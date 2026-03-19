import { useLocation, useNavigate } from 'react-router-dom';
import { QrCode, Wallet, CheckCircle2, Copy, Upload, ShieldCheck, Clock, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formatCurrency } = useLanguage();
  const amount = location.state?.amount || 0;
  const orderId = location.state?.orderId;
  const orderCode = location.state?.orderCode || 'ORD-UNKNOWN';
  
  const [copied, setCopied] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const [paymentName, setPaymentName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopyUPI = () => {
    navigator.clipboard.writeText("futureindiaexim@upi");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !transactionId || !paymentName) {
        alert("Please complete all fields and upload proof");
        return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append('orderId', String(orderId));
    formData.append('screenshot', file);
    formData.append('transactionId', transactionId);
    formData.append('paymentName', paymentName);

    try {
      const res = await fetch('http://localhost:5001/api/payments/proof', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => navigate('/my-account'), 3000);
      } else {
        const err = await res.json();
        alert(err.error || "Submission failed");
      }
    } catch (error) {
      console.error('Error submitting proof:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
        <div className="pt-24 pb-12 bg-[#F8F9FA] min-h-screen flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl text-center border border-gray-100">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-green-500/20">
                    <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-primary italic mb-3">Settlement Verified</h2>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed">Proof has been persisted for analysis. Redirecting to trade ledger...</p>
                <div className="mt-8 h-1 bg-gray-50 rounded-full overflow-hidden">
                    <motion.div initial={{ x: '-100%' }} animate={{ x: '0%' }} transition={{ duration: 3 }} className="h-full bg-accent" />
                </div>
            </motion.div>
        </div>
    );
  }

  return (
    <div className="pt-28 pb-12 bg-[#F8F9FA] min-h-screen font-sans">
      <div className="max-w-[1100px] mx-auto px-6">
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    <span className="text-[10px] font-bold text-accent tracking-[0.2em] uppercase">{orderCode} • PENDING SETTLEMENT</span>
                </div>
                <h1 className="text-4xl font-serif font-bold text-primary italic leading-none">Financial Protocol</h1>
            </div>
            <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Total Volume</span>
                <span className="text-2xl font-serif font-bold text-primary italic">{formatCurrency(amount)}</span>
            </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: QR Section (Desktop 5/12) */}
            <div className="lg:col-span-5 space-y-6">
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary border border-primary/10">
                            <QrCode className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-primary uppercase tracking-widest">Instant UPI Scan</h3>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Secure mobile settlement</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="p-4 bg-gray-50 rounded-[2rem] border border-gray-100 mb-6">
                            <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=futureindiaexim@upi&pn=FutureIndiaExim&am=${amount}&cu=INR`} 
                                alt="UPI QR Code"
                                className="w-40 h-40 mix-blend-multiply opacity-90"
                            />
                        </div>

                        <div className="w-full space-y-3">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none">VPA: futureindiaexim@upi</span>
                                <button 
                                    onClick={handleCopyUPI}
                                    className="text-accent hover:text-primary transition-colors"
                                >
                                    {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                            <button 
                                onClick={handleCopyUPI}
                                className="w-full py-4 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-accent transition-all shadow-lg shadow-primary/10"
                            >
                                {copied ? "Persisted to Clipboard" : "Copy Settlement ID"}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-primary p-8 rounded-[2rem] text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <Wallet className="w-5 h-5 text-accent" />
                            <h3 className="text-sm font-serif font-bold italic">Corporate Endpoint</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-white/5 border border-white/10 rounded-xl font-serif">
                                <span className="text-[8px] font-bold text-accent/60 uppercase tracking-widest block mb-0.5">Account ID</span>
                                <span className="text-[10px] font-bold italic">FIE-PROTOCOL-X</span>
                            </div>
                            <div className="p-3 bg-white/5 border border-white/10 rounded-xl font-serif">
                                <span className="text-[8px] font-bold text-accent/60 uppercase tracking-widest block mb-0.5">Commercial ID</span>
                                <span className="text-[10px] font-bold italic">IN-7782-FI</span>
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-2xl -mr-16 -mt-16" />
                </div>
            </div>

            {/* Right: Verification Form (Desktop 7/12) */}
            <div className="lg:col-span-7">
                <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-50">
                        <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-serif font-bold text-primary italic">Verify Settlement</h3>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Submit transaction proof for protocol audit</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmitProof} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Proof Screenshot</label>
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full aspect-square bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-all overflow-hidden group relative"
                                    >
                                        {preview ? (
                                            <>
                                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                                    <Upload className="w-6 h-6 text-white" />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-300 mb-3 shadow-sm group-hover:scale-105 transition-transform">
                                                    <Upload className="w-5 h-5" />
                                                </div>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center px-4">Upload Capture</p>
                                            </>
                                        )}
                                    </div>
                                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                </div>
                            </div>

                            <div className="space-y-6 flex flex-col justify-end">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Transaction Ref</label>
                                    <input 
                                        required
                                        value={transactionId}
                                        onChange={e => setTransactionId(e.target.value)}
                                        type="text" 
                                        className="w-full px-5 py-4 rounded-xl bg-gray-50 border-none outline-none focus:bg-white focus:ring-1 focus:ring-accent text-xs font-bold text-primary transition-all" 
                                        placeholder="12-digit UPI / Ref ID"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Payer Identity</label>
                                    <input 
                                        required
                                        value={paymentName}
                                        onChange={e => setPaymentName(e.target.value)}
                                        type="text" 
                                        className="w-full px-5 py-4 rounded-xl bg-gray-50 border-none outline-none focus:bg-white focus:ring-1 focus:ring-accent text-xs font-bold text-primary transition-all" 
                                        placeholder="Business / Payer Name"
                                    />
                                </div>
                                <div className="p-4 bg-orange-50 rounded-xl border border-orange-100/50 flex gap-3">
                                    <AlertCircle className="w-4 h-4 text-orange-400 shrink-0" />
                                    <p className="text-[9px] font-bold text-orange-600/80 uppercase tracking-widest leading-normal">Ensure the Transaction ID matches the screenshot exactly.</p>
                                </div>
                            </div>
                        </div>

                        <button 
                            disabled={submitting}
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/95 text-white py-5 rounded-2xl flex items-center justify-center gap-4 text-[11px] font-bold tracking-[0.2em] uppercase shadow-xl shadow-primary/10 transition-all disabled:opacity-50"
                        >
                            {submitting ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <ShieldCheck className="w-5 h-5 text-accent" />}
                            <span>{submitting ? 'AUDITING...' : 'VERIFY SETTLEMENT'}</span>
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-50 flex items-center gap-3">
                        <Clock className="w-4 h-4 text-gray-300" />
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Analyzed within 2-4 economic hours</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
