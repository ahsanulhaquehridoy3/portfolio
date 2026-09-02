import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import {
  TrendingUp,
  BarChart3,
  Megaphone,
  Search,
  ShoppingBag,
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
import { supabase } from './lib/supabase';

const WHATSAPP = 'https://wa.me/8801785778309';
const BEHANCE = 'https://www.behance.net/ahsanulhaquehridoy';
const LINKEDIN = 'https://www.linkedin.com/in/ahsanulhaquehridoy';
const FACEBOOK = 'https://www.facebook.com/share/1Ek2qFzhBm/?mibextid=wwXIfr';
const UPWORK = 'https://www.upwork.com/freelancers/ahsanulgoogleads';
const FIVERR = 'https://www.fiverr.com/s/bd1mmo1?utm_source=CopyLink_Mobile';
const EMAIL = 'hridoy410103@gmail.com';

function useScrollRevealObserver(pathname?: string) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const selector = [
      '.reveal',
      'section h1',
      'section h2',
      'section h3',
      'section h4',
      'section p',
      'section a',
      'section button',
      'section li',
      'section article',
    ].join(',');

    const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));
    if (!elements.length) return;

    const autoRevealElements = elements.filter((el, index) => {
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
      }
      if (
        !el.classList.contains('reveal-left') &&
        !el.classList.contains('reveal-right') &&
        !el.classList.contains('reveal-up') &&
        !el.classList.contains('reveal-scale') &&
        !el.classList.contains('reveal-zoom')
      ) {
        el.classList.add(index % 2 === 0 ? 'reveal-left' : 'reveal-right');
      }
      const hasDelayClass = Array.from(el.classList).some((className) => className.startsWith('reveal-delay-'));
      if (!hasDelayClass) {
        el.style.transitionDelay = `${(index % 6) * 0.08}s`;
      }
      return true;
    });

    if (prefersReducedMotion) {
      autoRevealElements.forEach((el) => el.classList.add('reveal-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('reveal-visible');
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -15% 0px' },
    );

    autoRevealElements.forEach((el) => {
      observer.observe(el);
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('reveal-visible');
        observer.unobserve(el);
      }
    });
    return () => observer.disconnect();
  }, [pathname]);
}

const ADMIN_USERNAME = 'Admin';
const DEFAULT_ADMIN_PASSWORD = 'AdminHridoy';
const LEGACY_ADMIN_PASSWORD = 'adminhridoy';
const ADMIN_PASSWORD_STORAGE_KEY = 'adminPassword';
const ADMIN_TOKEN_STORAGE_KEY = 'adminAuthToken';
const PROJECTS_STORAGE_KEY = 'portfolioProjects';
const SITE_CONTENT_STORAGE_KEY = 'portfolioSiteContent';
const PROJECT_CATEGORIES = ['Google Ads', 'Meta Ads', 'SEO', 'E-commerce', 'Lead Generation'] as const;

type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

type SiteContent = {
  hero: {
    badge: string;
    headline: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
    ctaUrl: string;
    image: string;
    subtext: string;
  };
  about: {
    sectionLabel: string;
    title: string;
    description: string;
    ctaLabel: string;
    ctaUrl: string;
    image: string;
  };
  contact: {
    headline: string;
    description: string;
    ctaLabel: string;
  };
};

const DEFAULT_SITE_CONTENT: SiteContent = {
  hero: {
    badge: 'Google · Meta · LinkedIn Ads Expert',
    headline: 'Ads that drive real business growth.',
    description:
      'I am Ahsanul Haque Hridoy — a certified paid media specialist with 4+ years managing millions in ad spend across Google, Meta and LinkedIn. I build campaigns that deliver measurable ROI, not just clicks.',
    ctaPrimary: 'Get a custom strategy',
    ctaSecondary: 'View my work',
    ctaUrl: '#contact',
    image: '/WhatsApp_Image_2026-07-02_at_11.43.33_PM.jpeg',
    subtext: '15+ repeat clients · Google & Facebook certified',
  },
  about: {
    sectionLabel: 'About me',
    title: 'Hi, I am Ahsanul Haque Hridoy.',
    description:
      'I am a Google Ads, Facebook Ads and LinkedIn Ads expert with over 3 years of experience specialising in Search Ads, Performance Max, Shopping Ads, Carousel Ads, conversion tracking and Pixel setup. I build ad strategies that improve lead quality and scale growth.',
    ctaLabel: 'View my portfolio',
    ctaUrl: BEHANCE,
    image: '/WhatsApp_Image_2026-07-02_at_11.43.33_PM.jpeg',
  },
  contact: {
    headline: 'Let’s build your next growth campaign.',
    description: 'Reach out for custom ad strategies that work across Google, Meta, LinkedIn and more.',
    ctaLabel: 'Start the conversation',
  },
};

type Project = {
  id: string;
  title: string;
  category: ProjectCategory | string;
  description: string;
  url?: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
};

function generateToken() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function loadProjects(): Project[] {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(PROJECTS_STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as any[];
    return parsed.map((project) => ({
      ...project,
      images: Array.isArray(project.images)
        ? project.images
        : project.image
        ? [project.image]
        : [],
      url: project.url || undefined,
    })) as Project[];
  } catch {
    return [];
  }
}

function saveProjects(projects: Project[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
}

async function loadProjectsFromDatabase(): Promise<Project[] | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('portfolio_projects')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;

  return (data ?? []).map((project) => ({
    id: project.id,
    title: project.title,
    category: project.category,
    description: project.description,
    url: project.url || undefined,
    images: Array.isArray(project.images) ? project.images : [],
    createdAt: project.created_at,
    updatedAt: project.updated_at,
  })) as Project[];
}

