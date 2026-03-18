import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Mail, 
  Phone, 
  X, 
  User,
  Package,
  Eye,
  Clock,
  Send
} from 'lucide-react';

interface Enquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  mobile?: string;
  country: string;
  company_name: string;
  food_item: string;
  type: string;
  message: string;
  created_at: string;
  status: 'New' | 'Contacted' | 'Closed';
}

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);

  useEffect(() => {
    fetch('http://localhost:5001/api/admin/inquiries')
      .then(res => res.json())
      .then(json => {
        if (json.data) setEnquiries(json.data);
      })
      .catch(err => console.error('Error fetching inquiries:', err));
  }, []);

  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  const filteredEnquiries = enquiries.filter(enq => 
    (filter === 'All' || enq.status === filter) &&
    (enq.name?.toLowerCase().includes(search.toLowerCase()) || enq.food_item?.toLowerCase().includes(search.toLowerCase()))
  );

  const updateStatus = (id: number, status: 'New' | 'Contacted' | 'Closed') => {
    setEnquiries(enquiries.map(enq => enq.id === id ? { ...enq, status } : enq));
  };


  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:justify-between md:items-end">
        <div>
          <h1 className="text-2xl md:text-4xl font-serif font-bold text-primary mb-1 italic">Client Enquiries</h1>
          <p className="text-gray-400 font-medium uppercase tracking-widest text-xs">Manage trade requests and logistics status.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input 
              type="text" 
              placeholder="Search..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="pl-10 pr-4 py-3 rounded-xl bg-white border border-gray-100 text-xs font-bold text-primary uppercase tracking-wider outline-none focus:ring-1 focus:ring-accent shadow-sm w-full" 
            />
          </div>
          <select 
            value={filter} 
            onChange={e => setFilter(e.target.value)} 
            className="px-4 py-3 rounded-xl bg-white border border-gray-100 text-xs font-bold text-primary uppercase tracking-wider outline-none shadow-sm cursor-pointer"
          >
            <option value="All">All Leads</option>
            <option value="New">New Enquiries</option>
            <option value="Contacted">In Discussion</option>
            <option value="Closed">Finalized</option>
          </select>
        </div>
      </header>

      {/* Count badge */}
      {filteredEnquiries.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm italic">No enquiries found.</div>
      )}

      {/* Leads Grid */}
      <div className="grid grid-cols-1 gap-5">
        {filteredEnquiries.map((enq) => (
          <motion.div
            layout
            key={enq.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-gray-50 flex flex-col lg:flex-row gap-6 group transition-all hover:shadow-xl hover:border-accent/10 relative overflow-hidden"
          >

            <div className="w-full lg:w-60 shrink-0 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center italic font-serif text-xl text-primary border border-primary/5 shrink-0">
                        {enq.name[0]}
                    </div>
                    <div>
                        <h3 className="text-base md:text-lg font-serif font-bold text-primary italic leading-none mb-0.5 group-hover:text-accent transition-colors">{enq.name}</h3>
                        <p className="text-[9px] text-gray-300 font-bold uppercase tracking-widest">{enq.country}</p>
                    </div>
                </div>
                
                <div className="space-y-2 pt-3 border-t border-gray-50">
                   <div className="flex items-center gap-2 text-xs font-bold text-gray-500 truncate">
                     <Mail className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                     <span className="truncate">{enq.email}</span>
                   </div>
                   <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                     <Phone className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                     <span>{enq.phone || (enq.country?.includes('(') ? enq.country.match(/\(([^)]+)\)/)?.[1] : null) || <span className="text-gray-300 italic">Not provided</span>}</span>
                   </div>
                </div>
            </div>

            <div className="flex-1 space-y-5 bg-gray-50/50 p-5 rounded-xl border border-gray-100/50">
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mb-1">Request Type</div>
                      <div className="text-xs font-bold text-primary uppercase">{enq.food_item}</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mb-1">Requirement</div>
                      <div className="text-xs font-bold text-accent">{enq.type || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mb-1">Received On</div>
                      <div className="text-xs font-bold text-gray-500">{new Date(enq.created_at).toLocaleDateString()}</div>
                    </div>
                    <div>
                        <div className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mb-1">Status</div>
                        <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                            enq.status === 'New' ? 'bg-blue-100 text-blue-600' :
                            enq.status === 'Contacted' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-green-100 text-green-600'
                        }`}>
                            {enq.status}
                        </span>
                    </div>
                 </div>
                 <div>
                    <div className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mb-2">Message:</div>
                    <p className="text-xs text-gray-600 leading-relaxed font-light italic border-l-2 border-accent pl-4 bg-white p-3 rounded-xl shadow-inner">
                        "{enq.message}"
                    </p>
                 </div>
            </div>

            <div className="flex flex-row lg:flex-col gap-3 justify-between lg:w-36 shrink-0">
                 <div className="flex gap-2">
                   <button 
                    onClick={() => setSelectedEnquiry(enq)}
                    className="w-9 h-9 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-primary shadow-sm hover:bg-accent hover:text-white transition-all"
                   >
                     <Eye className="w-3.5 h-3.5" />
                   </button>
                   <button 
                    onClick={() => updateStatus(enq.id, 'Contacted')}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${enq.status === 'Contacted' ? 'bg-yellow-500 text-white shadow-xl' : 'bg-white border border-gray-100 text-yellow-500 hover:bg-yellow-50'}`}
                   >
                     <Clock className="w-3.5 h-3.5" />
                   </button>
                </div>
                <button 
                    onClick={() => updateStatus(enq.id, 'Closed')}
                    className={`flex-1 lg:w-full py-2 shadow-sm rounded-xl flex items-center justify-center space-x-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
                        enq.status === 'Closed' ? 'bg-green-500 text-white shadow-lg' : 'bg-primary text-white hover:bg-accent hover:text-primary'
                    }`}
                >
                    <X className="w-3.5 h-3.5" />
                    <span>{enq.status === 'Closed' ? 'Done' : 'Close'}</span>
                </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Enquiry Details & Action Modal */}
      <AnimatePresence>
        {selectedEnquiry && (
            <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-primary/80 backdrop-blur-md">
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="relative w-full max-w-3xl bg-white rounded-t-[2rem] sm:rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]"
                >
                    {/* Close button - small & top-right */}
                    <button
                      onClick={() => setSelectedEnquiry(null)}
                      className="absolute top-4 right-4 z-10 w-7 h-7 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-500 flex items-center justify-center text-gray-400 transition-all"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>

                    {/* Two-column layout */}
                    <div className="flex flex-col md:flex-row min-h-[500px]">

                      {/* Left: Client Info */}
                      <div className="md:w-2/5 bg-gray-50 p-8 flex flex-col gap-5 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none border-b md:border-b-0 md:border-r border-gray-100">
                        {/* Avatar + Name */}
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center font-serif text-2xl font-bold text-primary italic shrink-0">
                            {selectedEnquiry.name?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <h3 className="text-xl font-serif font-bold text-primary italic leading-tight">{selectedEnquiry.name}</h3>
                            <p className="text-[9px] font-bold text-accent uppercase tracking-widest mt-0.5">{selectedEnquiry.country}</p>
                          </div>
                        </div>

                        {/* Contact Details */}
                        <div className="space-y-3 pt-4 border-t border-gray-100">
                          <div className="flex items-start gap-3">
                            <Mail className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                            <span className="text-xs text-gray-600 font-medium break-all">{selectedEnquiry.email}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Phone className="w-3.5 h-3.5 text-accent shrink-0" />
                            <span className="text-xs text-gray-600 font-medium">{selectedEnquiry.phone || selectedEnquiry.mobile || 'Not provided'}</span>
                          </div>
                          {selectedEnquiry.company_name && (
                            <div className="flex items-center gap-3">
                              <User className="w-3.5 h-3.5 text-accent shrink-0" />
                              <span className="text-xs text-gray-600 font-medium">{selectedEnquiry.company_name}</span>
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="pt-4 border-t border-gray-100 space-y-3">
                          <div className="flex items-center gap-3">
                            <Package className="w-3.5 h-3.5 text-accent shrink-0" />
                            <span className="text-xs font-bold text-primary uppercase">{selectedEnquiry.food_item} — {selectedEnquiry.type || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                              selectedEnquiry.status === 'New' ? 'bg-blue-100 text-blue-600' :
                              selectedEnquiry.status === 'Contacted' ? 'bg-yellow-100 text-yellow-600' :
                              'bg-green-100 text-green-600'
                            }`}>{selectedEnquiry.status}</span>
                            <span className="text-[9px] text-gray-400 font-medium">{new Date(selectedEnquiry.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Message & Reply */}
                      <div className="flex-1 p-8 flex flex-col gap-6">
                        {/* Initial Message */}
                        <div>
                          <h4 className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mb-3">Initial Message</h4>
                          <p className="text-sm font-serif text-primary italic leading-relaxed bg-gray-50 p-4 rounded-xl border-l-2 border-accent">
                            "{selectedEnquiry.message}"
                          </p>
                        </div>

                        {/* Reply Textarea */}
                        <div className="flex-1 flex flex-col">
                          <h4 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">Official Response</h4>
                          <textarea 
                            value={replyMessage}
                            onChange={e => setReplyMessage(e.target.value)}
                            placeholder="Draft your commercial proposal or follow-up message..."
                            rows={5}
                            className="flex-1 w-full p-4 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:ring-1 focus:ring-accent text-sm font-medium resize-none"
                          />
                        </div>

                        {/* Action Button - only Send */}
                        <button className="w-full bg-primary hover:bg-accent text-white py-4 rounded-xl flex items-center justify-center space-x-2 text-xs font-bold tracking-widest uppercase shadow-lg transition-colors group">
                          <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          <span>Send to Client</span>
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
