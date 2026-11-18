import React, { useEffect, useRef } from 'react';
import { Search, MapPin, Target, Phone, Laptop, BarChart3 } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  speed: number;
  color: string;
}

export function PinParticleCore() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const width = 120;
    const height = 120;
    canvas.width = width * 2;
    canvas.height = height * 2;
    ctx.scale(2, 2);

    // Exact center of the pin head circle is at (60, 60)
    const cx = 60;
    const cy = 60;
    const r = 25;
    const holeR = 9.5;
    const tipY = 105;

    const isInsidePin = (x: number, y: number): boolean => {
      const dFromCenter = Math.hypot(x - cx, y - cy);
      // Center circular cutout hole
      if (dFromCenter < holeR) return false;

      // Upper semi-circle
      if (y <= cy) {
        return dFromCenter <= r;
      }

      // Lower triangle tapering to (60, tipY)
      if (y > tipY) return false;

      const progress = (y - cy) / (tipY - cy);
      const halfWidth = r * (1 - progress * 0.88);
      return Math.abs(x - cx) <= halfWidth;
    };

    // Generate ~400 dense golden and diamond particles
    const particles: Particle[] = [];
    const colors = ['#fde047', '#facc15', '#eab308', '#ffffff', '#fef08a'];

    while (particles.length < 400) {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      if (isInsidePin(rx, ry)) {
        particles.push({
          x: rx,
          y: ry,
          size: Math.random() * 1.8 + 0.6,
          baseAlpha: Math.random() * 0.65 + 0.35,
          alpha: Math.random() * 0.65 + 0.35,
          speed: Math.random() * 0.04 + 0.02,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    }

    let time = 0;
    const render = () => {
      time += 0.05;
      ctx.clearRect(0, 0, width, height);

      // Subtle ambient gold glow behind pin
      const radial = ctx.createRadialGradient(cx, cy, 6, cx, cy, 38);
      radial.addColorStop(0, 'rgba(250, 204, 21, 0.38)');
      radial.addColorStop(0.6, 'rgba(234, 179, 8, 0.12)');
      radial.addColorStop(1, 'rgba(234, 179, 8, 0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, width, height);

      // Render shimmering particles
      for (const p of particles) {
        p.alpha = p.baseAlpha + Math.sin(time * p.speed * 20 + p.x) * 0.28;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0.18, Math.min(1, p.alpha));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-[120px] h-[120px] flex items-center justify-center pointer-events-none">
      <div className="absolute w-24 h-24 rounded-full bg-amber-400/25 blur-xl pointer-events-none" />
      <canvas
        ref={canvasRef}
        style={{ width: 120, height: 120 }}
        className="w-[120px] h-[120px] drop-shadow-[0_0_24px_rgba(250,204,21,0.65)]"
      />
    </div>
  );
}

export function HeroOrbits() {
  return (
    <div className="relative w-full max-w-[480px] h-[460px] md:h-[500px] flex items-center justify-center mx-auto select-none group">
      {/* Background ambient lighting */}
      <div className="absolute w-[360px] h-[360px] rounded-full bg-brand-600/10 blur-3xl pointer-events-none" />
      <div className="absolute w-[240px] h-[240px] rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

      {/* Orbit Container with origin at center */}
      <div className="relative w-full h-full flex items-center justify-center scale-[0.82] sm:scale-95 lg:scale-100 transition-transform origin-center">

        {/* 1. DEAD CENTER LOCATION PIN: (left: 50%, top: 50%) with -50% -50% translate */}
        <div
          className="absolute left-1/2 top-1/2 z-20 pointer-events-none"
          style={{ transform: 'translate(-50%, -50%)' }}
        >
          <PinParticleCore />
        </div>

        {/* 2. ORBIT 1: Inner (diameter: 180px, radius: 90px) */}
        <div
          className="absolute left-1/2 top-1/2 rounded-full border border-dashed border-white/20 animate-orbit-1 group-hover:[animation-play-state:paused]"
          style={{ width: 180, height: 180 }}
        >
          {/* Maps (Angle: 35deg - Upper Right) */}
          <div
            className="absolute left-1/2 top-1/2 w-0 h-0"
            style={{
              transform: 'rotate(35deg) translateY(-90px) rotate(-35deg)',
            }}
          >
            <div className="absolute left-0 top-0 animate-orbit-1-face group-hover:[animation-play-state:paused]">
              <a
                href="#services"
                className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-700/80 bg-[#0d1829]/95 px-2.5 py-1 text-xs font-bold text-white shadow-[0_4px_16px_rgba(0,0,0,0.6)] backdrop-blur transition-all duration-300 hover:border-amber-400 hover:shadow-[0_0_15px_rgba(250,204,21,0.4)] hover:scale-105"
              >
                <MapPin className="h-3 w-3 text-amber-400 shrink-0" />
                <span>Maps</span>
              </a>
            </div>
          </div>

          {/* SEO (Angle: 215deg - Lower Left) */}
          <div
            className="absolute left-1/2 top-1/2 w-0 h-0"
            style={{
              transform: 'rotate(215deg) translateY(-90px) rotate(-215deg)',
            }}
          >
            <div className="absolute left-0 top-0 animate-orbit-1-face group-hover:[animation-play-state:paused]">
              <a
                href="#services"
                className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-700/80 bg-[#0d1829]/95 px-2.5 py-1 text-xs font-bold text-white shadow-[0_4px_16px_rgba(0,0,0,0.6)] backdrop-blur transition-all duration-300 hover:border-amber-400 hover:shadow-[0_0_15px_rgba(250,204,21,0.4)] hover:scale-105"
              >
                <Search className="h-3 w-3 text-amber-400 shrink-0" />
                <span>SEO</span>
              </a>
            </div>
          </div>
        </div>

        {/* 3. ORBIT 2: Middle (diameter: 290px, radius: 145px) */}
        <div
          className="absolute left-1/2 top-1/2 rounded-full border border-dashed border-white/20 animate-orbit-2 group-hover:[animation-play-state:paused]"
          style={{ width: 290, height: 290 }}
        >
          {/* Local Service Ads (Angle: 95deg - Top) */}
          <div
            className="absolute left-1/2 top-1/2 w-0 h-0"
            style={{
              transform: 'rotate(95deg) translateY(-145px) rotate(-95deg)',
            }}
          >
            <div className="absolute left-0 top-0 animate-orbit-2-face group-hover:[animation-play-state:paused]">
              <a
                href="#services"
                className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-700/80 bg-[#0d1829]/95 px-2.5 py-1 text-xs font-bold text-white shadow-[0_4px_16px_rgba(0,0,0,0.6)] backdrop-blur transition-all duration-300 hover:border-amber-400 hover:shadow-[0_0_15px_rgba(250,204,21,0.4)] hover:scale-105"
              >
                <Phone className="h-3 w-3 text-amber-400 shrink-0" />
                <span>Local Service Ads</span>
              </a>
            </div>
          </div>

          {/* Google Ads (Angle: 285deg - Bottom Right) */}
          <div
            className="absolute left-1/2 top-1/2 w-0 h-0"
            style={{
              transform: 'rotate(285deg) translateY(-145px) rotate(-285deg)',
            }}
          >
            <div className="absolute left-0 top-0 animate-orbit-2-face group-hover:[animation-play-state:paused]">
              <a
                href="#services"
                className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-700/80 bg-[#0d1829]/95 px-2.5 py-1 text-xs font-bold text-white shadow-[0_4px_16px_rgba(0,0,0,0.6)] backdrop-blur transition-all duration-300 hover:border-amber-400 hover:shadow-[0_0_15px_rgba(250,204,21,0.4)] hover:scale-105"
              >
                <Target className="h-3 w-3 text-amber-400 shrink-0" />
                <span>Google Ads</span>
              </a>
            </div>
          </div>
        </div>

        {/* 4. ORBIT 3: Outer (diameter: 410px, radius: 205px) */}
        <div
          className="absolute left-1/2 top-1/2 rounded-full border border-dashed border-white/15 animate-orbit-3 group-hover:[animation-play-state:paused]"
          style={{ width: 410, height: 410 }}
        >
          {/* Websites (Angle: 185deg - Left) */}
          <div
            className="absolute left-1/2 top-1/2 w-0 h-0"
            style={{
              transform: 'rotate(185deg) translateY(-205px) rotate(-185deg)',
            }}
          >
            <div className="absolute left-0 top-0 animate-orbit-3-face group-hover:[animation-play-state:paused]">
              <a
                href="#services"
                className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-700/80 bg-[#0d1829]/95 px-2.5 py-1 text-xs font-bold text-white shadow-[0_4px_16px_rgba(0,0,0,0.6)] backdrop-blur transition-all duration-300 hover:border-amber-400 hover:shadow-[0_0_15px_rgba(250,204,21,0.4)] hover:scale-105"
              >
                <Laptop className="h-3 w-3 text-amber-400 shrink-0" />
                <span>Websites</span>
              </a>
            </div>
          </div>

          {/* Lead Tracking (Angle: 15deg - Right) */}
          <div
            className="absolute left-1/2 top-1/2 w-0 h-0"
            style={{
              transform: 'rotate(15deg) translateY(-205px) rotate(-15deg)',
            }}
          >
            <div className="absolute left-0 top-0 animate-orbit-3-face group-hover:[animation-play-state:paused]">
              <a
                href="#services"
                className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-700/80 bg-[#0d1829]/95 px-2.5 py-1 text-xs font-bold text-white shadow-[0_4px_16px_rgba(0,0,0,0.6)] backdrop-blur transition-all duration-300 hover:border-amber-400 hover:shadow-[0_0_15px_rgba(250,204,21,0.4)] hover:scale-105"
              >
                <BarChart3 className="h-3 w-3 text-amber-400 shrink-0" />
                <span>Lead Tracking</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
