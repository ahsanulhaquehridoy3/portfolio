import React, { useEffect, useRef, useState } from 'react';

interface ProcessStep {
  id: number;
  title: string;
  desc: string;
}

const STEPS: ProcessStep[] = [
  {
    id: 1,
    title: 'Onboard',
    desc: "We audit your current setup, connect your accounts, and get campaigns live without disrupting what's already working.",
  },
  {
    id: 2,
    title: 'Optimize',
    desc: 'Your dedicated manager continually tunes targeting, budget, and creative to improve lead volume and quality.',
  },
  {
    id: 3,
    title: 'Report',
    desc: "Regular, plain-English reporting on what's running and what it's producing, so you always know where things stand.",
  },
];

const PARTICLE_COUNT = 2800;

function ringPoint(r: number, width: number): [number, number] {
  const a = Math.random() * Math.PI * 2;
  const d = r + (Math.random() - 0.5) * width;
  return [Math.cos(a) * d, Math.sin(a) * d];
}

function linePoint(x1: number, y1: number, x2: number, y2: number, width: number): [number, number] {
  const t = Math.random();
  return [
    x1 + (x2 - x1) * t + (Math.random() - 0.5) * width,
    y1 + (y2 - y1) * t + (Math.random() - 0.5) * width,
  ];
}

function generateShapePoints(shape: 'search' | 'target' | 'bars', count: number): Float32Array {
  const pts = new Float32Array(count * 2);

  for (let i = 0; i < count; i++) {
    let x = 0;
    let y = 0;

    if (shape === 'search') {
      // Magnifying glass: 70% in circle head, 30% in angled handle
      if (Math.random() < 0.70) {
        const q = ringPoint(0.58, 0.14);
        x = q[0] - 0.18;
        y = q[1] + 0.18;
      } else {
        const l = linePoint(0.22, -0.22, 0.95, -0.95, 0.12);
        x = l[0];
        y = l[1];
      }
    } else if (shape === 'target') {
      // Target / Bullseye: outer ring, middle ring, solid center
      const p = Math.random();
      if (p < 0.44) {
        const q = ringPoint(0.92, 0.10);
        x = q[0];
        y = q[1];
      } else if (p < 0.78) {
        const q = ringPoint(0.56, 0.10);
        x = q[0];
        y = q[1];
      } else {
        const q = ringPoint(0.18, 0.18);
        x = q[0];
        y = q[1];
      }
    } else {
      // Bar Chart: 4 vertical bars
      const heights = [0.55, 0.95, 1.4, 1.9];
      const barIdx = Math.floor(Math.random() * 4);
      const bx = -0.84 + barIdx * 0.56;
      const by = Math.random() < 0.28 ? heights[barIdx] : Math.random() * heights[barIdx];
      x = bx + (Math.random() - 0.5) * 0.36;
      y = by - 0.95;
    }

    pts[i * 2] = x;
    pts[i * 2 + 1] = y;
  }

  return pts;
}

