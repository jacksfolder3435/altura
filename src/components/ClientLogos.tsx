const ClientLogos = () => {
  return (
    <div className="mt-12 flex flex-col items-center gap-5">
      <div className="font-mono text-[0.58em] tracking-[0.18em] uppercase text-[hsl(var(--accent-blue)/0.35)]">
        Trusted by leading projects
      </div>
      <div className="flex items-center flex-wrap justify-center border border-[hsl(var(--accent-blue)/0.12)] rounded-xl overflow-hidden bg-white">
        {/* Cardano */}
        <div className="px-6 py-[18px] flex items-center justify-center hover:bg-[hsl(var(--accent-blue)/0.04)] transition-colors">
          <svg width="110" height="32" viewBox="0 0 110 32" fill="none">
            <circle cx="12" cy="16" r="2" fill="#1a1a1a" opacity="0.9" />
            <circle cx="18" cy="10" r="1.5" fill="#1a1a1a" opacity="0.8" />
            <circle cx="18" cy="22" r="1.5" fill="#1a1a1a" opacity="0.8" />
            <circle cx="6" cy="10" r="1.5" fill="#1a1a1a" opacity="0.8" />
            <circle cx="6" cy="22" r="1.5" fill="#1a1a1a" opacity="0.8" />
            <circle cx="24" cy="16" r="1.2" fill="#1a1a1a" opacity="0.6" />
            <circle cx="0" cy="16" r="1.2" fill="#1a1a1a" opacity="0.6" />
            <text x="32" y="21" fontFamily="'Neue Haas Unica','Helvetica Neue',Helvetica,Arial,sans-serif" fontSize="14" fontWeight="700" fill="#1a1a1a" letterSpacing="0.05em">CARDANO</text>
          </svg>
        </div>
        <div className="w-px h-10 bg-[hsl(var(--accent-blue)/0.08)] shrink-0" />

        {/* Aethir */}
        <div className="px-6 py-[18px] flex items-center justify-center hover:bg-[hsl(var(--accent-blue)/0.04)] transition-colors">
          <svg width="90" height="32" viewBox="0 0 90 32" fill="none">
            <path d="M6 26L14 6L22 26" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8.5 20h11" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
            <path d="M17 12l5 14" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
            <text x="30" y="21" fontFamily="'Neue Haas Unica','Helvetica Neue',Helvetica,Arial,sans-serif" fontSize="15" fontWeight="500" fill="#1a1a1a">Aethir</text>
          </svg>
        </div>
        <div className="w-px h-10 bg-[hsl(var(--accent-blue)/0.08)] shrink-0" />

        {/* Cookie3 */}
        <div className="px-6 py-[18px] flex items-center justify-center hover:bg-[hsl(var(--accent-blue)/0.04)] transition-colors">
          <svg width="100" height="32" viewBox="0 0 100 32" fill="none">
            <rect x="4" y="8" width="5" height="5" rx="1" fill="#1a1a1a" opacity="0.9" />
            <rect x="11" y="4" width="5" height="5" rx="1" fill="#1a1a1a" opacity="0.9" />
            <rect x="18" y="8" width="5" height="5" rx="1" fill="#1a1a1a" opacity="0.9" />
            <rect x="4" y="15" width="5" height="5" rx="1" fill="#1a1a1a" opacity="0.7" />
            <rect x="18" y="15" width="5" height="5" rx="1" fill="#1a1a1a" opacity="0.7" />
            <rect x="11" y="19" width="5" height="5" rx="1" fill="#1a1a1a" opacity="0.9" />
            <text x="30" y="21" fontFamily="'Neue Haas Unica','Helvetica Neue',Helvetica,Arial,sans-serif" fontSize="15" fontWeight="600" fill="#1a1a1a">Cookie3</text>
          </svg>
        </div>
        <div className="w-px h-10 bg-[hsl(var(--accent-blue)/0.08)] shrink-0" />

        {/* Polkadot */}
        <div className="px-6 py-[18px] flex items-center justify-center hover:bg-[hsl(var(--accent-blue)/0.04)] transition-colors">
          <svg width="100" height="32" viewBox="0 0 100 32" fill="none">
            <circle cx="12" cy="16" r="5.5" fill="#1a1a1a" opacity="0.9" />
            <circle cx="12" cy="7" r="2.5" fill="#1a1a1a" opacity="0.7" />
            <circle cx="12" cy="25" r="2.5" fill="#1a1a1a" opacity="0.7" />
            <circle cx="4.2" cy="11.5" r="2.5" fill="#1a1a1a" opacity="0.6" />
            <circle cx="4.2" cy="20.5" r="2.5" fill="#1a1a1a" opacity="0.6" />
            <circle cx="19.8" cy="11.5" r="2.5" fill="#1a1a1a" opacity="0.6" />
            <circle cx="19.8" cy="20.5" r="2.5" fill="#1a1a1a" opacity="0.6" />
            <text x="28" y="21" fontFamily="'Neue Haas Unica','Helvetica Neue',Helvetica,Arial,sans-serif" fontSize="15" fontWeight="600" fill="#1a1a1a">Polkadot</text>
          </svg>
        </div>
        <div className="w-px h-10 bg-[hsl(var(--accent-blue)/0.08)] shrink-0" />

        {/* OKX */}
        <div className="px-6 py-[18px] flex items-center justify-center hover:bg-[hsl(var(--accent-blue)/0.04)] transition-colors">
          <svg width="60" height="32" viewBox="0 0 60 32" fill="none">
            <rect x="2" y="9" width="8" height="8" rx="1.5" fill="#1a1a1a" />
            <rect x="12" y="9" width="8" height="8" rx="1.5" fill="#1a1a1a" />
            <rect x="7" y="15" width="8" height="8" rx="1.5" fill="#1a1a1a" />
            <text x="24" y="21" fontFamily="'Neue Haas Unica','Helvetica Neue',Helvetica,Arial,sans-serif" fontSize="15" fontWeight="700" fill="#1a1a1a">OKX</text>
          </svg>
        </div>
        <div className="w-px h-10 bg-[hsl(var(--accent-blue)/0.08)] shrink-0" />

        {/* Solana */}
        <div className="px-6 py-[18px] flex items-center justify-center hover:bg-[hsl(var(--accent-blue)/0.04)] transition-colors">
          <svg width="90" height="32" viewBox="0 0 90 32" fill="none">
            <path d="M4 22h16l4-4H8z" fill="#1a1a1a" opacity="0.9" />
            <path d="M4 16h16l4-4H8z" fill="#1a1a1a" opacity="0.7" />
            <path d="M8 10h16l-4 4H4z" fill="#1a1a1a" opacity="0.5" />
            <text x="30" y="21" fontFamily="'Neue Haas Unica','Helvetica Neue',Helvetica,Arial,sans-serif" fontSize="15" fontWeight="600" fill="#1a1a1a">Solana</text>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ClientLogos;
