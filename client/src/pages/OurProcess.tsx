import { motion } from 'framer-motion';
import { Leaf, ShieldCheck, Box, Ship, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    icon: Leaf,
    title: "Sourcing",
    desc: "Direct farm cluster partnerships ensure the highest original quality and ethical procurement practices."
  },
  {
    icon: ShieldCheck,
    title: "Quality Check",
    desc: "Multi-stage lab testing and third-party inspections (SGS/Bureau Veritas) for every batch export."
  },
  {
    icon: Box,
    title: "Packaging",
    desc: "Customized export grading and vacuum-sealed or jute-bag packaging tailored to product shelf-life."
  },
  {
    icon: Ship,
    title: "Logistics",
    desc: "Integrated supply chain and strategic shipping lane partnerships for rapid, reliable fulfillment."
  },
  {
    icon: CheckCircle2,
    title: "Delivery",
    desc: "Final customs clearance and doorstep delivery, with real-time tracking for every international order."
  }
];

const OurProcess = () => {
  return (
    <div className="pt-32 pb-24 bg-background">
      <div className="container mx-auto px-6">
        <section className="mb-24 text-center max-w-4xl mx-auto">
          <span className="text-accent font-bold tracking-widest uppercase text-xs mb-4 block">Our Methodology</span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-8 leading-tight"> Precision in Every Grain. </h1>
          <p className="text-xl text-gray-600 leading-relaxed font-light">
            Our end-to-end export process is designed to eliminate contamination and ensure radical transparency from the farm to your warehouse.
          </p>
        </section>

        {/* Timeline Desktop */}
        <div className="hidden lg:block relative py-20">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-primary/10 -translate-y-1/2" />
          
          <div className="grid grid-cols-5 gap-8 relative">
            {steps.map((step, idx) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative group"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 flex items-center justify-center mb-10 shadow-lg group-hover:bg-accent group-hover:text-white transition-all transform group-hover:-translate-y-2 z-10">
                    <step.icon className="w-8 h-8" />
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-accent rounded-full border-4 border-white z-20" />
                  <h3 className="text-xl font-serif font-bold text-primary mb-4">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-[200px]">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Timeline Mobile */}
        <div className="lg:hidden space-y-12 relative before:absolute before:left-8 before:top-4 before:bottom-4 before:w-0.5 before:bg-primary/10">
          {steps.map((step, idx) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-start space-x-10 relative"
            >
              <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-lg shrink-0 z-10">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-primary mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quality Commitment Table */}
        <div className="mt-32 max-w-5xl mx-auto rounded-3xl overflow-hidden glass-card p-12">
          <h2 className="text-3xl font-serif font-bold text-primary mb-12">Export Compliance & Ethics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h4 className="text-accent font-bold uppercase tracking-widest text-xs">Phytosanitary Standards</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                We strictly adhere to the phytosanitary requirements of importing countries, including heat treatment, fumigation, and organic decontamination processes that preserve product integrity without chemical residue.
              </p>
            </div>
            <div className="space-y-6">
              <h4 className="text-accent font-bold uppercase tracking-widest text-xs">Direct Farmer Welfare</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                By bypassing local middlemen, we ensure that a larger percentage of the export value reaches the primary producer, creating sustainable farming communities across rural India.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurProcess;