export function ProcessSection() {
  const [activeStep, setActiveStep] = useState(1);
  const [manualStep, setManualStep] = useState<number | null>(null);

  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const manualTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Scroll detection to update active step
  useEffect(() => {
    const handleScroll = () => {
      if (manualStep !== null) return;
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const travel = section.offsetHeight - window.innerHeight;
      if (travel <= 0) return;

      const progress = Math.max(0, Math.min(1, -rect.top / travel));
      const stepIdx = Math.min(STEPS.length - 1, Math.floor(progress * STEPS.length));
      setActiveStep(stepIdx + 1);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [manualStep]);

  const handleStepClick = (id: number) => {
    setActiveStep(id);
    setManualStep(id);
    if (manualTimerRef.current) clearTimeout(manualTimerRef.current);
    manualTimerRef.current = setTimeout(() => {
      setManualStep(null);
    }, 4500);
  };

  // Canvas particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const shapesData = {
      search: generateShapePoints('search', PARTICLE_COUNT),
      target: generateShapePoints('target', PARTICLE_COUNT),
      bars: generateShapePoints('bars', PARTICLE_COUNT),
    };

    // Current interpolated positions
    const currentPos = new Float32Array(shapesData.search);

    // Particle colors & sizes (65% Gold #FFD84D, 25% Pure White, 10% Bright Amber)
    const colors: string[] = [];
    const sizes = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const rand = Math.random();
      if (rand < 0.65) {
        colors.push('rgba(255, 216, 77, 0.95)'); // Signal Gold
      } else if (rand < 0.88) {
        colors.push('rgba(255, 255, 255, 0.9)'); // Bright White
      } else {
        colors.push('rgba(251, 191, 36, 0.85)'); // Amber
      }
      sizes[i] = 1.1 + Math.random() * 1.6;
    }

    let targetShapeName: 'search' | 'target' | 'bars' = 'search';

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const width = rect.width || 480;
      const height = rect.height || 480;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    };
    resize();
    window.addEventListener('resize', resize);

    let time = 0;

    const render = () => {
      time += 0.025;

      if (activeStep === 1) targetShapeName = 'search';
      else if (activeStep === 2) targetShapeName = 'target';
      else targetShapeName = 'bars';

      const targetPts = shapesData[targetShapeName];

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const dpr = window.devicePixelRatio || 1;
      const scale = Math.min(w, h) * 0.38;
      const cx = w * 0.5;
      const cy = h * 0.5;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const tx = targetPts[i * 2];
        const ty = targetPts[i * 2 + 1];

        // Smooth easing towards target (responsive 0.09)
        currentPos[i * 2] += (tx - currentPos[i * 2]) * 0.09;
        currentPos[i * 2 + 1] += (ty - currentPos[i * 2 + 1]) * 0.09;

        // Subtle shimmering floating noise
        const jitterX = Math.sin(time + i * 0.7) * 0.007;
        const jitterY = Math.cos(time + i * 0.9) * 0.007;

        const px = cx + (currentPos[i * 2] + jitterX) * scale;
        // Invert Y so up is positive
        const py = cy - (currentPos[i * 2 + 1] + jitterY) * scale;

        ctx.fillStyle = colors[i];
        ctx.beginPath();
        ctx.arc(px, py, sizes[i] * dpr * 0.85, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [activeStep]);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative"
      style={{
        minHeight: '260vh',
        background: 'linear-gradient(180deg, #070e1a 0%, #0d1829 50%, #070e1a 100%)',
      }}
    >
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        {/* Background ambient gold lighting */}
        <div className="pointer-events-none absolute right-1/4 top-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-amber-400/[0.06] blur-3xl" />
        <div className="pointer-events-none absolute left-1/4 top-1/3 w-[450px] h-[450px] rounded-full bg-blue-600/[0.04] blur-3xl" />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-6 sm:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-14 items-center">
            {/* LEFT: Text & Step Cards */}
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
                Getting Started
              </div>
              <h2 className="mt-2.5 font-display text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-white leading-[1.15]">
                Getting started is easy
              </h2>
              <p className="mt-3.5 text-base sm:text-lg text-slate-400 leading-relaxed max-w-lg mb-7">
                We handle the setup and the ongoing work, so all it takes from you is a few details.
              </p>

              {/* Step Cards */}
              <div className="flex flex-col gap-3.5 max-w-xl">
                {STEPS.map((step) => {
                  const isActive = activeStep === step.id;

                  return (
                    <div
                      key={step.id}
                      onClick={() => handleStepClick(step.id)}
                      className={`group cursor-pointer rounded-2xl p-5 sm:p-6 transition-all duration-300 border flex gap-4 sm:gap-5 items-start ${
                        isActive
                          ? 'border-amber-400/80 bg-white/[0.05] shadow-[0_0_30px_rgba(251,191,36,0.16)] opacity-100 scale-[1.01]'
                          : 'border-white/10 bg-white/[0.02] opacity-45 hover:opacity-75 hover:border-white/20'
                      }`}
                    >
                      {/* Step Number Badge */}
                      <div
                        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full grid place-items-center font-display font-black text-base sm:text-lg shrink-0 transition-all duration-300 ${
                          isActive
                            ? 'bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(251,191,36,0.45)]'
                            : 'bg-white/10 text-slate-300 group-hover:bg-white/15'
                        }`}
                      >
                        {step.id}
                      </div>

                      {/* Step Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight">
                          {step.title}
                        </h3>
                        <p className="mt-1 text-sm sm:text-[15px] text-slate-300 leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT: Particle Formation Canvas */}
            <div className="flex justify-center items-center py-4">
              <div className="relative w-full max-w-[460px] aspect-square flex items-center justify-center">
                {/* Glow ring behind canvas */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-full"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(251,191,36,0.15) 0%, rgba(251,191,36,0.03) 50%, transparent 70%)',
                  }}
                />
                <canvas
                  ref={canvasRef}
                  className="relative z-10 w-full h-full block"
                  style={{ width: '100%', height: '100%' }}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
