'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, ExternalLink, ArrowRight } from 'lucide-react';
import { contactInfo } from '@/lib/config-loader';

export function Contact() {
  const openLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      className="mx-auto mt-6 w-full max-w-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-[#10131f] p-6 font-sans">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Get in Touch</h2>
          <span className="text-sm text-slate-500">{contactInfo.handle}</span>
        </div>

        {/* Email */}
        <div
          className="group mb-6 flex cursor-pointer items-center justify-between rounded-xl border border-white/8 bg-white/4 p-4 transition-all hover:border-primary/30 hover:bg-white/6"
          onClick={() => openLink(`mailto:${contactInfo.email}`)}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15">
              <Mail className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Email</p>
              <p className="text-sm font-medium text-white">{contactInfo.email}</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
        </div>

        {/* Social links */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {contactInfo.socials.map((social) => (
            <button
              key={social.name}
              className="group flex items-center justify-between rounded-xl border border-white/8 bg-white/4 px-4 py-3 text-left transition-all hover:border-primary/30 hover:bg-white/6"
              onClick={() => openLink(social.url)}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/8">
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                </div>
                <span className="text-sm font-medium text-slate-300">{social.name}</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default Contact;
