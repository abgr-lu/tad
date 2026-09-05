"use client";
import { useState } from 'react';

// Icono profesional SVG
const Icons = {
  Support: () => <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.38-.132-.77-.47-1.04C3.856 16.255 3 14.225 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>
};

export default function SupportPage() {
  const [form, setForm] = useState({ subject: '', message: '' });
  const [status, setStatus] = useState({ submitting: false, success: false, error: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, success: false, error: '' });

    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        setStatus({ submitting: false, success: true, error: '' });
        setForm({ subject: '', message: '' });
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Failed to dispatch message.');
      }
    } catch (error) {
      setStatus({ submitting: false, success: false, error: error.message });
    }
  };

  return (
    <div className="space-y-8 max-w-xl mx-auto animate-fade-in pb-12">
      
      {/* HEADER SECTION */}
      <header className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-2xl font-[900] tracking-tighter text-slate-900 dark:text-white uppercase italic flex items-center gap-3">
          <Icons.Support /> Client Assistance Desk
        </h1>
        <p className="mt-2 text-xs font-bold text-slate-400 dark:text-slate-500 tracking-wide">
          Direct communication channel with Ourios institutional engineers and platform administrators.
        </p>
      </header>

      {/* FORMULARIO DE SOPORTE */}
      <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm">
        
        {status.success && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs font-bold text-emerald-600 dark:text-emerald-400 tracking-wide">
            ✅ Inquiry dispatched successfully. Our team will review your ticket and respond shortly.
          </div>
        )}

        {status.error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-xs font-bold text-red-400 tracking-wide">
            ❌ Error: {status.error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
              Inquiry Subject / Topic
            </label>
            <input 
              type="text" 
              required
              placeholder="e.g., Valuation Algorithm API Inquiries"
              value={form.subject} 
              onChange={e => setForm({...form, subject: e.target.value})} 
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs font-bold tracking-tight focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
              Detailed Description
            </label>
            <textarea 
              required
              rows={5}
              placeholder="Provide specific technical parameters or system details..."
              value={form.message} 
              onChange={e => setForm({...form, message: e.target.value})} 
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-xs font-bold tracking-tight focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-500 resize-none"
            />
          </div>

          <button 
            type="submit" 
            disabled={status.submitting}
            className="w-full mt-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black tracking-widest uppercase rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            {status.submitting ? 'Transmitting Data...' : 'Submit Support Ticket'}
          </button>
        </form>
      </div>

    </div>
  );
}