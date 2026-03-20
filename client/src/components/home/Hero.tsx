import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useModal } from '../../context/ModalContext';
import { useLanguage } from '../../context/LanguageContext';

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const { openEnquiryModal } = useModal();
  const { t } = useLanguage();

  const slides = useMemo(() => [
    {
      image: '/images/hero-1.png',
      title: t('hero_title'),
      subtitle: t('hero_subtitle'),
      cta: t('request_sample')
    },
    {
      image: '/images/hero-2.png',
      title: t('hero_title_2'),
      subtitle: t('hero_subtitle_2'),
      cta: t('get_enquiry')
    },
    {
      image: '/images/hero-3.png',
      title: t('hero_title_3'),
      subtitle: t('hero_subtitle_3'),
      cta: t('explore_network')
    }
  ], [t]);

  // Auto slide logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Preload images to prevent flicker
  useEffect(() => {
    if (slides && slides.length > 0) {
      slides.forEach((slide) => {
        const img = new Image();
        img.src = slide.image;
      });
    }
  }, [slides]);

  return (
    <section className="relative h-screen min-h-[600px] w-full overflow-hidden flex items-center justify-center bg-black">

      {/* Background Slides */}
      <AnimatePresence mode="sync">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 will-change-transform"
        >
          <div className="absolute inset-0 bg-black/50 z-10" />
          <img
            src={slides[current].image}
            alt="Hero Background"
            className="w-full h-full object-cover grayscale-[10%] contrast-[1.05]"
          />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-20 w-full max-w-[1200px] px-6 text-center flex flex-col items-center">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          key={`title-${current}`}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 border border-accent/40 text-accent text-[9px] md:text-xs font-bold tracking-[0.3em] uppercase mb-6 backdrop-blur-md">
            Empowering Global Trade
          </span>

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-[1.1] mb-6 break-words uppercase">
            {slides[current].title}
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          key={`text-${current}`}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed font-light max-w-2xl px-4"
        >
          {slides[current].subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          key={`cta-${current}`}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-6 justify-center"
        >
          <button
            onClick={() => openEnquiryModal()}
            className="btn-accent flex items-center justify-center space-x-3 px-6 py-3.5 text-sm font-bold tracking-widest uppercase shadow-2xl"
          >
            <MessageSquare className="w-5 h-5" />
            <span>{slides[current].cta}</span>
          </button>

          <Link
            to="/products"
            className="btn-outline border-white/30 text-white hover:bg-white/10 flex items-center justify-center space-x-3 px-6 py-3.5 text-sm font-bold tracking-widest uppercase backdrop-blur-md"
          >
            <span>{t('our_portfolio')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-4">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-1.5 transition-all duration-500 rounded-full ${current === idx
              ? 'w-16 bg-accent'
              : 'w-6 bg-white/30 hover:bg-white/50'
              }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;