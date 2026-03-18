import { useLocation, useNavigate } from 'react-router-dom';
import { QrCode, Wallet, CheckCircle2, Copy, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useState } from 'react';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formatCurrency } = useLanguage();
  const amount = location.state?.amount || 0;
  const orderCode = location.state?.orderCode || 'ORD-UNKNOWN';
  const [copied, setCopied] = useState(false);

  const handleCopyUPI = () => {
    navigator.clipboard.writeText("futureindiaexim@upi");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pt-32 pb-24 bg-background min-h-screen">
      <div className="max-w-[800px] mx-auto px-6">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary italic mb-4">Secure Settlement</h1>
          <p className="text-gray-400 font-medium uppercase tracking-widest text-xs font-bold underline underline-offset-8 decoration-accent/30 decoration-2">Complete your transaction to finalize export protocol</p>
        </header>

        <div className="bg-white p-10 md:p-14 rounded-[3.5rem] shadow-2xl border border-gray-100 space-y-12 relative overflow-hidden">
          {/* Background Accent */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-32 -mt-32" />
          
          {/* Totals Section */}
          <div className="relative flex flex-col items-center justify-center p-12 bg-gray-50 rounded-[3rem] border border-gray-100">
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-4">Settlement Amount</span>
             <h2 className="text-6xl font-serif font-bold text-primary italic mb-2">{formatCurrency(amount)}</h2>
             <span className="text-xs font-bold text-accent px-4 py-1 bg-accent/10 rounded-full tracking-widest">{orderCode}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* UPI QR Section */}
            <div className="space-y-8 flex flex-col items-center">
               <div className="text-center group">
                  <div className="w-14 h-14 rounded-3xl bg-primary/10 flex items-center justify-center text-primary border border-primary/5 mx-auto mb-4 group-hover:scale-110 transition-transform">
                     <QrCode className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-primary italic">Scan & Pay</h3>
                  <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Instant UPI Verification</p>
               </div>

               <div className="p-6 bg-white border-4 border-primary/5 rounded-[2.5rem] shadow-inner relative group">
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=futureindiaexim@upi&pn=FutureIndiaExim&am=${amount}&cu=INR" 
                    alt="UPI QR Code"
                    className="w-48 h-48 opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/40 backdrop-blur-[2px] rounded-[2.5rem]">
                      <CheckCircle2 className="w-12 h-12 text-primary drop-shadow-lg" />
                  </div>
               </div>

               <button 
                onClick={handleCopyUPI}
                className="flex items-center gap-3 px-6 py-3 bg-gray-50 text-primary text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:bg-primary hover:text-white transition-all border border-transparent hover:border-primary/20"
               >
                 {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                 {copied ? "Copied UPI ID" : "Copy VPA: futureindiaexim@upi"}
               </button>
            </div>

            {/* Manual Verification Section */}
            <div className="space-y-8">
               <div className="group">
                  <div className="w-14 h-14 rounded-3xl bg-accent/10 flex items-center justify-center text-accent border border-accent/5 mb-4 group-hover:scale-110 transition-transform">
                     <Wallet className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-primary italic">Manual Approval</h3>
                  <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">For Large Transactions (Bank Transfer)</p>
               </div>

               <div className="space-y-6">
                  <div className="p-6 rounded-[2rem] bg-gray-50 border border-gray-100 space-y-2 group hover:bg-white hover:shadow-xl transition-all">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Bank Identifier / Swift</span>
                      <p className="text-sm font-bold text-primary italic font-serif">FIE-IND-6542-SWIFT</p>
                  </div>
                  <div className="p-6 rounded-[2rem] bg-gray-50 border border-gray-100 space-y-2 group hover:bg-white hover:shadow-xl transition-all">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Account Destination</span>
                      <p className="text-sm font-bold text-primary italic font-serif">Future India Exim Ltd. Bank</p>
                  </div>
               </div>

               <button 
                onClick={() => navigate('/my-account')}
                className="w-full btn-primary py-5 rounded-[2rem] flex items-center justify-center gap-4 text-[10px] font-bold tracking-widest uppercase shadow-xl group"
               >
                 <span>View Order Status</span>
                 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </button>
            </div>
          </div>
        </div>

        <p className="mt-12 text-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] leading-relaxed max-w-lg mx-auto">
          Payments are subject to export compliance verification. Your order status will update within 2-4 hours of settlement.
        </p>
      </div>
    </div>
  );
};

export default Payment;
