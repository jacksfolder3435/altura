const StrategyInfographic = () => {
  return (
    <div className="flex items-start gap-4 mt-1">
      <div className="flex-1 flex flex-col gap-3">
        <div className="font-mono text-xs tracking-[0.15em] uppercase text-muted-foreground text-center">
          no strategy
        </div>
        <svg className="w-full h-auto" viewBox="0 0 340 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g stroke="rgba(24,0,172,0.2)" strokeWidth="1.2" fill="none">
            <path d="M120 80 C160 60, 210 90, 240 75" markerEnd="url(#ah)" />
            <path d="M240 75 C260 120, 220 150, 260 170" markerEnd="url(#ah)" />
            <path d="M260 170 C230 200, 180 180, 200 220" markerEnd="url(#ah)" />
            <path d="M200 220 C160 240, 110 210, 90 230" markerEnd="url(#ah)" />
            <path d="M90 230 C60 200, 70 160, 50 140" markerEnd="url(#ah)" />
            <path d="M50 140 C40 110, 80 90, 120 80" markerEnd="url(#ah)" />
            <path d="M155 130 C190 100, 230 130, 215 160" markerEnd="url(#ah)" />
            <path d="M215 160 C200 190, 160 185, 145 210" markerEnd="url(#ah)" />
            <path d="M145 210 C120 195, 100 170, 120 150" markerEnd="url(#ah)" />
            <path d="M120 150 C135 135, 150 138, 155 130" markerEnd="url(#ah)" />
          </g>
          <defs>
            <marker id="ah" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M1 1L6 4L1 7" stroke="rgba(24,0,172,0.3)" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </marker>
          </defs>
          <g fontFamily="'Neue Haas Unica','Helvetica Neue',Helvetica,Arial,sans-serif" fontSize="11">
            {[
              { x: 106, y: 84, rx: 60, ry: 68, w: 92, label: "messaging" },
              { x: 181, y: 71, rx: 155, ry: 55, w: 52, label: "why" },
              { x: 252, y: 56, rx: 210, ry: 40, w: 84, label: "audiences" },
              { x: 253, y: 134, rx: 225, ry: 118, w: 56, label: "how" },
              { x: 80, y: 134, rx: 35, ry: 118, w: 90, label: "positioning" },
              { x: 136, y: 146, rx: 110, ry: 130, w: 52, label: "who" },
              { x: 196, y: 164, rx: 165, ry: 148, w: 62, label: "tactics" },
              { x: 128, y: 191, rx: 100, ry: 175, w: 56, label: "what" },
              { x: 92, y: 216, rx: 50, ry: 200, w: 84, label: "narratives" },
              { x: 219, y: 212, rx: 175, ry: 196, w: 88, label: "campaigns" },
              { x: 148, y: 261, rx: 110, ry: 245, w: 76, label: "channels" },
            ].map((p, i) => (
              <g key={i}>
                <rect x={p.rx} y={p.ry} width={p.w} height={24} rx={12} fill="rgba(24,0,172,0.05)" stroke="rgba(24,0,172,0.15)" strokeWidth="1" />
                <text x={p.x} y={p.y} textAnchor="middle" fill="rgba(24,0,172,0.65)">{p.label}</text>
              </g>
            ))}
          </g>
        </svg>
      </div>

      <div className="flex items-center justify-center font-display text-lg text-muted-foreground pt-16 shrink-0">
        VS
      </div>

      <div className="flex-1 flex flex-col gap-3">
        <div className="font-mono text-xs tracking-[0.15em] uppercase text-muted-foreground text-center">
          lunar strategy
        </div>
        <svg className="w-full h-auto" viewBox="0 0 400 370" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="200,8 5,350 395,350" fill="none" stroke="rgba(24,0,172,0.1)" strokeWidth="1" />
          <line x1="120" y1="95" x2="280" y2="95" stroke="rgba(24,0,172,0.07)" strokeWidth="1" />
          <line x1="72" y1="180" x2="328" y2="180" stroke="rgba(24,0,172,0.07)" strokeWidth="1" />
          <line x1="38" y1="265" x2="362" y2="265" stroke="rgba(24,0,172,0.07)" strokeWidth="1" />

          <text x="200" y="55" textAnchor="middle" fontFamily="'Neue Haas Unica','Helvetica Neue',sans-serif" fontWeight="700" fontSize="24" fill="rgba(24,0,172,0.9)">why</text>
          <rect x="148" y="62" width="104" height="22" rx="11" fill="rgba(24,0,172,0.05)" stroke="rgba(24,0,172,0.12)" strokeWidth="1" />
          <text x="200" y="78" textAnchor="middle" fontFamily="'Neue Haas Unica','Helvetica Neue',Helvetica,Arial,sans-serif" fontSize="11" fill="rgba(24,0,172,0.6)">positioning</text>

          <text x="200" y="132" textAnchor="middle" fontFamily="'Neue Haas Unica','Helvetica Neue',sans-serif" fontWeight="700" fontSize="24" fill="rgba(24,0,172,0.9)">who</text>
          <rect x="152" y="140" width="96" height="22" rx="11" fill="rgba(24,0,172,0.05)" stroke="rgba(24,0,172,0.12)" strokeWidth="1" />
          <text x="200" y="156" textAnchor="middle" fontFamily="'Neue Haas Unica','Helvetica Neue',Helvetica,Arial,sans-serif" fontSize="11" fill="rgba(24,0,172,0.6)">audiences</text>

          <text x="200" y="215" textAnchor="middle" fontFamily="'Neue Haas Unica','Helvetica Neue',sans-serif" fontWeight="700" fontSize="24" fill="rgba(24,0,172,0.85)">what</text>
          <rect x="104" y="225" width="88" height="22" rx="11" fill="rgba(24,0,172,0.05)" stroke="rgba(24,0,172,0.1)" strokeWidth="1" />
          <text x="148" y="241" textAnchor="middle" fontFamily="'Neue Haas Unica','Helvetica Neue',Helvetica,Arial,sans-serif" fontSize="11" fill="rgba(24,0,172,0.6)">messaging</text>
          <rect x="208" y="225" width="88" height="22" rx="11" fill="rgba(24,0,172,0.05)" stroke="rgba(24,0,172,0.1)" strokeWidth="1" />
          <text x="252" y="241" textAnchor="middle" fontFamily="'Neue Haas Unica','Helvetica Neue',Helvetica,Arial,sans-serif" fontSize="11" fill="rgba(24,0,172,0.6)">narratives</text>

          <text x="200" y="300" textAnchor="middle" fontFamily="'Neue Haas Unica','Helvetica Neue',sans-serif" fontWeight="700" fontSize="24" fill="rgba(24,0,172,0.8)">how</text>
          <rect x="52" y="312" width="82" height="22" rx="11" fill="rgba(24,0,172,0.05)" stroke="rgba(24,0,172,0.08)" strokeWidth="1" />
          <text x="93" y="328" textAnchor="middle" fontFamily="'Neue Haas Unica','Helvetica Neue',Helvetica,Arial,sans-serif" fontSize="11" fill="rgba(24,0,172,0.6)">tactics</text>
          <rect x="150" y="312" width="88" height="22" rx="11" fill="rgba(24,0,172,0.05)" stroke="rgba(24,0,172,0.08)" strokeWidth="1" />
          <text x="194" y="328" textAnchor="middle" fontFamily="'Neue Haas Unica','Helvetica Neue',Helvetica,Arial,sans-serif" fontSize="11" fill="rgba(24,0,172,0.6)">channels</text>
          <rect x="254" y="312" width="100" height="22" rx="11" fill="rgba(24,0,172,0.05)" stroke="rgba(24,0,172,0.08)" strokeWidth="1" />
          <text x="304" y="328" textAnchor="middle" fontFamily="'Neue Haas Unica','Helvetica Neue',Helvetica,Arial,sans-serif" fontSize="11" fill="rgba(24,0,172,0.6)">campaigns</text>
        </svg>
      </div>
    </div>
  );
};

export default StrategyInfographic;