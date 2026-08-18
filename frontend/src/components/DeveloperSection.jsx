import React from 'react';
import { Github, Linkedin, Code2, Sparkles, Terminal, ExternalLink, Cpu } from 'lucide-react';

export default function DeveloperSection() {
  return (
    <section id="developer" className="py-16 sm:py-24 bg-gradient-to-b from-white via-slate-50 to-slate-100 border-b border-slate-200/80 relative overflow-hidden">

      {/* Background Decorative Grid & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#3b82f615_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-dsdl-400/10 via-indigo-500/10 to-purple-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center space-x-2 bg-dsdl-50 border border-dsdl-200/80 text-dsdl-700 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
            <Code2 className="w-3.5 h-3.5 text-dsdl-600" />
            <span>Behind The Portal</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Meet the Developer
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            The architect and engineer behind the KIET DSDL Recruitment Platform.
          </p>
        </div>

        {/* Spotlight Card */}
        <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-md rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 overflow-hidden hover:shadow-2xl hover:border-dsdl-300 transition-all duration-300">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-0">

            {/* Image Column */}
            <div className="md:col-span-5 relative bg-gradient-to-b from-slate-900 via-slate-850 to-slate-950 p-6 sm:p-8 flex flex-col items-center justify-center text-center overflow-hidden group">

              {/* Ambient Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-dsdl-600/20 via-indigo-500/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

              {/* Photo with gradient frame */}
              <div className="relative mb-5">
                <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl p-1 bg-gradient-to-tr from-dsdl-400 via-indigo-500 to-purple-500 shadow-xl shadow-dsdl-900/50 group-hover:scale-105 transition-transform duration-300">
                  <img
                    src="/assets/developer.jpg"
                    alt="Arpit Rajput - Lead Developer"
                    className="w-full h-full object-cover object-top rounded-xl"
                  />
                </div>

                {/* Status indicator */}
                <div className="absolute -bottom-2 -right-2 bg-slate-900/90 backdrop-blur-xs border border-slate-700 text-emerald-400 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center space-x-1.5 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Lead Developer</span>
                </div>
              </div>

              {/* Developer Tag */}
              <div className="relative z-10">
                <h3 className="text-xl font-extrabold text-white tracking-tight">
                  Arpit Rajput
                </h3>
                <p className="text-xs text-dsdl-300 font-semibold mt-0.5">
                  Full Stack Engineer & Creator
                </p>
                <div className="mt-3 inline-flex items-center space-x-1.5 bg-white/10 text-slate-200 px-3 py-1 rounded-lg text-[11px] font-medium border border-white/10">
                  <Terminal className="w-3 h-3 text-dsdl-400" />
                  <span>KIET Group of Institutions</span>
                </div>
              </div>

            </div>

            {/* Content Column */}
            <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">

              <div className="space-y-4">

                <div className="flex items-center space-x-2 text-xs font-bold text-dsdl-600 uppercase tracking-widest">
                  <Sparkles className="w-4 h-4" />
                  <span>Architecture & Development</span>
                </div>

                <h4 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                  Building Next-Gen Recruitment Infrastructure for DSDL
                </h4>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Hi! I'm <strong className="text-slate-800 font-semibold">Arpit Rajput</strong>, the developer behind this recruitment platform. Designed and engineered end-to-end to streamline technical club inductions at KIET with automated candidate screening, real-time analytics, and multi-channel Google Sheets synchronization.
                </p>

                {/* Tech Stack Pills */}
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Core Technologies Used
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {['React.js', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'Vite', 'JWT Auth', 'REST APIs'].map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-dsdl-50 hover:text-dsdl-700 hover:border-dsdl-200 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Social Action Links */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
                <a
                  href="https://github.com/rajputarpit0110"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all group"
                >
                  <Github className="w-4 h-4 text-slate-300 group-hover:text-white" />
                  <span>GitHub Profile</span>
                  <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                </a>

                <a
                  href="https://www.linkedin.com/in/arpit-rajput-272296365/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all group"
                >
                  <Linkedin className="w-4 h-4 text-blue-200 group-hover:text-white" />
                  <span>LinkedIn Profile</span>
                  <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                </a>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
