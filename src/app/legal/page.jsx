import Link from 'next/link';

export const metadata = {
  title: 'Legal Information & Disclaimers | Ourios Analytics',
  description: 'Legal Notice, Financial Disclaimer, Terms of Use, and Privacy Policy for Ourios Analytics.',
};

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090D16] text-slate-800 dark:text-slate-200 antialiased font-sans">
      
      {/* NAVEGACIÓN SUPERIOR / RETORNO */}
      <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link 
            href="/" 
            className="text-lg font-black tracking-tighter text-slate-900 dark:text-white uppercase italic hover:text-blue-600 transition-colors"
          >
            Ourios Analytics
          </Link>
          <Link 
            href="/" 
            className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* CONTENEDOR PRINCIPAL */}
      <main className="max-w-5xl mx-auto px-6 py-12 md:py-16">
        
        {/* CABECERA DE LA SECCIÓN */}
        <header className="mb-12 border-b border-slate-200 dark:border-slate-800 pb-8">
          <span className="text-[11px] font-mono tracking-widest uppercase text-blue-600 dark:text-blue-400 font-bold block mb-2">
            Regulatory & Compliance Framework
          </span>
          <h1 className="text-3xl md:text-5xl font-[900] tracking-tight text-slate-900 dark:text-white uppercase italic">
            Legal Information
          </h1>
          <p className="mt-3 text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-3xl">
            This document sets forth the Legal Notice, Financial Disclaimers, Terms of Use, and Privacy Policy governing your access to and use of all quantitative models, analytics, and software services provided by Ourios Analytics.
          </p>
          <p className="mt-2 text-xs font-mono text-slate-400">
            Last Updated: September 2026 • Official Contact: info@ouriosanalytics.com
          </p>
        </header>

        {/* MENÚ DE ACCESO RÁPIDO (TOC) */}
        <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl p-4 mb-12 flex flex-wrap gap-4 text-xs font-bold uppercase tracking-wider shadow-sm">
          <a href="#legal-notice" className="text-blue-600 dark:text-blue-400 hover:underline">
            1. Legal Notice & Financial Disclaimer ↓
          </a>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <a href="#terms-of-use" className="text-blue-600 dark:text-blue-400 hover:underline">
            2. Terms of Use ↓
          </a>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <a href="#privacy-policy" className="text-blue-600 dark:text-blue-400 hover:underline">
            3. Privacy Policy ↓
          </a>
        </div>

        <div className="space-y-16">

          {/* ========================================================================= */}
          {/* SECCIÓN 1: LEGAL NOTICE & FINANCIAL DISCLAIMER                            */}
          {/* ========================================================================= */}
          <section id="legal-notice" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
                1. Legal Notice & Strict Financial Disclaimer
              </h2>
            </div>

            <div className="bg-amber-500/10 border-l-4 border-amber-500 p-5 rounded-r-xl mb-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-2">
                Mandatory Notice: Not Financial or Investment Advice
              </h3>
              <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                All materials, valuation spreadsheets, algorithms, financial models, estimates, and data matrices accessible via Ourios Analytics are developed and provided strictly for educational, research, and informational purposes. Under no circumstance does Ourios Analytics provide regulated investment, legal, tax, or accounting advice.
              </p>
            </div>

            <div className="space-y-4 text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed text-justify">
              <p>
                <strong>No Offer or Solicitation:</strong> Nothing contained within the Ourios Analytics platform constitutes an offer to buy, a solicitation of an offer to sell, or a recommendation to purchase, hold, or divest any stock, security, option, bond, corporate debt instrument, commodity, derivative, or any other financial asset in any jurisdiction.
              </p>
              <p>
                <strong>Obligation of Independent Due Diligence:</strong> Every financial asset and capital investment involves substantial market, liquidity, interest rate, and operational risk, including the possible total loss of principal invested. You acknowledge and agree that you are solely responsible for executing your own comprehensive, independent Due Diligence before entering into any transaction. Users must verify all calculations, balance sheet interpretations, enterprise valuation multiples, and macroeconomic assumptions with their own qualified, licensed financial advisors.
              </p>
              <p>
                <strong>Model Assumptions and Historical Limitations:</strong> Quantitative models provided by Ourios Analytics incorporate assumptions, simulations, and historical operational metrics. Historical performance, dividend yields, cash flow recurrence, and past returns are never indicative of future outcomes. Ourios Analytics makes no representation, warranty, or guarantee—express or implied—regarding the accuracy, completeness, or reliability of third-party financial filings, SEC reports, corporate filings, market feeds, or model outputs.
              </p>
              <p>
                <strong>Operator Identification:</strong> The platform is owned and operated under the brand name <strong>Ourios Analytics</strong>. For any legal or regulatory communications, you may reach our designated compliance channel directly at <a href="mailto:info@ouriosanalytics.com" className="text-blue-600 dark:text-blue-400 underline font-semibold">info@ouriosanalytics.com</a>.
              </p>
            </div>
          </section>

          <hr className="border-slate-200 dark:border-slate-800" />

          {/* ========================================================================= */}
          {/* SECCIÓN 2: TERMS OF USE                                                   */}
          {/* ========================================================================= */}
          <section id="terms-of-use" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
                2. Terms of Use
              </h2>
            </div>

            <div className="space-y-4 text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed text-justify">
              <p>
                <strong>1. Acceptance of Terms:</strong> By creating an account, completing a subscription payment, or browsing Ourios Analytics, you agree to be bound unconditionally by these Terms of Use and all applicable laws and regulations. If you disagree with any portion of these terms, your sole remedy is to immediately discontinue using the service.
              </p>
              <p>
                <strong>2. Proprietary Rights and License Grant:</strong> All financial software, architecture, analytical models, interactive calculation sheets, UI components, texts, and source code are the exclusive intellectual property of Ourios Analytics. We grant you a revocable, non-exclusive, non-transferable, personal license to access and utilize the models solely for your internal research. You may not distribute, redistribute, license, sublicense, scrape, reverse-engineer, resell, or publicly republish any proprietary model or compiled dataset without explicit prior written authorization from Ourios Analytics.
              </p>
              <p>
                <strong>3. Subscriptions, Payments, and Billings:</strong> Access to institutional-grade features and updated financial models is subject to recurring subscription fees processed securely through our payment service provider, Stripe. Subscription periods renew automatically (monthly or annually depending on your selection) unless cancelled prior to the end of the current billing cycle. All charges are non-refundable once the billing window commences, except where mandated by statutory consumer rights.
              </p>
              <p>
                <strong>4. Account Security:</strong> You are strictly responsible for maintaining the confidentiality of your credentials and session cookies. Sharing account access with third parties or attempting to bypass security barriers or subscriber access tiers will result in immediate termination of service without entitlement to refund.
              </p>
              <p>
                <strong>5. Limitation of Liability:</strong> To the maximum extent permitted by applicable law, Ourios Analytics, its creators, operators, and affiliates shall not be liable for any direct, indirect, punitive, incidental, special, consequential, or exemplary damages, including without limitation damages for loss of profits, investment capital losses, lost opportunities, goodwill, or operational disruptions arising from the use of, or inability to use, this service or its analytical outputs.
              </p>
            </div>
          </section>

          <hr className="border-slate-200 dark:border-slate-800" />

          {/* ========================================================================= */}
          {/* SECCIÓN 3: PRIVACY POLICY                                                 */}
          {/* ========================================================================= */}
          <section id="privacy-policy" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
                3. Privacy Policy
              </h2>
            </div>

            <div className="space-y-4 text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed text-justify">
              <p>
                <strong>1. Data Philosophy:</strong> At Ourios Analytics, we adhere strictly to principles of data minimization and transparency in accordance with global data protection standards (including the EU General Data Protection Regulation - GDPR). We collect only the information strictly necessary to authenticate your identity and deliver our analytical services.
              </p>
              <p>
                <strong>2. Data We Collect:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Account & Identity Data:</strong> Your email address and cryptographically hashed passwords (`bcrypt`) utilized to maintain secure session integrity.
                </li>
                <li>
                  <strong>Billing & Payment Tokens:</strong> Payment transactions are executed directly by Stripe. Ourios Analytics never stores, processes, or sees your credit card number or full banking details; we receive only cryptographically signed customer tokens and subscription verification status.
                </li>
                <li>
                  <strong>Profile & Usage Customization:</strong> Optional profile information you choose to enter (such as name, jurisdiction, or uploaded avatar image) stored in encrypted database repositories.
                </li>
              </ul>
              <p>
                <strong>3. Purpose of Processing:</strong> Collected data is used exclusively to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Verify subscriber authentication and gate access to proprietary models.</li>
                <li>Deliver mandatory transactional emails (such as account setup tokens and subscription renewal receipts) via our verified transactional delivery infrastructure (Resend).</li>
                <li>Prevent fraudulent access, platform abuse, and unauthorized redistribution.</li>
              </ul>
              <p>
                <strong>4. No Sale or Commercial Exploitation:</strong> Ourios Analytics does not sell, rent, monetize, or trade your personal data with any data broker or advertising network.
              </p>
              <p>
                <strong>5. Cookies and Session Management:</strong> We utilize secure, HTTP-only authentication session cookies (`session_token`) necessary for user login and site functionality. We do not use non-essential advertising trackers.
              </p>
              <p>
                <strong>6. Your Rights & Data Erasure:</strong> Under applicable privacy statutes, you hold the right to inspect, correct, export, or request the permanent deletion of your personal records and account history. To exercise any of these rights, contact us at <a href="mailto:info@ouriosanalytics.com" className="text-blue-600 dark:text-blue-400 underline font-semibold">info@ouriosanalytics.com</a>.
              </p>
            </div>
          </section>

        </div>

        {/* CIERRE DE PÁGINA */}
        <footer className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-500">
          <p>© {new Date().getFullYear()} Ourios Analytics. All rights reserved.</p>
          <p className="mt-1">Inquiries: <a href="mailto:info@ouriosanalytics.com" className="text-blue-600 dark:text-blue-400 underline">info@ouriosanalytics.com</a></p>
        </footer>

      </main>

    </div>
  );
}