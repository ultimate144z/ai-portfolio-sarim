'use client';
import { useChat } from '@ai-sdk/react';
import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

// Component imports
import ChatBottombar from '@/components/chat/chat-bottombar';
import ChatLanding from '@/components/chat/chat-landing';
import ChatMessageContent from '@/components/chat/chat-message-content';
import { SimplifiedChatView } from '@/components/chat/simple-chat-view';
import { PresetReply } from '@/components/chat/preset-reply';
import { presetReplies } from '@/lib/config-loader';
import {
  ChatBubble,
  ChatBubbleMessage,
} from '@/components/ui/chat/chat-bubble';
import HelperBoost from './HelperBoost';

// ClientOnly component for client-side rendering
//@ts-ignore
const ClientOnly = ({ children }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
};

// Define Avatar component props interface
interface AvatarProps {
  hasActiveTool: boolean;
}

// Dynamic import of Avatar component
const Avatar = dynamic<AvatarProps>(
  () =>
    Promise.resolve(({ hasActiveTool }: AvatarProps) => {
      // Conditional rendering based on detection
      return (
        <div
          className={`flex items-center justify-center rounded-full transition-all duration-300 ${hasActiveTool ? 'h-20 w-20' : 'h-28 w-28'}`}
        >
          <div
            className="relative cursor-pointer"
            onClick={() => (window.location.href = '/')}
          >
            <img
              src="/avatar.png"
              alt="Avatar"
              className="h-full w-full object-cover object-[center_top_-5%] scale-95 rounded-full"
            />
          </div>
        </div>
      );
    }),
  { ssr: false }
);

const MOTION_CONFIG = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: {
    duration: 0.3,
    ease: 'easeOut' as const,
  },
};

const MAX_MESSAGES_PER_DAY = 3;

