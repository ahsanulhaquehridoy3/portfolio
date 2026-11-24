import React, { useEffect, useRef, useState } from 'react';
import { Search, MapPin, Phone, ArrowRight } from 'lucide-react';

interface StepData {
  id: number;
  label: string;
  title: string;
  desc: string;
  targetShift: number; // in pixels down the SERP
}

const STEPS: StepData[] = [
  {
    id: 1,
    label: 'Local Service Ads',
    title: 'Local Service Ads',
    desc: 'The very top of the page. You pay per lead, not per click.',
    targetShift: 0,
  },
  {
    id: 2,
    label: 'Google Ads',
    title: 'Google Ads',
    desc: 'Show up the moment someone searches for your services, in the towns and hours you choose.',
    targetShift: 90,
  },
  {
    id: 3,
    label: 'Google Maps',
    title: 'Google Business Profile & Maps',
    desc: 'Free to appear in. Reviews, photos, and accurate details decide who gets shown.',
    targetShift: 215,
  },
  {
    id: 4,
    label: 'Google SEO',
    title: 'Google Search (SEO)',
    desc: 'Rankings build over time and can keep bringing in leads without paying per click.',
    targetShift: 410,
  },
  {
    id: 5,
    label: 'Your Website',
    title: 'Your Website',
    desc: 'Every click above lands here. A fast, clear site turns more of those visits into calls.',
    targetShift: 470,
  },
];

const N = STEPS.length;

