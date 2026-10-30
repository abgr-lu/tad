"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ShippingFeedbackPage() {
  const [formData, setFormData] = useState({
    email: '',
    source: '',
    overallRating: '5',
    modelsFeedback: '',
    usedForRealInvesting: 'Yes, regularly',
    requestedModels: '',
    missingFeatures: '',
    mostLiked: '',
    leastLiked: '',
    suggestions: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to send your feedback. Please try again.');
      }

      setIsSubmitted(true);
    } catch (err) {
      setErrorMessage(err.message || 'Connection error. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        
        {/* LOGO CORPORATIVO CENTRADO */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <Image
              src="/logo.png"
              alt="Ourios Analytics Logo"
              width={200}
              height={60}
              priority
              className="h-10 w-auto object-contain"
            />
          </Link>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl">
          {isSubmitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 text-blue-400 text-3xl mb-2">
                ✓
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-white">
                Thank you for your feedback!
              </h2>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Your insights help us continuously refine our valuation models and shipping coverage.
              </p>
              <div className="pt-6">
                <Link
                  href="/dashboard"
                  className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-widest py-3 px-6 rounded-xl transition-colors"
                >
                  Return to Dashboard
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                  Investor Experience Survey
                </h1>
                <p className="mt-2 text-sm text-slate-400">
                  Help us build the most precise shipping intelligence platform. Share your feedback on our valuation tools.
                </p>
              </div>

              {errorMessage && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-7">
                
                {/* Email Address */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Your Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="investor@example.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Question 1: How did you hear about us? */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    1. How did you hear about us?
                  </label>
                  <select
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="">Select an option...</option>
                    <option value="X / Twitter (@shippingupmore)">X / Twitter (@shippingupmore)</option>
                    <option value="YouTube Channel">YouTube Channel</option>
                    <option value="Investor Peer Recommendation">Investor Peer Recommendation</option>
                    <option value="Google / Search Engine">Google / Search Engine</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Question 2: Overall Experience */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    2. How would you rate your overall experience? (1 to 5)
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {['1', '2', '3', '4', '5'].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, overallRating: num }))}
                        className={`py-3 rounded-xl font-bold text-sm border transition-all ${
                          formData.overallRating === num
                            ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question 3: Feedback on Models */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    3. How do you evaluate our current financial models?
                  </label>
                  <textarea
                    rows={3}
                    name="modelsFeedback"
                    value={formData.modelsFeedback}
                    onChange={handleChange}
                    placeholder="Clarity, fleet data accuracy, easy to try your own assumptions..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Question 4: Real Investing Use */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    4. Are you using these models for live shipping investments?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'Yes, regularly', label: 'Yes, regularly' },
                      { value: 'Currently evaluating', label: 'Evaluating' },
                      { value: 'Not yet', label: 'Not yet' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, usedForRealInvesting: opt.value }))}
                        className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all ${
                          formData.usedForRealInvesting === opt.value
                            ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question 5: Requested Models or Data */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    5. Which shipping companies or data would you add?
                  </label>
                  <textarea
                    rows={3}
                    name="requestedModels"
                    value={formData.requestedModels}
                    onChange={handleChange}
                    placeholder="Specific tickers, orderbook visibility, vessels sales..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Question 6: Missing Features */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    6. Is there anything you find missing in the models, the control panel, or the platform??
                  </label>
                  <textarea
                    rows={3}
                    name="missingFeatures"
                    value={formData.missingFeatures}
                    onChange={handleChange}
                    placeholder="Come on, be bold and let us know what you’d like ;)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Question 7: What do you like the most? */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    7. What do you like the most about Ourios Analytics?
                  </label>
                  <textarea
                    rows={3}
                    name="mostLiked"
                    value={formData.mostLiked}
                    onChange={handleChange}
                    placeholder="What provides the highest value to your research..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Question 8: What do you like the least? */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    8. What do you like the least or find frustrating?
                  </label>
                  <textarea
                    rows={3}
                    name="leastLiked"
                    value={formData.leastLiked}
                    onChange={handleChange}
                    placeholder="Any friction points, UX details, or confusing metrics..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Question 9: What would you change? */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    9. If you could change or improve one single thing today, what would it be?
                  </label>
                  <textarea
                    rows={3}
                    name="suggestions"
                    value={formData.suggestions}
                    onChange={handleChange}
                    placeholder="Your top priority suggestion..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-black text-xs uppercase tracking-[0.2em] py-4 rounded-xl transition-all cursor-pointer shadow-lg shadow-blue-600/20"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        <span>Sending Feedback...</span>
                      </>
                    ) : (
                      'Submit Feedback'
                    )}
                  </button>
                </div>

              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}