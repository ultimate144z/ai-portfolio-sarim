'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Download, File, ExternalLink } from 'lucide-react';
import { resumeDetails } from '@/lib/config-loader';

export function Resume() {
  const handleDownload = () => {
    window.open(resumeDetails.downloadUrl, '_blank');
  };

  return (
    <div className="mx-auto w-full py-6 font-sans">
      {/* Resume Card */}
      <motion.div
        className="group relative mb-4 overflow-hidden rounded-xl border border-white/10 bg-[#10131f] transition-all duration-300 hover:border-primary/30"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-white">
                {resumeDetails.title}
              </h3>
              <p className="mt-0.5 text-sm text-slate-400">
                {resumeDetails.description}
              </p>
              <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-500">
                <span className="rounded-sm bg-white/8 px-1.5 py-0.5 font-medium text-slate-400">
                  {resumeDetails.fileType}
                </span>
                <span>Updated {resumeDetails.lastUpdated}</span>
                <span>·</span>
                <span>{resumeDetails.fileSize}</span>
              </div>
            </div>
            <motion.button
              onClick={handleDownload}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary/80"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Download PDF"
            >
              <Download className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* PDF Preview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="w-full overflow-hidden rounded-xl border border-white/10"
      >
        <div className="flex items-center justify-between border-b border-white/10 bg-[#10131f] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <File className="h-4 w-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-300">Resume Preview</span>
          </div>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 transition-colors hover:bg-white/10"
          >
            <ExternalLink className="h-3 w-3" />
            Open Full
          </button>
        </div>
        <div className="w-full h-[600px] bg-[#0d0f1a]">
          <iframe
            src={resumeDetails.downloadUrl}
            width="100%"
            height="100%"
            className="border-0"
            title="Resume Preview"
          />
        </div>
      </motion.div>
    </div>
  );
}

export default Resume;
