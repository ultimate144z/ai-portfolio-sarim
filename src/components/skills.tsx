'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Code, Cpu, Cloud, Brain, Layers } from 'lucide-react';
import { getConfig } from '@/lib/config-loader';

const Skills = () => {
  // Get skills from configuration
  const config = getConfig();
  
  // Transform skills data with icons
  const skillsData = [
    {
      category: 'Programming Languages',
      icon: <Code className="h-5 w-5" />,
      skills: config.skills.languages,
      color: 'bg-blue-900/30 text-blue-300 border border-blue-500/30',
    },
    {
      category: 'ML/AI Technologies',
      icon: <Brain className="h-5 w-5" />,
      skills: config.skills.ml_ai,
      color: 'bg-purple-900/30 text-purple-300 border border-purple-500/30',
    },
    {
      category: 'LLMs & APIs',
      icon: <Cpu className="h-5 w-5" />,
      skills: config.skills.llms_apis,
      color: 'bg-cyan-900/30 text-cyan-300 border border-cyan-500/30',
    },
    {
      category: 'DevOps & Cloud',
      icon: <Cloud className="h-5 w-5" />,
      skills: config.skills.devops_cloud,
      color: 'bg-emerald-900/30 text-emerald-300 border border-emerald-500/30',
    },
  ].filter(category => category.skills && category.skills.length > 0);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' as const },
    },
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: 'easeOut' as const },
    },
  };

  return (
    <motion.div
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      className="mx-auto w-full max-w-5xl rounded-4xl px-4 sm:px-6"
    >
      <Card className="w-full border-none px-0 pb-8 sm:pb-12 shadow-none">
        <CardHeader className="px-0 pb-1">
          <CardTitle className="text-primary px-0 text-2xl sm:text-3xl lg:text-4xl font-bold">
            Skills & Expertise
          </CardTitle>
        </CardHeader>

        <CardContent className="px-0">
          <motion.div
            className="space-y-6 sm:space-y-8 px-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {skillsData.map((section, index) => (
              <motion.div
                key={index}
                className="space-y-3 px-0"
                variants={itemVariants}
              >
                <div className="flex items-center gap-2">
                  {section.icon}
                  <h3 className="text-accent-foreground text-base sm:text-lg font-semibold">
                    {section.category}
                  </h3>
                </div>

                <motion.div
                  className="flex flex-wrap gap-1.5 sm:gap-2"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {section.skills.map((skill, idx) => (
                    <motion.div
                      key={idx}
                      variants={badgeVariants}
                      whileHover={{
                        scale: 1.04,
                        transition: { duration: 0.2 },
                      }}
                    >
                      <Badge className={`border px-2 py-1 sm:px-3 sm:py-1.5 font-normal text-xs sm:text-sm`}>
                        {skill}
                      </Badge>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Skills;
