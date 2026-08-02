import { useEffect, useRef, useState } from 'react';
import {
  TrendingUp,
  BarChart3,
  Megaphone,
  Search,
  ShoppingBag,
  Youtube,
  CheckCircle2,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  ArrowUpRight,
  Star,
  Zap,
  LineChart,
  Sparkles,
  Mail,
  Phone,
  Send,
  Quote,
  Target,
  ExternalLink,
  Code2,
  FileText,
  Globe,
  Briefcase,
  Award,
  MessageCircle,
  Linkedin,
} from 'lucide-react';

const WHATSAPP = 'https://wa.me/8801785778309';
const BEHANCE = 'https://www.behance.net/ahsanulhaquehridoy';
const LINKEDIN = 'https://www.linkedin.com/in/ahsanulhaquehridoy';
const FACEBOOK = 'https://www.facebook.com/share/1Ek2qFzhBm/?mibextid=wwXIfr';
const UPWORK = 'https://www.upwork.com/freelancers/ahsanulgoogleads';
const FIVERR = 'https://www.fiverr.com/s/bd1mmo1?utm_source=CopyLink_Mobile';
const EMAIL = 'hridoy410103@gmail.com';

// ─── Logo ──────────────────────────────────────────────────────────────────

function HridoyLogo({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Google Ads Expert logo"
    >
      {/* Background */}
      <rect width="40" height="40" rx="10" fill="#0f172a" />

      {/* Grid lines */}
      <line x1="8" y1="20" x2="32" y2="20" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
      <line x1="14" y1="10" x2="14" y2="30" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
      <line x1="20" y1="10" x2="20" y2="30" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
      <line x1="26" y1="10" x2="26" y2="30" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />

      {/* Rising bars - Google colors */}
      <rect x="10" y="20" width="4" height="8" rx="1" fill="#4285F4" />
      <rect x="16" y="14" width="4" height="14" rx="1" fill="#34A853" />
      <rect x="22" y="18" width="4" height="10" rx="1" fill="#FBBC05" />
      <rect x="28" y="10" width="4" height="18" rx="1" fill="#EA4335" />

      {/* H letter overlay */}
      <rect x="12" y="12" width="3" height="16" rx="1" fill="white" fillOpacity="0.95" />
      <rect x="25" y="12" width="3" height="16" rx="1" fill="white" fillOpacity="0.95" />
      <rect x="12" y="18.5" width="16" height="3" rx="1" fill="white" fillOpacity="0.95" />
    </svg>
  );
}

function HridoyWordmark({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <HridoyLogo size={40} />
      <div className="flex flex-col leading-tight">
        <span
          className="font-display font-extrabold tracking-tight text-white"
          style={{ fontSize: '1.1rem', letterSpacing: '-0.02em' }}
        >
          Hridoy
        </span>
        <span
          className="flex items-center gap-1 font-semibold"
          style={{ fontSize: '0.55rem', letterSpacing: '0.12em' }}
        >
          <span className="text-blue-400">Google</span>
          <span className="text-slate-500">·</span>
          <span className="text-green-400">Meta</span>
          <span className="text-slate-500">·</span>
          <span className="text-amber-400">LinkedIn</span>
          <span className="text-slate-500 ml-1">Ads</span>
        </span>
      </div>
    </div>
  );
}

// ─── Data ──────────────────────────────────────────────────────────────────

const stats = [
  { value: '4+', label: 'Years in paid media' },
  { value: '20+', label: 'Clients managed' },
  { value: '50+', label: 'Campaigns launched' },
  { value: '15+', label: 'Repeat clients' },
];

const platforms = [
  { name: 'Google Ads', icon: Search, color: 'from-blue-500 to-blue-700' },
  { name: 'Meta Ads', icon: Megaphone, color: 'from-blue-600 to-indigo-700' },
  { name: 'LinkedIn Ads', icon: Briefcase, color: 'from-sky-600 to-blue-800' },
  { name: 'Performance Max', icon: Zap, color: 'from-amber-500 to-orange-600' },
  { name: 'Shopping Ads', icon: ShoppingBag, color: 'from-emerald-500 to-teal-700' },
  { name: 'YouTube Ads', icon: Youtube, color: 'from-red-500 to-rose-700' },
  { name: 'TikTok Ads', icon: Sparkles, color: 'from-pink-500 to-fuchsia-700' },
  { name: 'X (Twitter) Ads', icon: Send, color: 'from-slate-700 to-slate-900' },
];