function smooth(a: number, b: number, v: number) {
  const t = Math.max(0, Math.min(1, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

// Calculate continuous SERP shift based on fractional step f (0 to N)
function shiftAt(f: number): number {
  const pts: [number, number][] = [[0, 0]];
  for (let k = 1; k < N; k++) {
    pts.push([k - 0.5, STEPS[k - 1].targetShift]);
  }
  pts.push([N - 1, STEPS[N - 1].targetShift]);

  for (let i = 0; i < pts.length - 1; i++) {
    if (f <= pts[i + 1][0]) {
      const t = smooth(pts[i][0], pts[i + 1][0], f);
      return pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t;
    }
  }
  return pts[pts.length - 1][1];
}

export function PlatformsSection() {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepFraction, setStepFraction] = useState(0); // 0 to 1 progress within active step
  const [tapPosition, setTapPosition] = useState<{ x: number; y: number } | null>(null);
  const [isTapActive, setIsTapActive] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const serpRef = useRef<HTMLDivElement>(null);
  const block1Ref = useRef<HTMLDivElement>(null);
  const block2Ref = useRef<HTMLDivElement>(null);
  const block3Ref = useRef<HTMLDivElement>(null);
  const block4Ref = useRef<HTMLDivElement>(null);
  const callBtnRef = useRef<HTMLDivElement>(null);

  const shownShiftRef = useRef(0);
  const targetShiftRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const tapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Inertial continuous SERP scrubbing matching home-motion.js (0.14 lerp factor)
  useEffect(() => {
    let active = true;

    const scrub = () => {
      if (!active) return;
      const diff = targetShiftRef.current - shownShiftRef.current;
      shownShiftRef.current += diff * 0.14;

      if (Math.abs(diff) < 0.2) {
        shownShiftRef.current = targetShiftRef.current;
      }

      if (serpRef.current) {
        serpRef.current.style.transform = `translateY(-${shownShiftRef.current.toFixed(1)}px)`;
      }

      rafRef.current = requestAnimationFrame(scrub);
    };

    rafRef.current = requestAnimationFrame(scrub);

    return () => {
      active = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Trigger finger tap ripple matching ironleadagency tapOn()
  const triggerTap = (element: HTMLElement | null, offsetY = 0) => {
    if (!element) return;
    if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);
    setIsTapActive(false);

    tapTimeoutRef.current = setTimeout(() => {
      const box = element.getBoundingClientRect();
      const parent = element.closest('.phone-screen-container')?.getBoundingClientRect();
      if (!parent) return;

      setTapPosition({
        x: box.left - parent.left + box.width * 0.68,
        y: box.top - parent.top + Math.min(box.height / 2, 38) + offsetY,
      });
      setIsTapActive(true);
    }, 450);
  };

  // Scroll story handler
  useEffect(() => {
    let lastStep = 1;

    const onScroll = () => {
      const track = trackRef.current;
      if (!track) return;

      const r = track.getBoundingClientRect();
      const travel = r.height - window.innerHeight;
      if (travel <= 0) return;

      // Fraction from 0 to 4.9999
      const progress = Math.max(0, Math.min(0.9999, -r.top / travel));
      const f = progress * N;
      const step = Math.min(N, Math.floor(f) + 1);
      const frac = f - (step - 1);

      setCurrentStep(step);
      setStepFraction(frac);

      // Smooth scrub target
      targetShiftRef.current = shiftAt(f);

      // Trigger tap when entering new step
      if (step !== lastStep) {
        lastStep = step;
        if (step === 1) triggerTap(block1Ref.current);
        else if (step === 2) triggerTap(block2Ref.current);
        else if (step === 3) triggerTap(block3Ref.current);
        else if (step === 4) triggerTap(block4Ref.current);
        else if (step === 5) triggerTap(callBtnRef.current, -10);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Jump to step on bar or pill click
  const scrollToStep = (stepIndex: number) => {
    const track = trackRef.current;
    if (!track) return;
    const top = track.getBoundingClientRect().top + window.scrollY;
    const travel = track.offsetHeight - window.innerHeight;
    const targetY = top + (travel * (stepIndex - 0.75)) / N;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  const isSiteActive = currentStep === 5;

  return (
    <section
      id="platforms"
      className="relative select-none"
      style={{
        background:
          'radial-gradient(ellipse 60% 70% at 72% 50%, rgba(31, 69, 115, 0.45), transparent 70%), linear-gradient(180deg, #0b1626, #102238 50%, #0b1626)',
        boxShadow: 'inset 0 40px 60px -40px rgba(0,0,0,0.5), inset 0 -40px 60px -40px rgba(0,0,0,0.5)',
      }}
    >
      {/* ── Scroll Track (460vh matching ironleadagency .plat-track) ── */}
      <div ref={trackRef} className="relative" style={{ height: '460vh' }}>
        {/* Sticky viewport container (100vh) */}
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          {/* Ambient Glows */}
          <div className="pointer-events-none absolute right-1/4 top-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-amber-400/[0.05] blur-3xl" />
          <div className="pointer-events-none absolute left-1/4 top-1/3 w-[500px] h-[500px] rounded-full bg-blue-600/[0.06] blur-3xl" />

          <div className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-14 items-center">
              {/* ── LEFT: Copy & Stacked Card Story ──────────────── */}
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
                  Where We Show Up For You
                </div>
                <h2 className="mt-2.5 font-display text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-white leading-[1.15]">
                  The platforms your competitors are already using
                </h2>
                <p className="mt-3.5 text-base sm:text-lg text-slate-300/80 leading-relaxed max-w-lg mb-6">
                  Customers can find you in four places on Google's first page, and all of them lead to your website. Every spot you're missing goes to a competitor.
                </p>

                {/* 5-Step Progress Indicators */}
                <div className="flex gap-2 mb-6 max-w-md items-center" aria-hidden="true">
                  {STEPS.map((s, idx) => {
                    const isDone = s.id < currentStep;
                    const isActive = s.id === currentStep;
                    const scale = isDone ? 1 : isActive ? stepFraction : 0;

                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => scrollToStep(s.id)}
                        aria-label={`Jump to ${s.label}`}
                        className="flex-1 py-2 cursor-pointer group focus:outline-none"
                      >
                        <div className="h-[4px] rounded-[2px] bg-white/20 overflow-hidden relative transition-colors group-hover:bg-white/35">
                          <div
                            className="absolute inset-0 bg-[#FFD84D] origin-left"
                            style={{
                              transform: `scaleX(${scale})`,
                              transition: isActive ? 'none' : 'transform 0.25s cubic-bezier(0.22, 0.8, 0.2, 1)',
                            }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Stacked Step Cards with 3D Slide Transition */}
                <div className="relative h-[210px] sm:h-[190px] overflow-hidden">
                  {STEPS.map((step) => {
                    const isPast = step.id < currentStep;
                    const isActive = step.id === currentStep;

                    return (
                      <div
                        key={step.id}
                        className={`absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.22,0.8,0.2,1)] ${
                          isActive
                            ? 'opacity-100 pointer-events-auto'
                            : 'opacity-0 pointer-events-none'
                        }`}
                      >
                        {/* Title slides up / out */}
                        <div className="overflow-hidden pb-1">
                          <h3
                            className="font-display text-2xl sm:text-3xl lg:text-[38px] font-extrabold text-white tracking-tight leading-tight transition-transform duration-700 ease-[cubic-bezier(0.22,0.8,0.2,1)]"
                            style={{
                              transform: isActive
                                ? 'translateY(0)'
                                : isPast
                                ? 'translateY(-110%)'
                                : 'translateY(110%)',
                            }}
                          >
                            {step.title}
                          </h3>
                        </div>

                        {/* Description & Link fade and rise */}
                        <div
                          className="transition-all duration-500 ease-out"
                          style={{
                            opacity: isActive ? 1 : 0,
                            transform: isActive ? 'translateY(0)' : 'translateY(16px)',
                            transitionDelay: isActive ? '180ms' : '0ms',
                          }}
                        >
                          <p className="mt-2.5 text-base sm:text-lg text-slate-300 leading-relaxed max-w-lg">
                            {step.desc}
                          </p>
                          <div className="mt-4">
                            <a
                              href="#contact"
                              className="inline-flex items-center gap-1.5 text-sm sm:text-base font-bold text-[#FFD84D] hover:text-amber-300 transition-transform duration-200 hover:translate-x-1"
                            >
                              Learn more <ArrowRight className="h-4 w-4" />
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Pill Switcher (as in user screenshot) */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {STEPS.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => scrollToStep(s.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border cursor-pointer ${
                        s.id === currentStep
                          ? 'bg-[#FFD84D] text-slate-950 border-[#FFD84D] shadow-[0_0_15px_rgba(255,216,77,0.38)] font-bold'
                          : 'border-white/10 text-slate-400 bg-white/5 hover:border-amber-400/40 hover:text-white'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── RIGHT: iPhone Mockup with Continuous SERP & Tap ── */}
              <div className="flex justify-center items-center py-2">
                <div className="relative">
                  {/* Gold ambient radial background */}
                  <div
                    className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] aspect-square rounded-full"
                    style={{
                      background:
                        'radial-gradient(closest-side, rgba(255,216,77,0.20), rgba(255,216,77,0.05) 55%, transparent)',
                    }}
                  />

                  {/* Phone Outer Shell */}
                  <div
                    className="relative select-none overflow-hidden"
                    style={{
                      width: 305,
                      height: 615,
                      padding: 10,
                      background: '#050b15',
                      borderRadius: 48,
                      boxShadow:
                        '0 0 0 1.5px rgba(255,255,255,0.14), 0 40px 90px rgba(0,0,0,0.7), 0 0 50px rgba(255,216,77,0.14)',
                    }}
                  >
                    {/* Dynamic Island / Notch */}
                    <div className="absolute z-30 left-1/2 -translate-x-1/2 top-[18px] w-[88px] h-[24px] bg-[#050b15] rounded-[14px]" />

                    {/* EXAMPLE Tag */}
                    <div className="absolute z-30 right-[22px] top-[22px] px-[7px] py-[3px] rounded-[6px] text-[8.5px] font-extrabold tracking-[1.2px] uppercase bg-white border border-amber-400/80 text-amber-700 shadow-sm">
                      EXAMPLE
                    </div>

                    {/* Inner Screen Container */}
                    <div className="phone-screen-container relative h-full overflow-hidden rounded-[38px] bg-white text-slate-900 font-sans text-[11.5px] leading-[1.35]">
                      {/* Finger Tap Ripple Effect (.ph-tap) */}
                      {tapPosition && (
                        <div
                          className={`pointer-events-none absolute z-40 w-10 h-10 rounded-full border-2 border-slate-700/40 bg-slate-700/20 -translate-x-1/2 -translate-y-1/2 ${
                            isTapActive ? 'animate-tap-ripple' : 'opacity-0'
                          }`}
                          style={{ left: tapPosition.x, top: tapPosition.y }}
                        />
                      )}

                      {/* ── CONTINUOUS SERP LAYER ────────────────────── */}
                      <div
                        ref={serpRef}
                        className="pt-[56px] px-[12px] pb-[20px] transition-opacity duration-500 will-change-transform"
                        style={{
                          opacity: isSiteActive ? 0.28 : 1,
                        }}
                      >
                        {/* Google Search Bar */}
                        <div className="flex items-center gap-2 px-3 py-2 rounded-full border border-slate-200 bg-white shadow-[0_2px_8px_rgba(30,34,60,0.08)]">
                          <span className="text-[#4285f4] font-bold text-sm">G</span>
                          <span className="flex-1 text-slate-800 text-[11px] font-medium">plumber near me</span>
                          <Search className="h-3.5 w-3.5 text-[#4285f4]" />
                        </div>

                        {/* Search Tabs */}
                        <div className="flex gap-3.5 px-1.5 pt-2.5 pb-1 text-[10.5px] text-slate-400 border-b border-slate-200">
                          <span className="text-[#1a73e8] font-bold border-b-2 border-[#1a73e8] pb-1">All</span>
                          <span>Maps</span>
                          <span>Images</span>
                          <span>News</span>
                        </div>

                        {/* Block 1: Local Service Ads */}
                        <div
                          ref={block1Ref}
                          onClick={() => scrollToStep(1)}
                          className={`mt-2.5 p-2 rounded-[14px] cursor-pointer transition-all duration-400 border-[1.5px] ${
                            currentStep === 1
                              ? 'border-[#FFD84D] bg-[#FFD84D]/[0.08] shadow-[0_8px_24px_rgba(255,216,77,0.28)] opacity-100 scale-[1.01]'
                              : 'border-transparent opacity-35 hover:opacity-70'
                          }`}
                        >
                          <div className="text-[9.5px] font-bold text-slate-500 mb-1.5">Sponsored · Local services</div>
                          <div className="grid gap-1.5">
                            {[
                              { initials: 'RP', name: 'Reliable Plumbing', rating: '4.9 (212)', bg: '#163455' },
                              { initials: 'AF', name: 'Ace Flow Services', rating: '4.8 (97)', bg: '#2f7d5b' },
                            ].map((biz) => (
                              <div key={biz.name} className="flex gap-2 items-center p-2 border border-slate-200 rounded-[10px] bg-white shadow-xs">
                                <div
                                  className="w-[30px] h-[30px] rounded-full grid place-items-center text-[10px] font-extrabold text-white shrink-0"
                                  style={{ background: biz.bg }}
                                >
                                  {biz.initials}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <b className="block text-[11px] text-slate-900 leading-tight">{biz.name}</b>
                                  <em className="block not-italic text-[9.5px] text-amber-700 font-semibold">★★★★★ {biz.rating}</em>
                                  <span className="inline-block text-[9px] font-bold text-[#188038]">✔ Google Guaranteed</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Block 2: Google Ads */}
                        <div
                          ref={block2Ref}
                          onClick={() => scrollToStep(2)}
                          className={`mt-2 p-2.5 rounded-[14px] cursor-pointer transition-all duration-400 border-[1.5px] ${
                            currentStep === 2
                              ? 'border-[#FFD84D] bg-[#FFD84D]/[0.08] shadow-[0_8px_24px_rgba(255,216,77,0.28)] opacity-100 scale-[1.01]'
                              : 'border-transparent opacity-35 hover:opacity-70'
                          }`}
                        >
                          <div className="text-[9.5px] font-bold text-slate-500 mb-0.5">Sponsored</div>
                          <div className="text-[9.5px] text-slate-500">reliableplumbing.com</div>
                          <div className="text-[12.5px] text-[#1a0dab] font-semibold my-0.5 leading-snug">
                            Same-Day Plumbing Repair | Call Now
                          </div>
                          <div className="h-1.5 rounded bg-slate-200 mt-1 w-full" />
                          <div className="h-1.5 rounded bg-slate-200 mt-1 w-[62%]" />
                        </div>

                        {/* Block 3: Google Maps */}
                        <div
                          ref={block3Ref}
                          onClick={() => scrollToStep(3)}
                          className={`mt-2 p-2.5 rounded-[14px] cursor-pointer transition-all duration-400 border-[1.5px] ${
                            currentStep === 3
                              ? 'border-[#FFD84D] bg-[#FFD84D]/[0.08] shadow-[0_8px_24px_rgba(255,216,77,0.28)] opacity-100 scale-[1.01]'
                              : 'border-transparent opacity-35 hover:opacity-70'
                          }`}
                        >
                          <div
                            className="relative h-[90px] rounded-[10px] mb-2 overflow-hidden border border-slate-200"
                            style={{
                              background:
                                'linear-gradient(115deg,transparent 46%,#fff 46% 50%,transparent 50%),linear-gradient(25deg,transparent 58%,#fff 58% 61%,transparent 61%),linear-gradient(#dfeedd,#e8f0e4)',
                            }}
                          >
                            {[{ l: '24%', t: '34%' }, { l: '58%', t: '54%' }, { l: '76%', t: '26%' }].map((p, i) => (
                              <div key={i} className="absolute -translate-x-1/2 -translate-y-full drop-shadow" style={{ left: p.l, top: p.t }}>
                                <MapPin className="h-5 w-5 fill-[#ea4335] text-white" />
                              </div>
                            ))}
                          </div>
                          {[
                            { name: 'Reliable Plumbing', info: '★ 4.9 · Open 24 hours' },
                            { name: 'Ace Flow Services', info: '★ 4.8 · Open now' },
                          ].map((biz) => (
                            <div key={biz.name} className="py-1 border-t border-slate-200">
                              <b className="block text-[11px] text-slate-900 leading-tight">{biz.name}</b>
                              <em className="block not-italic text-[9.5px] text-amber-700 font-semibold">{biz.info}</em>
                            </div>
                          ))}
                        </div>

                        {/* People Also Ask */}
                        <div className="mt-2.5 p-2 rounded-[14px] bg-slate-50 border border-slate-100 opacity-40 text-[10.5px]">
                          <div className="font-bold text-slate-500 mb-1">People also ask</div>
                          {['How much does a plumber cost?', 'Is there a 24 hour plumber near me?'].map((q) => (
                            <div key={q} className="flex justify-between py-1 border-t border-slate-200">
                              <span>{q}</span><span>⌄</span>
                            </div>
                          ))}
                        </div>

                        {/* Block 4: SEO */}
                        <div
                          ref={block4Ref}
                          onClick={() => scrollToStep(4)}
                          className={`mt-2 p-2.5 rounded-[14px] cursor-pointer transition-all duration-400 border-[1.5px] ${
                            currentStep === 4
                              ? 'border-[#FFD84D] bg-[#FFD84D]/[0.08] shadow-[0_8px_24px_rgba(255,216,77,0.28)] opacity-100 scale-[1.01]'
                              : 'border-transparent opacity-35 hover:opacity-70'
                          }`}
                        >
                          <div className="text-[9.5px] text-slate-500">reliableplumbing.com › plumber</div>
                          <div className="text-[12.5px] text-[#1a0dab] font-semibold my-0.5 leading-snug">
                            Plumber Near You, Licensed & Insured
                          </div>
                          <div className="h-1.5 rounded bg-slate-200 mt-1 w-full" />
                          <div className="h-1.5 rounded bg-slate-200 mt-1 w-[62%]" />
                          <div className="text-[9.5px] text-slate-400 mt-2.5">yelp.com › plumbers</div>
                          <div className="text-[12px] text-[#5a5fb0] font-semibold my-0.5">Top 10 Best Plumbers Near You</div>
                          <div className="h-1.5 rounded bg-slate-200 mt-1 w-full" />
                        </div>
                      </div>

                      {/* ── STEP 5: WEBSITE LAYER (Slides in smoothly) ── */}
                      <div
                        className="absolute inset-0 bg-[#f8fafc] will-change-transform"
                        style={{
                          transform: isSiteActive ? 'translateX(0%)' : 'translateX(100%)',
                          transition: 'transform 0.75s cubic-bezier(0.22, 0.8, 0.2, 1)',
                        }}
                      >
                        {/* Header */}
                        <div className="flex items-center gap-2 pt-[52px] px-3.5 pb-2.5 bg-white border-b border-slate-200 text-[11.5px]">
                          <div className="w-[22px] h-[22px] rounded-[6px] bg-[#163455] text-white font-extrabold text-[8.5px] grid place-items-center">
                            RP
                          </div>
                          <b className="text-slate-900 font-bold text-[11px]">Reliable Plumbing</b>
                          <span className="ml-auto text-slate-500 font-bold">☰</span>
                        </div>

                        {/* Hero Card */}
                        <div
                          className="m-3 p-4 rounded-[16px] text-white"
                          style={{ background: 'linear-gradient(140deg, #163455, #254d79)' }}
                        >
                          <div className="text-[9px] font-bold tracking-[0.8px] uppercase text-[#FFD84D]">
                            Licensed · Same-day service
                          </div>
                          <div className="text-[18px] font-extrabold leading-[1.15] tracking-tight my-2">
                            Plumbing fixed today, done right.
                          </div>
                          <div
                            ref={callBtnRef}
                            className="relative text-center py-2 px-3 rounded-[10px] font-extrabold text-[11.5px] bg-[#FFD84D] text-slate-950 flex items-center justify-center gap-1.5 shadow-md"
                            style={{
                              animation: isSiteActive ? 'phCallPulse 1.8s ease-out 0.8s infinite' : 'none',
                            }}
                          >
                            <Phone className="h-3 w-3 fill-slate-950" /> Call now
                          </div>
                          <div className="mt-2 text-center py-2 px-3 rounded-[10px] font-semibold text-[11px] border border-white/35 text-white">
                            Get a free quote
                          </div>
                        </div>

                        {/* Trust row */}
                        <div className="flex justify-around mx-3 my-2 py-2 px-2 bg-white rounded-[12px] border border-slate-200 text-[9.5px] font-bold text-[#163455] shadow-xs">
                          <span>★ 4.9 rating</span>
                          <span>24/7</span>
                          <span>Insured</span>
                        </div>

                        {/* Services list */}
                        <div className="mx-3 bg-white border border-slate-200 rounded-[12px] overflow-hidden shadow-xs">
                          {['Leak repair', 'Water heaters', 'Drain cleaning'].map((svc, i, arr) => (
                            <div
                              key={svc}
                              className={`flex justify-between py-2 px-3 text-[11px] font-semibold ${
                                i < arr.length - 1 ? 'border-b border-slate-100' : ''
                              }`}
                            >
                              <span>{svc}</span>
                              <span className="text-slate-400">›</span>
                            </div>
                          ))}
                        </div>

                        {/* Toast Notification */}
                        <div
                          className="absolute left-3 right-3 bottom-4 flex items-center gap-2.5 p-2.5 rounded-[14px] bg-white shadow-[0_10px_30px_rgba(22,52,85,0.22)] border border-slate-100"
                          style={{
                            transform: isSiteActive ? 'translateY(0)' : 'translateY(35px)',
                            opacity: isSiteActive ? 1 : 0,
                            transition: 'transform 0.6s cubic-bezier(0.22, 0.8, 0.2, 1), opacity 0.5s ease',
                            transitionDelay: isSiteActive ? '0.9s' : '0s',
                          }}
                        >
                          <div className="w-7 h-7 rounded-full grid place-items-center bg-amber-400/20 text-amber-700 shrink-0">
                            <Phone className="h-3.5 w-3.5 fill-amber-600 text-amber-600" />
                          </div>
                          <div>
                            <b className="block text-[11px] text-slate-900 leading-tight">New call</b>
                            <em className="block not-italic text-[9.5px] text-slate-500">Found you on Google</em>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Keyframe styles for tap ripple and pulse ── */}
      <style>{`
        @keyframes tapRipple {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
          25% { opacity: 1; transform: translate(-50%, -50%) scale(0.85); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1.6); }
        }
        .animate-tap-ripple {
          animation: tapRipple 0.85s ease-out forwards;
        }
        @keyframes phCallPulse {
          0% { box-shadow: 0 0 0 0 rgba(255, 216, 77, 0.6); }
          100% { box-shadow: 0 0 0 12px rgba(255, 216, 77, 0); }
        }
      `}</style>
    </section>
  );
}
