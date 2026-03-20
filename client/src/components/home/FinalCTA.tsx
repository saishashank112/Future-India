import { useModal } from '../../context/ModalContext';

const FinalCTA = () => {
  const { openEnquiryModal } = useModal();

  return (
    <section className="py-12 bg-black border-t border-white/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-serif font-black text-white leading-[1.1] mb-2 uppercase tracking-tighter">
              SCALE YOUR SUPPLY CHAIN <br /> WITH INDIAN EXCELLENCE.
            </h2>
            <p className="text-sm md:text-base text-accent font-black uppercase tracking-widest leading-relaxed">
              Industrial grade procurement for global B2B bulk requirements.
            </p>
          </div>

          <div className="shrink-0 w-full lg:w-auto">
            <button 
              onClick={() => openEnquiryModal()}
              className="bg-accent hover:bg-[white] text-primary font-black px-12 py-5 text-sm uppercase tracking-[0.2em] shadow-2xl transition-all duration-300 lg:hover:-translate-x-2 w-full lg:w-auto text-center rounded-none"
            >
              Get Enquiry System
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