const services = [
  {
    icon: Search,
    title: 'Search Ads',
    desc: 'High-intent Google Search campaigns capturing buyers actively looking for what you offer.',
  },
  {
    icon: Zap,
    title: 'Performance Max',
    desc: "Google's AI-driven campaigns across all networks to maximise conversions from one feed.",
  },
  {
    icon: ShoppingBag,
    title: 'Shopping Ads',
    desc: 'Product feed optimisation and Shopping campaigns that move inventory profitably.',
  },
  {
    icon: Megaphone,
    title: 'Meta & Carousel Ads',
    desc: 'Scroll-stopping Facebook and Instagram creative with precise audience targeting.',
  },
  {
    icon: Briefcase,
    title: 'LinkedIn Ads Setup',
    desc: 'B2B lead generation on LinkedIn with audience and funnel optimisation.',
  },
  {
    icon: Code2,
    title: 'Conversion Tracking & Pixel',
    desc: 'GTM, Pixel, Conversions API and server-side tracking so every conversion is measured.',
  },
];

const campaignProjects = [
  {
    id: 'google-lead',
    label: 'Google Ads Lead Gen',
    color: 'from-blue-500 to-blue-700',
    platform: 'Google Ads',
    platformColor: 'bg-blue-500/15 text-blue-300 border-blue-400/25',
    title: 'Google Ads Lead Generation Campaigns',
    subtitle: '74 conversions in November — multi-campaign search strategy for B2B client LBS ANZ.',
    desc: 'Managed 12 active Google Search campaigns for Leica Biosystems ANZ (LBS ANZ) — a B2B scientific equipment company. Structured with branded, generic and phrase-match ad groups, the campaigns delivered 74 conversions in November 2024 and 52 in October 2024 at an avg. CPC of $4.66 and $1.36 respectively.',
    metrics: [
      { label: 'Nov conversions', value: '74' },
      { label: 'Oct conversions', value: '52' },
      { label: 'Nov avg. CPC', value: '$4.66' },
      { label: 'Active campaigns', value: '12' },
    ],
    screenshots: [
      '/files_10812615-2026-07-02T17-56-32-775Z-WhatsApp_Image_2026-07-02_at_11.52.20_PM_(1).jpeg',
    ],
    behance: 'https://www.behance.net/gallery/195719849/Google-Ads-Campaign-For-Lead-Generation-61-leads',
  },
  {
    id: 'google-ecom',
    label: 'Google Ads eCommerce',
    color: 'from-amber-500 to-orange-600',
    platform: 'Google Ads',
    platformColor: 'bg-amber-500/15 text-amber-300 border-amber-400/25',
    title: 'Google Ads eCommerce & Performance Max',
    subtitle: '311 purchases in April — Zen Green Tea scaled to 335K impressions at $22.24 cost/conv.',
    desc: 'End-to-end eCommerce campaigns for Zen Green Tea (Zen Co Pty Ltd) using Performance Max, Smart Shopping and Search. April 2025 delivered 311.99 purchases from 335K impressions at $6.94K spend. December 2025 achieved 52.97 conversions with 1.57K clicks at $2.05 avg. CPC and 118K impressions.',
    metrics: [
      { label: 'Apr purchases', value: '311' },
      { label: 'Apr impressions', value: '335K' },
      { label: 'Apr cost/conv', value: '$22.24' },
      { label: 'Apr total spend', value: '$6.94K' },
    ],
    screenshots: [
      '/files_10812615-2026-07-02T17-56-33-023Z-WhatsApp_Image_2026-07-02_at_11.52.20_PM_(2).jpeg',
    ],
    behance: 'https://www.behance.net/gallery/249551761/Google-Ads-Performance-Max-Campaign',
  },
  {
    id: 'meta-lead',
    label: 'Meta Ads Lead Gen',
    color: 'from-sky-500 to-blue-700',
    platform: 'Meta Ads',
    platformColor: 'bg-sky-500/15 text-sky-300 border-sky-400/25',
    title: 'Meta Ads Lead Generation Campaigns',
    subtitle: '87 website leads — campaign flagged as High Performing by Meta\'s system.',
    desc: 'Facebook and Instagram lead generation campaigns combining audience layering (custom audiences, lookalikes, interest targeting) with conversion-optimised creative. The "Customer Bookings – Chicago" campaign delivered 87 website leads with a reach of 22,891 in a single month and was flagged as "High performing" by Meta.',
    metrics: [
      { label: 'Website leads', value: '87' },
      { label: 'Total reach', value: '24,852' },
      { label: 'Avg. frequency', value: '2.70' },
      { label: 'Platform rating', value: 'High performing' },
    ],
    screenshots: [
      '/google-ads/lead-generation/WhatsApp_Image_2026-07-02_at_11.52.23_PM.jpeg',
    ],
    behance: 'https://www.behance.net/gallery/184725033/google-ads-campaign-conversion-tracking-expert',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn Ads',
    color: 'from-cyan-600 to-blue-800',
    platform: 'LinkedIn Ads',
    platformColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-400/25',
    title: 'LinkedIn Ads B2B Campaigns',
    subtitle: '18 leads at $314 CPL — 92% of spend on Conversion/Lead objective for Ready Credit Corp.',
    desc: 'Managed LinkedIn Ads for Ready Credit Corp (healthcare sector) — 19 active ad sets across Sponsored Content formats. April 2026 delivered 18 leads at a $314 CPL with $6.1K total spend. 92% of budget was allocated to Conversion/Lead campaigns, including "Documents Ads || Healthcare" (10 leads) and "Single Image || Healthcare" (6 leads).',
    metrics: [
      { label: 'Total leads', value: '18' },
      { label: 'Cost per lead', value: '$314' },
      { label: 'Total spend', value: '$6.1K' },
      { label: 'Active ad sets', value: '19' },
    ],
    screenshots: [
      '/files_10812615-2026-07-02T17-56-33-076Z-WhatsApp_Image_2026-07-02_at_11.52.21_PM_(1).jpeg',
    ],
    behance: 'https://www.behance.net/ahsanulhaquehridoy',
  },
];

