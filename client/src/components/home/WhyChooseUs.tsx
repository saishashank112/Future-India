import { motion } from 'framer-motion';
import { Shield, Leaf, Truck, Zap } from 'lucide-react';

const reasons = [
  {
    icon: Shield,
    title: "Uncompromising Quality",
    text: "Multi-stage grading and third-party lab testing for every batch export."
  },
  {
    icon: Leaf,
    title: "Ethical Sourcing",
    text: "Supporting small-holder farmer clusters with fair trade practices."
  },
  {
    icon: Truck,
    title: "Global Logistics",
    text: "Strategic partnerships with MAERSK and MSC for priority shipping lanes."
  },
  {
    icon: Zap,
    title: "Rapid Fulfillment",
    text: "Optimized processing times ensuring your orders reach faster."
  }
];

const WhyChooseUs = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, idx) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="glass-card p-8 hover:bg-white transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 group-hover:bg-accent group-hover:rotate-6 transition-all">
                <reason.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="text-xl font-serif font-bold text-primary mb-4">{reason.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {reason.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
