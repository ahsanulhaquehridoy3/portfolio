import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Phone, ArrowRight } from 'lucide-react';

interface StepData {
  id: number;
  label: string;
  title: string;
  desc: string;
  shift: number;
}

const STEPS: StepData[] = [
  {
    id: 1,
    label: 'Local Service Ads',
    title: 'Local Service Ads',
    desc: 'The very top of the page. You pay per lead, not per click.',
    shift: 0,
  },
  {
    id: 2,
    label: 'Google Ads',
    title: 'Google Ads',
    desc: 'Show up the moment someone searches for your services, in the towns and hours you choose.',
    shift: 92,
  },
  {
    id: 3,
    label: 'Google Business Profile & Maps',
    title: 'Google Business Profile & Maps',
    desc: 'Free to appear in. Reviews, photos, and accurate details decide who gets shown.',
    shift: 216,
  },
  {
    id: 4,
    label: 'Google Search (SEO)',
    title: 'Google Search (SEO)',
    desc: 'Rankings build over time and can keep bringing in leads without paying per click.',
    shift: 412,
  },
  {
    id: 5,
    label: 'Your Website',
    title: 'Your Website',
    desc: 'Every click above lands here. A fast, clear site turns more of those visits into calls.',
    shift: 470,
  },
];

export function PlatformsSection() {
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const progressIntervalRef = useRef<number | null>(null);

  const STEP_DURATION = 3500; // ms per step
  const UPDATE_INTERVAL = 50; // ms update rate

  useEffect(() => {
    if (isHovered) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    const stepInc = (UPDATE_INTERVAL / STEP_DURATION) * 100;

    progressIntervalRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentStep((s) => (s % STEPS.length) + 1);
          return 0;
        }
        return prev + stepInc;
      });
    }, UPDATE_INTERVAL);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [currentStep, isHovered]);

  const handleStepClick = (stepId: number) => {
    setCurrentStep(stepId);
    setProgress(0);
  };

  const activeData = STEPS[currentStep - 1];
  const isSiteActive = currentStep === 5;

  return (
    <section
      id="platforms"
      className="relative isolate overflow-hidden py-20 md:py-28"
      style={{
        background: 'linear-gradient(180deg, #0d1829 0%, #070e1a 100%)',
      }}
    >
      {/* Background ambient lighting */}
      <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-amber-400/[0.04] blur-3xl pointer-events-none" />
      <div className="absolute right-1/4 top-1/3 w-[500px] h-[500px] rounded-full bg-brand-600/[0.07] blur-3xl pointer-events-none" />

      <div
        className="relative z-10 mx-auto max-w-6xl px-5"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
          {/* LEFT: Text & Step Controllers */}
          <div className="reveal reveal-left">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
              Where We Show Up For You
            </div>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-white leading-[1.15]">
              The platforms your competitors are already using
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl">
              Customers can find you in four places on Google's first page, and all of them lead to your website. Every spot you're missing goes to a competitor.
            </p>

            {/* 5 Step Progress Bars */}
            <div className="mt-8 flex items-center gap-2 max-w-md">
              {STEPS.map((s) => {
                const isDone = s.id < currentStep;
                const isActive = s.id === currentStep;
                const fillWidth = isDone ? '100%' : isActive ? `${progress}%` : '0%';

                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleStepClick(s.id)}
                    aria-label={s.label}
                    className="flex-1 py-3 group cursor-pointer focus:outline-none"
                  >
                    <div className="h-1 sm:h-1.5 w-full rounded-full bg-white/15 overflow-hidden transition-colors group-hover:bg-white/30">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-75 ease-linear"
                        style={{ width: fillWidth }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Animated Active Step Card */}
            <div className="mt-7 min-h-[170px]">
              <div
                key={activeData.id}
                className="animate-in fade-in slide-in-from-bottom-3 duration-500"
              >
                <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                  {activeData.title}
                </h3>
                <p className="mt-3 text-base sm:text-lg text-slate-300 leading-relaxed max-w-lg">
                  {activeData.desc}
                </p>
                <div className="mt-5">
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-amber-400 hover:text-amber-300 transition-all duration-200 hover:translate-x-1"
                  >
                    Learn more <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Step Selection Buttons for Quick Switch */}
            <div className="mt-4 flex flex-wrap gap-2">
              {STEPS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleStepClick(s.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border ${
                    s.id === currentStep
                      ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.35)]'
                      : 'border-white/10 text-slate-400 bg-white/5 hover:border-amber-400/40 hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Phone Mockup (Exact ironleadagency styling & motion) */}
          <div className="reveal reveal-right flex justify-center items-center py-4">
            <div className="relative">
              {/* Gold ambient aura behind phone */}
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] aspect-square rounded-full pointer-events-none"
                style={{
                  background:
                    'radial-gradient(closest-side, rgba(255,216,77,0.22), rgba(255,216,77,0.06) 55%, transparent)',
                }}
              />

              {/* Phone Container */}
              <div
                className="relative select-none overflow-hidden"
                style={{
                  width: 300,
                  height: 610,
                  padding: 10,
                  background: '#050b15',
                  borderRadius: 46,
                  boxShadow:
                    '0 0 0 1.5px rgba(255,255,255,0.14), 0 40px 90px rgba(0,0,0,0.65), 0 0 60px rgba(255,216,77,0.15)',
                }}
              >
                {/* Phone Notch */}
                <div
                  className="absolute z-30 left-1/2 -translate-x-1/2 top-[18px] w-[88px] h-[24px] bg-[#050b15] rounded-[14px]"
                />

                {/* EXAMPLE Badge */}
                <div
                  className="absolute z-30 right-[22px] top-[22px] px-[7px] py-[3px] rounded-[6px] text-[8.5px] font-extrabold tracking-[1.2px] uppercase bg-white border border-amber-400/80 text-amber-700 shadow-sm"
                >
                  EXAMPLE
                </div>

                {/* Phone Screen Area */}
                <div
                  className="relative h-full overflow-hidden rounded-[37px] bg-white text-slate-900 font-sans text-[11.5px] leading-[1.35]"
                >
                  {/* GOOGLE SEARCH RESULTS (SERP) LAYER */}
                  <div
                    className="pt-[54px] px-[12px] pb-[16px] transition-all duration-700 ease-[cubic-bezier(0.22,0.8,0.2,1)]"
                    style={{
                      transform: isSiteActive
                        ? 'translateY(-440px) translateX(-30%)'
                        : `translateY(-${activeData.shift}px)`,
                      opacity: isSiteActive ? 0.35 : 1,
                    }}
                  >
                    {/* Google Search Bar */}
                    <div className="flex items-center gap-2 px-3 py-2 rounded-full border border-slate-200 bg-white shadow-[0_2px_8px_rgba(30,34,60,0.08)]">
                      <span className="text-[#4285f4] font-bold text-sm">G</span>
                      <span className="flex-1 text-slate-800 text-[11px] font-medium">
                        plumber near me
                      </span>
                      <Search className="h-3.5 w-3.5 text-[#4285f4]" />
                    </div>

                    {/* Google Tabs */}
                    <div className="flex gap-3.5 px-1.5 pt-2.5 pb-1 text-[10.5px] text-slate-400 border-b border-slate-200">
                      <span className="text-[#1a73e8] font-bold border-b-2 border-[#1a73e8] pb-1">
                        All
                      </span>
                      <span>Maps</span>
                      <span>Images</span>
                      <span>News</span>
                    </div>

                    {/* BLOCK 1: Local Service Ads (data-layer 1) */}
                    <div
                      onClick={() => handleStepClick(1)}
                      className={`mt-2.5 p-2 rounded-[14px] cursor-pointer transition-all duration-500 border-[1.5px] ${
                        currentStep === 1
                          ? 'border-amber-400 bg-amber-400/[0.08] shadow-[0_8px_24px_rgba(255,216,77,0.28)] opacity-100 scale-[1.01]'
                          : 'border-transparent opacity-35 hover:opacity-70'
                      }`}
                    >
                      <div className="text-[9.5px] font-bold text-slate-500 mb-1.5">
                        Sponsored · Local services
                      </div>
                      <div className="grid gap-1.5">
                        {/* Reliable Plumbing */}
                        <div className="flex gap-2 items-center p-2 border border-slate-200 rounded-[10px] bg-white shadow-xs">
                          <div className="w-[30px] h-[30px] rounded-full grid place-items-center text-[10px] font-extrabold text-white bg-[#163455] shrink-0">
                            RP
                          </div>
                          <div className="flex-1 min-w-0">
                            <b className="block text-[11px] text-slate-900 leading-tight">
                              Reliable Plumbing
                            </b>
                            <em className="block not-italic text-[9.5px] text-amber-700 font-semibold">
                              ★★★★★ 4.9 (212)
                            </em>
                            <span className="inline-block text-[9px] font-bold text-[#188038]">
                              ✔ Google Guaranteed
                            </span>
                          </div>
                        </div>

                        {/* Ace Flow Services */}
                        <div className="flex gap-2 items-center p-2 border border-slate-200 rounded-[10px] bg-white shadow-xs">
                          <div className="w-[30px] h-[30px] rounded-full grid place-items-center text-[10px] font-extrabold text-white bg-[#2f7d5b] shrink-0">
                            AF
                          </div>
                          <div className="flex-1 min-w-0">
                            <b className="block text-[11px] text-slate-900 leading-tight">
                              Ace Flow Services
                            </b>
                            <em className="block not-italic text-[9.5px] text-amber-700 font-semibold">
                              ★★★★★ 4.8 (97)
                            </em>
                            <span className="inline-block text-[9px] font-bold text-[#188038]">
                              ✔ Google Guaranteed
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* BLOCK 2: Google Ads (data-layer 2) */}
                    <div
                      onClick={() => handleStepClick(2)}
                      className={`mt-2 p-2.5 rounded-[14px] cursor-pointer transition-all duration-500 border-[1.5px] ${
                        currentStep === 2
                          ? 'border-amber-400 bg-amber-400/[0.08] shadow-[0_8px_24px_rgba(255,216,77,0.28)] opacity-100 scale-[1.01]'
                          : 'border-transparent opacity-35 hover:opacity-70'
                      }`}
                    >
                      <div className="text-[9.5px] font-bold text-slate-500 mb-0.5">
                        Sponsored
                      </div>
                      <div className="text-[9.5px] text-slate-500">
                        reliableplumbing.com
                      </div>
                      <div className="text-[12.5px] text-[#1a0dab] font-semibold my-0.5 leading-snug">
                        Same-Day Plumbing Repair | Call Now
                      </div>
                      <div className="h-1.5 rounded bg-slate-200 mt-1 w-full" />
                      <div className="h-1.5 rounded bg-slate-200 mt-1 w-[62%]" />
                    </div>

                    {/* BLOCK 3: Google Maps & Place Listings (data-layer 3) */}
                    <div
                      onClick={() => handleStepClick(3)}
                      className={`mt-2 p-2.5 rounded-[14px] cursor-pointer transition-all duration-500 border-[1.5px] ${
                        currentStep === 3
                          ? 'border-amber-400 bg-amber-400/[0.08] shadow-[0_8px_24px_rgba(255,216,77,0.28)] opacity-100 scale-[1.01]'
                          : 'border-transparent opacity-35 hover:opacity-70'
                      }`}
                    >
                      {/* Interactive stylized map with 3 pins */}
                      <div
                        className="relative h-[92px] rounded-[10px] mb-2 overflow-hidden border border-slate-200"
                        style={{
                          background:
                            'linear-gradient(115deg, transparent 46%, #ffffff 46% 50%, transparent 50%), linear-gradient(25deg, transparent 58%, #ffffff 58% 61%, transparent 61%), linear-gradient(#dfeedd, #e8f0e4)',
                        }}
                      >
                        {/* Map Pins */}
                        <div
                          className="absolute -translate-x-1/2 -translate-y-full drop-shadow"
                          style={{ left: '24%', top: '34%' }}
                        >
                          <MapPin className="h-5 w-5 fill-[#ea4335] text-white" />
                        </div>
                        <div
                          className="absolute -translate-x-1/2 -translate-y-full drop-shadow"
                          style={{ left: '58%', top: '54%' }}
                        >
                          <MapPin className="h-5 w-5 fill-[#ea4335] text-white" />
                        </div>
                        <div
                          className="absolute -translate-x-1/2 -translate-y-full drop-shadow"
                          style={{ left: '76%', top: '26%' }}
                        >
                          <MapPin className="h-5 w-5 fill-[#ea4335] text-white" />
                        </div>
                      </div>

                      {/* Place Listings */}
                      <div className="py-1 border-t border-slate-200">
                        <b className="block text-[11px] text-slate-900 leading-tight">
                          Reliable Plumbing
                        </b>
                        <em className="block not-italic text-[9.5px] text-amber-700 font-semibold">
                          ★ 4.9 · Open 24 hours
                        </em>
                      </div>
                      <div className="py-1 border-t border-slate-200">
                        <b className="block text-[11px] text-slate-900 leading-tight">
                          Ace Flow Services
                        </b>
                        <em className="block not-italic text-[9.5px] text-amber-700 font-semibold">
                          ★ 4.8 · Open now
                        </em>
                      </div>
                    </div>

                    {/* People Also Ask */}
                    <div className="mt-2.5 p-2 rounded-[14px] bg-slate-50 border border-slate-100 opacity-40 text-[10.5px]">
                      <div className="font-bold text-slate-500 mb-1">
                        People also ask
                      </div>
                      <div className="flex justify-between py-1 border-t border-slate-200">
                        <span>How much does a plumber cost?</span>
                        <span>⌄</span>
                      </div>
                      <div className="flex justify-between py-1 border-t border-slate-200">
                        <span>Is there a 24 hour plumber near me?</span>
                        <span>⌄</span>
                      </div>
                    </div>

                    {/* BLOCK 4: Google Search (SEO) (data-layer 4) */}
                    <div
                      onClick={() => handleStepClick(4)}
                      className={`mt-2 p-2.5 rounded-[14px] cursor-pointer transition-all duration-500 border-[1.5px] ${
                        currentStep === 4
                          ? 'border-amber-400 bg-amber-400/[0.08] shadow-[0_8px_24px_rgba(255,216,77,0.28)] opacity-100 scale-[1.01]'
                          : 'border-transparent opacity-35 hover:opacity-70'
                      }`}
                    >
                      <div className="text-[9.5px] text-slate-500">
                        reliableplumbing.com › plumber
                      </div>
                      <div className="text-[12.5px] text-[#1a0dab] font-semibold my-0.5 leading-snug">
                        Plumber Near You, Licensed & Insured
                      </div>
                      <div className="h-1.5 rounded bg-slate-200 mt-1 w-full" />
                      <div className="h-1.5 rounded bg-slate-200 mt-1 w-[62%]" />

                      <div className="text-[9.5px] text-slate-400 mt-3">
                        yelp.com › plumbers
                      </div>
                      <div className="text-[12px] text-[#5a5fb0] font-semibold my-0.5">
                        Top 10 Best Plumbers Near You
                      </div>
                      <div className="h-1.5 rounded bg-slate-200 mt-1 w-full" />
                    </div>

                    {/* Extra organic results */}
                    <div className="mt-2 p-2 opacity-35 text-[9.5px]">
                      <div className="text-slate-400">angi.com › plumbing</div>
                      <div className="text-[12px] text-[#5a5fb0] font-semibold my-0.5">
                        Compare Local Plumbers, Read Reviews
                      </div>
                      <div className="h-1.5 rounded bg-slate-200 mt-1 w-full" />
                    </div>
                  </div>

                  {/* BLOCK 5: WEBSITE LAYER (Slides in from the right when step 5 is active) */}
                  <div
                    className="absolute inset-0 bg-[#f8fafc] transition-transform duration-750 ease-[cubic-bezier(0.22,0.8,0.2,1)]"
                    style={{
                      transform: isSiteActive ? 'translateX(0%)' : 'translateX(100%)',
                    }}
                  >
                    {/* Website Header Bar */}
                    <div className="flex items-center gap-2 pt-[50px] px-3.5 pb-2.5 bg-white border-b border-slate-200 text-[11.5px]">
                      <div className="w-[22px] h-[22px] rounded-[6px] bg-[#163455] text-white font-extrabold text-[8.5px] grid place-items-center">
                        RP
                      </div>
                      <b className="text-slate-900 font-bold text-[11px]">
                        Reliable Plumbing
                      </b>
                      <span className="ml-auto text-slate-500 font-bold">☰</span>
                    </div>

                    {/* Website Hero Card */}
                    <div
                      className="m-3 p-4 rounded-[16px] text-white"
                      style={{
                        background: 'linear-gradient(140deg, #163455, #254d79)',
                      }}
                    >
                      <div className="text-[9px] font-bold tracking-[0.8px] uppercase text-amber-300">
                        Licensed · Same-day service
                      </div>
                      <div className="text-[18px] font-extrabold leading-[1.15] tracking-tight my-2">
                        Plumbing fixed today, done right.
                      </div>

                      {/* Call now CTA with pulse animation */}
                      <div className="relative text-center py-2 px-3 rounded-[10px] font-extrabold text-[11.5px] bg-amber-400 text-slate-950 flex items-center justify-center gap-1.5 shadow-md animate-pulse">
                        <Phone className="h-3 w-3 fill-slate-950" />
                        Call now
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

                    {/* Services List */}
                    <div className="mx-3 bg-white border border-slate-200 rounded-[12px] overflow-hidden shadow-xs">
                      <div className="flex justify-between py-2 px-3 text-[11px] font-semibold border-b border-slate-100">
                        <span>Leak repair</span>
                        <span className="text-slate-400">›</span>
                      </div>
                      <div className="flex justify-between py-2 px-3 text-[11px] font-semibold border-b border-slate-100">
                        <span>Water heaters</span>
                        <span className="text-slate-400">›</span>
                      </div>
                      <div className="flex justify-between py-2 px-3 text-[11px] font-semibold">
                        <span>Drain cleaning</span>
                        <span className="text-slate-400">›</span>
                      </div>
                    </div>

                    {/* "New call - Found you on Google" Toast */}
                    <div
                      className="absolute left-3 right-3 bottom-4 flex items-center gap-2.5 p-2.5 rounded-[14px] bg-white shadow-[0_10px_30px_rgba(22,52,85,0.22)] border border-slate-100 transition-all duration-500 ease-out"
                      style={{
                        transform: isSiteActive ? 'translateY(0)' : 'translateY(40px)',
                        opacity: isSiteActive ? 1 : 0,
                        transitionDelay: isSiteActive ? '0.4s' : '0s',
                      }}
                    >
                      <div className="w-7 h-7 rounded-full grid place-items-center bg-amber-400/20 text-amber-700 shrink-0">
                        <Phone className="h-3.5 w-3.5 fill-amber-600 text-amber-600" />
                      </div>
                      <div>
                        <b className="block text-[11px] text-slate-900 leading-tight">
                          New call
                        </b>
                        <em className="block not-italic text-[9.5px] text-slate-500">
                          Found you on Google
                        </em>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM CALLOUT: "Not sure which spots you're missing?" (from ironleadagency.com) */}
        <div className="mt-16 sm:mt-20 rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center md:text-left">
            <h3 className="font-display text-xl sm:text-2xl font-extrabold text-white">
              Not sure which spots you're missing?
            </h3>
            <p className="mt-2 text-sm sm:text-base text-slate-400 leading-relaxed">
              Tell me about your business and we'll look at where your competitors show up on each platform and where the openings are for you.
            </p>
          </div>
          <a
            href="#contact"
            className="group shrink-0 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-[0_0_25px_rgba(251,191,36,0.35)] transition-all duration-200 hover:bg-amber-300 hover:shadow-[0_0_35px_rgba(251,191,36,0.5)] hover:scale-[1.02]"
          >
            Get a Free Quote
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
