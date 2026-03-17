import { motion } from 'framer-motion';

const certifications = [
  { name: 'ISO 9001:2015', label: 'Quality Management' },
  { name: 'APEDA', label: 'Agri Export Authority' },
  { name: 'FSSAI', label: 'Food Safety Standard' },
  { name: 'Organic India', label: 'Certified Organic' },
  { name: 'HALAL', label: 'Process Certified' },
  { name: 'GMP', label: 'Manufacturing Practice' },
];

const TrustStrip = () => {
  return (
    <div className="bg-white py-12 border-b border-gray-100">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-between items-center gap-10 opacity-50">
          {certifications.map((cert) => (
            <motion.div 
              key={cert.name}
              whileHover={{ opacity: 1, scale: 1.05 }}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="text-xl font-bold text-primary font-serif mb-1 group-hover:text-accent transition-colors">
                {cert.name}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-gray-500">
                {cert.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustStrip;
