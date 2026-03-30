import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { z } from 'zod';

import { SYSTEM_PROMPT } from './prompt';
import { getContact } from './tools/getContact';
import { getInternship } from './tools/getIntership';
import { getPresentation } from './tools/getPresentation';
import { getProjects } from './tools/getProjects';
import { getResume } from './tools/getResume';
import { getSkills } from './tools/getSkills';

export const maxDuration = 30;

// Simple in-memory rate limiting (Note: Will reset on serverless function cold boot)
// but provides a basic server-side safety net against spam over local storage.
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const MAX_MESSAGES_PER_IP = 15; // slightly higher than localstorage to allow preset clicks
const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function POST(req: Request) {
  try {
    // Basic IP tracking from headers (Vercel standard headers)
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    
    // IP-based Rate limiting logic
    if (ip !== 'unknown') {
      const current = rateLimitMap.get(ip);
      const now = Date.now();
      if (current) {
        if (now - current.timestamp > RATE_LIMIT_WINDOW_MS) {
          // Reset after 24h
          rateLimitMap.set(ip, { count: 1, timestamp: now });
        } else if (current.count >= MAX_MESSAGES_PER_IP) {
          console.warn(`[RATE-LIMIT] IP ${ip} exceeded daily limit`);
          return new Response('Rate limit exceeded', { status: 429 });
        } else {
          // Increment
          rateLimitMap.set(ip, { count: current.count + 1, timestamp: current.timestamp });
        }
      } else {
        rateLimitMap.set(ip, { count: 1, timestamp: now });
      }
    }

    const { messages } = await req.json();
    console.log('[CHAT-API] Incoming messages count:', messages.length);

    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error('[CHAT-API] Missing OPENAI_API_KEY environment variable');
      return new Response('Missing API key', { status: 500 });
    }

    // Basic profanity/abuse patterns — checked before consuming any tokens
    const ABUSE_PATTERNS = /\b(fuck|shit|ass|bitch|nigger|faggot|cunt|bastard|dick|pussy)\b/i;

    // Sanitize input: strip HTML, limit to 500 chars, check abuse
    const sanitizedMessages = messages.map((m: { role: string; content: string }) => {
      if (typeof m.content === 'string') {
        // Strip HTML tags
        m.content = m.content.replace(/<[^>]*>/g, '');
        // Limit to 500 characters
        if (m.content.length > 500) {
          m.content = m.content.substring(0, 500) + '...[truncated]';
        }
        // Abuse check (only on user messages)
        if (m.role === 'user' && ABUSE_PATTERNS.test(m.content)) {
          console.warn('[CHAT-API] Blocked abusive message');
          return null; // will be filtered out below
        }
      }
      return m;
    }).filter(Boolean);

    // If last user message was abusive, return polite decline without using tokens
    const lastUserMsg = [...sanitizedMessages].reverse().find((m: { role: string }) => m.role === 'user');
    if (!lastUserMsg) {
      return new Response("Please keep the conversation respectful. I'm happy to answer questions about Sarim's work and background.", { status: 400 });
    }

    // Add system prompt
    sanitizedMessages.unshift(SYSTEM_PROMPT);

    // Add tools
    const tools = {
      getProjects,
      getPresentation,
      getResume,
      getContact,
      getSkills,
      getInternship,
    };

    console.log('[CHAT-API] About to call streamText with gpt-4o-mini');
    
    const result = await streamText({
      model: openai('gpt-4o-mini'),
      messages: sanitizedMessages,
      tools,
      maxSteps: 3,
    });
    
    const response = result.toDataStreamResponse();
    console.log('[CHAT-API] DataStreamResponse created');
    
    return response;
  } catch (error) {
    console.error('Chat API error:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    
    if (error instanceof Error && error.message?.includes('quota')) {
      return new Response('API quota exceeded. Please try again later.', { status: 429 });
    }
    
    if (error instanceof Error && error.message?.includes('network')) {
      return new Response('Network error. Please check your connection and try again.', { status: 503 });
    }
    
    return new Response(`Internal Server Error`, { status: 500 });
  }
}
