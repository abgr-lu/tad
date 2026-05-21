"use client";
import { useState } from 'react';

export default function SupportPage() {
  const [ticket, setTicket] = useState({ subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    const res = await fetch('/api/support', {
      method: 'POST',
      body: JSON.stringify(ticket)
    });

    if (res.ok) {
      alert("✅ Ticket submitted successfully. Our analyst desk will review it shortly.");
      setTicket({ subject: '', message: '' });
    }
    setSending(false);
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto animate-fade-in pb-12">
      
      {/* HEADER SECTION */}
      <header className="border-b border-slate-200 dark:border-slate-800/60 pb-5">
        <h1 className="text-2xl font-[900] tracking-tighter text-slate-900 dark:text-white uppercase italic">
          Help & Support Desk
        </h1>
        <p className="mt-1.5 text-xs font-bold text-slate-400 dark:text-slate-500 tracking-tight">
          Encountering technical discrepancies or data gaps? Submit an official operational inquiry.
        </p>
      </header>

      {/* TICKET DISPATCH CARD */}
      <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 rounded-2xl p-8 shadow-sm backdrop-blur-md transition-colors">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* SUBJECT INPUT */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
              Inquiry Subject
            </label>
            <input 
              type="text" 
              required 
              placeholder="e.g., Data sync discrepancy within V-Sales ledger"
              value={ticket.subject}
              onChange={e => setTicket({...ticket, subject: e.target.value})}
              className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/60 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-xs font-bold tracking-tight placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          
          {/* MESSAGE TEXTAREA */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
              Detailed Context / Message
            </label>
            <textarea 
              required 
              placeholder="Provide a comprehensive breakdown of your query or system issue..."
              value={ticket.message}
              onChange={e => setTicket({...ticket, message: e.target.value})}
              className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/60 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-xs font-bold tracking-tight placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors h-36 resize-none"
            />
          </div>

          {/* DISPATCH ACTION BUTTON */}
          <button 
            type="submit" 
            disabled={sending}
            className="w-full mt-2 py-3 bg-blue-600 dark:bg-blue-500/10 hover:bg-blue-700 dark:hover:bg-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-white dark:text-blue-400 border border-transparent dark:border-blue-500/20 text-xs font-black tracking-widest uppercase rounded-xl transition-all shadow-sm cursor-pointer"
          >
            {sending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block animate-spin rounded-full h-3 w-3 border border-current border-t-transparent" />
                Dispatching Ticket...
              </span>
            ) : (
              'Submit Operational Inquiry'
            )}
          </button>

        </form>
      </div>

    </div>
  );
}