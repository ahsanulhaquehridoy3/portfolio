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
  Phone,
  Linkedin,
  GripVertical,
  ShieldCheck,
  UserCheck,
  Play,
} from 'lucide-react';
import { supabase } from './lib/supabase';
import { HeroOrbits } from './HeroOrbits';

const WHATSAPP = 'https://wa.me/8801785778309';
const PHONE = '+8801785778309';
const PHONE_DISPLAY = '+880 1785 778 309';
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
    ctaPrimary: 'Get Free Quote',
    ctaSecondary: 'View My All Work',
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
  orderIndex: number;
  title: string;
  category: ProjectCategory | string;
  description: string;
  url?: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
};

function isMissingProjectOrderColumn(error: { code?: string } | null) {
  return error?.code === '42703' || error?.code === 'PGRST204';
}

function normalizeProject(raw: any): Project {
  const images = Array.isArray(raw?.images)
    ? raw.images.filter((image: unknown): image is string => typeof image === 'string' && image.length > 0)
    : typeof raw?.image === 'string' && raw.image.length > 0
    ? [raw.image]
    : [];

  return {
    id: typeof raw?.id === 'string' && raw.id ? raw.id : generateToken(),
    orderIndex: typeof raw?.orderIndex === 'number'
      ? raw.orderIndex
      : typeof raw?.sort_order === 'number'
      ? raw.sort_order
      : 0,
    title: typeof raw?.title === 'string' ? raw.title : 'Untitled project',
    category: typeof raw?.category === 'string' ? raw.category : PROJECT_CATEGORIES[0],
    description: typeof raw?.description === 'string' ? raw.description : '',
    url: typeof raw?.url === 'string' && raw.url ? raw.url : undefined,
    images,
    createdAt: typeof raw?.createdAt === 'string' ? raw.createdAt : new Date().toISOString(),
    updatedAt: typeof raw?.updatedAt === 'string' ? raw.updatedAt : new Date().toISOString(),
  };
}

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
    return Array.isArray(parsed)
      ? parsed.map((project, index) => normalizeProject({ ...project, orderIndex: project?.orderIndex ?? index }))
      : [];
  } catch {
    return [];
  }
}

function saveProjects(projects: Project[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    // Large base64 image uploads can exceed localStorage even though the page is still usable.
    console.warn('Unable to cache projects locally; Supabase remains the durable project store.', error);
  }
}

function readProjectImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('Unable to read project image.'));
        return;
      }

      const image = new Image();
      image.onerror = () => reject(new Error('Unable to decode project image.'));
      image.onload = () => {
        const maxDimension = 1800;
        const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
        const context = canvas.getContext('2d');

        if (!context) {
          resolve(reader.result as string);
          return;
        }

        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

async function loadProjectsFromDatabase(): Promise<Project[]> {
  if (!supabase) {
    throw new Error('Supabase is not configured. Projects cannot be loaded from the database.');
  }

  let { data, error } = await supabase
    .from('portfolio_projects')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (isMissingProjectOrderColumn(error)) {
    const fallback = await supabase
      .from('portfolio_projects')
      .select('*')
      .order('updated_at', { ascending: false })
      .order('created_at', { ascending: false });
    data = fallback.data;
    error = fallback.error;
  }

  if (error) throw error;

  return (data ?? []).map((project) => normalizeProject({
    ...project,
    orderIndex: project.sort_order,
    createdAt: project.created_at,
    updatedAt: project.updated_at,
  }));
}

async function saveProjectToDatabase(project: Project) {
  if (!supabase) {
    throw new Error('Supabase is not configured. Projects cannot be saved to the database.');
  }

  const projectRow = {
    id: project.id,
    title: project.title,
    category: project.category,
    description: project.description,
    url: project.url || null,
    images: project.images,
    created_at: project.createdAt,
    updated_at: project.updatedAt,
  };
  const { error } = await supabase.from('portfolio_projects').upsert({
    ...projectRow,
    sort_order: project.orderIndex,
  });

  if (isMissingProjectOrderColumn(error)) {
    const fallback = await supabase.from('portfolio_projects').upsert(projectRow);
    if (fallback.error) throw fallback.error;
    return;
  }

  if (error) throw error;
}

async function saveProjectOrderToDatabase(projects: Project[]) {
  if (!supabase) {
    throw new Error('Supabase is not configured. Project order cannot be saved to the database.');
  }
  const database = supabase;

  const orderTimestamp = Date.now();
  await Promise.all(projects.map(async (project, index) => {
    const { error } = await database
      .from('portfolio_projects')
      .update({
        sort_order: index,
        updated_at: new Date(orderTimestamp - index).toISOString(),
      })
      .eq('id', project.id);

    if (isMissingProjectOrderColumn(error)) {
      const fallback = await database
        .from('portfolio_projects')
        .update({ updated_at: new Date(orderTimestamp - index).toISOString() })
        .eq('id', project.id);
      if (fallback.error) throw fallback.error;
      return;
    }

    if (error) throw error;
  }));
}

async function deleteProjectFromDatabase(id: string) {
  if (!supabase) {
    throw new Error('Supabase is not configured. Projects cannot be deleted from the database.');
  }
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
    const normalizeHeroCta = (value: unknown, fallback: string): string => {
      const safeValue = safe(value, fallback);
      if (safeValue.toLowerCase().includes('get a custom strategy')) {
        return fallback;
      }
      return safeValue;
    };

    return {
      hero: {
        badge: safe(parsed.hero?.badge, DEFAULT_SITE_CONTENT.hero.badge),
        headline: safe(parsed.hero?.headline, DEFAULT_SITE_CONTENT.hero.headline),
        description: safe(parsed.hero?.description, DEFAULT_SITE_CONTENT.hero.description),
        ctaPrimary: normalizeHeroCta(parsed.hero?.ctaPrimary, DEFAULT_SITE_CONTENT.hero.ctaPrimary),
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
  window.history.scrollRestoration = 'manual';
  window.history.pushState({ path }, '', path);
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  window.dispatchEvent(new PopStateEvent('popstate', { state: window.history.state }));
}

function usePathname() {
  const [pathname, setPathname] = useState(() => (typeof window === 'undefined' ? '/' : window.location.pathname || '/'));

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.history.scrollRestoration = 'manual';
    const handlePopstate = () => {
      setPathname(window.location.pathname || '/');
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    };
    handlePopstate();
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

void featuredCaseStudyImages;
void campaignProjects;

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
          <a href={`tel:${PHONE}`} className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-brand-400 hover:text-brand-300">
            <Phone className="h-4 w-4" />
            {PHONE_DISPLAY}
          </a>
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-600">
            WhatsApp
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
            <a href={`tel:${PHONE}`} onClick={() => setOpen(false)} className="mt-1 inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-center text-sm font-semibold text-white">
              <Phone className="h-4 w-4" />
              Call {PHONE_DISPLAY}
            </a>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className="rounded-full bg-brand-500 px-5 py-2.5 text-center text-sm font-semibold text-white">
              WhatsApp
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

  return (
    <section id="top" className={`relative isolate overflow-hidden ${sectionBg} pt-28 pb-20 md:pt-36`}>
      <div className="absolute inset-0 bg-grid-dark" />
      <div className="absolute -right-40 top-10 h-96 w-96 rounded-full bg-brand-600/25 blur-3xl" />
      <div className="absolute -left-40 top-32 h-96 w-96 rounded-full bg-brand-800/20 blur-3xl" />

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-8 lg:gap-14 px-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="reveal reveal-left max-w-xl">
          <span className="reveal reveal-up reveal-delay-100 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-slate-300 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            {content.badge || 'SEO · Google Ads · Local Marketing, Fully Managed'}
          </span>
          <h1 className="reveal reveal-up reveal-delay-150 mt-5 font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-white text-balance sm:text-5xl lg:text-[54px]">
            Marketing that gets your{' '}
            <span className="text-amber-400">business</span> real results
          </h1>

          <p className="reveal reveal-up reveal-delay-200 mt-5 text-base md:text-lg leading-relaxed text-slate-400">
            {content.description ||
              'I run the SEO, ads, and local marketing behind the scenes, so you can focus on your customers, not campaign management.'}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <a
              href="#contact"
              className="reveal reveal-up reveal-delay-250 group inline-flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-[0_0_25px_rgba(251,191,36,0.35)] transition-all duration-200 hover:bg-amber-300 hover:shadow-[0_0_35px_rgba(251,191,36,0.5)] hover:scale-[1.02]"
            >
              Get a Free Quote
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#work"
              className="reveal reveal-up reveal-delay-300 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition-all duration-200 hover:bg-white/10 hover:border-white/30"
            >
              See How It Works
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

        {/* Orbital Constellation (ironleadagency style) */}
        <div className="relative flex justify-center items-center py-4">
          <HeroOrbits />
        </div>
      </div>

      {/* Trust Chips (ironleadagency style) */}
      <div className="relative z-10 mx-auto mt-20 md:mt-24 grid max-w-6xl grid-cols-1 gap-4 px-5 md:grid-cols-3">
        <div className="reveal reveal-up rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur transition-all duration-300 hover:border-amber-400/40 hover:bg-white/[0.06] flex items-start gap-4">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">White-label Friendly</h4>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              I work behind the scenes as your fulfillment partner, or directly with your business. Your call.
            </p>
          </div>
        </div>

        <div className="reveal reveal-up reveal-delay-100 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur transition-all duration-300 hover:border-amber-400/40 hover:bg-white/[0.06] flex items-start gap-4">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
            <LineChart className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Transparent Reporting</h4>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Clear, regular updates on performance, conversion tracking, and real ROI with no black boxes.
            </p>
          </div>
        </div>

        <div className="reveal reveal-up reveal-delay-200 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur transition-all duration-300 hover:border-amber-400/40 hover:bg-white/[0.06] flex items-start gap-4">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Dedicated Management</h4>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              A real dedicated expert who knows your accounts and strategy, not a rotating support team.
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-12 grid max-w-6xl grid-cols-2 gap-4 px-5 md:grid-cols-4">
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
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section id="vsl" className="relative isolate overflow-hidden bg-slate-950 py-20 md:py-28">
      {/* Background ambient light */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[600px] rounded-full bg-brand-600/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-4xl px-5 text-center">
        {/* Eyebrow, Title and Subtitle matching ironleadagency.com */}
        <div className="reveal reveal-up">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
            Watch
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
            See how we drive results
          </h2>
          <p className="mt-4 text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            A quick look at how I plug into your business and deliver measurable growth through smart ad campaigns.
          </p>
        </div>

        {/* Video Frame with rotating conic border (from ironleadagency.com) */}
        <div className="reveal reveal-scale mt-10 md:mt-12 mx-auto max-w-3xl">
          <div className="vsl-frame">
            {isPlaying ? (
              <div className="aspect-video w-full overflow-hidden rounded-[13px] bg-black">
                <iframe
                  className="h-full w-full border-0"
                  src="https://www.youtube.com/embed/wdVo_t7B6UM?autoplay=1&rel=0"
                  title="See how we drive results"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : (
              <div
                onClick={() => setIsPlaying(true)}
                className="group relative aspect-video w-full cursor-pointer overflow-hidden rounded-[13px] bg-slate-900 flex items-center justify-center transition-all duration-300"
                style={{
                  backgroundImage: `linear-gradient(rgba(10, 20, 35, 0.4), rgba(10, 20, 35, 0.65)), url('https://img.youtube.com/vi/wdVo_t7B6UM/maxresdefault.jpg')`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                {/* Center Play Button (exact icon styling from ironleadagency.com) */}
                <div className="relative z-10 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full border-2 border-white/40 bg-white/15 backdrop-blur-md shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:border-amber-400 group-hover:bg-amber-400 group-hover:shadow-[0_0_35px_rgba(250,204,21,0.6)]">
                  <Play className="h-8 w-8 sm:h-10 sm:w-10 fill-white text-white transition-colors duration-300 group-hover:fill-slate-950 group-hover:text-slate-950 ml-1" />
                </div>

                {/* Duration Caption Badge at the bottom */}
                <div className="absolute bottom-5 left-0 right-0 z-10 flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold text-white/90 drop-shadow">
                  <Play className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span>3 min watch</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Where I Show Up For You ───────────────────────────────────────────────

const PLATFORM_STEPS = [
  {
    id: 'lsa',
    label: 'Local Service Ads',
    title: 'Local Service Ads',
    desc: 'Appear at the very top of Google — before regular ads — with a Google Guaranteed badge that builds instant trust.',
    screen: (
      <div className="flex flex-col h-full bg-white text-slate-900 font-sans text-[10px] overflow-hidden rounded-b-[32px]">
        {/* Search bar */}
        <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 border-b border-slate-200">
          <div className="flex-1 flex items-center gap-1.5 rounded-full bg-white border border-slate-300 px-2.5 py-1">
            <Search className="h-2.5 w-2.5 text-slate-400 shrink-0" />
            <span className="text-[9px] text-slate-500">google ads expert near me</span>
          </div>
        </div>
        {/* LSA card */}
        <div className="flex-1 overflow-auto px-2.5 pt-2 space-y-1.5">
          <p className="text-[8px] text-slate-500 font-medium">Sponsored · Local Services</p>
          {[
            { name: 'Ahsanul Haque Hridoy', rating: '4.9', reviews: 32, badge: true },
            { name: 'Digital Ads Pro', rating: '4.7', reviews: 18, badge: false },
          ].map((c) => (
            <div key={c.name} className={`rounded-lg border p-2 flex gap-2 items-start ${c.badge ? 'border-green-400 bg-green-50' : 'border-slate-200 bg-white'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-white text-[8px] font-bold ${c.badge ? 'bg-amber-500' : 'bg-slate-400'}`}>
                {c.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="font-semibold text-[9px] leading-tight">{c.name}</span>
                  {c.badge && <span className="bg-green-600 text-white text-[7px] px-1 py-0.5 rounded font-bold">✓ Google Guaranteed</span>}
                </div>
                <div className="flex items-center gap-0.5 mt-0.5">
                  {[...Array(5)].map((_, i) => <span key={i} className={`text-[8px] ${i < 5 ? 'text-amber-400' : 'text-slate-300'}`}>★</span>)}
                  <span className="text-[8px] text-slate-500 ml-0.5">{c.rating} ({c.reviews})</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'google-ads',
    label: 'Google Ads',
    title: 'Google Ads',
    desc: 'Show up when potential clients are actively searching. Precision targeting, compelling copy, and bids that maximize ROI.',
    screen: (
      <div className="flex flex-col h-full bg-white text-slate-900 text-[10px] overflow-hidden rounded-b-[32px]">
        <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 border-b border-slate-200">
          <div className="flex-1 flex items-center gap-1.5 rounded-full bg-white border border-slate-300 px-2.5 py-1">
            <Search className="h-2.5 w-2.5 text-slate-400 shrink-0" />
            <span className="text-[9px] text-slate-500">hire google ads specialist</span>
          </div>
        </div>
        <div className="flex-1 overflow-auto px-2.5 pt-2 space-y-2">
          {[
            { title: 'Ahsanul Hridoy — Google Ads Expert', url: 'ahsanulhaquehridoy.com', desc: 'Certified specialist. 4+ yrs. Free strategy call. ROI-focused campaigns.', top: true },
            { title: 'Paid Media Services | Google Ads', url: 'ahsanulhaquehridoy.com/services', desc: 'Google, Meta & LinkedIn Ads. Transparent reporting. No long-term contracts.', top: false },
          ].map((ad, i) => (
            <div key={i} className={`rounded-lg border p-2 ${ad.top ? 'border-amber-300 bg-amber-50' : 'border-slate-200 bg-white'}`}>
              <div className="flex items-center gap-1 mb-0.5">
                <span className="text-[7px] border border-slate-400 text-slate-600 px-1 py-0.5 rounded font-medium">Sponsored</span>
                <span className="text-[8px] text-green-700 truncate">{ad.url}</span>
              </div>
              <p className="text-[9px] font-semibold text-blue-700 leading-tight">{ad.title}</p>
              <p className="text-[8px] text-slate-600 mt-0.5 leading-snug">{ad.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'maps',
    label: 'Maps',
    title: 'Google Maps',
    desc: 'Dominate the Local Pack. When clients search nearby, your profile shows ratings, reviews, and a direct call button.',
    screen: (
      <div className="flex flex-col h-full bg-white text-slate-900 text-[10px] overflow-hidden rounded-b-[32px]">
        {/* Map placeholder */}
        <div className="relative h-28 bg-gradient-to-br from-green-100 to-blue-100 flex-shrink-0">
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'repeating-linear-gradient(0deg,rgba(0,0,0,0.05) 0,rgba(0,0,0,0.05) 1px,transparent 1px,transparent 32px), repeating-linear-gradient(90deg,rgba(0,0,0,0.05) 0,rgba(0,0,0,0.05) 1px,transparent 1px,transparent 32px)' }} />
          {/* Pins */}
          {[{ x: '38%', y: '30%', color: '#ef4444', big: true }, { x: '58%', y: '52%', color: '#6b7280', big: false }, { x: '25%', y: '60%', color: '#6b7280', big: false }].map((pin, i) => (
            <div key={i} className="absolute" style={{ left: pin.x, top: pin.y, transform: 'translate(-50%,-100%)' }}>
              <div className="w-3 h-3 rounded-full border-2 border-white shadow" style={{ background: pin.color }} />
            </div>
          ))}
        </div>
        {/* Listings */}
        <div className="flex-1 overflow-auto px-2.5 pt-1.5 space-y-1.5">
          {[
            { name: 'Ahsanul Haque Hridoy', rating: '4.9', reviews: 47, type: 'Digital Marketing', active: true },
            { name: 'MediaGrow Agency', rating: '4.6', reviews: 23, type: 'Advertising Agency', active: false },
            { name: 'AdsFirst Studio', rating: '4.5', reviews: 15, type: 'Google Ads', active: false },
          ].map((b, i) => (
            <div key={i} className={`flex items-start gap-2 rounded-lg border p-1.5 ${b.active ? 'border-blue-400 bg-blue-50' : 'border-slate-200'}`}>
              <div className={`w-5 h-5 rounded shrink-0 flex items-center justify-center text-white text-[8px] font-bold ${b.active ? 'bg-blue-600' : 'bg-slate-400'}`}>{i + 1}</div>
              <div>
                <p className="font-semibold text-[9px] leading-tight">{b.name}</p>
                <p className="text-[8px] text-slate-500">{b.type}</p>
                <div className="flex items-center gap-0.5 mt-0.5">
                  <span className="text-amber-500 text-[8px]">★</span>
                  <span className="text-[8px] text-slate-700">{b.rating}</span>
                  <span className="text-[8px] text-slate-500">({b.reviews})</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'seo',
    label: 'SEO',
    title: 'SEO',
    desc: 'Long-term organic visibility. Build authority so clients find you even when you\'re not running paid ads.',
    screen: (
      <div className="flex flex-col h-full bg-white text-slate-900 text-[10px] overflow-hidden rounded-b-[32px]">
        <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 border-b border-slate-200">
          <div className="flex-1 flex items-center gap-1.5 rounded-full bg-white border border-slate-300 px-2.5 py-1">
            <Search className="h-2.5 w-2.5 text-slate-400 shrink-0" />
            <span className="text-[9px] text-slate-500">best google ads expert bangladesh</span>
          </div>
        </div>
        <div className="flex-1 overflow-auto px-2.5 pt-2 space-y-2">
          {[
            { title: 'Ahsanul Haque Hridoy | Certified Google Ads...', url: 'ahsanulhaquehridoy.com', desc: 'Certified Google & Meta Ads specialist. 4+ years driving ROI for 15+ clients. Free consultation.', top: true },
            { title: '10 Best Google Ads Experts in Bangladesh', url: 'techreviews.bd', desc: '#1 pick: Ahsanul Haque Hridoy for measurable results...', top: false },
          ].map((r, i) => (
            <div key={i} className="border-b border-slate-100 pb-2">
              <p className="text-[8px] text-green-700 truncate">{r.url}</p>
              <p className={`text-[9px] leading-tight mt-0.5 ${r.top ? 'text-blue-700 font-semibold' : 'text-blue-600'}`}>{r.title}</p>
              <p className="text-[8px] text-slate-600 mt-0.5 leading-snug">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'website',
    label: 'Website',
    title: 'Your Website',
    desc: 'Every click above lands here. A fast, conversion-optimized site that turns visitors into qualified leads.',
    screen: (
      <div className="flex flex-col h-full bg-[#0d1829] text-white text-[10px] overflow-hidden rounded-b-[32px]">
        {/* Mini nav */}
        <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="text-[9px] font-bold text-white">Ahsanul</span>
          </div>
          <div className="flex gap-2 text-[7px] text-slate-400">
            <span>About</span><span>Work</span><span>Contact</span>
          </div>
        </div>
        {/* Hero mini */}
        <div className="flex-1 flex flex-col items-start justify-center px-3 py-3 gap-1.5">
          <span className="text-[7px] bg-amber-400/10 border border-amber-400/30 text-amber-400 px-1.5 py-0.5 rounded-full">Google · Meta · LinkedIn Ads</span>
          <p className="text-[10px] font-extrabold text-white leading-tight">Ads that drive real<br/>business growth.</p>
          <p className="text-[8px] text-slate-400 leading-snug">Certified paid media specialist.<br/>4+ years. 15+ repeat clients.</p>
          <div className="flex gap-1.5 mt-1">
            <div className="bg-amber-400 text-slate-950 text-[7px] font-bold px-2 py-1 rounded-lg">Get Free Quote</div>
            <div className="border border-white/20 text-white text-[7px] font-semibold px-2 py-1 rounded-lg">View Work</div>
          </div>
        </div>
        {/* Stats row */}
        <div className="flex border-t border-white/10 flex-shrink-0">
          {[['4+', 'Years'], ['15+', 'Clients'], ['$2M+', 'Ad Spend']].map(([v, l]) => (
            <div key={l} className="flex-1 text-center py-1.5 border-r border-white/10 last:border-r-0">
              <p className="text-[9px] font-extrabold text-amber-400">{v}</p>
              <p className="text-[7px] text-slate-500">{l}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

function WhereIShowUp() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % PLATFORM_STEPS.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const step = PLATFORM_STEPS[active];

  return (
    <section className="relative isolate overflow-hidden py-20 md:py-28" style={{ background: 'linear-gradient(180deg, #0d1829 0%, #0a1220 100%)' }}>
      {/* Ambient glow */}
      <div className="absolute -left-40 top-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
      <div className="absolute -right-40 top-1/3 h-80 w-80 rounded-full bg-brand-600/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-6xl px-5 grid gap-16 items-center md:grid-cols-2">

        {/* LEFT: Text + step buttons */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400 reveal reveal-up">
            WHERE I SHOW UP FOR YOU
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl reveal reveal-up reveal-delay-100">
            The platforms your<br />clients are already using
          </h2>
          <p className="mt-4 text-slate-400 leading-relaxed reveal reveal-up reveal-delay-200">
            Clients can find you in four places on Google's first page, and all of them lead to your website. Every spot you're missing goes to a competitor.
          </p>

          {/* Progress dots */}
          <div className="mt-8 flex gap-1.5 reveal reveal-up reveal-delay-300">
            {PLATFORM_STEPS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setActive(i)}
                aria-label={s.label}
                className={`h-1.5 rounded-full transition-all duration-500 ${i === active ? 'bg-amber-400 w-8' : 'bg-white/25 w-4 hover:bg-white/50'}`}
              />
            ))}
          </div>

          {/* Active step title + desc */}
          <div className="mt-7 reveal reveal-up reveal-delay-300">
            <h3 className="text-xl font-extrabold text-amber-400">{step.title}</h3>
            <p className="mt-2 text-slate-400 leading-relaxed text-sm">{step.desc}</p>
            <a href="#contact" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors">
              Learn more <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          {/* Step buttons */}
          <div className="mt-8 flex flex-wrap gap-2 reveal reveal-up reveal-delay-400">
            {PLATFORM_STEPS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setActive(i)}
                className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-all duration-200 border ${
                  i === active
                    ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)]'
                    : 'border-white/15 text-slate-400 bg-white/5 hover:border-amber-400/50 hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: Phone Mockup */}
        <div className="flex justify-center reveal reveal-right">
          {/* EXAMPLE badge */}
          <div className="relative">
            <div className="absolute -top-3 right-0 z-10 bg-amber-400 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded">
              EXAMPLE
            </div>

            {/* Phone outer shell */}
            <div
              className="relative overflow-hidden shadow-2xl"
              style={{
                width: 240,
                height: 490,
                borderRadius: 36,
                background: 'linear-gradient(145deg, #1a2540, #0d1829)',
                border: '2px solid rgba(255,255,255,0.12)',
                boxShadow: '0 40px 80px -20px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.08)',
              }}
            >
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 w-20 h-5 bg-[#0d1829] rounded-b-2xl flex items-center justify-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                <div className="w-6 h-1.5 rounded-full bg-slate-700" />
              </div>

              {/* Screen area */}
              <div
                className="absolute overflow-hidden"
                style={{ top: 20, left: 4, right: 4, bottom: 4, borderRadius: 32, background: '#f8fafc' }}
              >
                {/* Animated screen content */}
                <div
                  key={active}
                  className="h-full w-full"
                  style={{ animation: 'fadeSlideIn 0.4s ease-out' }}
                >
                  {step.screen}
                </div>
              </div>

              {/* Home bar */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 rounded-full bg-white/25" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── About ─────────────────────────────────────────────────────────────────
function About({ content }: { content: SiteContent['about'] }) {
  const sectionBg = 'bg-transparent';

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
        <div id="whatsapp-cta" className="mt-10 flex justify-center">
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
  onReorder,
  onLogout,
  siteContent,
  onSaveSiteContent,
  onAdminPasswordChange,
}: {
  projects: Project[];
  onSave: (project: Project) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onReorder: (projects: Project[]) => Promise<void>;
  onLogout: () => void;
  siteContent: SiteContent;
  onSaveSiteContent: (content: SiteContent) => void;
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
  const [draggedProjectId, setDraggedProjectId] = useState<string | null>(null);
  const draggedProjectIdRef = useRef<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

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

    const readers = Array.from(files).map(readProjectImage);

    Promise.all(readers)
      .then((results) => setImages((current) => [...current, ...results]))
      .catch(() => setMessage('One or more images could not be processed. Please try again.'));
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || images.length === 0) {
      setMessage('Title, description, and at least one image are required.');
      return;
    }
    const project: Project = {
      id: editingProject?.id ?? generateToken(),
      orderIndex: editingProject?.orderIndex ?? projects.length,
      title: title.trim(),
      category,
      description: description.trim(),
      url: url.trim() || undefined,
      images,
      createdAt: editingProject?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await onSave(project);
      setEditingProject(null);
      setMessage(editingProject ? 'Project updated successfully.' : 'Project added successfully.');
    } catch (error) {
      console.error('Unable to save project to Supabase.', error);
      setMessage('Project could not be saved. Please try again.');
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    window.requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
  };

  const handleProjectDrop = (targetProjectId: string) => {
    const sourceProjectId = draggedProjectIdRef.current;
    if (!sourceProjectId || sourceProjectId === targetProjectId) return;

    const reorderedProjects = [...projects];
    const sourceIndex = reorderedProjects.findIndex((project) => project.id === sourceProjectId);
    const targetIndex = reorderedProjects.findIndex((project) => project.id === targetProjectId);
    if (sourceIndex < 0 || targetIndex < 0) return;

    const [draggedProject] = reorderedProjects.splice(sourceIndex, 1);
    reorderedProjects.splice(targetIndex, 0, draggedProject);
    const normalizedProjects = reorderedProjects.map((project, index) => ({
      ...project,
      orderIndex: index,
    }));

    draggedProjectIdRef.current = null;
    setDraggedProjectId(null);
    void onReorder(normalizedProjects).catch((error) => {
      console.error('Unable to save project order to Supabase.', error);
      setMessage('Project order could not be saved. Please try again.');
    });
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
            <form ref={formRef} onSubmit={handleSubmit} className="mt-6 space-y-6">
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
                projects.map((project, index) => (
                  <div
                    key={project.id}
                    draggable
                    onDragStart={(event) => {
                      draggedProjectIdRef.current = project.id;
                      event.dataTransfer.effectAllowed = 'move';
                      event.dataTransfer.setData('text/plain', project.id);
                      setDraggedProjectId(project.id);
                    }}
                    onDragEnd={() => {
                      setDraggedProjectId(null);
                    }}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                      event.preventDefault();
                      handleProjectDrop(project.id);
                    }}
                    className={`cursor-grab rounded-3xl border border-white/10 bg-slate-900 p-4 transition active:cursor-grabbing ${draggedProjectId === project.id ? 'opacity-50' : ''}`}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                      <div className="flex items-center gap-2 text-slate-500" title="Drag to reorder">
                        <GripVertical className="h-5 w-5 shrink-0" />
                        {index + 1}
                      </div>
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
                        onClick={() => {
                          void onDelete(project.id).catch((error) => {
                            console.error('Unable to delete project from Supabase.', error);
                            setMessage('Project could not be deleted. Please try again.');
                          });
                        }}
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

function Contact() {
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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.history.scrollRestoration = 'manual';
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  const [projects, setProjects] = useState<Project[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent>(() => loadSiteContent());
  const [adminPassword, setAdminPassword] = useState<string>(() => loadAdminPassword());
  const orderSaveVersionRef = useRef(0);

  useEffect(() => {
    let active = true;

    loadProjectsFromDatabase()
      .then(async (databaseProjects) => {
        if (!active) return;

        const localProjects = loadProjects();
        if (databaseProjects.length === 0 && localProjects.length > 0) {
          await Promise.all(localProjects.map(saveProjectToDatabase));
          if (active) {
            setProjects(localProjects);
            saveProjects([]);
          }
          return;
        }

        setProjects(databaseProjects);
        saveProjects([]);
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

  const handleSaveProject = async (project: Project) => {
    const withoutProject = projects.filter((item) => item.id !== project.id);
    const existingProject = projects.find((item) => item.id === project.id);
    const insertionIndex = existingProject
      ? Math.min(existingProject.orderIndex, withoutProject.length)
      : withoutProject.length;
    const nextProjects = [...withoutProject];
    nextProjects.splice(insertionIndex, 0, project);
    const orderTimestamp = Date.now();
    const orderedProjects = nextProjects.map((item, index) => ({
      ...item,
      orderIndex: index,
      updatedAt: item.id === project.id ? project.updatedAt : new Date(orderTimestamp - index).toISOString(),
    }));

    await Promise.all(orderedProjects.map(saveProjectToDatabase));
    setProjects(orderedProjects);
  };

  const handleReorderProjects = async (reorderedProjects: Project[]) => {
    const previousProjects = projects;
    const requestVersion = orderSaveVersionRef.current + 1;
    orderSaveVersionRef.current = requestVersion;
    setProjects(reorderedProjects);
    try {
      await saveProjectOrderToDatabase(reorderedProjects);
    } catch (error) {
      if (orderSaveVersionRef.current !== requestVersion) return;
      setProjects(previousProjects);
      throw error;
    }
  };

  const handleDeleteProject = async (id: string) => {
    const remainingProjects = projects
      .filter((item) => item.id !== id)
      .map((item, index) => ({
        ...item,
        orderIndex: index,
        updatedAt: new Date(Date.now() - index).toISOString(),
      }));
    await saveProjectOrderToDatabase(remainingProjects);
    await deleteProjectFromDatabase(id);
    setProjects(remainingProjects);
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
        onReorder={handleReorderProjects}
        onLogout={handleLogout}
        siteContent={siteContent}
        onSaveSiteContent={handleSaveSiteContent}
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
        <WhereIShowUp />
        <About content={siteContent.about} />
        <Services />
        <Work projects={projects} />
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
