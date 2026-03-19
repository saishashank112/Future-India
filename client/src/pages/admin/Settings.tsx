import { getApiUrl } from '../../config/api';
import { useState, useEffect } from 'react';
import { 
  Building2, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Save, 
  Lock, 
  Globe2, 
  MapPin,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<any>({});
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch(getApiUrl('/settings'));
      const data = await res.json();
      if (res.ok) setSettings(data.data);
    } catch (e) { console.error(e); }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch(getApiUrl('/admin/settings'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });
      if (res.ok) {
        setMessage('Settings saved successfully');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
        alert("Passwords don't match");
        return;
    }
    setSaving(true);
    try {
      const res = await fetch(getApiUrl('/admin/password'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: passwordForm.current, newPassword: passwordForm.new }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Password updated successfully');
        setPasswordForm({ current: '', new: '', confirm: '' });
        setTimeout(() => setMessage(''), 3000);
      } else {
        alert(data.error);
      }
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const tabs = [
    { id: 'general', name: 'General Information', icon: Building2 },
    { id: 'security', name: 'Security Settings', icon: ShieldCheck },
    { id: 'content', name: 'Website Content', icon: Globe2 },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 font-sans">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary italic">Control Protocol</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Platform Master Configurations & Global Settings</p>
        </div>
        <AnimatePresence>
            {message && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="px-4 py-2 bg-green-500 text-white text-[9px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-2 shadow-lg shadow-green-500/20">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{message}</span>
                </motion.div>
            )}
        </AnimatePresence>
      </header>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-72 space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${
                activeTab === tab.id 
                  ? 'bg-primary text-white shadow-xl shadow-primary/20 translate-x-1' 
                  : 'text-gray-400 hover:bg-gray-50'
              }`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-accent' : ''}`} />
              <span className="text-[10px] font-bold uppercase tracking-widest leading-none">{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-grow bg-white p-10 md:p-14 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden">
          {activeTab === 'general' && (
            <div className="space-y-10">
               <div>
                  <h3 className="text-xl font-serif font-bold text-primary italic">Corporate Identity</h3>
                  <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-1">Global contact endpoints and addresses</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1">Official Email</label>
                    <div className="relative group">
                        <input 
                            value={settings.company_email || ''} 
                            onChange={e => setSettings({...settings, company_email: e.target.value})}
                            type="email" 
                            className="w-full px-6 py-4 pl-12 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-1 focus:ring-accent transition-all text-xs font-bold text-primary outline-none" 
                            placeholder="e.g. contact@futureindia.com"
                        />
                        <Mail className="w-4 h-4 text-gray-300 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-accent transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1">Support Hotline</label>
                    <div className="relative group">
                        <input 
                            value={settings.company_phone || ''} 
                            onChange={e => setSettings({...settings, company_phone: e.target.value})}
                            type="tel" 
                            className="w-full px-6 py-4 pl-12 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-1 focus:ring-accent transition-all text-xs font-bold text-primary outline-none" 
                            placeholder="+91 80XXXXXXX"
                        />
                        <Phone className="w-4 h-4 text-gray-300 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-accent transition-colors" />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-3">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1">Corporate Address</label>
                    <div className="relative group">
                        <textarea 
                            value={settings.company_address || ''} 
                            onChange={e => setSettings({...settings, company_address: e.target.value})}
                            rows={3} 
                            className="w-full px-6 py-4 pl-12 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-1 focus:ring-accent transition-all text-xs font-bold text-primary resize-none outline-none font-serif" 
                            placeholder="Enter the full business domicile address..."
                        />
                        <MapPin className="w-4 h-4 text-gray-300 absolute left-4 top-6 group-focus-within:text-accent transition-colors" />
                    </div>
                  </div>
               </div>

               <button 
                onClick={handleSaveSettings}
                disabled={saving}
                className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-accent transition-all shadow-xl shadow-primary/10"
               >
                 {saving ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4 text-accent" />}
                 <span>Persist Changes</span>
               </button>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-10">
               <div>
                  <h3 className="text-xl font-serif font-bold text-primary italic">Administrative Security</h3>
                  <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-1">Update primary access credentials</p>
               </div>

               <form onSubmit={handleChangePassword} className="space-y-8 max-w-md">
                  <div className="space-y-3">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1">Current Password</label>
                    <div className="relative group">
                        <input 
                            required
                            value={passwordForm.current}
                            onChange={e => setPasswordForm({...passwordForm, current: e.target.value})}
                            type="password" 
                            className="w-full px-6 py-4 pl-12 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-1 focus:ring-accent transition-all text-xs font-bold text-primary outline-none" 
                        />
                        <Lock className="w-4 h-4 text-gray-300 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-accent transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1">New Secure Password</label>
                    <div className="relative group">
                        <input 
                            required
                            value={passwordForm.new}
                            onChange={e => setPasswordForm({...passwordForm, new: e.target.value})}
                            type="password" 
                            className="w-full px-6 py-4 pl-12 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-1 focus:ring-accent transition-all text-xs font-bold text-primary outline-none" 
                        />
                        <ShieldCheck className="w-4 h-4 text-gray-300 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-accent transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1">Confirm Protocol</label>
                    <div className="relative group">
                        <input 
                            required
                            value={passwordForm.confirm}
                            onChange={e => setPasswordForm({...passwordForm, confirm: e.target.value})}
                            type="password" 
                            className="w-full px-6 py-4 pl-12 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-1 focus:ring-accent transition-all text-xs font-bold text-primary outline-none" 
                        />
                        <ShieldCheck className="w-4 h-4 text-gray-300 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-accent transition-colors" />
                    </div>
                  </div>

                  <button 
                    disabled={saving}
                    type="submit"
                    className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-accent transition-all shadow-xl shadow-primary/10"
                  >
                    <span>Update Credentials</span>
                    <ArrowRight className="w-4 h-4 text-accent" />
                  </button>
               </form>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="space-y-10">
               <div>
                  <h3 className="text-xl font-serif font-bold text-primary italic">Website Copy & Brand</h3>
                  <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-1">Manage global site messages and banners</p>
               </div>

               <div className="space-y-8 max-w-2xl">
                  <div className="space-y-3">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1">Hero Banner Tagline</label>
                    <textarea 
                        value={settings.site_tagline || ''}
                        onChange={e => setSettings({...settings, site_tagline: e.target.value})}
                        className="w-full px-6 py-4 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-1 focus:ring-accent transition-all text-xs font-bold text-primary italic font-serif outline-none" 
                        rows={2}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1">Announcement Bar (Marquee)</label>
                    <input 
                        value={settings.announcement || ''}
                        onChange={e => setSettings({...settings, announcement: e.target.value})}
                        type="text" 
                        className="w-full px-6 py-4 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-1 focus:ring-accent transition-all text-xs font-bold text-primary uppercase outline-none"
                    />
                  </div>
               </div>

               <button 
                onClick={handleSaveSettings}
                className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-accent transition-all shadow-xl shadow-primary/10"
               >
                 <Save className="w-4 h-4 text-accent" />
                 <span>Synchronize Content</span>
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