const experience = [
  {
    role: 'Senior Executive — PPC Rockers',
    period: 'Ended Jun 2026',
    points: [
      'Managing 5 active clients across diverse industries',
      'Running 10+ live ad campaigns on Google, Meta & LinkedIn',
      '4 repeat clients continuing due to strong ROI',
    ],
  },
  {
    role: 'Ads Expert — BD Calling IT',
    period: 'Previous',
    points: [
      'Managed 15 clients across E-commerce, SaaS and Biotech',
      'Launched 40+ campaigns end to end',
      '11 repeat clients from results delivered',
    ],
  },
];

const industries = [
  'E-commerce', 'Healthcare', 'SaaS', 'Real Estate',
  'Finance', 'Fine Arts', 'Consumer Goods', 'Biotech',
];

const whyMe = [
  {
    icon: TrendingUp,
    title: 'Proven Results',
    desc: 'Managed millions in ad spend across E-commerce, SaaS and Biotech — consistently delivering high ROAS and quality leads.',
  },
  {
    icon: Globe,
    title: 'Multi-Platform Expert',
    desc: 'Certified in Google Ads (Search, Shopping, YouTube) and expert in Meta, LinkedIn, TikTok, X and Bing advertising.',
  },
  {
    icon: LineChart,
    title: 'Holistic Strategy',
    desc: 'I optimise the entire journey — from ad creative to landing page CRO — so every click has the highest chance to convert.',
  },
  {
    icon: Briefcase,
    title: 'Corporate-Level Management',
    desc: 'My corporate background means your accounts get professional structure, strategic depth and clear communication.',
  },
  {
    icon: Globe,
    title: 'Global Perspective',
    desc: 'Experienced tailoring campaigns for diverse international markets and local nuances.',
  },
  {
    icon: Award,
    title: 'Certified Specialist',
    desc: 'Google Ads certified and Facebook Ads certified — staying current as the platforms evolve.',
  },
];

const howHelp = [
  { icon: Target, title: 'Full-Stack Ad Management', desc: 'Strategy, setup and optimisation for Google, Meta, LinkedIn, X and TikTok.' },
  { icon: FileText, title: 'Audits & Strategy', desc: 'Data-driven analysis of existing campaigns to identify leaks and growth opportunities.' },
  { icon: Code2, title: 'Advanced Tracking', desc: 'Precise conversion tracking with Google Tag Manager and custom solutions for accurate data.' },
  { icon: BarChart3, title: 'Transparent Reporting', desc: 'Regular, detailed reports with actionable insights — no jargon, just results.' },
];

const testimonials = [
  {
    name: 'E-commerce Client',
    role: 'DTC brand',
    quote: 'Hridoy rebuilt our Performance Max campaigns and our ROAS jumped within the first month. The tracking setup alone fixed months of bad data.',
  },
  {
    name: 'SaaS Founder',
    role: 'B2B SaaS',
    quote: 'Finally a paid media person who understands B2B. Our cost per qualified lead dropped and the reporting is genuinely clear.',
  },
  {
    name: 'Local Business Owner',
    role: 'Service business',
    quote: 'We started getting calls the same week the campaign went live. Hridoy knows exactly how to target local customers.',
  },
  {
    name: 'Agency Partner',
    role: 'Marketing agency',
    quote: 'I trust Hridoy with our clients Google and Meta accounts. Structured, responsive and the results speak for themselves.',
  },
];

