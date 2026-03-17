import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Mail, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Eye, 
  X, 
  Send,
  User,
  Package,
  ArrowUpRight
} from 'lucide-react';

interface Enquiry {
  id: number;
  name: string;
  email: string;
  mobile: string;
  country: string;
  product: string;
  quantity: string;
  message: string;
  date: string;
  status: 'New' | 'Contacted' | 'Closed';
  deliveryStatus: 'Pending' | 'Shipped' | 'Processing' | 'Delivered' | 'N/A';
}

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([
    { 
      id: 1, 
      name: 'Hans Müller', 
      email: 'hans@germanimports.de', 
      mobile: '+49 123 456789', 
      country: 'Germany', 
      product: 'Turmeric Finger', 
      quantity: '5 MT', 
      message: 'Looking for premium grade turmeric for local distribution. Need SGS certification.', 
      date: '2025-03-17', 
      status: 'New',
      deliveryStatus: 'Processing'
    },
    { 
      id: 2, 
      name: 'Fatima Al-Sayed', 
      email: 'fatima@uaetraders.ae', 
      mobile: '+971 50 123 4567', 
      country: 'UAE', 
      product: 'Black Pepper', 
      quantity: '2 MT', 
      message: 'Please provide quote for Malabar Garbled Black Pepper.', 
      date: '2025-03-16', 
      status: 'Contacted',
      deliveryStatus: 'Pending'
    },
    { 
      id: 3, 
      name: 'John Doe', 
      email: 'john@usafoods.co', 
      mobile: '+1 415 555 0123', 
      country: 'USA', 
      product: 'Shelled Groundnuts', 
      quantity: '15 MT', 
      message: 'Regular monthly requirement for food manufacturing.', 
      date: '2025-03-15', 
      status: 'Closed',
      deliveryStatus: 'Delivered'
    },
  ]);

  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  const filteredEnquiries = enquiries.filter(enq => 
    (filter === 'All' || enq.status === filter) &&
    (enq.name.toLowerCase().includes(search.toLowerCase()) || enq.product.toLowerCase().includes(search.toLowerCase()))
  );

  const updateStatus = (id: number, status: 'New' | 'Contacted' | 'Closed') => {
    setEnquiries(enquiries.map(enq => enq.id === id ? { ...enq, status } : enq));
  };

  const updateDeliveryStatus = (id: number, deliveryStatus: Enquiry['deliveryStatus']) => {
    setEnquiries(enquiries.map(enq => enq.id === id ? { ...enq, deliveryStatus } : enq));
    if (selectedEnquiry?.id === id) {
        setSelectedEnquiry(prev => prev ? { ...prev, deliveryStatus } : null);
    }
  };

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-serif font-bold text-primary mb-2 italic">Client Enquiries</h1>
          <p className="text-gray-400 font-medium uppercase tracking-widest text-xs">Manage trade requests and logistics status.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input 
              type="text" 
              placeholder="Search datasets..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="pl-14 pr-8 py-4 rounded-2xl bg-white border border-gray-100 text-[10px] font-bold text-primary uppercase tracking-[0.2em] outline-none focus:ring-1 focus:ring-accent shadow-sm min-w-[300px]" 
            />
          </div>
          <select 
            value={filter} 
            onChange={e => setFilter(e.target.value)} 
            className="px-8 py-4 rounded-2xl bg-white border border-gray-100 text-[10px] font-bold text-primary uppercase tracking-[0.2em] outline-none shadow-sm cursor-pointer appearance-none min-w-[180px]"
          >
            <option value="All">All Leads</option>
            <option value="New">New Enquiries</option>
            <option value="Contacted">In Discussion</option>
            <option value="Closed">Finalized</option>
          </select>
        </div>
      </header>

      {/* Leads Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredEnquiries.map((enq) => (
          <motion.div
            layout
            key={enq.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-50 flex flex-col xl:flex-row gap-12 group transition-all hover:shadow-2xl hover:border-accent/10 relative overflow-hidden"
          >
            {/* Delivery Status Indicator */}
            <div className={`absolute top-0 right-10 w-48 py-2 text-center text-[9px] font-bold uppercase tracking-[0.3em] rounded-b-2xl ${
                enq.deliveryStatus === 'Delivered' ? 'bg-green-500 text-white' :
                enq.deliveryStatus === 'Shipped' ? 'bg-accent text-white' :
                enq.deliveryStatus === 'Processing' ? 'bg-blue-500 text-white' :
                'bg-gray-100 text-gray-400'
            }`}>
                <div className="flex items-center justify-center gap-2">
                    <Truck className="w-3.5 h-3.5" />
                    {enq.deliveryStatus}
                </div>
            </div>

            <div className="w-full xl:w-1/4 space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center italic font-serif text-2xl text-primary border border-primary/5">
                        {enq.name[0]}
                    </div>
                    <div>
                        <h3 className="text-xl font-serif font-bold text-primary italic leading-none mb-1 group-hover:text-accent transition-colors">{enq.name}</h3>
                        <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">{enq.country}</p>
                    </div>
                </div>
                
                <div className="space-y-3 pt-4 border-t border-gray-50">
                   <div className="flex items-center gap-3 text-[11px] font-bold text-gray-500">
                     <Mail className="w-4 h-4 text-gray-300" />
                     {enq.email}
                   </div>
                   <div className="flex items-center gap-3 text-[11px] font-bold text-gray-500 italic">
                     <Phone className="w-4 h-4 text-gray-300" />
                     {enq.mobile}
                   </div>
                </div>
            </div>

            <div className="flex-1 space-y-8 bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100/50">
                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    <div>
                      <div className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mb-2">Request Type</div>
                      <div className="text-xs font-bold text-primary uppercase">{enq.product}</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mb-2">Requirement</div>
                      <div className="text-xs font-bold text-accent">{enq.quantity || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mb-2">Recieved On</div>
                      <div className="text-xs font-bold text-gray-500">{enq.date}</div>
                    </div>
                    <div>
                        <div className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mb-2">Lead Lifecycle</div>
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                            enq.status === 'New' ? 'bg-blue-100 text-blue-600' :
                            enq.status === 'Contacted' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-green-100 text-green-600'
                        }`}>
                            {enq.status}
                        </span>
                    </div>
                 </div>
                 <div>
                    <div className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mb-3">Communication Log:</div>
                    <p className="text-xs text-gray-600 leading-relaxed font-light italic border-l-2 border-accent pl-6 bg-white p-4 rounded-xl shadow-inner">
                        "{enq.message}"
                    </p>
                 </div>
            </div>

            <div className="w-full xl:w-48 flex xl:flex-col gap-4 justify-between pt-4">
                <div className="flex items-center justify-end xl:justify-center gap-3">
                   <button 
                    onClick={() => setSelectedEnquiry(enq)}
                    className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-primary shadow-sm hover:bg-accent hover:text-white transition-all transform hover:-translate-y-1"
                   >
                     <Eye className="w-5 h-5" />
                   </button>
                   <button 
                    onClick={() => updateStatus(enq.id, 'Contacted')}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${enq.status === 'Contacted' ? 'bg-yellow-500 text-white shadow-xl rotate-12 scale-110' : 'bg-white border border-gray-100 text-yellow-500 hover:bg-yellow-50'}`}
                   >
                     <Clock className="w-5 h-5" />
                   </button>
                </div>
                <button 
                    onClick={() => updateStatus(enq.id, 'Closed')}
                    className={`w-full py-4 rounded-2xl flex items-center justify-center space-x-3 text-[10px] font-bold uppercase tracking-widest transition-all ${
                        enq.status === 'Closed' ? 'bg-green-500 text-white shadow-lg' : 'bg-primary text-white hover:bg-accent hover:text-primary'
                    }`}
                >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{enq.status === 'Closed' ? 'Finalized' : 'Close Deal'}</span>
                </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Enquiry Details & Action Modal */}
      <AnimatePresence>
        {selectedEnquiry && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-primary/80 backdrop-blur-md">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 30 }}
                    className="relative w-full max-w-5xl bg-white rounded-[3rem] shadow-3xl overflow-hidden flex flex-col md:flex-row min-h-[600px]"
                >
                    <div className="md:w-5/12 bg-gray-50 p-12 flex flex-col border-r border-gray-100">
                        <div className="mb-10">
                            <h3 className="text-3xl font-serif font-bold text-primary italic mb-2">{selectedEnquiry.name}</h3>
                            <p className="text-xs font-bold text-accent uppercase tracking-widest">{selectedEnquiry.country}</p>
                        </div>

                        <div className="space-y-8 flex-1">
                            <div className="p-6 bg-white rounded-[2rem] shadow-sm border border-gray-100">
                                <h4 className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-6">Logistics Tracking</h4>
                                <div className="space-y-4">
                                    {(['Pending', 'Processing', 'Shipped', 'Delivered'] as const).map((step) => (
                                        <button
                                            key={step}
                                            onClick={() => updateDeliveryStatus(selectedEnquiry.id, step)}
                                            className={`w-full p-4 rounded-2xl flex items-center justify-between text-[10px] font-bold uppercase tracking-widest transition-all ${
                                                selectedEnquiry.deliveryStatus === step ? 'bg-accent text-white shadow-lg scale-105' : 'bg-gray-50 text-gray-400 hover:bg-gray-100 transition-colors'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-3 h-3 rounded-full border-2 ${selectedEnquiry.deliveryStatus === step ? 'bg-white border-white' : 'border-gray-200'}`} />
                                                {step}
                                            </div>
                                            {selectedEnquiry.deliveryStatus === step && <ArrowUpRight className="w-4 h-4" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-100 space-y-4">
                             <div className="flex items-center gap-4 text-xs font-bold text-primary">
                                <User className="w-4 h-4 text-accent" />
                                <span>Verified Client Profile</span>
                             </div>
                             <div className="flex items-center gap-4 text-xs font-bold text-primary">
                                <Package className="w-4 h-4 text-accent" />
                                <span>{selectedEnquiry.product} ({selectedEnquiry.quantity})</span>
                             </div>
                        </div>
                    </div>

                    <div className="flex-1 p-16 flex flex-col">
                        <button onClick={() => setSelectedEnquiry(null)} className="absolute top-10 right-10 p-3 hover:bg-gray-50 rounded-full transition-all text-gray-300">
                            <X className="w-6 h-6" />
                        </button>

                        <div className="mb-12">
                             <h4 className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-4">Initial Message</h4>
                             <p className="text-lg font-serif text-primary italic leading-relaxed">"{selectedEnquiry.message}"</p>
                        </div>

                        <div className="flex-1 flex flex-col">
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Official Response</h4>
                            <textarea 
                                value={replyMessage}
                                onChange={e => setReplyMessage(e.target.value)}
                                placeholder="Draft your commercial proposal or follow-up email..."
                                className="flex-1 w-full p-8 rounded-[2rem] bg-gray-50 border-none outline-none focus:ring-1 focus:ring-accent text-sm font-medium resize-none shadow-inner"
                            />
                        </div>

                        <div className="mt-8 flex gap-6">
                            <button className="flex-1 btn-primary py-5 rounded-[2rem] flex items-center justify-center space-x-3 text-xs font-bold tracking-widest uppercase shadow-2xl group">
                                <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                <span>Send to Client</span>
                            </button>
                            <button className="px-10 py-5 rounded-[2rem] border border-gray-100 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-all">
                                Internal Note
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminEnquiries;
