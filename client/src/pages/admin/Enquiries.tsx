import { getApiUrl } from '../../config/api';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  Search, 
  X, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Building2,
  Send,
  CheckCircle,
  Archive,
  Menu
} from 'lucide-react';

interface Inquiry {
  id: number;
  name: string;
  email: string;
  country: string;
  food_item: string;
  type: string;
  message: string;
  phone?: string;
  company_name?: string;
  status: string;
  created_at: string;
}

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState<Inquiry[]>([
    {
      id: 1,
      name: "Marcus Thorne",
      email: "m.thorne@londonagro.co.uk",
      country: "United Kingdom",
      food_item: "Organic Turmeric",
      type: "Bulk Order",
      message: "Initial interest in 15MT monthly supply. Please provide pricing for premium grade.",
      status: "New",
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      name: "Aria Chen",
      email: "aria@singaporefoods.sg",
      country: "Singapore",
      food_item: "Basmati Rice",
      type: "Sample Request",
      message: "Requesting quotation for 2 x 20ft FCL. Also need batch samples for 1121 Sella.",
      status: "New",
      created_at: new Date().toISOString()
    }
  ]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Inquiry | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  const fetchEnquiries = () => {
    fetch(getApiUrl('/admin/inquiries'))
      .then(res => res.json())
      .then(json => {
        if (json.data) setEnquiries(json.data);
      })
      .catch(err => console.error('Error fetching enquiries:', err));
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const filteredEnquiries = enquiries.filter(enq => 
    (filter === 'All' || enq.status === filter) &&
    (enq.name?.toLowerCase().includes(search.toLowerCase()) || enq.food_item?.toLowerCase().includes(search.toLowerCase()))
  ).sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const updateStatus = async (id: number, status: string) => {
    try {
      await fetch(getApiUrl(`/admin/enquiries/${id}/status`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchEnquiries();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleReply = async () => {
    if (!replyText.trim()) return;
    setIsReplying(true);
    try {
      const res = await fetch(getApiUrl(`/admin/inquiries/${selectedEnquiry?.id}/reply`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: replyText })
      });
      if (res.ok) {
        setReplyText('');
        alert("Reply sent successfully");
        updateStatus(selectedEnquiry!.id, 'Responded');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsReplying(false);
    }
  };

  const deleteEnquiry = async (id: number) => {
    if (!window.confirm("Are you sure you want to permanently delete this lead?")) return;
    try {
      const res = await fetch(getApiUrl(`/admin/enquiries/${id}`), {
        method: 'DELETE'
      });
      if (res.ok) {
        setSelectedEnquiry(null);
        fetchEnquiries();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4 md:space-y-8 pb-12 font-sans px-1 md:px-0">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-6">
        <div>
          <h1 className="text-xl md:text-3xl font-serif font-bold text-primary italic leading-none">Inquiry Protocol</h1>
          <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Operational Trade Matrix • Real-time Monitoring</p>
        </div>
        
        {/* COMPACT SEARCH & FILTER DOCK */}
        <div className="flex items-center gap-2 md:gap-4 bg-white p-1.5 md:p-2 rounded-2xl md:rounded-2xl shadow-sm border border-gray-100 flex-1 lg:max-w-xl">
           <div className="relative flex-1">
              <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-3 h-3 md:w-3.5 md:h-3.5 text-gray-300" />
              <input 
                type="text" 
                placeholder="Audit leads..." 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                className="w-full pl-8 md:pl-10 pr-2 md:pr-4 py-2 bg-gray-50 border-none rounded-xl text-[8px] md:text-[10px] font-bold text-primary focus:ring-1 focus:ring-accent outline-none" 
              />
           </div>
           <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border-l border-gray-200">
              <Menu className="w-3 h-3 text-gray-300 md:hidden" />
              <select 
                className="bg-transparent text-[8px] md:text-[10px] font-black text-primary uppercase tracking-widest focus:outline-none border-none cursor-pointer appearance-none md:appearance-auto"
                value={filter}
                onChange={e => setFilter(e.target.value)}
              >
                  <option value="All">All Protocol</option>
                  <option value="New">New Vectors</option>
                  <option value="Contacted">Active</option>
                  <option value="Responded">Responded</option>
                  <option value="Closed">Archived</option>
              </select>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        {filteredEnquiries.map((enq) => (
          <motion.div 
            layout
            key={enq.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between"
          >
             <div className="space-y-3 md:space-y-6">
                 <div className="flex justify-between items-start">
                    <div className={`px-3 md:px-4 py-1 rounded-full text-[7px] md:text-[8px] font-black uppercase tracking-widest ${
                        enq.status === 'New' ? 'bg-blue-50 text-blue-600' :
                        enq.status === 'Responded' ? 'bg-green-50 text-green-600' :
                        'bg-gray-50 text-gray-500'
                    }`}>
                        {enq.status}
                    </div>
                    <span className="text-[7px] md:text-[9px] font-bold text-gray-300 uppercase tracking-widest">{new Date(enq.created_at).toLocaleDateString()}</span>
                 </div>

                 <div>
                    <h3 className="text-sm md:text-xl font-serif font-bold text-primary group-hover:text-accent transition-colors mb-0.5 md:mb-1 italic">
                        {enq.food_item}
                    </h3>
                    <div className="flex items-center gap-2 text-[7px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <Globe className="w-2.5 h-2.5 md:w-3 h-3 text-accent" />
                        {enq.country} · {enq.type}
                    </div>
                 </div>

                 <p className="text-[10px] md:text-xs text-gray-500 font-medium line-clamp-2 leading-relaxed italic border-l-2 border-gray-100 pl-2 md:pl-3">
                    "{enq.message}"
                 </p>
             </div>

             <div className="mt-4 md:mt-8 pt-4 md:pt-8 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3">
                   <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg md:rounded-full bg-gray-50 flex items-center justify-center text-primary italic font-serif text-xs md:text-sm border border-gray-100 shadow-inner">
                     {enq.name[0]}
                   </div>
                   <div>
                      <div className="text-[8px] md:text-[10px] font-bold text-primary leading-none mb-0.5">{enq.name}</div>
                      <div className="text-[6px] md:text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Potential Partner</div>
                   </div>
                </div>
                <button 
                  onClick={() => setSelectedEnquiry(enq)}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gray-50 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm active:scale-90"
                >
                    <Eye className="w-3.5 h-3.5 md:w-4 h-4" />
                </button>
             </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedEnquiry && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 bg-primary/95 backdrop-blur-md">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="w-full max-w-5xl bg-white rounded-3xl md:rounded-[3rem] shadow-3xl overflow-hidden relative flex flex-col md:flex-row max-h-[95vh] md:max-h-[90vh]"
                >
                    <button 
                        onClick={() => setSelectedEnquiry(null)}
                        className="absolute top-4 right-4 md:top-8 md:right-8 w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-50 flex items-center justify-center text-primary hover:bg-red-50 hover:text-red-500 transition-all z-[210] active:rotate-90"
                    >
                        <X className="w-4 h-4 md:w-5 h-5" />
                    </button>

                    {/* Left Snapshot */}
                    <div className="w-full md:w-5/12 bg-gray-50 p-6 md:p-12 md:border-r border-gray-100 flex flex-col gap-4 md:gap-10">
                        <div className="mb-2 md:mb-0">
                           <h3 className="text-lg md:text-2xl font-serif font-bold text-primary italic leading-none mb-1 md:mb-2 text-center md:text-left">Vector Metrics</h3>
                           <p className="text-[7px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-relaxed text-center md:text-left">
                             Direct commercial synchronization protocol
                           </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-6">
                            <div className="p-3 md:p-6 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-2 md:space-y-4">
                                <div className="flex items-start gap-2 md:gap-4">
                                    <div className="w-6 h-6 md:w-10 md:h-10 bg-primary/5 rounded-lg md:rounded-xl flex items-center justify-center text-primary shrink-0">
                                        <User className="w-3 h-3 md:w-5 h-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <span className="text-[6px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">Partner</span>
                                        <span className="text-[9px] md:text-sm font-bold text-primary truncate block">{selectedEnquiry.name}</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2 md:gap-4">
                                    <div className="w-6 h-6 md:w-10 md:h-10 bg-primary/5 rounded-lg md:rounded-xl flex items-center justify-center text-primary shrink-0">
                                        <Building2 className="w-3 h-3 md:w-5 h-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <span className="text-[6px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">Entity</span>
                                        <span className="text-[9px] md:text-sm font-bold text-primary italic font-serif truncate block">{selectedEnquiry.company_name || 'Individual'}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-3 md:p-6 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-2 md:space-y-4">
                                <div className="flex items-start gap-2 md:gap-4">
                                    <div className="w-6 h-6 md:w-10 md:h-10 bg-accent/10 rounded-lg md:rounded-xl flex items-center justify-center text-accent shrink-0">
                                        <Mail className="w-3 h-3 md:w-5 h-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <span className="text-[6px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">Endpoint</span>
                                        <span className="text-[8px] md:text-xs font-bold text-primary truncate block">{selectedEnquiry.email}</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2 md:gap-4">
                                    <div className="w-6 h-6 md:w-10 md:h-10 bg-accent/10 rounded-lg md:rounded-xl flex items-center justify-center text-accent shrink-0">
                                        <Phone className="w-3 h-3 md:w-5 h-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <span className="text-[6px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">Protocol</span>
                                        <span className="text-[9px] md:text-xs font-bold text-primary truncate block">{selectedEnquiry.phone || 'Standby'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Body */}
                    <div className="flex-1 p-6 md:p-12 overflow-y-auto space-y-6 md:space-y-12 bg-white">
                        <div className="space-y-2 md:space-y-4">
                            <span className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] block">Request Payload</span>
                            <div className="text-xs md:text-lg font-serif text-primary italic leading-relaxed bg-gray-50 p-4 md:p-8 rounded-2xl md:rounded-[2rem] border-l-4 border-accent shadow-inner">
                                "{selectedEnquiry.message}"
                            </div>
                        </div>

                        <div className="space-y-4 md:space-y-6">
                            <h4 className="text-[8px] md:text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                                <Send className="w-3 h-3 md:w-4 h-4 text-accent" /> Dispatch Reply
                            </h4>
                            <textarea
                                value={replyText}
                                onChange={e => setReplyText(e.target.value)}
                                className="w-full p-4 md:p-8 rounded-2xl md:rounded-[2rem] bg-gray-50 border border-gray-100 outline-none focus:ring-1 focus:ring-accent text-xs md:text-sm font-medium italic font-serif min-h-[100px] md:min-h-[150px] transition-all"
                                placeholder="Draft response protocol..."
                            />
                            <div className="flex gap-2 md:gap-4">
                                <button 
                                    disabled={isReplying}
                                    onClick={handleReply}
                                    className="flex-1 bg-primary py-3 md:py-4 rounded-xl text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 md:gap-3 hover:bg-accent transition-all shadow-xl active:scale-95 disabled:opacity-50"
                                >
                                    {isReplying ? <div className="w-3 h-3 md:w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <CheckCircle className="w-3.5 h-3.5 md:w-4 h-4 text-accent" />}
                                    <span>Synchronize Response</span>
                                </button>
                                <button 
                                    onClick={() => deleteEnquiry(selectedEnquiry.id)}
                                    className="px-4 md:px-8 py-3 md:py-4 bg-gray-100 rounded-xl text-gray-400 text-[8px] md:text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all active:scale-90"
                                >
                                    <Archive className="w-3.5 h-3.5 md:w-4 h-4" />
                                </button>
                            </div>
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
