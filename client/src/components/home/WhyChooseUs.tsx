import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';

// Import images from local assets
import qualityImg from '../../assets/features/quality.png';
import cultivationImg from '../../assets/features/cultivation.png';
import logisticsImg from '../../assets/features/logistics.png';
import speedImg from '../../assets/features/speed.png';

const reasons = [
  {
    title: "Sovereign Quality",
    text: "Multi-stage proprietary grading and ISO-certified lab validation for every maritime batch.",
    image: qualityImg
  },
  {
    title: "Direct Cultivation",
    text: "Eliminating intermediaries by managing 5,000+ acres of direct farmer-cluster partnerships.",
    image: cultivationImg
  },
  {
    title: "Priority Logistics",
    text: "Consolidated shipping lanes with MAERSK and MSC ensuring expedited global transit.",
    image: logisticsImg
  },
  {
    title: "Protocol Speed",
    text: "Automated documentation and export compliance ensuring rapid customs clearance.",
    image: speedImg
  }
];

const WhyChooseUs = () => {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-slide logic for mobile
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % reasons.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % reasons.length);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? reasons.length - 1 : prev - 1));
  }, []);

  return (
    <section className="py-8 md:py-16 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-4 md:mb-10">
          <span className="text-accent font-bold tracking-[0.3em] uppercase text-[10px] mb-3 block">Our Advantage</span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-primary leading-tight">Beyond Exporting. Integrated Quality.</h2>
        </div>

        {/* Desktop View: Grid */}
        <div className="hidden md:grid grid-cols-4 gap-8">
          {reasons.map((reason, idx) => (
            <motion.div
              key={reason.title}
              className="relative group h-[400px] overflow-hidden rounded-[2.5rem] bg-black cursor-pointer shadow-2xl"
              onMouseEnter={() => setActiveCard(idx)}
              onMouseLeave={() => setActiveCard(null)}
            >
              <img
                src={reason.image}
                alt={reason.title}
                className={`w-full h-full object-cover transition-transform duration-[800ms] ${activeCard === idx ? 'scale-110 opacity-100' : 'scale-100 opacity-60'}`}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/90" />
              <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center p-10">
                <motion.h3 
                  animate={{ y: activeCard === idx ? -30 : 0 }}
                  className="text-2xl font-serif font-bold text-white mb-4 drop-shadow-lg"
                >
                  {reason.title}
                </motion.h3>
                <div className={`transition-all duration-500 ${activeCard === idx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                   <p className="text-sm text-white/80 leading-relaxed font-serif">{reason.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile View: Unified Slideshow */}
        <div className="md:hidden relative">
          <div 
            className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden bg-black shadow-2xl"
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setTimeout(() => setIsPaused(false), 2000)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute inset-0"
              >
                {/* Background Image with Entry Zoom */}
                <motion.img
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.05 }}
                  transition={{ duration: 4, ease: "linear" }}
                  src={reasons[currentSlide].image}
                  alt={reasons[currentSlide].title}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/95" />

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-3xl font-serif font-bold text-white mb-6 drop-shadow-2xl"
                  >
                    {reasons[currentSlide].title}
                  </motion.h3>

                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 20 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="max-w-xs mt-auto"
                  >
                    <p className="text-sm text-white/80 leading-relaxed font-serif">
                      {reasons[currentSlide].text}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Tap areas for manual nav */}
            <div className="absolute inset-y-0 left-0 w-1/4 z-20" onClick={handlePrev} />
            <div className="absolute inset-y-0 right-0 w-1/4 z-20" onClick={handleNext} />
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-6 space-x-2.5">
            {reasons.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentSlide(idx);
                  setIsPaused(true);
                  setTimeout(() => setIsPaused(false), 3000);
                }}
                className={`h-1.5 transition-all duration-300 rounded-full ${currentSlide === idx ? 'w-8 bg-accent' : 'w-2.5 bg-gray-200'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;