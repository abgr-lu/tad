"use client";
import { useEffect, useState } from 'react';

// Iconos SVG profesionales integrados para sustituir elementos informales
const Icons = {
  User: () => <svg className="w-8 h-8 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>,
  Shield: () => <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
};

export default function ProfilePage() {
  const [user, setUser] = useState({ name: '', country: '', image: '' });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/user').then(res => res.json()).then(data => {
      const userData = Array.isArray(data) ? data[0] : data;
      setUser({ name: userData?.name || '', country: userData?.country || '', image: userData?.image || '' });
      setLoading(false);
    });
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      alert("⚠️ File exceeds size ceiling. Maximum allowed capacity is 4MB.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/user/upload', { method: 'POST', body: formData });
    if (res.ok) {
      const { imageUrl } = await res.json();
      setUser({ ...user, image: imageUrl });
      alert("✅ Profile image updated successfully.");
      window.location.reload(); 
    }
  };

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/user/update', { method: 'PUT', body: JSON.stringify(user) });
    if (res.ok) {
      alert("✅ Profile records updated successfully.");
      window.location.reload();
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      return alert("❌ Validation Error: New password entries do not match.");
    }

    const res = await fetch('/api/user/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.new })
    });

    if (res.ok) {
      alert("✅ Security credentials mutated successfully.");
      setPasswords({ current: '', new: '', confirm: '' });
    } else {
      const error = await res.json();
      alert(`❌ Security Rejection: ${error.error}`);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-2 max-w-xl mx-auto font-sans">
        <span className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-slate-400 dark:border-slate-600 border-t-transparent" />
        <span className="text-xs text-slate-400 dark:text-slate-500 font-mono tracking-wider uppercase">
          Querying secure account profiles...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-xl mx-auto animate-fade-in pb-12">
      
      {/* HEADER SECTION */}
      <header className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-2xl font-[900] tracking-tighter text-slate-900 dark:text-white uppercase italic">
          Account Settings
        </h1>
      </header>

      {/* SECTION 1: IDENTITY CREDENTIALS & AVATAR MATRIX */}
      <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm">
        
        {/* AVATAR UPLOAD SECTION */}
        <div className="flex flex-col items-center text-center pb-6 border-b border-slate-100 dark:border-slate-800 mb-6">
          <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-900 border-2 border-blue-500/30 overflow-hidden shadow-inner flex items-center justify-center relative">
            {user.image ? (
              <img src={user.image} alt="Profile node" className="w-full h-full object-cover" />
            ) : (
              <Icons.User />
            )}
          </div>
          
          <label className="mt-4 text-xs font-black tracking-wider uppercase text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer transition-colors">
            Upload New Photo
            <input type="file" hidden onChange={handleFileUpload} accept="image/*" />
          </label>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-1 uppercase tracking-wider">
            Max Capacity: 4MB (JPG, PNG)
          </span>
        </div>

        {/* PROFILE INFORMATION FORM */}
        <form onSubmit={handleUpdateInfo} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
              Full Name
            </label>
            <input 
              type="text" 
              value={user.name} 
              onChange={e => setUser({...user, name: e.target.value})} 
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs font-bold tracking-tight focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
              Country Base
            </label>
            <input 
              type="text" 
              value={user.country} 
              onChange={e => setUser({...user, country: e.target.value})} 
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs font-bold tracking-tight focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <button 
            type="submit" 
            className="w-full mt-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black tracking-widest uppercase rounded-xl transition-all shadow-sm cursor-pointer"
          >
            Save Profile Ledger
          </button>
        </form>
      </div>

      {/* SECTION 2: SECURITY LAYER */}
      <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 border-t-4 border-t-red-500 rounded-xl p-8 shadow-sm">
        <h3 className="text-xs font-black tracking-[0.2em] text-slate-900 dark:text-white uppercase mb-6 flex items-center gap-2.5">
          <Icons.Shield /> Security Layer (Credentials)
        </h3>
        
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
              Current Active Password
            </label>
            <input 
              type="password" 
              required 
              value={passwords.current} 
              onChange={e => setPasswords({...passwords, current: e.target.value})} 
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs font-bold tracking-tight focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
              New Password
            </label>
            <input 
              type="password" 
              required 
              value={passwords.new} 
              onChange={e => setPasswords({...passwords, new: e.target.value})} 
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs font-bold tracking-tight focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
              Confirm New Password
            </label>
            <input 
              type="password" 
              required 
              value={passwords.confirm} 
              onChange={e => setPasswords({...passwords, confirm: e.target.value})} 
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs font-bold tracking-tight focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>

          <button 
            type="submit" 
            className="w-full mt-2 py-3.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black tracking-widest uppercase rounded-xl transition-all shadow-sm cursor-pointer"
          >
            Change Password
          </button>
        </form>
      </div>
      
    </div>
  );
}