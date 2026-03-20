import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Linkedin, Instagram, Globe } from 'lucide-react';
import { useSettings } from '../context/SettingsProvider';

const Contact = () => {
  const { settings } = useSettings();
  
  return (
    <div className="pt-20 pb-16 bg-white">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-20 items-start">
          
          {/* Left: Contact Info */}
          <div className="w-full lg:w-5/12">
            <span className="text-accent font-bold tracking-[0.3em] uppercase text-[10px] mb-6 block">Get In Touch</span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary mb-10 leading-tight">Start Your Global Sourcing.</h1>
            <p className="text-gray-500 mb-16 text-lg font-light leading-relaxed">
              Have questions about our products, certification, or logistics? Our export experts are ready to assist you in securing the finest Indian agricultural goods.
            </p>

            <div className="space-y-12">
              <div className="flex items-start space-x-8 group">
                <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0 transition-colors group-hover:bg-accent group-hover:text-white">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-primary text-xl mb-3">Our Address</h4>
                  <p className="text-gray-400 text-sm leading-relaxed font-medium">
                    {settings.company_address}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-8 group">
                <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0 transition-colors group-hover:bg-accent group-hover:text-white">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-primary text-xl mb-3">Direct Inquiries</h4>
                  <p className="text-accent text-sm font-bold uppercase tracking-widest break-all">{settings.company_email}</p>
                  <a href={`mailto:${settings.company_email}`} className="text-gray-400 text-sm font-medium hover:text-accent transition-colors">Contact via Email</a>
                </div>
              </div>

              <div className="flex items-start space-x-8 group">
                <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0 transition-colors group-hover:bg-accent group-hover:text-white">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-primary text-xl mb-3">Contact Person</h4>
                  <p className="text-gray-700 text-sm font-bold mb-1">Mr. Satish Sarella</p>
                  <p className="text-gray-500 text-sm font-bold">{settings.company_phone}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <a href={`https://wa.me/${settings.company_phone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="text-green-600 text-[10px] font-bold uppercase tracking-widest hover:underline">WhatsApp Available</a>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-8 group">
                <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0 transition-colors group-hover:bg-accent group-hover:text-white">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-primary text-xl mb-3">Listed On</h4>
                  <a href="https://www.exportersindia.com/future-india-exim/" target="_blank" rel="noopener noreferrer" className="text-accent text-xs font-bold block hover:underline mb-1">exportersindia.com/future-india-exim</a>
                  <a href="https://www.indianyellowpages.com/vijayawada/future-india-exim-12213912/" target="_blank" rel="noopener noreferrer" className="text-gray-400 text-xs font-medium block hover:text-accent transition-colors">indianyellowpages.com</a>
                </div>
              </div>
            </div>

            <div className="mt-20 pt-10 border-t border-gray-100 flex items-center space-x-8">
              <span className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">Follow Us:</span>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-primary hover:bg-accent hover:text-white transition-all"><Linkedin className="w-4 h-4" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-primary hover:bg-accent hover:text-white transition-all"><Instagram className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Right: Premium Form Container */}
          <div className="w-full lg:w-7/12">
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#fcf8f0] rounded-[3rem] p-10 md:p-16 border border-[#e5d5b7] shadow-2xl relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-10">
                   <div className="w-1 h-12 bg-accent rounded-full" />
                   <h3 className="text-4xl font-serif font-bold text-primary">Secure a <br/> Digital Quotation</h3>
                </div>

                <form className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Full Name</label>
                      <input type="text" placeholder="e.g. David Richardson" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-1 focus:ring-accent/50 transition-all outline-none font-medium text-primary shadow-inner" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Email Address</label>
                      <input type="email" placeholder="david@globalimports.com" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-1 focus:ring-accent/50 transition-all outline-none font-medium text-primary shadow-inner" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Target Country</label>
                      <div className="relative">
                        <Globe className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                        <input type="text" placeholder="e.g. Germany" className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-1 focus:ring-accent/50 transition-all outline-none font-medium text-primary shadow-inner" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Nature of Inquiry</label>
                      <select className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-1 focus:ring-accent/50 transition-all outline-none font-bold text-primary shadow-inner appearance-none cursor-pointer">
                        <option>Full Container Load (FCL)</option>
                        <option>Product Samples</option>
                        <option>Partnership Inquiry</option>
                        <option>Logistics Query</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Requirement Details</label>
                    <textarea rows={5} placeholder="Include product types, approximate volumes, and target shipping date..." className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-1 focus:ring-accent/50 transition-all outline-none resize-none font-medium text-primary shadow-inner"></textarea>
                  </div>

                  <button type="submit" className="w-full btn-primary py-5 flex items-center justify-center space-x-3 text-sm font-bold tracking-[0.2em] uppercase shadow-2xl group">
                    <span>Send Official Enquiry</span>
                    <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                  
                  <p className="text-center text-[10px] font-bold text-gray-300 uppercase tracking-widest pt-4">
                    Response time: Within 12 business hours
                  </p>
                </form>
              </div>
              {/* Background accent */}
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-0" />
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
