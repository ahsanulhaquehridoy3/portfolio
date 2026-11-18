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
    const width = 140;
    const height = 180;
    canvas.width = width * 2;
    canvas.height = height * 2;
    ctx.scale(2, 2);

    // Pin shape geometry helper
    const isInsidePin = (x: number, y: number): boolean => {
      const cx = 70;
      const cy = 55;
      const r = 44;
      const holeR = 17;

      // Inner hole check
      const dFromHole = Math.hypot(x - cx, y - cy);
      if (dFromHole < holeR) return false;

      // Upper circle check
      if (y <= cy) {
        return dFromHole <= r;
      }

      // Lower triangle / point check (from cy to tip at 155)
      const tipX = 70;
      const tipY = 160;
      if (y > tipY) return false;

      // Interpolate tangent line bounds
      const progress = (y - cy) / (tipY - cy);
      const halfWidthAtY = r * Math.sqrt(Math.max(0, 1 - Math.pow(progress * 0.7, 2))) * (1 - progress * 0.85);
      return Math.abs(x - cx) <= halfWidthAtY;
    };

    // Generate ~350 particles inside pin
    const particles: Particle[] = [];
    const colors = ['#fde047', '#facc15', '#eab308', '#ffffff', '#fef08a'];

    while (particles.length < 320) {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      if (isInsidePin(rx, ry)) {
        particles.push({
          x: rx,
          y: ry,
          size: Math.random() * 2 + 0.8,
          baseAlpha: Math.random() * 0.6 + 0.4,
          alpha: Math.random() * 0.6 + 0.4,
          speed: Math.random() * 0.03 + 0.015,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    }

    let time = 0;
    const render = () => {
      time += 0.05;
      ctx.clearRect(0, 0, width, height);

      // Subtle glow backdrop
      const radial = ctx.createRadialGradient(70, 55, 10, 70, 55, 60);
      radial.addColorStop(0, 'rgba(250, 204, 21, 0.25)');
      radial.addColorStop(1, 'rgba(250, 204, 21, 0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, width, height);

      // Render shimmering particles
      for (const p of particles) {
        p.alpha = p.baseAlpha + Math.sin(time * p.speed * 20 + p.x) * 0.25;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0.15, Math.min(1, p.alpha));
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
    <div className="relative flex items-center justify-center">
      <div className="absolute -inset-4 rounded-full bg-amber-400/20 blur-2xl" />
      <canvas
        ref={canvasRef}
        style={{ width: 140, height: 180 }}
        className="relative z-10 drop-shadow-[0_0_24px_rgba(250,204,21,0.55)]"
      />
    </div>
  );
}

export function HeroOrbits() {
  return (
    <div className="relative flex items-center justify-center w-full min-h-[460px] md:min-h-[520px] select-none group">
      {/* Outer ambient glow */}
      <div className="absolute w-[440px] h-[440px] rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />

      {/* Orbit scaling container for responsive fit */}
      <div className="relative w-[340px] h-[340px] sm:w-[440px] sm:h-[440px] md:w-[500px] md:h-[500px] scale-[0.78] sm:scale-90 md:scale-100 transition-transform origin-center">
        {/* Core in center */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <PinParticleCore />
        </div>

        {/* Orbit 1: Inner (diameter: 220px, radius: 110px) */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/20 animate-orbit-1 group-hover:[animation-play-state:paused]"
          style={{ width: 220, height: 220 }}
        >
          {/* SEO (Angle: 40deg) */}
          <div
            className="absolute left-1/2 top-1/2 w-0 h-0"
            style={{
              transform: 'rotate(40deg) translateY(-110px) rotate(-40deg)',
            }}
          >
            <div className="absolute -translate-x-1/2 -translate-y-1/2 animate-orbit-1-face group-hover:[animation-play-state:paused]">
              <a
                href="#services"
                className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-slate-700/80 bg-slate-900/90 px-3.5 py-1.5 text-xs font-bold text-white shadow-[0_8px_25px_-5px_rgba(0,0,0,0.6)] backdrop-blur transition-all duration-300 hover:border-amber-400/80 hover:shadow-[0_0_20px_rgba(250,204,21,0.4)] hover:scale-105"
              >
                <Search className="h-3.5 w-3.5 text-amber-400" />
                <span>SEO</span>
              </a>
            </div>
          </div>

          {/* Maps (Angle: 220deg) */}
          <div
            className="absolute left-1/2 top-1/2 w-0 h-0"
            style={{
              transform: 'rotate(220deg) translateY(-110px) rotate(-220deg)',
            }}
          >
            <div className="absolute -translate-x-1/2 -translate-y-1/2 animate-orbit-1-face group-hover:[animation-play-state:paused]">
              <a
                href="#services"
                className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-slate-700/80 bg-slate-900/90 px-3.5 py-1.5 text-xs font-bold text-white shadow-[0_8px_25px_-5px_rgba(0,0,0,0.6)] backdrop-blur transition-all duration-300 hover:border-amber-400/80 hover:shadow-[0_0_20px_rgba(250,204,21,0.4)] hover:scale-105"
              >
                <MapPin className="h-3.5 w-3.5 text-amber-400" />
                <span>Maps</span>
              </a>
            </div>
          </div>
        </div>

        {/* Orbit 2: Middle (diameter: 350px, radius: 175px) */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/20 animate-orbit-2 group-hover:[animation-play-state:paused]"
          style={{ width: 350, height: 350 }}
        >
          {/* Google Ads (Angle: 120deg) */}
          <div
            className="absolute left-1/2 top-1/2 w-0 h-0"
            style={{
              transform: 'rotate(120deg) translateY(-175px) rotate(-120deg)',
            }}
          >
            <div className="absolute -translate-x-1/2 -translate-y-1/2 animate-orbit-2-face group-hover:[animation-play-state:paused]">
              <a
                href="#services"
                className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-slate-700/80 bg-slate-900/90 px-3.5 py-1.5 text-xs font-bold text-white shadow-[0_8px_25px_-5px_rgba(0,0,0,0.6)] backdrop-blur transition-all duration-300 hover:border-amber-400/80 hover:shadow-[0_0_20px_rgba(250,204,21,0.4)] hover:scale-105"
              >
                <Target className="h-3.5 w-3.5 text-amber-400" />
                <span>Google Ads</span>
              </a>
            </div>
          </div>

          {/* Local Service Ads (Angle: 300deg) */}
          <div
            className="absolute left-1/2 top-1/2 w-0 h-0"
            style={{
              transform: 'rotate(300deg) translateY(-175px) rotate(-300deg)',
            }}
          >
            <div className="absolute -translate-x-1/2 -translate-y-1/2 animate-orbit-2-face group-hover:[animation-play-state:paused]">
              <a
                href="#services"
                className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-slate-700/80 bg-slate-900/90 px-3.5 py-1.5 text-xs font-bold text-white shadow-[0_8px_25px_-5px_rgba(0,0,0,0.6)] backdrop-blur transition-all duration-300 hover:border-amber-400/80 hover:shadow-[0_0_20px_rgba(250,204,21,0.4)] hover:scale-105"
              >
                <Phone className="h-3.5 w-3.5 text-amber-400" />
                <span>Local Service Ads</span>
              </a>
            </div>
          </div>
        </div>

        {/* Orbit 3: Outer (diameter: 480px, radius: 240px) */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/15 animate-orbit-3 group-hover:[animation-play-state:paused]"
          style={{ width: 480, height: 480 }}
        >
          {/* Websites (Angle: 15deg) */}
          <div
            className="absolute left-1/2 top-1/2 w-0 h-0"
            style={{
              transform: 'rotate(15deg) translateY(-240px) rotate(-15deg)',
            }}
          >
            <div className="absolute -translate-x-1/2 -translate-y-1/2 animate-orbit-3-face group-hover:[animation-play-state:paused]">
              <a
                href="#services"
                className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-slate-700/80 bg-slate-900/90 px-3.5 py-1.5 text-xs font-bold text-white shadow-[0_8px_25px_-5px_rgba(0,0,0,0.6)] backdrop-blur transition-all duration-300 hover:border-amber-400/80 hover:shadow-[0_0_20px_rgba(250,204,21,0.4)] hover:scale-105"
              >
                <Laptop className="h-3.5 w-3.5 text-amber-400" />
                <span>Websites</span>
              </a>
            </div>
          </div>

          {/* Lead Tracking (Angle: 195deg) */}
          <div
            className="absolute left-1/2 top-1/2 w-0 h-0"
            style={{
              transform: 'rotate(195deg) translateY(-240px) rotate(-195deg)',
            }}
          >
            <div className="absolute -translate-x-1/2 -translate-y-1/2 animate-orbit-3-face group-hover:[animation-play-state:paused]">
              <a
                href="#services"
                className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-slate-700/80 bg-slate-900/90 px-3.5 py-1.5 text-xs font-bold text-white shadow-[0_8px_25px_-5px_rgba(0,0,0,0.6)] backdrop-blur transition-all duration-300 hover:border-amber-400/80 hover:shadow-[0_0_20px_rgba(250,204,21,0.4)] hover:scale-105"
              >
                <BarChart3 className="h-3.5 w-3.5 text-amber-400" />
                <span>Lead Tracking</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