async function saveProjectToDatabase(project: Project) {
  if (!supabase) return;

  const { error } = await supabase.from('portfolio_projects').upsert({
    id: project.id,
    title: project.title,
    category: project.category,
    description: project.description,
    url: project.url || null,
    images: project.images,
    created_at: project.createdAt,
    updated_at: project.updatedAt,
  });
  if (error) throw error;
}

async function deleteProjectFromDatabase(id: string) {
  if (!supabase) return;
  const { error } = await supabase.from('portfolio_projects').delete().eq('id', id);
  if (error) throw error;
}

function loadSiteContent(): SiteContent {
  if (typeof window === 'undefined') return DEFAULT_SITE_CONTENT;
  const raw = window.localStorage.getItem(SITE_CONTENT_STORAGE_KEY);
  if (!raw) return DEFAULT_SITE_CONTENT;

  try {
    const parsed = JSON.parse(raw) as Partial<SiteContent>;
    const safe = <T extends string>(value: unknown, fallback: T): T =>
      typeof value === 'string' && value.trim() ? (value as T) : fallback;

    return {
      hero: {
        badge: safe(parsed.hero?.badge, DEFAULT_SITE_CONTENT.hero.badge),
        headline: safe(parsed.hero?.headline, DEFAULT_SITE_CONTENT.hero.headline),
        description: safe(parsed.hero?.description, DEFAULT_SITE_CONTENT.hero.description),
        ctaPrimary: safe(parsed.hero?.ctaPrimary, DEFAULT_SITE_CONTENT.hero.ctaPrimary),
        ctaSecondary: safe(parsed.hero?.ctaSecondary, DEFAULT_SITE_CONTENT.hero.ctaSecondary),
        ctaUrl: safe(parsed.hero?.ctaUrl, DEFAULT_SITE_CONTENT.hero.ctaUrl),
        image: safe(parsed.hero?.image, DEFAULT_SITE_CONTENT.hero.image),
        subtext: safe(parsed.hero?.subtext, DEFAULT_SITE_CONTENT.hero.subtext),
      },
      about: {
        sectionLabel: safe(parsed.about?.sectionLabel, DEFAULT_SITE_CONTENT.about.sectionLabel),
        title: safe(parsed.about?.title, DEFAULT_SITE_CONTENT.about.title),
        description: safe(parsed.about?.description, DEFAULT_SITE_CONTENT.about.description),
        ctaLabel: safe(parsed.about?.ctaLabel, DEFAULT_SITE_CONTENT.about.ctaLabel),
        ctaUrl: safe(parsed.about?.ctaUrl, DEFAULT_SITE_CONTENT.about.ctaUrl),
        image: safe(parsed.about?.image, DEFAULT_SITE_CONTENT.about.image),
      },
      contact: {
        headline: safe(parsed.contact?.headline, DEFAULT_SITE_CONTENT.contact.headline),
        description: safe(parsed.contact?.description, DEFAULT_SITE_CONTENT.contact.description),
        ctaLabel: safe(parsed.contact?.ctaLabel, DEFAULT_SITE_CONTENT.contact.ctaLabel),
      },
    };
  } catch {
    return DEFAULT_SITE_CONTENT;
  }
}

function saveSiteContent(content: SiteContent) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(SITE_CONTENT_STORAGE_KEY, JSON.stringify(content));
}


function loadAdminPassword(): string {
  if (typeof window === 'undefined') return DEFAULT_ADMIN_PASSWORD;

  const storedPassword = window.localStorage.getItem(ADMIN_PASSWORD_STORAGE_KEY);

  if (storedPassword === LEGACY_ADMIN_PASSWORD) {
    window.localStorage.setItem(ADMIN_PASSWORD_STORAGE_KEY, DEFAULT_ADMIN_PASSWORD);
    return DEFAULT_ADMIN_PASSWORD;
  }

  return storedPassword || DEFAULT_ADMIN_PASSWORD;
}

function saveAdminPassword(password: string) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ADMIN_PASSWORD_STORAGE_KEY, password);
}

function isAdminAuthenticated() {
  if (typeof window === 'undefined') return false;
  return !!window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
}

function loginAdmin() {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, generateToken());
}

function logoutAdmin() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
}

function navigateTo(path: string) {
  if (typeof window === 'undefined') return;
  window.history.pushState({ path }, '', path);
  window.dispatchEvent(new PopStateEvent('popstate', { state: window.history.state }));
}

function usePathname() {
  const [pathname, setPathname] = useState(() => (typeof window === 'undefined' ? '/' : window.location.pathname || '/'));

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handlePopstate = () => setPathname(window.location.pathname || '/');
    window.addEventListener('popstate', handlePopstate);
    return () => window.removeEventListener('popstate', handlePopstate);
  }, []);

  return pathname;
}

// ─── Logo ──────────────────────────────────────────────────────────────────

