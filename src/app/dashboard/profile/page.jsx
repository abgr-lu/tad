"use client";
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [user, setUser] = useState({ name: '', country: '', image: '' });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/user').then(res => res.json()).then(data => {
      const userData = Array.isArray(data) ? data : data;
      setUser({ name: userData?.name || '', country: userData?.country || '', image: userData?.image || '' });
      loadingProfileDelay();
    });
  }, []);

  // Soft fallback trigger to prevent structural layout jumps
  const loadingProfileDelay = () => setLoading(false);

  // 1. FILE UPLOAD LOGIC (Strict 4MB Binary Limit)
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

  // 2. PERSONAL METRICS DATA UPDATE (Name & Country Ledger)
  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/user/update', { method: 'PUT', body: JSON.stringify(user) });
    if (res.ok) {
      alert("✅ Profile records updated successfully.");
      window.location.reload();
    }
  };

  // 3. SECURE PASSKEY CREDENTIALMUTATION
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      return alert("❌ Validation Error: New password entries do not match.");
    }

    const res = await fetch('/api/user/password', {
      method: 'PUT',
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
    <div className="space-y-6 max-w-xl mx-auto animate-fade-in pb-12">
      
      {/* HEADER SECTION */}
      <header className="border-b border-slate-200 dark:border-slate-800/60 pb-5">
        <h1 className="text-2xl font-[900] tracking-tighter text-slate-900 dark:text-white uppercase italic">
          Account Settings
        </h1>
        <p className="mt-1.5 text-xs font-bold text-slate-400 dark:text-slate-500 tracking-tight">
          Manage your identity credentials, profile visual nodes, and security layer parameters.
        </p>
      </header>

      {/* SECTION 1: IDENTITY CREDENTIALS & AVATAR MATRIX */}
      <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 rounded-2xl p-8 shadow-sm backdrop-blur-md transition-colors">
        
        {/* AVATAR UPLOAD SECTION */}
        <div className="flex flex-col items-center text-center pb-6 border-b border-slate-100 dark:border-slate-800/40 mb-6">
          <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-950/80 border-2 border-blue-500 dark:border-blue-500/30 overflow-hidden shadow-inner flex items-center justify-center relative group">
            {user.image ? (
              <img src={user.image} alt="Profile node" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl select-none">👤</span>
            )}
          </div>
          
          <label className="mt-4 text-xs font-black tracking-wider uppercase text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-white cursor-pointer transition-colors">
            Upload New Photo
            <input type="file" hidden onChange={handleFileUpload} accept="image/*" />
          </label>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-1 uppercase tracking-wide">
            Max Capacity: 4MB (JPG, PNG)
          </span>
        </div>

        {/* PROFILE INFORMATION METRICS FORM */}
        <form onSubmit={handleUpdateInfo} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
              Full Name
            </label>
            <input 
              type="text" 
              value={user.name} 
              onChange={e => setUser({...user, name: e.target.value})} 
              className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/60 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-xs font-bold tracking-tight focus:outline-none focus:border-blue-500 transition-colors"
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
              className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/60 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-xs font-bold tracking-tight focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <button 
            type="submit" 
            className="w-full mt-2 py-3 bg-blue-600 dark:bg-blue-500/10 hover:bg-blue-700 dark:hover:bg-blue-500/20 text-white dark:text-blue-400 border border-transparent dark:border-blue-500/20 text-xs font-black tracking-widest uppercase rounded-xl transition-all shadow-sm cursor-pointer"
          >
            Save Profile Ledger
          </button>
        </form>
      </div>

      {/* SECTION 2: PASSKEY / SECURITY MATRIX LAYER */}
      <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 border-t-4 border-t-red-500 dark:border-t-red-500/80 rounded-2xl p-8 shadow-sm backdrop-blur-md transition-colors">
        <h3 className="text-xs font-black tracking-[0.2em] text-slate-800 dark:text-white uppercase mb-4 flex items-center gap-2">
          <span>🔐</span> Security Layer (Credentials)
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
              className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/60 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-xs font-bold tracking-tight focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
              New Password Mutation
            </label>
            <input 
              type="password" 
              required 
              value={passwords.new} 
              onChange={e => setPasswords({...passwords, new: e.target.value})} 
              className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/60 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-xs font-bold tracking-tight focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
              Confirm New Password Mutation
            </label>
            <input 
              type="password" 
              required 
              value={passwords.confirm} 
              onChange={e => setPasswords({...passwords, confirm: e.target.value})} 
              className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/60 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-xs font-bold tracking-tight focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>

          <button 
            type="submit" 
            className="w-full mt-2 py-3 bg-red-500 dark:bg-red-500/10 hover:bg-red-600 dark:hover:bg-red-500/20 text-white dark:text-red-400 border border-transparent dark:border-red-500/20 text-xs font-black tracking-widest uppercase rounded-xl transition-all shadow-sm cursor-pointer"
          >
            Mutate Access Password
          </button>
        </form>
      </div>
      
    </div>
  );
}