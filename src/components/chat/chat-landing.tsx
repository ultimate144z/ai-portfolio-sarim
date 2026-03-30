'use client';

import { motion } from 'framer-motion';
import { Code, Award, Briefcase, Mail, User } from 'lucide-react';
import React from 'react';

import { presetReplies } from '@/lib/config-loader';

interface ChatLandingProps {
  submitQuery: (query: string) => void;
  handlePresetReply?: (question: string, reply: string, tool: string) => void;
}

const ChatLanding: React.FC<ChatLandingProps> = ({ submitQuery, handlePresetReply }) => {
  const suggestedQuestions = [
    { icon: <User className="h-4 w-4" />, text: 'Who are you?' },
    { icon: <Code className="h-4 w-4" />, text: 'What projects are you most proud of?' },
    { icon: <Award className="h-4 w-4" />, text: 'What are your skills?' },
    { icon: <Briefcase className="h-4 w-4" />, text: "What's your experience?" },
    { icon: <Mail className="h-4 w-4" />, text: 'How can I reach you?' },
  ];

  const handleQuestionClick = (questionText: string) => {
    const preset = presetReplies[questionText as keyof typeof presetReplies];
    if (preset && handlePresetReply) {
      handlePresetReply(questionText, preset.reply, preset.tool);
    } else {
      submitQuery(questionText);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
  };

  return (
    <motion.div
      className="flex w-full flex-col items-center px-4 py-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Welcome message */}
      <motion.div className="mb-8 text-center" variants={itemVariants}>
        <h2 className="mb-2 text-2xl font-semibold text-white">
          Ask me anything about Sarim
        </h2>
        <p className="text-slate-400 mx-auto max-w-md text-sm">
          I&apos;m Sarim&apos;s AI assistant. Ask about his experience, projects, skills, or availability.
        </p>
      </motion.div>

      {/* Suggested questions */}
      <motion.div className="w-full max-w-md space-y-2" variants={containerVariants}>
        {suggestedQuestions.map((question, index) => (
          <motion.button
            key={index}
            className="flex w-full items-center gap-3 rounded-xl border border-white/8 bg-[#10131f]/70 px-4 py-3 text-left transition-all duration-200 hover:border-primary/40 hover:bg-[#10131f] backdrop-blur-md"
            onClick={() => handleQuestionClick(question.text)}
            variants={itemVariants}
            whileHover={{ scale: 1.01, x: 2 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
              {question.icon}
            </span>
            <span className="text-sm text-slate-300">{question.text}</span>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default ChatLanding;
