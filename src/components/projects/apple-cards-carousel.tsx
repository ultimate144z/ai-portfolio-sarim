'use client';
import { useOutsideClick } from '@/hooks/use-outside-click';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Github, ExternalLink, ChevronLeft, ChevronRight, X } from 'lucide-react';

type Card = {
  src: string;
  title: string;
  category: string;
  content: React.ReactNode;
  gradient?: string;
  accentColor?: string;
  links?: Array<{ name: string; url: string }>;
};

export const CarouselContext = createContext<{
  onCardClose: (index: number) => void;
  currentIndex: number;
}>({
  onCardClose: () => {},
  currentIndex: 0,
});

export const Carousel = ({
  items,
  initialScroll = 0,
}: {
  items: React.ReactNode[];
  initialScroll?: number;
}) => {
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
  }, [initialScroll]);

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scrollLeft = () => {
    carouselRef.current?.scrollBy({ left: -336, behavior: 'smooth' });
  };
  const scrollRight = () => {
    carouselRef.current?.scrollBy({ left: 336, behavior: 'smooth' });
  };

  const handleCardClose = (index: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ left: 336 * index, behavior: 'smooth' });
      setCurrentIndex(index);
    }
  };

  return (
    <CarouselContext.Provider value={{ onCardClose: handleCardClose, currentIndex }}>
      <div className="relative w-full">
        <div
          className="flex w-full overflow-x-scroll overscroll-x-auto scroll-smooth py-8 [scrollbar-width:none]"
          ref={carouselRef}
          onScroll={checkScrollability}
        >
          <div className="flex flex-row justify-start gap-4 mx-auto max-w-7xl">
            {items.map((item, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, delay: 0.15 * index, ease: 'easeOut' as const },
                }}
                key={'card' + index}
                className="rounded-3xl last:pr-[5%] md:last:pr-[33%]"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scroll buttons */}
        <div className="mr-4 flex justify-end gap-2 md:mr-8">
          <button
            className="relative z-40 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#10131f] text-slate-300 disabled:opacity-30 hover:border-primary/40 hover:text-white transition-all"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            className="relative z-40 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#10131f] text-slate-300 disabled:opacity-30 hover:border-primary/40 hover:text-white transition-all"
            onClick={scrollRight}
            disabled={!canScrollRight}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

export const Card = ({
  card,
  index,
  layout = false,
}: {
  card: Card;
  index: number;
  layout?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { onCardClose } = useContext(CarouselContext);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') handleClose();
    }
    document.body.style.overflow = open ? 'hidden' : 'auto';
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  // @ts-ignore
  useOutsideClick(containerRef, () => handleClose());

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    onCardClose(index);
  };

  const gradient = card.gradient || 'from-violet-900/80 via-purple-900/60 to-[#10131f]';
  const hasGitHub = card.links && card.links.length > 0;

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[52] h-screen overflow-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 h-full w-full bg-black/80 backdrop-blur-lg"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              ref={containerRef}
              layoutId={layout ? `card-${card.title}` : undefined}
              className="relative z-[60] mx-auto my-10 h-fit max-w-2xl rounded-2xl border border-white/10 bg-[#0d1020] font-sans shadow-2xl"
            >
              {/* Gradient header */}
              <div className={`relative h-28 w-full overflow-hidden rounded-t-2xl bg-gradient-to-br ${gradient}`}>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0d1020]/80" />
                <button
                  className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70 transition-colors"
                  onClick={handleClose}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Header text */}
              <div className="px-6 pt-4 pb-2">
                <motion.p
                  layoutId={layout ? `category-${card.title}` : undefined}
                  className="text-xs font-semibold uppercase tracking-wider text-slate-500"
                >
                  {card.category}
                </motion.p>
                <motion.p
                  layoutId={layout ? `title-${card.title}` : undefined}
                  className="mt-1 text-2xl font-bold text-white"
                >
                  {card.title}
                </motion.p>
              </div>

              {/* Content */}
              <div className="px-6 pb-8 pt-4">{card.content}</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Card thumbnail */}
      <motion.button
        layoutId={layout ? `card-${card.title}` : undefined}
        onClick={handleOpen}
        className="group relative z-10 flex h-56 w-72 flex-col items-start justify-end overflow-hidden rounded-2xl border border-white/8 bg-[#10131f] transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        {/* Gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-60 transition-opacity duration-300 group-hover:opacity-80`} />
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }} />

        {/* GitHub badge (top right) */}
        {hasGitHub && (
          <div className="absolute right-3 top-3 z-20">
            <span className="flex items-center gap-1 rounded-full border border-white/20 bg-black/40 px-2 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
              <Github className="h-3 w-3" />
              GitHub
            </span>
          </div>
        )}

        {/* Text content */}
        <div className="relative z-10 w-full p-4">
          <motion.p
            layoutId={layout ? `category-${card.category}` : undefined}
            className="mb-1 text-left text-xs font-semibold uppercase tracking-wider text-white/60"
          >
            {card.category}
          </motion.p>
          <motion.p
            layoutId={layout ? `title-${card.title}` : undefined}
            className="text-left text-lg font-bold leading-tight text-white [text-wrap:balance]"
          >
            {card.title}
          </motion.p>
          <p className="mt-2 text-xs text-white/50">Click to explore →</p>
        </div>
      </motion.button>
    </>
  );
};