const faqs = [
  {
    q: 'Which platforms do you manage?',
    a: 'Google Ads (Search, Performance Max, Shopping, YouTube, Display), Meta Ads (Facebook & Instagram), LinkedIn Ads, TikTok Ads, X (Twitter) Ads and Bing Ads — plus full conversion tracking across all of them.',
  },
  {
    q: 'What is your experience?',
    a: 'Over 3 years in paid media. I previously managed 15 clients and 40+ campaigns at BD Calling IT (11 repeat clients), and I was a Senior Executive at PPC Rockers (ended June 2026) managing 5 clients and 10+ campaigns (4 repeat clients).',
  },
  {
    q: 'Which industries do you work in?',
    a: 'E-commerce, Healthcare, SaaS, Real Estate, Finance, Fine Arts, Consumer Goods and Biotech — across both international and local markets.',
  },
  {
    q: 'Do you set up conversion tracking?',
    a: 'Yes. I handle Pixel setup, Google Tag Manager, Conversions API, server-side tracking and custom event tracking so your data is accurate and actionable.',
  },
  {
    q: 'How do you report on performance?',
    a: 'Regular, detailed reports with actionable insights — spend, ROAS, CPL, conversions and what we changed. No jargon, just results.',
  },
  {
    q: 'How do we get started?',
    a: 'Send a message through the form below. I will review your account and propose a custom strategy for your business — no obligation.',
  },
];

// ─── Hooks ─────────────────────────────────────────────────────────────────

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setShown(true),
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, shown };
}

