import Link from 'next/link';

// Iconos SVG oficiales vectorizados para las redes sociales
const SocialIcons = {
  X: () => (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  TikTok: () => (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  ),
  YouTube: () => (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F19] transition-colors py-12">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* BLOQUE IZQUIERDO: MARCA Y DERECHOS */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
          <span className="text-sm font-black tracking-tighter uppercase italic text-slate-900 dark:text-white">
            Ourios Analytics
          </span>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            © {currentYear} Ourios Analytics. All rights reserved.
          </p>
        </div>

        {/* BLOQUE CENTRAL: ENLACE LEGAL */}
        <div className="flex items-center gap-6">
          <Link
            href="/legal"
            className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-wider"
          >
            Legal Information, Terms & Privacy
          </Link>
        </div>

        {/* BLOQUE DERECHO: REDES SOCIALES */}
        <div className="flex items-center gap-3">
          {/* Botón X */}
          <a
            href="https://x.com/ouriosanalytics" // Sustituye con tu perfil real de X cuando lo tengas
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow us on X"
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-slate-600 transition-all bg-slate-50 dark:bg-slate-900/50"
          >
            <SocialIcons.X />
          </a>

          {/* Botón TikTok */}
          <a
            href="https://www.tiktok.com/@ouriosanalytics" // Sustituye con tu perfil real de TikTok
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow us on TikTok"
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-slate-600 transition-all bg-slate-50 dark:bg-slate-900/50"
          >
            <SocialIcons.TikTok />
          </a>

          {/* Botón YouTube */}
          <a
            href="https://www.youtube.com/@ouriosanalytics" // Sustituye con tu canal real de YouTube
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Subscribe on YouTube"
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-500 hover:border-red-300 dark:hover:border-red-900/50 transition-all bg-slate-50 dark:bg-slate-900/50"
          >
            <SocialIcons.YouTube />
          </a>
        </div>

      </div>
    </footer>
  );
}