import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const INK = "#1800AC";
const CARD = "#e3f0f9";
const FONT = "'Neue Haas Unica', 'Helvetica Neue', Helvetica, Arial, sans-serif";

function useFade() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  return { ref, inView };
}

function Slide({ children, num }: { children: React.ReactNode; num: number }) {
  const { ref, inView } = useFade();
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="min-h-screen flex flex-col justify-center px-8 md:px-16 lg:px-24 py-20 relative border-b border-[#1800AC]/8"
    >
      <div
        className="absolute top-8 right-10 font-mono text-xs tracking-widest select-none"
        style={{ color: `${INK}40` }}
      >
        {String(num).padStart(2, "0")} / 13
      </div>
      <div className="max-w-6xl mx-auto w-full">{children}</div>
    </motion.section>
  );
}

// ─── Infographic helpers ──────────────────────────────────────────────────────

function ContentMixBar() {
  const segs = [
    { pct: 40, label: 'Threads' },
    { pct: 25, label: 'Visuals & Memes' },
    { pct: 20, label: 'Video Clips' },
    { pct: 15, label: 'Polls' },
  ];
  return (
    <div className="mb-8">
      <div className="flex rounded-full overflow-hidden gap-px h-3 mb-4">
        {segs.map((s, i) => (
          <div key={i} style={{ width: `${s.pct}%`, background: INK, opacity: 1 - i * 0.2 }} />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {segs.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: INK, opacity: 1 - i * 0.2 }} />
            <span className="font-mono text-[0.6rem] tracking-widest lowercase" style={{ color: `${INK}60` }}>
              {s.pct}% {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResultsStrip() {
  const highlights = [
    { val: '13.3%', desc: 'Engagement rate', project: 'Dualmint' },
    { val: '97K', desc: 'Followers in 19 days', project: 'Dualmint' },
    { val: '$78M', desc: 'Pledged', project: 'Theoriq' },
    { val: '22M+', desc: 'Smart reach', project: 'Warden' },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
      {highlights.map((h, i) => (
        <Card key={i} className="p-5 text-center">
          <p className="font-bold leading-none mb-2" style={{ fontSize: 'clamp(1.6rem,3vw,2.4rem)', color: INK }}>
            {h.val}
          </p>
          <p className="text-xs leading-snug mb-2" style={{ color: `${INK}65` }}>{h.desc}</p>
          <span className="font-mono text-[0.55rem] tracking-widest lowercase px-2 py-0.5 rounded-full"
            style={{ background: `${INK}10`, color: `${INK}70` }}>
            {h.project}
          </span>
        </Card>
      ))}
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl p-6 ${className}`}
      style={{ background: CARD }}
    >
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[0.65rem] tracking-[0.22em] lowercase mb-4" style={{ color: `${INK}55` }}>
      {children}
    </p>
  );
}

function SlideTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="font-bold leading-[1.05] tracking-tight mb-10"
      style={{ fontSize: "clamp(2.6rem,6vw,5rem)", color: INK }}
    >
      {children}
    </h2>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-bold text-3xl leading-none" style={{ color: INK }}>
        {value}
      </span>
      <span className="font-mono text-[0.65rem] tracking-widest lowercase" style={{ color: `${INK}50` }}>
        {label}
      </span>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-block font-mono text-[0.65rem] tracking-widest lowercase px-3 py-1 rounded-full"
      style={{ background: `${INK}12`, color: INK }}
    >
      {children}
    </span>
  );
}

function BulletList({ items, color = INK }: { items: string[]; color?: string }) {
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-base leading-snug" style={{ color: `${color}80` }}>
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color, opacity: 0.4 }} />
          {item}
        </li>
      ))}
    </ul>
  );
}

// ─── Slides ───────────────────────────────────────────────────────────────────

function Slide01() {
  return (
    <Slide num={1}>
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-16">
        <div className="flex-1">
          <Label>Lunar Strategy · Presentation</Label>
          <h1
            className="font-bold leading-[1.01] tracking-tight mb-6"
            style={{ fontSize: "clamp(3rem,8vw,6.5rem)", color: INK }}
          >
            Crypto Social<br />Media Strategy
          </h1>
          <p className="text-xl font-bold mb-10" style={{ color: `${INK}50` }}>
            to Win Market Share
          </p>
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0" style={{ background: INK }}>
              JH
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: INK }}>Jack Haldorsson</p>
              <p className="font-mono text-xs" style={{ color: `${INK}50` }}>Lunar Strategy</p>
            </div>
          </div>
        </div>
        <div className="flex flex-row lg:flex-col gap-4 lg:items-end">
          <Card className="px-10 py-8 text-center">
            <p className="font-bold leading-none mb-1" style={{ fontSize: "clamp(3rem,6vw,5rem)", color: INK }}>250+</p>
            <p className="font-mono text-xs tracking-widest lowercase" style={{ color: `${INK}50` }}>Projects</p>
          </Card>
          <Card className="px-10 py-8 text-center">
            <p className="font-bold leading-none mb-1" style={{ fontSize: "clamp(3rem,6vw,5rem)", color: INK }}>2019</p>
            <p className="font-mono text-xs tracking-widest lowercase" style={{ color: `${INK}50` }}>Since</p>
          </Card>
        </div>
      </div>
    </Slide>
  );
}

function Slide02() {
  const cols = [
    {
      label: "Distribution Layer",
      body: "Your posts reach users, investors, and partners directly. No middleman. No ad spend required.",
    },
    {
      label: "Community Hub",
      body: "X is where your community lives. It's where they research, evaluate, and decide to back you.",
    },
    {
      label: "First Point of Contact",
      body: "Before anyone reads your docs or joins Discord, they check your X. That first impression matters.",
    },
  ];

  return (
    <Slide num={2}>
      <Label>Why social media</Label>
      <SlideTitle>The Most Underrated Marketing Channel</SlideTitle>

      <Card className="mb-8 p-7">
        <p className="text-base leading-relaxed" style={{ color: `${INK}80` }}>
          Social media is the one channel where you get to speak directly with your users and investors.{" "}
          <strong style={{ color: INK }}>For free. Every single day.</strong>
        </p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cols.map((c, i) => (
          <Card key={i}>
            <p className="font-mono text-[0.65rem] tracking-widest lowercase mb-3" style={{ color: `${INK}45` }}>
              0{i + 1}
            </p>
            <p className="font-bold text-base mb-3" style={{ color: INK }}>
              {c.label}
            </p>
            <p className="text-base leading-relaxed" style={{ color: `${INK}65` }}>
              {c.body}
            </p>
          </Card>
        ))}
      </div>
    </Slide>
  );
}

function Slide03() {
  return (
    <Slide num={3}>
      <Label>Messaging strategy</Label>
      <SlideTitle>
        Stop Listing Features.<br />Start Creating Feelings.
      </SlideTitle>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-8">
          <Pill>The narrative approach</Pill>
          <p className="font-bold text-2xl mt-5 mb-4 leading-tight" style={{ color: INK }}>
            Good marketers promote outcomes.<br />
            <span style={{ color: `${INK}55` }}>Great marketers give you a feeling.</span>
          </p>
          <p className="text-base leading-relaxed" style={{ color: `${INK}60` }}>
            FOMO. Excitement. Urgency. These are the emotions that drive action. Tell your audience the right things — every post should move them closer to understanding why your project matters and why they should care right now.
          </p>
        </Card>

        <Card className="p-8 flex flex-col gap-6">
          <div>
            <p className="font-mono text-[0.65rem] tracking-widest lowercase mb-3" style={{ color: `${INK}45` }}>
              Good
            </p>
            <p
              className="text-base leading-relaxed rounded-xl p-4"
              style={{ background: `${INK}08`, color: `${INK}70` }}
            >
              "This protocol has 20% APY, low fees, and audited contracts" — communicates value.
            </p>
          </div>
          <div>
            <p className="font-mono text-[0.65rem] tracking-widest lowercase mb-3" style={{ color: INK }}>
              Great
            </p>
            <p
              className="text-sm font-bold leading-relaxed rounded-xl p-4"
              style={{ background: `${INK}15`, color: INK }}
            >
              "Your yield is waiting. 48 hours left before the vault closes." — creates urgency.
            </p>
          </div>
        </Card>
      </div>
    </Slide>
  );
}

function Slide04() {
  const stop = [
    "Posting 5–10x a day with low-effort content",
    "Copy-paste announcements with no personality",
    "Ignoring replies and DMs",
    "Tweeting into the void with zero engagement",
  ];
  const start = [
    "1–2 thoughtful posts that earn engagement",
    "Reply to 10–20 relevant conversations daily",
    "Mix formats: threads, visuals, memes, polls",
    "Engage before and after you post",
    "Track smart metrics, not vanity numbers",
  ];

  return (
    <Slide num={4}>
      <Label>Content cadence</Label>
      <SlideTitle>Posting Cadence: Quality Over Volume</SlideTitle>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card className="p-7">
          <p className="font-bold text-4xl mb-1" style={{ color: INK }}>
            1–2
          </p>
          <p className="font-mono text-xs tracking-widest lowercase mb-3" style={{ color: `${INK}50` }}>
            Quality posts/day
          </p>
          <p className="text-base leading-relaxed" style={{ color: `${INK}60` }}>
            Consistency beats volume. Every post should earn attention.
          </p>
        </Card>
        <Card className="p-7">
          <p className="font-bold text-4xl mb-1" style={{ color: INK }}>
            10–20
          </p>
          <p className="font-mono text-xs tracking-widest lowercase mb-3" style={{ color: `${INK}50` }}>
            Strategic replies/day
          </p>
          <p className="text-base leading-relaxed" style={{ color: `${INK}60` }}>
            Show up in ecosystem conversations. Add real value.
          </p>
        </Card>
        <Card className="p-7">
          <p className="font-bold text-4xl mb-1" style={{ color: INK }}>
            2–3
          </p>
          <p className="font-mono text-xs tracking-widest lowercase mb-3" style={{ color: `${INK}50` }}>
            X Spaces/month
          </p>
          <p className="text-base leading-relaxed" style={{ color: `${INK}60` }}>
            Host or join. Builds authority and audience habits.
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-7">
          <p className="font-mono text-[0.65rem] tracking-widest lowercase mb-4" style={{ color: `${INK}45` }}>
            Stop doing this
          </p>
          <BulletList items={stop} color={`${INK}99`} />
        </Card>
        <Card className="p-7">
          <p className="font-mono text-[0.65rem] tracking-widest lowercase mb-4" style={{ color: INK }}>
            Start doing this
          </p>
          <BulletList items={start} />
        </Card>
      </div>
    </Slide>
  );
}

function Slide05() {
  const how = [
    "Join ongoing debates where your expertise adds value",
    "Provide real insights, not surface-level praise",
    "Comment on posts by industry leaders and high-traction accounts regularly",
    "Reply-to-reply chains carry 75× algorithm weight",
    "Build relationships before you need anything",
  ];
  const yap = [
    "600+ creator network posting organically",
    "Threads, quote RTs, memes, reactions",
    "4M impressions in 7 days (real result)",
    "Consistent mindshare without massive budgets",
  ];

  return (
    <Slide num={5}>
      <Label>Growth tactic</Label>
      <SlideTitle>Be the Reply Guy</SlideTitle>

      <p className="text-base leading-relaxed mb-8 max-w-2xl" style={{ color: `${INK}65` }}>
        X rewards engagement, not just posting. The best way to grow visibility is to show up in high-traffic conversations.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-7">
          <p className="font-mono text-[0.65rem] tracking-widest lowercase mb-5" style={{ color: `${INK}45` }}>
            How to do it right
          </p>
          <BulletList items={how} />
        </Card>
        <Card className="p-7">
          <p className="font-mono text-[0.65rem] tracking-widest lowercase mb-4" style={{ color: `${INK}45` }}>
            Scaling it — YAP Strategy
          </p>
          <BulletList items={yap} />
          <div className="mt-6 pt-5 border-t border-[#1800AC]/10 grid grid-cols-2 gap-4">
            <Stat value="600+" label="Creators" />
            <Stat value="4M" label="Impressions / 7 days" />
          </div>
        </Card>
      </div>
    </Slide>
  );
}

function Slide06() {
  const cols = [
    {
      step: "01",
      title: "Spot Early",
      body: "Identify emerging narratives before they dominate X. Use AI-powered tools to track what's gaining traction in your sector.",
    },
    {
      step: "02",
      title: "Add Your Angle",
      body: "Don't just repost the news. Add unique insights from your project's perspective. Position your team as the authority.",
    },
    {
      step: "03",
      title: "Move Fast",
      body: "The window for trendjacking is hours, not days. Build a rapid response workflow. Approve and post within 30 minutes.",
    },
  ];

  return (
    <Slide num={6}>
      <Label>Trend strategy</Label>
      <SlideTitle>Jump on Trends in Your Niche</SlideTitle>

      <p className="text-base leading-relaxed mb-8 max-w-2xl" style={{ color: `${INK}65` }}>
        Projects that react to breaking news in real-time gain a visibility advantage over those relying on pre-planned content alone.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cols.map((c, i) => (
          <Card key={i} className="p-7">
            <p className="font-mono text-[0.65rem] tracking-widest lowercase mb-4" style={{ color: `${INK}35` }}>
              {c.step}
            </p>
            <p className="font-bold text-xl mb-3" style={{ color: INK }}>
              {c.title}
            </p>
            <p className="text-base leading-relaxed" style={{ color: `${INK}65` }}>
              {c.body}
            </p>
          </Card>
        ))}
      </div>
    </Slide>
  );
}

function Slide07() {
  const types = [
    {
      pct: "40%",
      type: "Threads",
      body: "Your authority builder. Educational threads about your tech, market insights, or behind-the-scenes stories. 10 tweets max. Spend 30–40% of your time on the hook.",
    },
    {
      pct: "25%",
      type: "Visuals & Memes",
      body: "Memes are the native language of CT. Data visualizations drive saves and shares. Infographics outperform text-only posts by 120%.",
    },
    {
      pct: "20%",
      type: "Video Clips",
      body: "Short clips (15–60 sec) of founder interviews, product demos, event highlights. 85% of users watch on mute. Always add captions.",
    },
    {
      pct: "15%",
      type: "Polls & Engagement",
      body: "Polls get an algorithm boost. Use them for community decisions, market sentiment, and product feedback. Ask questions your audience cares about.",
    },
  ];

  return (
    <Slide num={7}>
      <Label>Content mix</Label>
      <SlideTitle>Content Types That Actually Work</SlideTitle>

      <ContentMixBar />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {types.map((t, i) => (
          <Card key={i} className="p-7">
            <p
              className="font-bold leading-none mb-2"
              style={{ fontSize: "clamp(2.5rem,5vw,4rem)", color: `${INK}18` }}
            >
              {t.pct}
            </p>
            <p className="font-bold text-xl mb-3" style={{ color: INK }}>
              {t.type}
            </p>
            <p className="text-base leading-relaxed" style={{ color: `${INK}65` }}>
              {t.body}
            </p>
          </Card>
        ))}
      </div>
    </Slide>
  );
}

function Slide08() {
  const acts = [
    {
      title: "Video Interviews",
      body: "Put a human face on your project. Short clips (1–3 min) optimised for X. Builds trust in an anonymous industry. Creates shareable content that travels.",
    },
    {
      title: "Community Quests",
      body: "Galxe, Layer3, or Zealy campaigns. Users complete social + on-chain tasks to earn points. Gamified missions drive engagement and onboard new users.",
    },
    {
      title: "Campaigns (Yield Run)",
      body: "Gamified leaderboards with Capital, Network, and Bonus quests. Users deposit, compete, share, and recruit. Creates a virtuous growth cycle.",
    },
    {
      title: "X Spaces & AMAs",
      body: "Weekly live sessions with ecosystem guests. Record and repurpose into clips, threads, and blog posts. One session = 7 content pieces.",
    },
  ];

  return (
    <Slide num={8}>
      <Label>Activation playbook</Label>
      <SlideTitle>Activations That Drive Real Growth</SlideTitle>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {acts.map((a, i) => (
          <Card key={i} className="p-7">
            <p className="font-mono text-[0.65rem] tracking-widest lowercase mb-3" style={{ color: `${INK}40` }}>
              0{i + 1}
            </p>
            <p className="font-bold text-xl mb-3" style={{ color: INK }}>
              {a.title}
            </p>
            <p className="text-base leading-relaxed" style={{ color: `${INK}65` }}>
              {a.body}
            </p>
          </Card>
        ))}
      </div>
    </Slide>
  );
}

function Slide09() {
  const cycle = [
    { n: 1, text: "Users deposit stablecoins", sub: "Capital Quests" },
    { n: 2, text: "Earn points + compete on leaderboard", sub: "Gamification" },
    { n: 3, text: "Share progress on social media", sub: "Organic distribution" },
    { n: 4, text: "Attract new users through referrals", sub: "Network Quests" },
    { n: 5, text: "New users deposit → TVL grows", sub: "Growth flywheel" },
  ];
  const quests = [
    {
      title: "Capital Quests",
      body: "Deposit stablecoins to earn points. Higher deposits = more points. Drives TVL directly.",
    },
    {
      title: "Network Quests",
      body: "Referrals and social engagement tasks. Turns every participant into a recruiter.",
    },
    {
      title: "Bonus Quests",
      body: "Limited-time tasks for extra points. Creates urgency and daily check-in habits.",
    },
  ];

  return (
    <Slide num={9}>
      <Label>Case study</Label>
      <SlideTitle>Yield Run: Gamified Growth in Action</SlideTitle>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Virtuous cycle */}
        <Card className="p-7">
          <p className="font-mono text-[0.65rem] tracking-widest lowercase mb-6" style={{ color: `${INK}45` }}>
            The Virtuous Cycle
          </p>
          <div className="space-y-3">
            {cycle.map((c) => (
              <div key={c.n} className="flex items-start gap-4">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                  style={{ background: INK }}
                >
                  {c.n}
                </div>
                <div>
                  <p className="font-bold text-sm" style={{ color: INK }}>
                    {c.text}
                  </p>
                  <p className="font-mono text-[0.6rem] tracking-widest lowercase mt-0.5" style={{ color: `${INK}45` }}>
                    {c.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quest types */}
        <div className="flex flex-col gap-4">
          {quests.map((q, i) => (
            <Card key={i} className="p-6">
              <p className="font-bold text-base mb-2" style={{ color: INK }}>
                {q.title}
              </p>
              <p className="text-base leading-relaxed" style={{ color: `${INK}65` }}>
                {q.body}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </Slide>
  );
}

function Slide10() {
  const vanity = ["Raw follower count", "Total impressions without context", "Likes without engagement depth", "Retweets from bot accounts"];
  const smart = ["Engagement rate (3–5% = strong)", "Profile clicks and link clicks", "Kaito mindshare score", "Smart followers (quality over quantity)", "Wallet connections from social"];
  const tools = [
    { name: "Kaito", desc: "Mindshare tracking and narrative monitoring" },
    { name: "Cookie3", desc: "Smart reach metrics and audience quality" },
    { name: "TweetScout", desc: "CT account analysis and bot detection" },
    { name: "LunarCrush", desc: "Social volume and sentiment tracking" },
    { name: "Spindl / Formo", desc: "Ad-to-wallet attribution (on-chain ROI)" },
    { name: "Buffer / Hypefury", desc: "Scheduling and engagement automation" },
  ];

  return (
    <Slide num={10}>
      <Label>Analytics</Label>
      <SlideTitle>Measure What Matters</SlideTitle>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card className="p-7">
          <p className="font-mono text-[0.65rem] tracking-widest lowercase mb-4" style={{ color: `${INK}45` }}>
            Vanity metrics — stop
          </p>
          <BulletList items={vanity} color={`${INK}88`} />
        </Card>
        <Card className="p-7">
          <p className="font-mono text-[0.65rem] tracking-widest lowercase mb-4" style={{ color: INK }}>
            Smart metrics — start
          </p>
          <BulletList items={smart} />
        </Card>
      </div>

      <Card className="p-7">
        <p className="font-mono text-[0.65rem] tracking-widest lowercase mb-5" style={{ color: `${INK}45` }}>
          Tools we use
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {tools.map((t, i) => (
            <div
              key={i}
              className="rounded-xl p-4"
              style={{ background: `${INK}08` }}
            >
              <p className="font-bold text-sm mb-1" style={{ color: INK }}>
                {t.name}
              </p>
              <p className="text-xs leading-snug" style={{ color: `${INK}60` }}>
                {t.desc}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </Slide>
  );
}

function Slide11() {
  const tiers = [
    { tier: "Macro", range: "500K+", price: "$5K – $50K+" },
    { tier: "Mid", range: "100K – 500K", price: "$2K – $10K" },
    { tier: "Micro", range: "10K – 100K", price: "$500 – $5K" },
    { tier: "Nano", range: "1K – 10K", price: "$100 – $1K" },
  ];

  return (
    <Slide num={11}>
      <Label>Influencer marketing</Label>
      <SlideTitle>KOL & Partner Marketing</SlideTitle>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tiers */}
        <Card className="p-7">
          <p className="font-mono text-[0.65rem] tracking-widest lowercase mb-5" style={{ color: `${INK}45` }}>
            KOL Pricing Tiers
          </p>
          <div className="space-y-3">
            {tiers.map((t, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl px-4 py-3"
                style={{ background: `${INK}08` }}
              >
                <div>
                  <span className="font-bold text-sm" style={{ color: INK }}>
                    {t.tier}
                  </span>
                  <span className="font-mono text-xs ml-2" style={{ color: `${INK}45` }}>
                    {t.range}
                  </span>
                </div>
                <span className="font-bold text-sm" style={{ color: INK }}>
                  {t.price}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs leading-relaxed mt-5 p-3 rounded-xl" style={{ color: `${INK}60`, background: `${INK}08` }}>
            <strong style={{ color: INK }}>Best model: Hybrid</strong> — flat fee + token allocation + performance bonuses. Long-term (6+ months) = 3–4× more users.
          </p>
        </Card>

        {/* Network stats */}
        <div className="flex flex-col gap-4">
          {[
            { value: "800+", label: "KOL creators in network" },
            { value: "50M+", label: "Combined reach" },
            { value: "40×", label: "Oversubscription (Theoriq campaign)" },
            { value: "$200M", label: "Pledged via community raise (Limitless)" },
          ].map((s, i) => (
            <Card key={i} className="flex items-center gap-5 p-6">
              <p
                className="font-bold leading-none flex-shrink-0"
                style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)", color: INK }}
              >
                {s.value}
              </p>
              <p className="text-sm" style={{ color: `${INK}60` }}>
                {s.label}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </Slide>
  );
}

function Slide12() {
  const campaigns = [
    {
      name: "Dualmint",
      kpis: [
        "13.3% engagement rate",
        "97K follower growth in 19 days",
        "554.5K impressions",
        "23.5K new followers",
        "Every product launch sold out",
        "Social presence created genuine demand",
      ],
    },
    {
      name: "Warden",
      kpis: [
        "3M+ impressions",
        "90+ content pieces",
        "22.25M+ smart reach",
        "Clear narrative as North Star for all content",
      ],
    },
    {
      name: "Theoriq",
      kpis: [
        "$78M pledged at 40× oversubscription",
        "50 KOLs activated",
        "Multi-tier campaign strategy",
        "Community raise drove real demand",
        "From awareness to conversion in weeks",
      ],
    },
  ];

  return (
    <Slide num={12}>
      <Label>Proof of work</Label>
      <SlideTitle>Results From Real Campaigns</SlideTitle>

      <ResultsStrip />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {campaigns.map((c, i) => (
          <Card key={i} className="p-7">
            <p className="font-bold text-2xl mb-6" style={{ color: INK }}>
              {c.name}
            </p>
            <div className="space-y-2.5">
              {c.kpis.map((k, j) => (
                <div key={j} className="flex items-start gap-2.5">
                  <span
                    className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: INK, opacity: 0.35 }}
                  />
                  <span className="text-base leading-snug" style={{ color: `${INK}75` }}>
                    {k}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </Slide>
  );
}

function Slide13() {
  return (
    <Slide num={13}>
      <div className="flex flex-col items-center text-center py-12">
        <Label>Let's work together</Label>
        <h2
          className="font-bold leading-tight tracking-tight mb-6 max-w-2xl"
          style={{ fontSize: "clamp(2.5rem,6vw,5rem)", color: INK }}
        >
          Your audience is on X right now.
          <span style={{ color: `${INK}45` }}> You should be there too.</span>
        </h2>
        <p className="text-base leading-relaxed max-w-xl mb-16" style={{ color: `${INK}60` }}>
          Social media lets you speak with your users every single day for free. Tell them the right things. Make them feel something. Show up consistently.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          {[
            { label: "Presenter", value: "Jack Haldorsson" },
            { label: "Telegram", value: "@jacklunar" },
            { label: "Website", value: "lunarstrategy.com" },
          ].map((c, i) => (
            <Card key={i} className="px-8 py-6 text-center min-w-[180px]">
              <p className="font-mono text-[0.6rem] tracking-widest lowercase mb-2" style={{ color: `${INK}40` }}>
                {c.label}
              </p>
              <p className="font-bold text-sm" style={{ color: INK }}>
                {c.value}
              </p>
            </Card>
          ))}
        </div>

        <p className="font-mono text-xs tracking-widest mt-16" style={{ color: `${INK}30` }}>
          www.lunarstrategy.com
        </p>
      </div>
    </Slide>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Presentation() {
  return (
    <div className="min-h-screen" style={{ background: "#f5f5f5", fontFamily: FONT, textTransform: "lowercase" }}>
      {/* Nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 backdrop-blur-md"
        style={{ background: "rgba(245,245,245,0.85)", borderBottom: `1px solid ${INK}10` }}
      >
        <span className="font-bold text-sm tracking-wide" style={{ color: INK }}>
          LUNAR STRATEGY
        </span>
        <span className="font-mono text-xs tracking-widest" style={{ color: `${INK}40` }}>
          Crypto Social Media Strategy
        </span>
      </nav>

      <div className="pt-16">
        <Slide01 />
        <Slide02 />
        <Slide03 />
        <Slide04 />
        <Slide05 />
        <Slide06 />
        <Slide07 />
        <Slide08 />
        <Slide09 />
        <Slide10 />
        <Slide11 />
        <Slide12 />
        <Slide13 />
      </div>
    </div>
  );
}
