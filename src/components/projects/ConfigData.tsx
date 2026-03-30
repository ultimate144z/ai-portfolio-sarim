import { Github, ExternalLink } from 'lucide-react';
import { projectData, getConfig } from '@/lib/config-loader';

const config = getConfig();
const PROJECT_CONTENT = config.projects;

// Gradient palettes per project index for visual variety
const CARD_GRADIENTS = [
  'from-violet-900/80 via-purple-900/60 to-[#10131f]',
  'from-cyan-900/80 via-blue-900/60 to-[#10131f]',
  'from-emerald-900/80 via-teal-900/60 to-[#10131f]',
  'from-rose-900/80 via-pink-900/60 to-[#10131f]',
];

const CARD_ACCENT_COLORS = [
  'text-violet-400 border-violet-500/30 bg-violet-500/10',
  'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
  'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  'text-rose-400 border-rose-500/30 bg-rose-500/10',
];

const ProjectContent = ({ project }: { project: { title: string } }) => {
  const projectData = PROJECT_CONTENT.find(p => p.title === project.title);
  const idx = PROJECT_CONTENT.findIndex(p => p.title === project.title);
  const accentColor = CARD_ACCENT_COLORS[idx % CARD_ACCENT_COLORS.length];

  if (!projectData) return null;

  return (
    <div className="max-w-4xl space-y-5 p-0">
      {/* Description */}
      <p className="text-slate-300 leading-relaxed text-sm">
        {projectData.description}
      </p>

      {/* Status & Date row */}
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full border px-3 py-1 text-xs font-medium ${
          projectData.status === 'Completed'
            ? 'border-green-500/30 bg-green-500/10 text-green-400'
            : 'border-blue-500/30 bg-blue-500/10 text-blue-400'
        }`}>
          {projectData.status}
        </span>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">
          {projectData.date}
        </span>
        <span className={`rounded-full border px-3 py-1 text-xs font-medium ${accentColor}`}>
          {projectData.category}
        </span>
      </div>

      {/* Tech Stack */}
      {projectData.techStack && projectData.techStack.length > 0 && (
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Tech Stack</h4>
          <div className="flex flex-wrap gap-1.5">
            {projectData.techStack.map((tech, index) => (
              <span
                key={index}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Links */}
      {projectData.links && projectData.links.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {projectData.links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-all hover:bg-primary/20"
            >
              <Github className="h-4 w-4" />
              {link.name}
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>
          ))}
        </div>
      )}

      {!projectData.links || projectData.links.length === 0 && (
        <p className="text-xs text-slate-500 italic">Repository not yet public — work in progress.</p>
      )}
    </div>
  );
};

// Build card data — use gradient thumbnails since projects have no images
export const data = projectData.map((project, idx) => ({
  category: project.category,
  title: project.title,
  src: project.src !== '/placeholder.jpg' ? project.src : '',
  gradient: CARD_GRADIENTS[idx % CARD_GRADIENTS.length],
  accentColor: CARD_ACCENT_COLORS[idx % CARD_ACCENT_COLORS.length],
  links: PROJECT_CONTENT.find(p => p.title === project.title)?.links || [],
  content: <ProjectContent project={{ title: project.title }} />,
}));