// ─── Header ────────────────────────────────────────────────────────────────

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    ['About', '#about'],
    ['Services', '#services'],
    ['Work', '#work'],
    ['Why me', '#why'],
    ['Reviews', '#reviews'],
    ['FAQ', '#faq'],
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-slate-950/90 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <a href="#top"><HridoyWordmark /></a>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="text-sm font-medium text-slate-300 transition-colors hover:text-white">
              {label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <a href="#contact" className="rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-600">
            Get a custom strategy
          </a>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-lg border border-white/20 text-white md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-white/10 bg-slate-950/95 backdrop-blur px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {links.map(([label, href]) => (
              <a key={href} href={href} onClick={() => setOpen(false)} className="text-sm font-medium text-slate-300">
                {label}
              </a>
            ))}
            <a href="#contact" onClick={() => setOpen(false)} className="mt-1 rounded-full bg-brand-500 px-5 py-2.5 text-center text-sm font-semibold text-white">
              Get a custom strategy
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-slate-950 pt-28 pb-20 md:pt-36">
      <div className="absolute inset-0 bg-grid-dark" />
      <div className="absolute -right-40 top-10 h-96 w-96 rounded-full bg-brand-600/25 blur-3xl" />
      <div className="absolute -left-40 top-32 h-96 w-96 rounded-full bg-brand-800/20 blur-3xl" />

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-2">
        <div className="animate-rise">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-400/40 bg-brand-500/10 px-3.5 py-1.5 text-xs font-semibold text-brand-300 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            Google · Meta · LinkedIn Ads Expert
          </span>

          <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-white text-balance sm:text-5xl md:text-6xl">
            Ads that drive{' '}
            <span className="bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent">
              real business growth.
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-400">
            I am <strong className="font-semibold text-white">Ahsanul Haque Hridoy</strong> — a
            certified paid media specialist with 4+ years managing millions in
            ad spend across Google, Meta and LinkedIn. I build campaigns that
            deliver measurable ROI, not just clicks.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#contact" className="group inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-600">
              Get a custom strategy
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a href="#work" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10">
              View my work
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
            <div className="flex items-center gap-1.5">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-medium text-slate-300">15+ repeat clients</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-brand-400" />
              Google & Facebook Ads certified
            </div>
          </div>
        </div>

        {/* Portrait */}
        <div className="relative flex justify-center">
          <div className="relative w-full max-w-sm">
            <div className="absolute -inset-3 rounded-[2.5rem] bg-gradient-to-br from-brand-500/40 to-accent-500/30 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/20 shadow-2xl">
              <div className="aspect-[4/5] w-full bg-gradient-to-br from-slate-800 via-slate-700 to-brand-950">
                <img
                  src="/WhatsApp_Image_2026-07-02_at_11.43.33_PM.jpeg"
                  alt="Ahsanul Haque Hridoy — Paid Media Expert"
                  className="h-full w-full object-cover object-top"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-brand-900/25 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
                    <p className="font-display text-base font-bold text-white">Ahsanul Haque Hridoy</p>
                    <p className="mt-0.5 text-xs text-brand-300">Paid Media Expert · 4+ Years · Certified</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -left-6 top-8 hidden rounded-2xl border border-white/20 bg-white/15 p-3.5 backdrop-blur sm:block animate-floaty">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-500/25 text-emerald-200">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs text-slate-100">Campaigns launched</p>
                  <p className="text-sm font-bold text-white">50+</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-6 top-1/2 hidden -translate-y-1/2 rounded-2xl border border-white/20 bg-white/15 p-3.5 backdrop-blur sm:block animate-floaty" style={{ animationDelay: '1.5s' }}>
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-500/25 text-brand-200">
                  <TrendingUp className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs text-slate-100">Repeat clients</p>
                  <p className="text-sm font-bold text-white">15+</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-brand-400/30 bg-brand-500/15 px-4 py-2 backdrop-blur">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-brand-300">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Google & Facebook Certified
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-20 grid max-w-6xl grid-cols-2 gap-4 px-5 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/15 bg-white/5 p-5 text-center backdrop-blur">
            <p className="font-display text-3xl font-extrabold text-brand-400">{s.value}</p>
            <p className="mt-1 text-sm text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Platforms Marquee ─────────────────────────────────────────────────────

function PlatformsMarquee() {
  const row = [...platforms, ...platforms];
  return (
    <section className="border-y border-white/10 bg-slate-950 py-8">
      <div className="mx-auto max-w-6xl px-5">
        <p className="mb-5 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
          Platforms I run & optimise
        </p>
        <div className="relative overflow-hidden mask-fade-x">
          <div className="flex w-max animate-marquee gap-6">
            {row.map((p, i) => (
              <span key={i} className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-white/15 bg-white/5 px-4 py-2.5">
                <span className={`grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br ${p.color} text-white`}>
                  <p.icon className="h-4 w-4" />
                </span>
                <span className="font-display text-sm font-bold text-slate-300">{p.name}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── About ─────────────────────────────────────────────────────────────────

function About() {
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    <section id="about" className="py-20 md:py-28">
      <div
        ref={ref}
        className={`mx-auto max-w-6xl px-5 transition-all duration-700 ${
          shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div className="overflow-hidden rounded-3xl border border-white/15 bg-white/5 backdrop-blur md:grid md:grid-cols-2">
          <div className="relative min-h-[400px] bg-slate-800 md:min-h-0">
            <img
              src="/image.png"
              alt="Ahsanul Haque Hridoy"
              className="h-full w-full object-cover object-center"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-950/80 md:bg-gradient-to-t" />
            <div className="absolute left-6 top-6"><HridoyLogo size={48} /></div>
            <a
              href={BEHANCE}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-6 left-6 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              View my portfolio <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="p-8 md:p-10">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-400">About me</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white">
              Hi, I am Hridoy.
            </h2>
            <p className="mt-4 leading-relaxed text-slate-400">
              I am a Google Ads, Facebook Ads and LinkedIn Ads expert with over
              3 years of experience specialising in Search Ads, Performance Max,
              Shopping Ads, Carousel Ads, conversion tracking and Pixel setup. I
              create and manage campaigns that drive business growth and deliver
              measurable ROI.
            </p>
            <p className="mt-3 leading-relaxed text-slate-400">
              Previously I worked as an Ads Expert at BD Calling IT, managing 15
              clients and launching 40+ campaigns — with 11 repeat clients due
              to the results I delivered. I was also a Senior Executive at
              PPC Rockers (ended June 2026), managing 5 clients and 10+
              campaigns, with 4 repeat clients continuing because of strong
              performance and ROI.
            </p>

            <div className="mt-6 space-y-4">
              {experience.map((e) => (
                <div key={e.role} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-display font-bold text-white">{e.role}</p>
                    <span className="rounded-full bg-brand-500/20 px-2.5 py-0.5 text-xs font-semibold text-brand-300">
                      {e.period}
                    </span>
                  </div>
                  <ul className="mt-2 space-y-1.5">
                    {e.points.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-sm text-slate-400">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-600">
                Work with me <ArrowRight className="h-4 w-4" />
              </a>
              <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10">
                LinkedIn <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Services ──────────────────────────────────────────────────────────────

function Services() {
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    <section id="services" className="relative isolate overflow-hidden bg-slate-950 py-20 md:py-28">
      <div className="absolute inset-0 bg-grid-dark" />
      <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-brand-600/15 blur-3xl" />
      <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-brand-800/10 blur-3xl" />

      <div
        ref={ref}
        className={`relative z-10 mx-auto max-w-6xl px-5 transition-all duration-700 ${
          shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-400">What I do</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Full-stack ad management, end to end.
          </h2>
          <p className="mt-3 text-slate-400">
            Strategy, setup, tracking and optimisation across Google, Meta,
            LinkedIn, X and TikTok — handled by one certified specialist
            accountable for your numbers.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <article
              key={s.title}
              className="group relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur transition hover:-translate-y-1 hover:border-brand-400/40"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-lg">
                <s.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-display text-lg font-bold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.desc}</p>
              <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-brand-500/20 blur-2xl transition group-hover:bg-brand-500/30" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Case Studies / Work ───────────────────────────────────────────────────

function Work() {
  const { ref, shown } = useReveal<HTMLDivElement>();
  const [activeTab, setActiveTab] = useState(campaignProjects[0].id);
  const active = campaignProjects.find((p) => p.id === activeTab)!;

  return (
    <section id="work" className="relative isolate overflow-hidden bg-slate-950 py-20 md:py-28">
      <div className="absolute inset-0 bg-grid-dark" />
      <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-brand-600/25 blur-3xl" />
      <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-brand-800/20 blur-3xl" />

      <div
        ref={ref}
        className={`relative z-10 mx-auto max-w-6xl px-5 transition-all duration-700 ${
          shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        {/* Section header */}
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-400">Selected work</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Real campaigns. Real results.
          </h2>
          <p className="mt-3 text-slate-400">
            Browse by platform and campaign type — each project includes dashboard
            screenshots and key performance metrics.
          </p>
        </div>

        {/* Tab pills */}
        <div className="mt-10 flex flex-wrap gap-2">
          {campaignProjects.map((p) => (
            <button
              key={p.id}
              onClick={() => setActiveTab(p.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                activeTab === p.id
                  ? `bg-gradient-to-r ${p.color} text-white shadow-lg`
                  : 'border border-white/20 bg-white/5 text-slate-300 hover:border-white/40 hover:bg-white/10 hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Active project panel */}
        <div className="mt-6 overflow-hidden rounded-3xl border border-white/15 bg-white/10 backdrop-blur-md">
          {/* Panel header */}
          <div className="border-b border-white/10 p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${active.platformColor}`}>
                  {active.platform}
                </span>
                <h3 className="mt-3 font-display text-2xl font-extrabold text-white md:text-3xl">
                  {active.title}
                </h3>
                <p className="mt-1.5 font-medium text-slate-300">{active.subtitle}</p>
              </div>
              <a
                href={active.behance}
                target="_blank"
                rel="noopener noreferrer"
                className="flex shrink-0 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
              >
                View on Behance <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* Metrics row */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {active.metrics.map((m) => (
                <div key={m.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                  <p className="font-display text-xl font-extrabold text-white">{m.value}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{m.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Panel body */}
          <div className="grid gap-0 md:grid-cols-2">
            {/* Description */}
            <div className="border-b border-white/10 p-6 md:border-b-0 md:border-r md:p-8">
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-400">Campaign overview</p>
              <p className="mt-4 leading-relaxed text-slate-300">{active.desc}</p>

              <div className="mt-6 space-y-2">
                {[
                  'Keyword research & competitor analysis',
                  'Ad copy creation & A/B testing',
                  'Audience & location targeting',
                  'Bid strategy optimisation',
                  'Conversion tracking & reporting',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-sm text-slate-300">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-400" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Screenshots */}
            <div className="p-6 md:p-8">
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-400">
                Dashboard screenshots
              </p>
              {active.screenshots.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {active.screenshots.map((src, i) => (
                    <div key={i} className="overflow-hidden rounded-2xl border border-white/10 shadow-lg">
                      <img
                        src={src}
                        alt={`${active.title} — campaign dashboard screenshot ${i + 1}`}
                        className="w-full object-cover transition duration-300 hover:scale-[1.02]"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/5 py-16 text-center">
                  <BarChart3 className="h-10 w-10 text-slate-500" />
                  <p className="mt-3 text-sm font-medium text-slate-300">Screenshots coming soon</p>
                  <p className="mt-1 text-xs text-slate-400">Results available on Behance</p>
                  <a
                    href={active.behance}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-brand-300 transition hover:bg-white/10"
                  >
                    View full case study <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-6 flex justify-center">
          <a
            href={BEHANCE}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            See full portfolio on Behance
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Why Me ────────────────────────────────────────────────────────────────

function WhyMe() {
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    <section id="why" className="py-20 md:py-28">
      <div
        ref={ref}
        className={`mx-auto max-w-6xl px-5 transition-all duration-700 ${
          shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-400">Why work with me</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            More than an ad buyer.
          </h2>
          <p className="mt-3 text-slate-400">
            I bring corporate-level structure, multi-platform expertise and a
            holistic view of your entire funnel — not just the ad click.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {whyMe.map((w, i) => (
            <article
              key={w.title}
              className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur transition hover:-translate-y-1 hover:border-brand-400/40"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-500/20 text-brand-400">
                <w.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-base font-bold text-white">{w.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{w.desc}</p>
            </article>
          ))}
        </div>

        {/* How I help strip */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {howHelp.map((h) => (
            <div key={h.title} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-500/20 text-brand-400">
                <h.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-sm font-bold text-white">{h.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">{h.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Industries ────────────────────────────────────────────────────────────

function Industries() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-6xl px-5">
        <div className="rounded-3xl border border-white/15 bg-white/5 p-8 backdrop-blur md:p-10">
          <p className="text-center text-sm font-semibold uppercase tracking-wider text-brand-400">
            Industries I have served
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {industries.map((ind) => (
              <span
                key={ind}
                className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-brand-400/40 hover:bg-brand-500/10 hover:text-brand-300"
              >
                {ind}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Reviews ───────────────────────────────────────────────────────────────

function Reviews() {
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    <section id="reviews" className="relative isolate overflow-hidden py-20 md:py-28">
      <div className="absolute inset-0 bg-grid-dark" />
      <div className="absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-brand-600/15 blur-3xl" />
      <div className="absolute -right-40 bottom-1/4 h-96 w-96 rounded-full bg-brand-800/10 blur-3xl" />

      <div
        ref={ref}
        className={`relative z-10 mx-auto max-w-6xl px-5 transition-all duration-700 ${
          shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-400">Client reviews</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Trusted by clients who stayed.
          </h2>
        </div>
        <div className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="mb-5 break-inside-avoid rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur transition hover:border-brand-400/40">
              <Quote className="h-7 w-7 text-brand-500/40" />
              <blockquote className="mt-3 text-[15px] leading-relaxed text-slate-300">{t.quote}</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 font-display text-sm font-bold text-white">
                  {t.name.charAt(0)}
                </span>
                <div>
                  <p className="font-display font-bold text-white">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ───────────────────────────────────────────────────────────────────

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-5">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-400">FAQ</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Questions, answered.
          </h2>
        </div>
        <div className="mt-10 space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className={`overflow-hidden rounded-2xl border bg-white/5 backdrop-blur transition ${isOpen ? 'border-brand-400/40' : 'border-white/15'}`}>
                <button onClick={() => setOpen(isOpen ? null : i)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
                  <span className="font-display font-semibold text-white">{f.q}</span>
                  <ChevronDown className={`h-5 w-5 shrink-0 text-brand-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <div className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-[15px] leading-relaxed text-slate-400">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Contact ───────────────────────────────────────────────────────────────

function Contact() {
  return (
    <section id="contact" className="relative isolate overflow-hidden py-20 md:py-28">
      <div className="absolute inset-0 bg-grid-dark" />
      <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-brand-600/15 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-4xl px-5 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-400">Get in touch</p>
        <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Ready to scale your ads?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-slate-400">
          Message me on WhatsApp and I'll personally review your account and propose a custom strategy — no obligation.
        </p>

        {/* Primary WhatsApp CTA */}
        <a
          href={WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
          className="group mx-auto mt-10 inline-flex items-center gap-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-5 text-lg font-bold text-white shadow-xl transition hover:from-emerald-600 hover:to-emerald-700 hover:shadow-emerald-500/30"
        >
          <span className="grid h-14 w-14 place-items-center rounded-xl bg-white/20">
            <MessageCircle className="h-7 w-7" />
          </span>
          <div className="text-left">
            <span className="block text-2xl">Chat on WhatsApp</span>
            <span className="block text-sm font-normal text-emerald-100">+880 1785 778 309</span>
          </div>
          <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
        </a>

        <p className="mt-6 text-sm text-slate-500">Available for quick response 9 AM — 10 PM (BDT)</p>

        {/* Secondary contact methods */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href={`mailto:${EMAIL}`}
            className="group flex items-center gap-4 rounded-2xl border border-white/15 bg-white/5 p-5 text-left backdrop-blur transition hover:border-brand-400/40"
          >
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-500/20 text-brand-400">
              <Mail className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display font-bold text-white">Email</p>
              <p className="text-sm text-slate-400">{EMAIL}</p>
            </div>
          </a>

          <a
            href={LINKEDIN}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-2xl border border-white/15 bg-white/5 p-5 text-left backdrop-blur transition hover:border-brand-400/40"
          >
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-500/20 text-blue-400">
              <Linkedin className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display font-bold text-white">LinkedIn</p>
              <p className="text-sm text-slate-400">Connect professionally</p>
            </div>
          </a>

          <a
            href={UPWORK}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-2xl border border-white/15 bg-white/5 p-5 text-left backdrop-blur transition hover:border-brand-400/40"
          >
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-500/20 text-emerald-400">
              <Briefcase className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display font-bold text-white">Upwork</p>
              <p className="text-sm text-slate-400">Hire via platform</p>
            </div>
          </a>

          <a
            href={FIVERR}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-2xl border border-white/15 bg-white/5 p-5 text-left backdrop-blur transition hover:border-brand-400/40"
          >
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-green-500/20 text-green-400">
              <Zap className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display font-bold text-white">Fiverr</p>
              <p className="text-sm text-slate-400">Quick gig orders</p>
            </div>
          </a>

          <a
            href={BEHANCE}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-2xl border border-white/15 bg-white/5 p-5 text-left backdrop-blur transition hover:border-brand-400/40"
          >
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-pink-500/20 text-pink-400">
              <Globe className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display font-bold text-white">Behance</p>
              <p className="text-sm text-slate-400">Case studies</p>
            </div>
          </a>

          <a
            href={FACEBOOK}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-2xl border border-white/15 bg-white/5 p-5 text-left backdrop-blur transition hover:border-brand-400/40"
          >
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-600/20 text-blue-400">
              <Megaphone className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display font-bold text-white">Facebook</p>
              <p className="text-sm text-slate-400">Follow & message</p>
            </div>
          </a>
        </div>

        {/* Testimonial */}
        <div className="mx-auto mt-14 max-w-lg rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6 text-left">
          <Quote className="h-8 w-8 text-emerald-500/40" />
          <p className="mt-2 text-white">"61 qualified leads in the first 7 days — the campaign paid for itself immediately."</p>
          <p className="mt-3 text-sm text-emerald-300">— Lead generation client</p>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950 text-slate-400">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <HridoyWordmark />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-500">
            Google, Meta & LinkedIn Ads expert helping brands turn ad spend into
            measurable ROI. Strategy, creative, tracking and scaling — all
            under one roof.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <a href={BEHANCE} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-xl bg-white/5 px-3 py-2 text-xs font-semibold text-slate-400 transition hover:bg-brand-500 hover:text-white">
              Behance <ExternalLink className="h-3 w-3" />
            </a>
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-xl bg-white/5 px-3 py-2 text-xs font-semibold text-slate-400 transition hover:bg-brand-500 hover:text-white">
              LinkedIn <ExternalLink className="h-3 w-3" />
            </a>
            <a href={FACEBOOK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-xl bg-white/5 px-3 py-2 text-xs font-semibold text-slate-400 transition hover:bg-brand-500 hover:text-white">
              Facebook <ExternalLink className="h-3 w-3" />
            </a>
            <a href={UPWORK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-xl bg-white/5 px-3 py-2 text-xs font-semibold text-slate-400 transition hover:bg-brand-500 hover:text-white">
              Upwork <ExternalLink className="h-3 w-3" />
            </a>
            <a href={FIVERR} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-xl bg-white/5 px-3 py-2 text-xs font-semibold text-slate-400 transition hover:bg-brand-500 hover:text-white">
              Fiverr <ExternalLink className="h-3 w-3" />
            </a>
            <a href={`mailto:${EMAIL}`} className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 text-slate-400 transition hover:bg-brand-500 hover:text-white">
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div>
          <p className="font-display font-bold text-white">Services</p>
          <ul className="mt-3 space-y-2 text-sm">
            {services.slice(0, 5).map((s) => (
              <li key={s.title}><a href="#services" className="hover:text-brand-400">{s.title}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-display font-bold text-white">Contact</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a href={`mailto:${EMAIL}`} className="hover:text-brand-400">{EMAIL}</a></li>
            <li><a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="hover:text-brand-400">WhatsApp: +880 1785 778 309</a></li>
            <li><a href={UPWORK} target="_blank" rel="noopener noreferrer" className="hover:text-brand-400">Upwork</a></li>
            <li><a href={FIVERR} target="_blank" rel="noopener noreferrer" className="hover:text-brand-400">Fiverr</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5 py-6">
        <p className="mx-auto max-w-6xl px-5 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} Ahsanul Haque Hridoy. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <main>
        <Hero />
        <PlatformsMarquee />
        <About />
        <Services />
        <Work />
        <WhyMe />
        <Industries />
        <Reviews />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
