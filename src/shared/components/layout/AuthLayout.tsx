import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen w-full bg-[#F1F5F9] dark:bg-gray-900">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#7e22ce] to-[#581c87] overflow-hidden flex-col justify-between p-12">
        {/* Decorative elements / image could go here as absolute background */}
        <div className="relative z-10 flex items-center gap-2 text-white">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
             {/* Simple bird/fly logo placeholder for Electroluz or brand */}
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="text-2xl font-bold tracking-wider">Electroluz</span>
        </div>

        <div className="relative z-10 max-w-lg mb-12">
          <h1 className="text-5xl font-extrabold text-white leading-tight mb-6">
            Your Trusted<br />Partner in Business.
          </h1>
          <p className="text-lg text-white/90 leading-relaxed font-medium">
            At Electroluz, we ensure fast and reliable management services,
            tailored to meet your needs with efficiency and care.
          </p>
        </div>
        
        {/* Adding the background placeholder from design */}
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-400 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500 rounded-full blur-[100px] translate-y-1/4 -translate-x-1/4"></div>
        </div>
      </div>

      {/* Right Panel - Content */}
      <div className="flex flex-1 items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-[480px] bg-white dark:bg-gray-800 rounded-[2rem] p-10 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-gray-800">
          {children}
        </div>
      </div>
    </div>
  );
};
