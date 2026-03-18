import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, ShieldCheck, CheckCircle2, Mail, Phone, Lock, User, KeyRound } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [method, setMethod] = useState<'password' | 'otp'>('password');
  
  // Signup State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  // Login State
  const [identifier, setIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // OTP State
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'request' | 'verify'>('request');
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signup, loginWithPassword, sendOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !password) {
      setError('All fields are required for professional registration.');
      return;
    }
    
    setIsLoading(true);
    setError('');

    const cleanData = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password: password.trim()
    };
    
    const res = await signup(cleanData);
    
    if (res.success) {
      navigate('/', { replace: true });
    } else {
      setError(res.error || 'Registration failed. Please try again.');
    }
    setIsLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !loginPassword) {
      setError('Please provide your credentials.');
      return;
    }

    setIsLoading(true);
    setError('');

    const cleanIdentifier = identifier.trim();
    const cleanPassword = loginPassword.trim();

    // Admin fallback
    if (cleanIdentifier === 'admin@futureindia.com') {
      navigate('/admin/login');
      return;
    }

    const res = await loginWithPassword(cleanIdentifier, cleanPassword);
    
    if (res.success) {
      navigate('/', { replace: true });
    } else {
      setError(res.error || 'Invalid credentials. Please verify your details.');
    }
    setIsLoading(false);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) return;
    
    setIsLoading(true);
    setError('');

    const success = await sendOtp(identifier, 'email'); // Defaulting to email for recovery
    
    if (success) {
      setStep('verify');
    } else {
      setError('Security Error: Unable to transmit recovery token.');
    }
    setIsLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;
    
    setIsLoading(true);
    setError('');
    
    const success = await verifyOtp(identifier, otp);
    
    if (success) {
       navigate('/', { replace: true });
    } else {
      setError('Invalid recovery token.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 flex items-center justify-center px-4 md:px-6">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        
        {/* Branding Side - Hidden on small mobile */}
        <div className="space-y-6 hidden lg:block pr-12">
          <div className="inline-flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm text-[10px] font-bold text-primary uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5 text-accent" />
            <span>Secure Trade Portal</span>
          </div>
          
          <h1 className="text-4xl xl:text-5xl font-serif font-bold text-primary italic leading-tight">
            Global Commerce,<br/>
            Engineered for <span className="text-accent">Trust</span>.
          </h1>
          
          <p className="text-gray-400 font-medium leading-relaxed max-w-md text-sm">
            Access your personalized export dashboard. Track shipments, manage RFQs, and securely finalize commercial agreements directly.
          </p>

          <div className="space-y-4 pt-6 md:pt-8 border-t border-gray-100">
             <div className="flex items-center gap-4 text-[10px] font-bold text-primary uppercase tracking-widest">
               <CheckCircle2 className="w-5 h-5 text-accent" /> Encrypted Credentials
             </div>
             <div className="flex items-center gap-4 text-[10px] font-bold text-primary uppercase tracking-widest">
               <CheckCircle2 className="w-5 h-5 text-accent" /> Corporate Sovereignty
             </div>
          </div>
        </div>

        {/* Form Side */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="bg-white/80 backdrop-blur-xl p-6 md:p-14 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl border border-white/50 relative overflow-hidden group w-full"
        >
          {/* Subtle bg glow */}
          <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-accent/10 rounded-full blur-[60px] md:blur-[80px] -mr-10 -mt-10" />
          
          <div className="relative z-10 w-full">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary italic">
                    {isLogin ? (method === 'password' ? 'Corporate Login' : 'Secure Verification') : 'New Application'}
                  </h2>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                    {isLogin ? 'Access your account' : 'Apply for trade access'}
                  </p>
                </div>
                <div className="bg-primary/5 p-3 rounded-2xl">
                  {isLogin ? <Lock className="w-5 h-5 text-accent" /> : <User className="w-5 h-5 text-accent" />}
                </div>
              </div>

              {error && (
                 <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 bg-red-50 text-red-500 text-[10px] font-bold p-4 rounded-xl border border-red-100 flex items-center gap-3"
                 >
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    {error}
                 </motion.div>
              )}

              {/* Toggle Login/Signup */}
              {step === 'request' && (
                <div className="flex bg-gray-50/50 p-1 rounded-2xl mb-8 border border-gray-100">
                   <button 
                     type="button"
                     onClick={() => { setIsLogin(true); setError(''); setMethod('password'); }}
                     className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${isLogin ? 'bg-white shadow-sm text-primary' : 'text-gray-400 hover:text-primary'}`}
                   >
                     Sign In
                   </button>
                   <button 
                     type="button"
                     onClick={() => { setIsLogin(false); setError(''); }}
                     className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${!isLogin ? 'bg-white shadow-sm text-primary' : 'text-gray-400 hover:text-primary'}`}
                   >
                     Sign Up
                   </button>
                </div>
              )}

              <AnimatePresence mode="wait">
                 {isLogin ? (
                    method === 'password' ? (
                      <motion.form 
                        key="login-password"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        onSubmit={handleLogin} 
                        className="space-y-5"
                      >
                         <div className="space-y-4">
                            <div className="relative group/field">
                               <label className="text-[9px] font-bold text-primary uppercase tracking-widest px-1 block mb-2">Email, Phone, or Name</label>
                               <div className="relative">
                                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/field:text-accent transition-colors">
                                     <User className="w-4 h-4" />
                                  </div>
                                  <input 
                                     type="text"
                                     required
                                     value={identifier}
                                     onChange={e => setIdentifier(e.target.value)}
                                     placeholder="account@company.com"
                                     className="w-full pl-12 pr-6 py-4.5 rounded-2xl bg-gray-50 border-none outline-none focus:ring-1 focus:ring-accent text-sm font-bold text-primary transition-shadow hover:shadow-inner"
                                  />
                               </div>
                            </div>
                            
                            <div className="relative group/field">
                               <div className="flex justify-between items-center mb-2">
                                  <label className="text-[9px] font-bold text-primary uppercase tracking-widest px-1">Access Password</label>
                                  <button type="button" onClick={() => setMethod('otp')} className="text-[8px] font-bold text-accent uppercase tracking-wider hover:underline">Forgot?</button>
                               </div>
                               <div className="relative">
                                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/field:text-accent transition-colors">
                                     <KeyRound className="w-4 h-4" />
                                  </div>
                                  <input 
                                     type="password"
                                     required
                                     value={loginPassword}
                                     onChange={e => setLoginPassword(e.target.value)}
                                     placeholder="••••••••••••"
                                     className="w-full pl-12 pr-6 py-4.5 rounded-2xl bg-gray-50 border-none outline-none focus:ring-1 focus:ring-accent text-sm font-bold text-primary transition-shadow hover:shadow-inner"
                                  />
                               </div>
                            </div>
                         </div>

                         <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full btn-primary py-5 rounded-2xl flex items-center justify-center gap-4 text-[10px] font-bold tracking-widest uppercase shadow-xl mt-8"
                         >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                 <span>Authorize Access</span>
                                 <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                         </button>
                      </motion.form>
                    ) : (
                      /* OTP Recovery / Login Flow if user wants it */
                      <motion.form 
                        key="login-otp"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        onSubmit={step === 'request' ? handleSendOtp : handleVerifyOtp} 
                        className="space-y-6"
                      >
                         {step === 'request' ? (
                            <div className="space-y-4">
                               <label className="text-[9px] font-bold text-primary uppercase tracking-widest px-1 block">Account Identifier</label>
                               <input 
                                  type="text"
                                  required
                                  value={identifier}
                                  onChange={e => setIdentifier(e.target.value)}
                                  placeholder="email@address.com"
                                  className="w-full px-6 py-4.5 rounded-2xl bg-gray-50 border-none outline-none focus:ring-1 focus:ring-accent text-sm font-bold text-primary transition-shadow"
                               />
                               <p className="text-[8px] text-gray-400 uppercase font-bold tracking-widest px-1">We will send a one-time secure recovery token to this address.</p>
                            </div>
                         ) : (
                            <div className="space-y-4">
                               <div className="bg-accent/5 p-4 rounded-2xl text-center mb-4 border border-accent/10">
                                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Token transmitted to:</div>
                                  <div className="text-xs font-bold text-primary">{identifier}</div>
                               </div>
                               <label className="text-[9px] font-bold text-primary uppercase tracking-widest px-1 block text-center">Enter 6-Digit Token</label>
                               <input 
                                  type="text"
                                  required
                                  maxLength={6}
                                  value={otp}
                                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                                  placeholder="000 000"
                                  className="w-full px-6 py-5 rounded-2xl bg-gray-50 border-none outline-none focus:ring-1 focus:ring-accent text-2xl font-bold text-primary text-center tracking-[0.5em]"
                               />
                            </div>
                         )}

                         <div className="flex flex-col gap-3">
                            <button 
                               type="submit" 
                               disabled={isLoading}
                               className="w-full btn-primary py-5 rounded-2xl flex items-center justify-center gap-4 text-[10px] font-bold tracking-widest uppercase shadow-xl"
                            >
                               {isLoading ? 'Processing...' : (step === 'request' ? 'Send Recovery Code' : 'Verify & Sign In')}
                            </button>
                            <button type="button" onClick={() => { setMethod('password'); setStep('request'); }} className="text-[9px] font-bold text-gray-400 uppercase hover:text-primary transition-colors py-2">Back to Password Login</button>
                         </div>
                      </motion.form>
                    )
                 ) : (
                    /* Signup Flow */
                    <motion.form 
                      key="signup"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      onSubmit={handleSignup} 
                      className="space-y-4"
                    >
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                             <label className="text-[9px] font-bold text-primary uppercase tracking-widest px-1">Full Name</label>
                             <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input 
                                   type="text"
                                   required
                                   value={name}
                                   onChange={e => setName(e.target.value)}
                                   placeholder="John Doe"
                                   className="w-full pl-11 pr-5 py-3.5 md:py-4.5 rounded-2xl bg-gray-50 text-xs font-bold text-primary outline-none focus:ring-1 focus:ring-accent"
                                />
                             </div>
                          </div>
                          
                          <div className="space-y-2">
                             <label className="text-[9px] font-bold text-primary uppercase tracking-widest px-1">Email Address</label>
                             <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input 
                                   type="email"
                                   required
                                   value={email}
                                   onChange={e => setEmail(e.target.value)}
                                   placeholder="corporate@email.com"
                                   className="w-full pl-11 pr-5 py-3.5 md:py-4.5 rounded-2xl bg-gray-50 text-xs font-bold text-primary outline-none focus:ring-1 focus:ring-accent"
                                />
                             </div>
                          </div>
                          
                          <div className="space-y-2">
                             <label className="text-[9px] font-bold text-primary uppercase tracking-widest px-1">Phone Number</label>
                             <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input 
                                   type="tel"
                                   required
                                   value={phone}
                                   onChange={e => setPhone(e.target.value)}
                                   placeholder="+91 0000 0000"
                                   className="w-full pl-11 pr-5 py-3.5 md:py-4.5 rounded-2xl bg-gray-50 text-xs font-bold text-primary outline-none focus:ring-1 focus:ring-accent"
                                />
                             </div>
                          </div>

                          <div className="space-y-2">
                             <label className="text-[9px] font-bold text-primary uppercase tracking-widest px-1">Account Password</label>
                             <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input 
                                   type="password"
                                   required
                                   value={password}
                                   onChange={e => setPassword(e.target.value)}
                                   placeholder="Create secure password"
                                   className="w-full pl-11 pr-5 py-3.5 md:py-4.5 rounded-2xl bg-gray-50 text-xs font-bold text-primary outline-none focus:ring-1 focus:ring-accent"
                                />
                             </div>
                          </div>
                       </div>

                       <div className="pt-4">
                          <button 
                             type="submit" 
                             disabled={isLoading}
                             className="w-full btn-primary py-4.5 md:py-5 rounded-2xl flex items-center justify-center gap-4 text-[10px] font-bold tracking-widest uppercase shadow-xl mt-4"
                          >
                             {isLoading ? 'Processing Registration...' : (
                                 <>
                                  <span>Create Account</span>
                                  <ArrowRight className="w-4 h-4" />
                                 </>
                             )}
                          </button>
                          <p className="text-center text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-6 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                             By applying, you agree to our International Trade Protocols and Terms of Export.
                          </p>
                       </div>
                    </motion.form>
                 )}
              </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
