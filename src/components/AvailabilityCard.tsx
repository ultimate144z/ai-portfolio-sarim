'use client';

import { motion } from 'framer-motion';
import { CalendarDays, MapPin, Code2, Mail, Linkedin, Github, ExternalLink } from 'lucide-react';
import { getConfig } from '@/lib/config-loader';

interface AvailabilityCardProps {
  data?: any;
}

const AvailabilityCard = ({ data }: AvailabilityCardProps) => {
  const config = getConfig();
  const { personal, social, internship, skills } = config;

  const allSkills = [
    ...config.skills.languages,
    ...config.skills.ml_ai.slice(0, 4),
    ...config.skills.llms_apis.slice(0, 3),
    ...config.skills.devops_cloud,
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto mt-6 w-full max-w-2xl rounded-2xl border border-white/10 bg-[#10131f] p-6 font-sans"
    >
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 overflow-hidden rounded-full border border-white/10">
            <img
              src="/profile.jpeg"
              alt="Sarim Farooq"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">{personal.name}</h2>
            <p className="text-sm text-slate-400">{personal.title}</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 rounded-full border border-green-500/40 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400" />
          </span>
          Available Now
        </span>
      </div>

      {/* Status grid */}
      <div className="mb-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/8 bg-white/4 p-3">
          <div className="mb-1 flex items-center gap-2 text-slate-400">
            <CalendarDays className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Start Date</span>
          </div>
          <p className="text-sm font-semibold text-white">{internship.startDate}</p>
        </div>
        <div className="rounded-xl border border-white/8 bg-white/4 p-3">
          <div className="mb-1 flex items-center gap-2 text-slate-400">
            <MapPin className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Location</span>
          </div>
          <p className="text-sm font-semibold text-white">{personal.location}</p>
        </div>
      </div>

      {/* Focus areas */}
      <div className="mb-5">
        <div className="mb-2 flex items-center gap-2 text-slate-400">
          <Code2 className="h-4 w-4" />
          <span className="text-xs font-medium uppercase tracking-wider">Focus Areas</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {internship.focusAreas.map((area, i) => (
            <span
              key={i}
              className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
            >
              {area}
            </span>
          ))}
        </div>
      </div>

      {/* Tech stack */}
      <div className="mb-5">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">Tech Stack</p>
        <div className="flex flex-wrap gap-1.5">
          {allSkills.map((skill, i) => (
            <span
              key={i}
              className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Goal */}
      <div className="mb-5 rounded-xl border border-white/8 bg-white/3 p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-2">What I&apos;m looking for</p>
        <p className="text-sm text-slate-300 leading-relaxed">{internship.goals}</p>
      </div>

      {/* Contact links */}
      <div className="flex flex-wrap gap-2">
        <a
          href={`mailto:${personal.email}`}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition-all hover:border-primary/40 hover:text-white"
        >
          <Mail className="h-4 w-4" />
          Email
        </a>
        <a
          href={social.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition-all hover:border-primary/40 hover:text-white"
        >
          <ExternalLink className="h-4 w-4" />
          LinkedIn
        </a>
        <a
          href={social.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition-all hover:border-primary/40 hover:text-white"
        >
          <ExternalLink className="h-4 w-4" />
          GitHub
        </a>
      </div>
    </motion.div>
  );
};

export default AvailabilityCard;
