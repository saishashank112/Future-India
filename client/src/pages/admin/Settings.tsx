import { Shield, Bell, User, Save } from 'lucide-react';

const AdminSettings = () => {
  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-4xl font-serif font-bold text-primary mb-2 italic">Control Panel</h1>
        <p className="text-gray-400 font-medium uppercase tracking-widest text-xs">Manage system configurations and security.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* General Section */}
          <section className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-primary">
                <User className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif font-bold text-primary italic">Organization Identity</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Display Name</label>
                <input type="text" defaultValue="Future India Exim" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none text-sm font-bold text-primary outline-none focus:ring-1 focus:ring-accent shadow-inner" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Official Email</label>
                <input type="email" defaultValue="contact@futureindiaexim.in" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none text-sm font-bold text-primary outline-none focus:ring-1 focus:ring-accent shadow-inner" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Global HQ Address</label>
              <textarea rows={3} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none text-sm font-bold text-primary outline-none focus:ring-1 focus:ring-accent shadow-inner resize-none" defaultValue="Dno.41-1/16-3, Bapanaiah Nagar, Krishnalanka, Bank Colony, Vijayawada, Andhra Pradesh - 520013" />
            </div>
          </section>

          {/* Security Section */}
          <section className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-red-500">
                <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif font-bold text-primary italic">Security & Credentials</h3>
            </div>
            
            <div className="space-y-6">
                <div className="p-6 bg-gray-50 rounded-[2rem] space-y-4">
                     <p className="text-xs font-bold text-primary uppercase">Change Administrative Password</p>
                     <p className="text-[10px] text-gray-400 font-medium pb-2">Ensure your account uses a strong, secure password.</p>
                     <input type="password" placeholder="Current Password" className="w-full px-6 py-4 rounded-2xl bg-white border-none text-sm font-bold text-primary outline-none focus:ring-1 focus:ring-accent shadow-sm" />
                     <input type="password" placeholder="New Password" className="w-full px-6 py-4 rounded-2xl bg-white border-none text-sm font-bold text-primary outline-none focus:ring-1 focus:ring-accent shadow-sm" />
                     <button className="w-full mt-2 bg-primary text-white text-[10px] font-bold uppercase tracking-widest py-3 rounded-xl hover:bg-accent transition-colors shadow-lg">
                        Update Password
                     </button>
                </div>
            </div>
          </section>
        </div>

        <div className="space-y-10">
          {/* Notifications config */}
          <section className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
             <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                    <Bell className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-primary italic">Alert Config</h3>
             </div>
             
             <div className="space-y-6">
                {['New Inquiries', 'Export Milestone', 'System Updates'].map(item => (
                    <div key={item} className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{item}</span>
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-200 text-accent focus:ring-accent" />
                    </div>
                ))}
             </div>
          </section>

          <button className="w-full btn-primary py-5 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest shadow-2xl">
             <Save className="w-5 h-5" />
             Save Configurations
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