const Chat = () => {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('query');
  const [autoSubmitted, setAutoSubmitted] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [messagesCount, setMessagesCount] = useState(0);
  const [presetReply, setPresetReply] = useState<{
    question: string;
    reply: string;
    tool: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const savedCount = localStorage.getItem('sarim_portfolio_msg_count');
    const resetDate = localStorage.getItem('sarim_portfolio_reset_date');
    const today = new Date().toDateString();

    if (resetDate !== today) {
      localStorage.setItem('sarim_portfolio_msg_count', '0');
      localStorage.setItem('sarim_portfolio_reset_date', today);
      setMessagesCount(0);
    } else if (savedCount) {
      setMessagesCount(parseInt(savedCount, 10));
    }
  }, []);

  const incrementMessageCount = () => {
    const newCount = messagesCount + 1;
    setMessagesCount(newCount);
    localStorage.setItem('sarim_portfolio_msg_count', newCount.toString());
  };

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    setMessages,
    setInput,
    reload,
    addToolResult,
    append,
  } = useChat({
    onResponse: (response) => {
      if (response) {
        setLoadingSubmit(false);
      }
    },
    onFinish: () => {
      setLoadingSubmit(false);
    },
    onError: (error) => {
      setLoadingSubmit(false);
      console.error('Chat error:', error.message, error.cause);
      
      // Handle specific error types
      if (error.message?.includes('quota') || error.message?.includes('exceeded') || error.message?.includes('429')) {
        // Show a friendly notification for quota issues
        toast.error('⚠️ API Limit Reached. Please contact Sarim directly or use the preset questions below.', {
          duration: 6000,
          style: {
            background: '#10131f',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '500',
          },
        });
        
        // Set error message state for frontend display
        setErrorMessage('quota_exhausted');
        
        // Try to add a chat bubble with the error message
        try {
          append({
            role: 'assistant',
            content: '⚠️ **API Limit Reached**\n\nThe AI provider limit has been reached. Please contact Sarim directly or use the preset questions below.',
          });
        } catch (appendError) {
          console.error('Failed to append error message:', appendError);
        }
      } else if (error.message?.includes('network')) {
        toast.error('Network error. Please check your connection and try again.');
        setErrorMessage('Network error. Please check your connection and try again.');
      } else {
        toast.error(`Error: ${error.message}`);
        setErrorMessage(`Error: ${error.message}`);
      }
    },
    onToolCall: (tool) => {
      const toolName = tool.toolCall.toolName;
      console.log('Tool call:', toolName);
    },
  });

  const { currentAIMessage, latestUserMessage, hasActiveTool } = useMemo(() => {
    const latestAIMessageIndex = messages.findLastIndex(
      (m) => m.role === 'assistant'
    );
    const latestUserMessageIndex = messages.findLastIndex(
      (m) => m.role === 'user'
    );

    const result = {
      currentAIMessage:
        latestAIMessageIndex !== -1 ? messages[latestAIMessageIndex] : null,
      latestUserMessage:
        latestUserMessageIndex !== -1 ? messages[latestUserMessageIndex] : null,
      hasActiveTool: false,
    };

    if (result.currentAIMessage) {
      result.hasActiveTool =
        result.currentAIMessage.parts?.some(
          (part) =>
            part.type === 'tool-invocation' &&
            part.toolInvocation?.state === 'result'
        ) || false;
    }

    if (latestAIMessageIndex < latestUserMessageIndex) {
      result.currentAIMessage = null;
    }

    return result;
  }, [messages]);

  const isToolInProgress = messages.some(
    (m) =>
      m.role === 'assistant' &&
      m.parts?.some(
        (part) =>
          part.type === 'tool-invocation' &&
          part.toolInvocation?.state !== 'result'
      )
  );

  //@ts-ignore
  const submitQuery = (query) => {
    if (!query.trim() || isToolInProgress) return;
    
    setErrorMessage(null);
    
    if (presetReplies[query]) {
      const preset = presetReplies[query];
      setPresetReply({ question: query, reply: preset.reply, tool: preset.tool });
      setLoadingSubmit(false);
      return;
    }
    
    // Regular text submission, trigger limit
    if (messagesCount >= MAX_MESSAGES_PER_DAY) {
      setErrorMessage("You've reached the demo limit for today. To continue the conversation, reach out directly at sarimfarooq1212@gmail.com — or come back tomorrow!");
      return;
    }
    
    incrementMessageCount();
    setLoadingSubmit(true);
    setPresetReply(null); // Clear any preset reply when submitting new query
    append({
      role: 'user',
      content: query,
    });
  };

  //@ts-ignore
  const submitQueryToAI = (query) => {
    if (!query.trim() || isToolInProgress) return;
    
    setErrorMessage(null);
    
    if (messagesCount >= MAX_MESSAGES_PER_DAY) {
      setErrorMessage("You've reached the demo limit for today. To continue the conversation, reach out directly at sarimfarooq1212@gmail.com — or come back tomorrow!");
      return;
    }

    incrementMessageCount();
    setLoadingSubmit(true);
    setPresetReply(null);
    append({
      role: 'user',
      content: query,
    });
  };

  //@ts-ignore
  const handlePresetReply = (question, reply, tool) => {
    setPresetReply({ question, reply, tool });
    setLoadingSubmit(false);
  };

  //@ts-ignore
  const handleGetAIResponse = (question, tool) => {
    setPresetReply(null);
    submitQueryToAI(question); // Use the new function that bypasses presets
  };

  useEffect(() => {
    if (initialQuery && !autoSubmitted) {
      setAutoSubmitted(true);
      setInput('');
      submitQuery(initialQuery);
    }
  }, [initialQuery, autoSubmitted]);

  //@ts-ignore
  const onSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isToolInProgress) return;
    submitQueryToAI(input); // User input should go directly to AI
    setInput('');
  };

  const handleStop = () => {
    stop();
    setLoadingSubmit(false);
  };

  // Check if this is the initial empty state (no messages)
  const isEmptyState =
    !currentAIMessage && !latestUserMessage && !loadingSubmit && !presetReply && !errorMessage;

  // Calculate header height based on hasActiveTool
  const headerHeight = hasActiveTool ? 100 : 180;

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Fixed Avatar Header with Gradient */}
      <div
        className="fixed top-0 right-0 left-0 z-50"
        style={{
          background:
            'linear-gradient(to bottom, rgba(8, 11, 20, 1) 0%, rgba(8, 11, 20, 0.95) 30%, rgba(8, 11, 20, 0.8) 50%, rgba(8, 11, 20, 0) 100%)',
        }}
      >
        <div
          className={`transition-all duration-300 ease-in-out ${hasActiveTool ? 'pt-6 pb-0' : 'py-6'}`}
        >
          <div className="flex justify-center flex-col items-center">
            <ClientOnly>
              <div className="relative mb-2">
                <Avatar
                  hasActiveTool={hasActiveTool}
                />
                {!hasActiveTool && (
                  <div className="absolute -bottom-2 -right-16 bg-[#10131f]/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-medium text-white tracking-wider whitespace-nowrap">AVAILABLE FOR HIRE</span>
                  </div>
                )}
              </div>
            </ClientOnly>
          </div>

          <AnimatePresence>
            {latestUserMessage && !currentAIMessage && (
              <motion.div
                {...MOTION_CONFIG}
                className="mx-auto flex max-w-3xl px-4"
              >
                <ChatBubble variant="sent">
                  <ChatBubbleMessage>
                    <ChatMessageContent
                      message={latestUserMessage}
                      isLast={true}
                      isLoading={false}
                      reload={() => Promise.resolve(null)}
                    />
                  </ChatBubbleMessage>
                </ChatBubble>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto flex h-full max-w-3xl flex-col">
        {/* Scrollable Chat Content */}
        <div
          className="flex-1 overflow-y-auto px-2 pb-4"
          style={{ paddingTop: `${headerHeight}px` }}
        >
          <AnimatePresence mode="wait">
            {isEmptyState ? (
              <motion.div
                key="landing"
                className="flex min-h-full items-center justify-center"
                {...MOTION_CONFIG}
              >
                <ChatLanding 
                  submitQuery={submitQuery} 
                  handlePresetReply={handlePresetReply}
                />
              </motion.div>
            ) : presetReply ? (
              <div className="pb-4">
                <PresetReply
                  question={presetReply.question}
                  reply={presetReply.reply}
                  tool={presetReply.tool}
                  onGetAIResponse={handleGetAIResponse}
                  onClose={() => setPresetReply(null)}
                />
              </div>
            ) : errorMessage ? (
              <motion.div
                key="error"
                {...MOTION_CONFIG}
                className="px-4 pt-4"
              >
                <ChatBubble variant="received">
                  <ChatBubbleMessage className="bg-[#10131f] border border-white/10 shadow-xl">
                    <div className="space-y-4 p-4 text-white">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                          <span className="text-primary text-lg">⚠️</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-md">
                            Limit Reached
                          </h3>
                        </div>
                      </div>
                      
                      <div className="text-sm text-slate-300 space-y-2">
                        <p>{errorMessage}</p>
                        
                        <div className="bg-white/5 border border-white/10 p-3 rounded-lg mt-3">
                          <p className="font-medium mb-2 text-white">Alternative options:</p>
                          <ul className="list-disc list-inside space-y-1 text-xs text-slate-400">
                            <li>Email me at <a href="mailto:sarimfarooq1212@gmail.com" className="text-primary hover:underline">sarimfarooq1212@gmail.com</a></li>
                            <li>Use the preset questions below for instant responses</li>
                            <li>Visit my LinkedIn or GitHub</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => {
                            setErrorMessage(null);
                            const preset = presetReplies["How can I reach you?"];
                            if (preset) {
                              setPresetReply({ 
                                question: "How can I reach you?", 
                                reply: preset.reply, 
                                tool: preset.tool 
                              });
                            }
                          }}
                          className="px-4 py-2 bg-amber-500 text-white text-sm rounded-md hover:bg-amber-600 transition-colors font-medium"
                        >
                          Contact me
                        </button>
                        <button
                          onClick={() => {
                            setErrorMessage(null);
                            window.location.href = '/';
                          }}
                          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                          Use Presets
                        </button>
                      </div>
                      
                      <p className="text-xs text-amber-600 dark:text-amber-400 text-center mt-3">
                        Thank you for your patience! 🙏
                      </p>
                    </div>
                  </ChatBubbleMessage>
                </ChatBubble>
              </motion.div>
            ) : currentAIMessage ? (
              <div className="pb-4">
                <SimplifiedChatView
                  message={currentAIMessage}
                  isLoading={isLoading}
                  reload={reload}
                  addToolResult={addToolResult}
                />
              </div>
            ) : (
              loadingSubmit && (
                <motion.div
                  key="loading"
                  {...MOTION_CONFIG}
                  className="px-4 pt-18"
                >
                  <ChatBubble variant="received">
                    <ChatBubbleMessage isLoading />
                  </ChatBubble>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>

        {/* Fixed Bottom Bar */}
        <div className="sticky bottom-0 bg-transparent px-2 pt-3 md:px-0 md:pb-4">
          <div className="absolute inset-0 bg-gradient-to-t from-[#080b14] via-[#080b14] to-transparent pointer-events-none" />
          <div className="relative flex flex-col items-center gap-2">
            
            <div className="flex justify-between w-full max-w-3xl px-4 text-xs font-semibold uppercase tracking-wider text-slate-400/80 mb-1 pointer-events-none">
               <span>AI ASSISTANT</span>
               <span>{MAX_MESSAGES_PER_DAY - messagesCount} {MAX_MESSAGES_PER_DAY - messagesCount === 1 ? 'MESSAGE' : 'MESSAGES'} REMAINING</span>
            </div>

            <HelperBoost 
              submitQuery={submitQuery} 
              setInput={setInput} 
              handlePresetReply={handlePresetReply}
            />
            <ChatBottombar
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={onSubmit}
              isLoading={isLoading}
              stop={handleStop}
              isToolInProgress={isToolInProgress}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Chat;
