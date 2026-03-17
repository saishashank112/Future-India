import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      const success = login(email, password);
      if (success) {
        navigate('/admin');
        setLoading(false);
      } else {
        setError('Invalid credentials. Access denied.');
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] -z-0" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] -z-0" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md bg-white rounded-[3rem] p-12 shadow-2xl overflow-hidden"
      >
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/10">
            <span className="text-accent font-bold text-2xl">FI</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-primary italic mb-2">Admin Portal</h1>
          <p className="text-gray-400 font-medium uppercase tracking-widest text-[10px]">Secure Gateway for Future India Exim</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-300" />
              <input 
                required
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-1 focus:ring-accent font-medium text-primary shadow-inner"
                placeholder="admin@futureindia.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-300" />
              <input 
                required
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-1 focus:ring-accent font-medium text-primary shadow-inner"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 p-4 bg-red-50 rounded-2xl text-red-600 text-[11px] font-bold uppercase tracking-wider"
            >
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </motion.div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-primary py-5 rounded-2xl flex items-center justify-center space-x-3 text-xs font-bold tracking-[0.2em] uppercase shadow-2xl group transition-all"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Access Dashboard</span>
                <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-12 text-center">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">
              Forgotten access? Contact root administrator.
            </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
