import { Outlet } from 'react-router-dom';
import { ThemeToggle } from '../ui/theme-toggle';

export const AuthLayout = () => {
  return (
    <div className="relative flex min-h-screen w-full overflow-hidden">
      {/* ── Gradient base background ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a] via-[#1d4ed8] to-[#3b82f6] dark:from-[#020817] dark:via-[#0f172a] dark:to-[#1e293b]" />

      {/* ── Animated blobs (textured background) ── */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Blob 1 — top-left, warm accent */}
        <div
          className="login-blob login-blob-1"
          style={{
            top: '-10%',
            left: '-5%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.5) 0%, rgba(59,130,246,0.2) 70%, transparent 100%)',
          }}
        />
        {/* Blob 2 — bottom-right, cool accent */}
        <div
          className="login-blob login-blob-2"
          style={{
            bottom: '-15%',
            right: '-10%',
            background: 'radial-gradient(circle, rgba(37,99,235,0.45) 0%, rgba(30,58,138,0.2) 70%, transparent 100%)',
          }}
        />
        {/* Blob 3 — center, subtle */}
        <div
          className="login-blob login-blob-3"
          style={{
            top: '40%',
            left: '30%',
            background: 'radial-gradient(circle, rgba(147,51,234,0.3) 0%, rgba(79,70,229,0.1) 70%, transparent 100%)',
          }}
        />

        {/* Dark mode enhanced blobs */}
        <div
          className="login-blob login-blob-1 hidden dark:block"
          style={{
            top: '20%',
            right: '10%',
            background: 'radial-gradient(circle, rgba(37,99,235,0.25) 0%, rgba(30,64,175,0.1) 70%, transparent 100%)',
          }}
        />
        <div
          className="login-blob login-blob-2 hidden dark:block"
          style={{
            bottom: '10%',
            left: '15%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 100%)',
          }}
        />
      </div>

      {/* ── Noise texture overlay ── */}
      <div className="login-noise-overlay" />

      {/* ── Content container ── */}
      <div className="relative z-10 flex w-full min-h-screen">
        {/* Theme toggle — top-right corner */}
        <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20">
          <ThemeToggle />
        </div>

        {/* Left side — Motivational text (hidden on small screens) */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 xl:p-20">
          <div className="max-w-lg space-y-6">
            {/* Brand icon */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-2xl font-bold tracking-wide text-white">Electroluz</span>
            </div>

            {/* Main heading */}
            <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight">
              Sistema de Gestión
              <br />
              <span className="text-blue-200 dark:text-blue-400">Punto de Venta</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-white/80 leading-relaxed max-w-md">
              Administra tu inventario, ventas y sucursales de forma eficiente y segura desde un solo lugar.
            </p>

            {/* Decorative dots */}
            <div className="flex gap-2 pt-4">
              <div className="w-2 h-2 rounded-full bg-white/60" />
              <div className="w-2 h-2 rounded-full bg-white/40" />
              <div className="w-2 h-2 rounded-full bg-white/20" />
            </div>
          </div>
        </div>

        {/* Right side — Login card */}
        <div className="flex flex-1 items-center justify-center p-6 sm:p-8 lg:justify-center lg:pr-16 xl:pr-24">
          <div
            className="w-full max-w-[460px] rounded-3xl p-8 sm:p-10 md:p-12
              bg-white/90 dark:bg-[#0f172a]/80
              backdrop-blur-xl
              border border-white/30 dark:border-white/10
              shadow-[0_20px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)]
              text-foreground"
          >
            {/* Logo inside card (mobile brand) */}
            <div className="flex items-center gap-2.5 mb-2 lg:hidden">
              <div className="w-9 h-9 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-foreground tracking-wide">Electroluz</span>
            </div>

            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};