function HridoyLogo({ size = 40 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="overflow-hidden rounded-full border border-white/20 bg-slate-950 shadow-lg"
      aria-label="Ahsanul profile logo"
    >
      <img
        src="/image.png"
        alt="Ahsanul Haque Hridoy"
        className="h-full w-full object-cover"
      />
    </div>
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
          Ahsanul
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
  { name: 'Google Ads', logo: '/logos/google-adds.png', color: 'from-blue-500 to-sky-600' },
  { name: 'Meta Ads', logo: '/logos/meta.png', color: 'from-sky-500 to-blue-600' },
  { name: 'LinkedIn Ads', logo: '/logos/linkedin.png', color: 'from-cyan-500 to-blue-700' },
  { name: 'Shopping Ads', logo: '/logos/google shopping.png', color: 'from-emerald-500 to-teal-600' },
  { name: 'YouTube Ads', logo: '/logos/youtube.png', color: 'from-red-500 to-rose-600' },
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

const featuredCaseStudyImages = [
  '/files_10812615-2026-07-02T17-56-32-775Z-WhatsApp_Image_2026-07-02_at_11.52.20_PM_(1).jpeg',
  '/files_10812615-2026-07-02T17-56-33-023Z-WhatsApp_Image_2026-07-02_at_11.52.20_PM_(2).jpeg',
  '/files_10812615-2026-07-02T17-56-33-076Z-WhatsApp_Image_2026-07-02_at_11.52.21_PM.jpeg',
  '/files_10812615-2026-07-02T17-56-33-076Z-WhatsApp_Image_2026-07-02_at_11.52.21_PM_(1).jpeg',
  '/google-ads/lead-generation/WhatsApp_Image_2026-07-02_at_11.52.23_PM.jpeg',
];

const campaignProjects = [
  {
    id: 'google-lead',
    label: 'Google Ads Lead Gen',
    color: 'from-blue-500 to-blue-700',
    platform: 'Google Ads',
    platformColor: 'bg-blue-500/15 text-blue-300 border-blue-400/25',
    title: 'Google Ads Lead Generation Campaigns',
    subtitle: 'May, June and July Google Ads performance across lead generation campaigns.',
    desc: 'Managed 12 active Google Search campaigns for Leica Biosystems ANZ (LBS ANZ) — a B2B scientific equipment company. Structured with branded, generic and phrase-match ad groups, the campaigns delivered consistent month-to-month growth across May, June and July with efficient cost control.',
    metrics: [
      { label: 'May conversions', value: '52' },
      { label: 'Jun conversions', value: '63' },
      { label: 'Jul conversions', value: '74' },
      { label: 'Active campaigns', value: '12' },
    ],
    screenshots: [
      '/files_10812615-2026-07-02T17-56-32-775Z-WhatsApp_Image_2026-07-02_at_11.52.20_PM_(1).jpeg',
      '/google-ads/lead-generation/WhatsApp_Image_2026-07-02_at_11.52.23_PM.jpeg',
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
      '/logos/meta.png',
      '/google-ads/lead-generation/WhatsApp_Image_2026-07-02_at_11.52.23_PM.jpeg',
      '/files_10812615-2026-07-02T17-56-33-076Z-WhatsApp_Image_2026-07-02_at_11.52.21_PM_(1).jpeg',
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

function useReveal<T extends HTMLElement>(direction: 'left' | 'right' | 'up' = 'up') {
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

  const hiddenClass = direction === 'left'
    ? '-translate-x-12'
    : direction === 'right'
    ? 'translate-x-12'
    : 'translate-y-6';

  return { ref, shown, hiddenClass };
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
          type="button"
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

function Hero({ content }: { content: SiteContent['hero'] }) {
  const sectionBg = 'bg-slate-950';
  const textColor = 'text-white';
  const subText = 'text-slate-400';
  const cardBg = 'bg-slate-950/40 border-white/20';

  return (
    <section id="top" className={`relative isolate overflow-hidden ${sectionBg} pt-28 pb-20 md:pt-36`}>
      <div className="absolute inset-0 bg-grid-dark" />
      <div className="absolute -right-40 top-10 h-96 w-96 rounded-full bg-brand-600/25 blur-3xl" />
      <div className="absolute -left-40 top-32 h-96 w-96 rounded-full bg-brand-800/20 blur-3xl" />

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-2">
        <div className="reveal reveal-left">
          <span className="reveal reveal-up reveal-delay-100 inline-flex items-center gap-2 rounded-full border border-brand-400/40 bg-brand-500/10 px-3.5 py-1.5 text-xs font-semibold text-brand-300 backdrop-blur">
            <Sparkles className="h-3.5 w-5" />
            {content.badge}
          </span>
          <h1 className={`reveal reveal-up reveal-delay-150 mt-5 font-display text-4xl font-extrabold leading-[1.08] tracking-tight ${textColor} text-balance sm:text-5xl md:text-6xl`}>
            {content.headline.includes('real business growth') ? (
              <>{content.headline}</>
            ) : (
              <>{content.headline}</>
            )}
          </h1>

            <p className={`reveal reveal-up reveal-delay-200 mt-5 max-w-xl text-lg leading-relaxed ${subText}`}>
              {content.description}
            </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#contact" className="reveal reveal-up reveal-delay-250 group inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-600">
              {content.ctaPrimary}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a href="#work" className="reveal reveal-up reveal-delay-300 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10">
              {content.ctaSecondary}
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
        <div className="relative flex justify-center reveal reveal-right reveal-zoom">
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
                  <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 backdrop-blur-3xl shadow-[0_20px_80px_-45px_rgba(15,23,42,0.8)]">
                    <p className="font-display text-base font-bold text-white">Ahsanul Haque Hridoy</p>
                    <p className="mt-0.5 text-xs text-slate-100">Paid Media Expert · 4+ years · Google & Facebook certified</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -left-6 top-8 hidden rounded-2xl border border-white/10 bg-slate-950/30 p-3.5 backdrop-blur-3xl shadow-[0_20px_80px_-45px_rgba(15,23,42,0.8)] sm:block animate-floaty">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-800/80 text-white shadow-inner shadow-black/20">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs text-slate-100">Campaigns launched</p>
                  <p className="text-sm font-bold text-white">50+</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-6 top-1/2 hidden -translate-y-1/2 rounded-2xl border border-white/10 bg-slate-950/30 p-3.5 backdrop-blur-3xl shadow-[0_20px_80px_-45px_rgba(15,23,42,0.8)] sm:block animate-floaty" style={{ animationDelay: '1.5s' }}>
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-800/80 text-white shadow-inner shadow-black/20">
                  <TrendingUp className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs text-slate-100">Repeat clients</p>
                  <p className="text-sm font-bold text-white">15+</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-slate-950/30 px-4 py-2 backdrop-blur-3xl shadow-[0_20px_80px_-45px_rgba(15,23,42,0.8)]">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-white">
                <CheckCircle2 className="h-3.5 w-3.5 text-brand-300" />
                Google & Facebook Certified
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-20 grid max-w-6xl grid-cols-2 gap-4 px-5 md:grid-cols-4">
        {stats.map((s, index) => (
          <div key={s.label} className={`reveal reveal-scale reveal-delay-${(index + 1) * 100} rounded-2xl border border-white/15 bg-white/5 p-5 text-center backdrop-blur`}>
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
    <section className="border-y border-white/10 bg-slate-950 py-8 reveal reveal-up">
      <div className="mx-auto max-w-6xl px-5">
        <p className="mb-5 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 reveal reveal-up reveal-delay-100">
          Platforms I run & optimise
        </p>
        <div className="relative overflow-hidden mask-fade-x">
          <div className="flex w-max animate-marquee gap-6">
            {row.map((p, i) => (
              <span key={i} className="reveal reveal-scale flex items-center gap-3 whitespace-nowrap rounded-xl border border-white/15 bg-white/5 px-4 py-2.5" style={{ transitionDelay: `${(i % platforms.length) * 0.05}s` }}>
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/5">
                  <img src={p.logo} alt={`${p.name} logo`} className="h-7 w-7 object-contain" />
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

function VideoIntro() {
  return (
    <section className="bg-slate-950 py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="reveal reveal-up mb-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-400">Intro video</p>
        </div>

        <div className="reveal reveal-scale overflow-hidden rounded-3xl border border-white/15 bg-white/5 p-2 shadow-[0_30px_80px_-40px_rgba(59,130,246,0.8)] md:p-3">
          <div className="overflow-hidden rounded-[1.25rem]">
            <iframe
              className="aspect-video w-full rounded-[1.25rem]"
              src="https://www.youtube.com/embed/wdVo_t7B6UM"
              title="Ahsanul Haque Hridoy introduction video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── About ─────────────────────────────────────────────────────────────────

function About({ content }: { content: SiteContent['about'] }) {
  const sectionBg = 'bg-transparent';
  const cardBg = 'bg-white/5 border-white/15';
  const textColor = 'text-white';
  const subText = 'text-slate-400';

  return (
    <section id="about" className={`py-20 md:py-28 ${sectionBg}`}>
      <div className="mx-auto max-w-6xl px-5">
        <div className="reveal reveal-up rounded-3xl border border-white/15 bg-white/5 backdrop-blur md:grid md:grid-cols-2">
          <div className="reveal reveal-zoom relative min-h-[400px] bg-slate-800 md:min-h-0">
            <img
              src="/WhatsApp_Image_2026-07-02_at_11.43.33_PM.jpeg"
              alt="Ahsanul Haque Hridoy portrait"
              className="h-full w-full object-cover object-center"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-950/40 md:bg-gradient-to-t" />
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/30 to-transparent" />
            <a
              href={content.ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-6 left-6 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/20 reveal reveal-up reveal-delay-100"
            >
              {content.ctaLabel} <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="p-8 md:p-10">
<p className="reveal reveal-up text-sm font-semibold uppercase tracking-wider text-brand-400 reveal-delay-100">{content.sectionLabel}</p>
          <h2 className="reveal reveal-up reveal-delay-150 mt-2 font-display text-3xl font-extrabold tracking-tight text-white">
            {content.title}
          </h2>
          <p className="reveal reveal-up reveal-delay-200 mt-4 leading-relaxed text-slate-400">
            {content.description}
            </p>

            <div className="mt-6 space-y-4">
              {experience.map((e, index) => (
                <div key={e.role} className={`reveal reveal-scale reveal-delay-${200 + index * 100} rounded-2xl border border-white/10 bg-white/5 p-4`}>
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
              <a href="#contact" className="reveal reveal-up reveal-delay-400 inline-flex items-center gap-2 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-600">
                Work with me <ArrowRight className="h-4 w-4" />
              </a>
              <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="reveal reveal-up reveal-delay-450 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10">
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
  const { ref, shown, hiddenClass } = useReveal<HTMLDivElement>('right');
  return (
    <section id="services" className="relative isolate overflow-hidden bg-slate-950 py-20 md:py-28">
      <div className="absolute inset-0 bg-grid-dark" />
      <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-brand-600/15 blur-3xl" />
      <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-brand-800/10 blur-3xl" />

      <div
        ref={ref}
        className={`relative z-10 mx-auto max-w-6xl px-5 transition-all duration-700 ${
          shown ? 'opacity-100 translate-y-0 translate-x-0' : `opacity-0 ${hiddenClass}`
        }`}
      >
        <div className="mt-10 flex justify-center">
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-5 text-lg font-bold text-white shadow-xl transition hover:from-emerald-600 hover:to-emerald-700 hover:shadow-emerald-500/30"
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
        </div>

        <div className="max-w-2xl mx-auto pt-10">
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

function Work({ projects }: { projects: Project[] }) {
  const { ref, shown, hiddenClass } = useReveal<HTMLDivElement>('left');
  const [showAll, setShowAll] = useState(false);
  const featuredProjects = projects.slice(0, 2);
  const visibleProjects = showAll ? projects : featuredProjects;

  return (
    <section id="work" className="relative isolate overflow-hidden bg-slate-950 py-20 md:py-28">
      <div className="absolute inset-0 bg-grid-dark" />
      <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-brand-600/25 blur-3xl" />
      <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-brand-800/20 blur-3xl" />

      <div
        ref={ref}
        className={`relative z-10 mx-auto max-w-6xl px-5 transition-all duration-700 ${
          shown ? 'opacity-100 translate-y-0 translate-x-0' : `opacity-0 ${hiddenClass}`
        }`}
      >
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-400">Featured Projects</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Real work, real results.
          </h2>
          <p className="mt-3 text-slate-400">
            Explore the latest projects from the admin dashboard. Click any project to view its full details and image gallery.
          </p>
        </div>

        {projects.length > 0 ? (
          <>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {visibleProjects.map((project) => (
                <article
                  key={project.id}
                  className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition hover:-translate-y-1"
                >
                  <a
                    href={`/project/${project.id}`}
                    onClick={(event) => {
                      event.preventDefault();
                      navigateTo(`/project/${project.id}`);
                    }}
                    className="block h-full"
                  >
                    <div className="h-64 overflow-hidden bg-slate-900">
                      {project.images.length > 0 ? (
                        <img src={project.images[0]} alt={project.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-slate-900 text-sm text-slate-400">
                          No image available
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <span className="inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                        {project.category}
                      </span>
                      <h3 className="mt-4 text-xl font-semibold text-white">{project.title}</h3>
                      <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-400 line-clamp-3">{project.description}</p>
                      <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-brand-300">
                        <span>View details</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </a>
                </article>
              ))}
            </div>

            {projects.length > 2 && (
              <div className="mt-10 text-center">
                <button
                  type="button"
                  onClick={() => setShowAll((current) => !current)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  {showAll ? 'Show less' : 'See more'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
            <p className="text-lg font-semibold text-white">No projects uploaded yet.</p>
            <p className="mt-3 text-slate-400">Use the admin dashboard to add new projects and publish them here.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function ProjectDetailsPage({
  project,
  onBack,
}: {
  project?: Project;
  onBack: () => void;
}) {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const openPreview = (index: number) => setPreviewIndex(index);
  const closePreview = () => setPreviewIndex(null);
  const showPreviousImage = () => {
    if (previewIndex === null || !project) return;
    setPreviewIndex((previewIndex - 1 + project.images.length) % project.images.length);
  };
  const showNextImage = () => {
    if (previewIndex === null || !project) return;
    setPreviewIndex((previewIndex + 1) % project.images.length);
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
        <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl">
          <button
            type="button"
            onClick={onBack}
            className="mb-6 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back to projects
          </button>
          <h1 className="text-3xl font-extrabold text-white">Project not found</h1>
          <p className="mt-4 text-slate-400">This project may have been removed or the link is invalid.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl space-y-10">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          <ArrowRight className="h-4 w-4 rotate-180" />
          Back to projects
        </button>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-brand-400">{project.category}</p>
              <h1 className="mt-3 text-4xl font-extrabold text-white">{project.title}</h1>
              <p className="mt-4 max-w-3xl whitespace-pre-wrap break-words text-slate-300">{project.description}</p>
            </div>
            {project.url ? (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-brand-400/30 bg-brand-500/10 px-5 py-3 text-sm font-semibold text-brand-300 transition hover:bg-brand-500/20"
              >
                External project link
                <ExternalLink className="h-4 w-4" />
              </a>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-300">
                No external URL provided
              </span>
            )}
          </div>

          <div className="mt-10 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {project.images.length > 0 ? (
                project.images.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => openPreview(index)}
                    className="overflow-hidden rounded-3xl focus-visible:ring-2 focus-visible:ring-brand-400"
                  >
                    <img
                      src={image}
                      alt={`${project.title} image ${index + 1}`}
                      className="h-80 w-full object-cover transition duration-300 hover:scale-105"
                    />
                  </button>
                ))
              ) : (
                <div className="flex h-80 items-center justify-center rounded-3xl bg-slate-900 text-slate-400">
                  No images uploaded for this project.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {previewIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 p-6 backdrop-blur-sm">
          <div className="relative w-full max-w-6xl">
            <button
              type="button"
              onClick={closePreview}
              className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-black/60 px-4 py-2 text-sm font-semibold text-white transition hover:bg-black/80"
            >
              Close
            </button>
            <div className="overflow-hidden rounded-[2rem] bg-slate-950 shadow-2xl">
              <img
                src={project.images[previewIndex]}
                alt={`${project.title} preview ${previewIndex + 1}`}
                className="h-[70vh] w-full object-contain"
              />
            </div>
            <div className="mt-4 flex items-center justify-between gap-4 text-sm text-slate-300 sm:gap-6">
              <button
                type="button"
                onClick={showPreviousImage}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 font-semibold text-white transition hover:bg-white/10"
              >
                Previous
              </button>
              <p className="text-center text-sm text-slate-300">
                Image {previewIndex + 1} of {project.images.length}
              </p>
              <button
                type="button"
                onClick={showNextImage}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 font-semibold text-white transition hover:bg-white/10"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminLoginPage({ onLogin, isAdmin, adminPassword }: { onLogin: () => void; isAdmin: boolean; adminPassword: string }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAdmin) {
      navigateTo('/admin/dashboard');
    }
  }, [isAdmin]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === adminPassword) {
      setError('');
      onLogin();
      return;
    }
    setError('Invalid username or password.');
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-16 text-white">
      <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
        <h1 className="text-3xl font-extrabold text-white">Admin Login</h1>
        <p className="mt-2 text-sm text-slate-400">Secure access to the portfolio admin dashboard.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-200">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-brand-400"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-200">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-brand-400"
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-sm text-rose-400">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-2xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}

function AdminDashboardPage({
  projects,
  onSave,
  onDelete,
  onLogout,
  isAdmin,
  siteContent,
  onSaveSiteContent,
  adminPassword,
  onAdminPasswordChange,
}: {
  projects: Project[];
  onSave: (project: Project) => void;
  onDelete: (id: string) => void;
  onLogout: () => void;
  isAdmin: boolean;
  siteContent: SiteContent;
  onSaveSiteContent: (content: SiteContent) => void;
  adminPassword: string;
  onAdminPasswordChange: (password: string) => void;
}) {
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProjectCategory>(PROJECT_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [localContent, setLocalContent] = useState<SiteContent>(siteContent);
  const [contentMessage, setContentMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    setLocalContent(siteContent);
  }, [siteContent]);

  useEffect(() => {
    if (editingProject) {
      setTitle(editingProject.title);
      setCategory(editingProject.category as ProjectCategory);
      setDescription(editingProject.description);
      setUrl(editingProject.url || '');
      setImages(editingProject.images || []);
      setMessage('Editing project');
      return;
    }
    setTitle('');
    setCategory(PROJECT_CATEGORIES[0]);
    setDescription('');
    setUrl('');
    setImages([]);
    setMessage('');
  }, [editingProject]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    const readers = Array.from(files).map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          }
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((results) => {
      setImages((current) => [...current, ...results]);
    });
  };

  const handleSiteImageChange = (section: 'hero' | 'about', event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setLocalContent((prev) => ({
          ...prev,
          [section]: {
            ...prev[section],
            image: reader.result,
          },
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLocalContentSave = () => {
    onSaveSiteContent(localContent);
    setContentMessage('Site content saved successfully.');
    setTimeout(() => setContentMessage(''), 4000);
  };

  const handlePasswordSave = () => {
    if (!newPassword.trim()) {
      setPasswordMessage('Please enter a new password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage('Passwords do not match.');
      return;
    }
    onAdminPasswordChange(newPassword.trim());
    setPasswordMessage('Admin password updated successfully.');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordMessage(''), 4000);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || images.length === 0) {
      setMessage('Title, description, and at least one image are required.');
      return;
    }

    const project: Project = {
      id: editingProject?.id ?? generateToken(),
      title: title.trim(),
      category,
      description: description.trim(),
      url: url.trim() || undefined,
      images,
      createdAt: editingProject?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(project);
    setEditingProject(null);
    setMessage(editingProject ? 'Project updated successfully.' : 'Project added successfully.');
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold">Admin Dashboard</h1>
            <p className="mt-2 text-sm text-slate-400">Manage case studies and portfolio projects from a secure admin panel.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigateTo('/')}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              View homepage
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-bold text-white">{editingProject ? 'Edit Project' : 'Add New Project'}</h2>
            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-200">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-brand-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-brand-400"
                >
                  {PROJECT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="text-slate-900">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-2 h-32 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-brand-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200">Project URL (optional)</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-brand-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200">Upload Images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="mt-2 w-full text-sm text-slate-200"
                />
              </div>
              {images.length > 0 && (
                <div className="rounded-3xl border border-white/10 bg-slate-900 p-4">
                  <p className="text-sm font-semibold text-slate-200">Image preview</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {images.map((img, idx) => (
                      <img key={idx} src={img} alt={`Project preview ${idx + 1}`} className="h-48 w-full rounded-3xl object-cover" />
                    ))}
                  </div>
                </div>
              )}
              {message && <p className="text-sm text-slate-300">{message}</p>}
              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="rounded-2xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
                >
                  {editingProject ? 'Save changes' : 'Add project'}
                </button>
                {editingProject && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Cancel edit
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Projects</h2>
                <p className="mt-2 text-sm text-slate-400">Manage existing uploads and preview their content.</p>
              </div>
              <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
                {projects.length} total
              </span>
            </div>
            <div className="mt-6 space-y-4">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <div key={project.id} className="rounded-3xl border border-white/10 bg-slate-900 p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                      {project.images.length > 0 ? (
                        <img src={project.images[0]} alt={project.title} className="h-24 w-full rounded-3xl object-cover sm:w-24" />
                      ) : (
                        <div className="flex h-24 w-full items-center justify-center rounded-3xl bg-slate-800 text-sm text-slate-400 sm:w-24">
                          No image
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm uppercase tracking-[0.24em] text-brand-400">{project.category}</p>
                        <h3 className="mt-2 text-lg font-semibold text-white">{project.title}</h3>
                        <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-400 line-clamp-2">{project.description}</p>
                                {project.url ? (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-brand-300 hover:text-brand-200"
                          >
                            Open project
                            <ArrowRight className="h-4 w-4" />
                          </a>
                        ) : (
                          <p className="mt-3 text-sm text-slate-500">No project link provided</p>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => handleEdit(project)}
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(project.id)}
                        className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-dashed border-white/10 bg-slate-900 p-8 text-center text-slate-300">
                  No projects yet. Add your first case study using the form.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-0 md:px-0">
        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-white">Site content editor</h2>
              <p className="mt-2 text-sm text-slate-400">Update homepage hero, about section, and contact messaging directly from the admin panel.</p>
              <div className="mt-6 space-y-6">
                <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
                  <h3 className="text-lg font-semibold text-white">Hero section</h3>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <label className="block text-sm text-slate-300">
                      Badge
                      <input
                        value={localContent.hero.badge}
                        onChange={(e) => setLocalContent((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, badge: e.target.value },
                        }))}
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                      />
                    </label>
                    <label className="block text-sm text-slate-300">
                      Headline
                      <input
                        value={localContent.hero.headline}
                        onChange={(e) => setLocalContent((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, headline: e.target.value },
                        }))}
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                      />
                    </label>
                    <label className="block text-sm text-slate-300 md:col-span-2">
                      Description
                      <textarea
                        value={localContent.hero.description}
                        onChange={(e) => setLocalContent((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, description: e.target.value },
                        }))}
                        rows={4}
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                      />
                    </label>
                    <label className="block text-sm text-slate-300">
                      Primary CTA
                      <input
                        value={localContent.hero.ctaPrimary}
                        onChange={(e) => setLocalContent((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, ctaPrimary: e.target.value },
                        }))}
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                      />
                    </label>
                    <label className="block text-sm text-slate-300">
                      Secondary CTA
                      <input
                        value={localContent.hero.ctaSecondary}
                        onChange={(e) => setLocalContent((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, ctaSecondary: e.target.value },
                        }))}
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                      />
                    </label>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
                  <h3 className="text-lg font-semibold text-white">About section</h3>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <label className="block text-sm text-slate-300">
                      Section label
                      <input
                        value={localContent.about.sectionLabel}
                        onChange={(e) => setLocalContent((prev) => ({
                          ...prev,
                          about: { ...prev.about, sectionLabel: e.target.value },
                        }))}
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                      />
                    </label>
                    <label className="block text-sm text-slate-300">
                      Title
                      <input
                        value={localContent.about.title}
                        onChange={(e) => setLocalContent((prev) => ({
                          ...prev,
                          about: { ...prev.about, title: e.target.value },
                        }))}
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                      />
                    </label>
                    <label className="block text-sm text-slate-300 md:col-span-2">
                      Description
                      <textarea
                        value={localContent.about.description}
                        onChange={(e) => setLocalContent((prev) => ({
                          ...prev,
                          about: { ...prev.about, description: e.target.value },
                        }))}
                        rows={4}
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                      />
                    </label>
                    <label className="block text-sm text-slate-300">
                      CTA label
                      <input
                        value={localContent.about.ctaLabel}
                        onChange={(e) => setLocalContent((prev) => ({
                          ...prev,
                          about: { ...prev.about, ctaLabel: e.target.value },
                        }))}
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                      />
                    </label>
                    <label className="block text-sm text-slate-300">
                      CTA URL
                      <input
                        value={localContent.about.ctaUrl}
                        onChange={(e) => setLocalContent((prev) => ({
                          ...prev,
                          about: { ...prev.about, ctaUrl: e.target.value },
                        }))}
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                      />
                    </label>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
                  <h3 className="text-lg font-semibold text-white">Contact section</h3>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <label className="block text-sm text-slate-300">
                      Headline
                      <input
                        value={localContent.contact.headline}
                        onChange={(e) => setLocalContent((prev) => ({
                          ...prev,
                          contact: { ...prev.contact, headline: e.target.value },
                        }))}
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                      />
                    </label>
                    <label className="block text-sm text-slate-300 md:col-span-2">
                      Description
                      <textarea
                        value={localContent.contact.description}
                        onChange={(e) => setLocalContent((prev) => ({
                          ...prev,
                          contact: { ...prev.contact, description: e.target.value },
                        }))}
                        rows={4}
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                      />
                    </label>
                    <label className="block text-sm text-slate-300">
                      CTA label
                      <input
                        value={localContent.contact.ctaLabel}
                        onChange={(e) => setLocalContent((prev) => ({
                          ...prev,
                          contact: { ...prev.contact, ctaLabel: e.target.value },
                        }))}
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                      />
                    </label>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleLocalContentSave}
                    className="rounded-2xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
                  >
                    Save site content
                  </button>
                  {contentMessage && <p className="text-sm text-slate-300">{contentMessage}</p>}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
                <h3 className="text-lg font-semibold text-white">Theme settings</h3>
                <p className="mt-2 text-sm text-slate-400">Theme selection is disabled. The site uses the default dark style.</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
                <h3 className="text-lg font-semibold text-white">Admin password</h3>
                <p className="mt-2 text-sm text-slate-400">Change the password used to log into the admin panel.</p>
                <label className="mt-4 block text-sm text-slate-300">
                  New password
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                  />
                </label>
                <label className="mt-4 block text-sm text-slate-300">
                  Confirm password
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                  />
                </label>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handlePasswordSave}
                    className="rounded-2xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
                  >
                    Save password
                  </button>
                  {passwordMessage && <p className="text-sm text-slate-300">{passwordMessage}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Why Me ────────────────────────────────────────────────────────────────

function WhyMe() {
  const { ref, shown, hiddenClass } = useReveal<HTMLDivElement>('right');
  return (
    <section id="why" className="py-20 md:py-28">
      <div
        ref={ref}
        className={`mx-auto max-w-6xl px-5 transition-all duration-700 ${
          shown ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 ${hiddenClass}`
        }`}
      >
        <div className="mt-10 flex justify-center">
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-5 text-lg font-bold text-white shadow-xl transition hover:from-emerald-600 hover:to-emerald-700 hover:shadow-emerald-500/30"
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
        </div>

        <div className="max-w-2xl mx-auto pt-10">
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
  const { ref, shown, hiddenClass } = useReveal<HTMLDivElement>('right');
  return (
    <section id="reviews" className="relative isolate overflow-hidden py-20 md:py-28">
      <div className="absolute inset-0 bg-grid-dark" />
      <div className="absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-brand-600/15 blur-3xl" />
      <div className="absolute -right-40 bottom-1/4 h-96 w-96 rounded-full bg-brand-800/10 blur-3xl" />

      <div
        ref={ref}
        className={`relative z-10 mx-auto max-w-6xl px-5 transition-all duration-700 ${
          shown ? 'opacity-100 translate-y-0 translate-x-0' : `opacity-0 ${hiddenClass}`
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

function Contact({ content }: { content: SiteContent['contact'] }) {
  return (
    <section id="contact" className="relative isolate overflow-hidden py-20 md:py-28 bg-slate-950">
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
        <div className="mt-10 flex justify-center">
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-5 text-lg font-bold text-white shadow-xl transition hover:from-emerald-600 hover:to-emerald-700 hover:shadow-emerald-500/30"
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
        </div>

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
  const pathname = usePathname();
  useScrollRevealObserver(pathname);
  const [projects, setProjects] = useState<Project[]>(() => loadProjects());
  const [siteContent, setSiteContent] = useState<SiteContent>(() => loadSiteContent());
  const [adminPassword, setAdminPassword] = useState<string>(() => loadAdminPassword());

  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  useEffect(() => {
    let active = true;

    loadProjectsFromDatabase()
      .then(async (databaseProjects) => {
        if (!active || !databaseProjects) return;

        const localProjects = loadProjects();
        if (databaseProjects.length === 0 && localProjects.length > 0) {
          await Promise.all(localProjects.map(saveProjectToDatabase));
          if (active) setProjects(localProjects);
          return;
        }

        setProjects(databaseProjects);
      })
      .catch((error) => {
        console.error('Unable to load projects from Supabase.', error);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    saveSiteContent(siteContent);
  }, [siteContent]);

  useEffect(() => {
    saveAdminPassword(adminPassword);
  }, [adminPassword]);

  const [isAdmin, setIsAdmin] = useState<boolean>(() => isAdminAuthenticated());

  useEffect(() => {
    if (pathname.startsWith('/admin') && !isAdmin) {
      navigateTo('/admin/login');
    }
  }, [isAdmin, pathname]);

  const handleLogin = () => {
    loginAdmin();
    setIsAdmin(true);
    navigateTo('/admin/dashboard');
  };

  const handleLogout = () => {
    logoutAdmin();
    setIsAdmin(false);
    navigateTo('/admin/login');
  };

  const handleSaveSiteContent = (content: SiteContent) => {
    setSiteContent(content);
  };

  const handleAdminPasswordChange = (newPassword: string) => {
    setAdminPassword(newPassword);
  };

  const handleSaveProject = (project: Project) => {
    setProjects((current) => {
      const exists = current.find((item) => item.id === project.id);
      if (exists) {
        return current.map((item) => (item.id === project.id ? project : item));
      }
      return [project, ...current];
    });
    void saveProjectToDatabase(project).catch((error) => {
      console.error('Unable to save project to Supabase.', error);
    });
  };

  const handleDeleteProject = (id: string) => {
    setProjects((current) => current.filter((item) => item.id !== id));
    void deleteProjectFromDatabase(id).catch((error) => {
      console.error('Unable to delete project from Supabase.', error);
    });
  };

  const projectId = pathname.startsWith('/project/') ? pathname.replace('/project/', '') : undefined;
  const currentProject = projectId ? projects.find((project) => project.id === projectId) : undefined;

  if (pathname.startsWith('/admin')) {
    if (!isAdmin) {
      return <AdminLoginPage onLogin={handleLogin} isAdmin={isAdmin} adminPassword={adminPassword} />;
    }

    return (
      <AdminDashboardPage
        projects={projects}
        onSave={handleSaveProject}
        onDelete={handleDeleteProject}
        onLogout={handleLogout}
        isAdmin={isAdmin}
        siteContent={siteContent}
        onSaveSiteContent={handleSaveSiteContent}
        adminPassword={adminPassword}
        onAdminPasswordChange={handleAdminPasswordChange}
      />
    );
  }

  if (pathname.startsWith('/project/')) {
    return <ProjectDetailsPage project={currentProject} onBack={() => navigateTo('/')} />;
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero content={siteContent.hero} />
        <PlatformsMarquee />
        <VideoIntro />
        <About content={siteContent.about} />
        <Services />
        <Work projects={projects} />
        <WhyMe />
        <Industries />
        <Reviews />
        <FAQ />
        <Contact content={siteContent.contact} />
      </main>
      <Footer />
    </div>
  );
}
