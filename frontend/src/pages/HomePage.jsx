import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Sparkles, Code2, Users, Rocket, BrainCircuit, 
  Terminal, Smartphone, Cpu, ShieldCheck, Palette, Cloud, Database, Network, ChevronRight
} from 'lucide-react';
import Navbar from '../components/Navbar';
import DeveloperSection from '../components/DeveloperSection';
import Footer from '../components/Footer';
import { INTEREST_OPTIONS } from '../config/recruitmentConfig';

export default function HomePage() {
  const iconMap = {
    'Web Development': Code2,
    'App Development': Smartphone,
    'AI / ML': BrainCircuit,
    'Data Science': Database,
    'Competitive Programming': Terminal,
    'Cyber Security': ShieldCheck,
    'UI/UX': Palette,
    'Cloud / DevOps': Cloud,
    'IoT': Cpu,
    'Blockchain': Network,
    'Other': Sparkles
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-red-600 selection:text-white">
      <Navbar />

      <main className="flex-grow">
        
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900/90 to-slate-950 pt-12 sm:pt-20 pb-16 sm:pb-24 border-b border-slate-800/80">
          {/* Subtle Ambient Red Glow Orb */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-red-600/10 blur-[130px] rounded-full pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            
            {/* KIET -> KML -> Recruitment 2026 Hierarchy Badge */}
            <div className="inline-flex items-center space-x-2 bg-slate-900/90 border border-red-500/30 px-3.5 py-1.5 rounded-full shadow-lg shadow-black/40 mb-6 text-xs sm:text-sm font-medium text-slate-200">
              <span className="font-bold text-slate-300">KIET University</span>
              <span className="text-red-500/60">•</span>
              <span className="font-semibold text-red-400">KML Technical Club</span>
              <span className="text-red-500/60">•</span>
              <span className="bg-red-950 text-red-300 border border-red-800/60 font-bold px-2 py-0.5 rounded-md text-[11px] uppercase tracking-wide">
                Recruitment 2026
              </span>
            </div>

            {/* Logo Hero Composition */}
            <div className="flex items-center justify-center space-x-4 sm:space-x-6 mb-8">
              <div className="bg-white/95 p-2 sm:p-3 rounded-2xl border border-white/10 shadow-xl shadow-black/40">
                <img 
                  src="/assets/kiet-logo.png" 
                  alt="KIET University Official Seal" 
                  className="h-12 sm:h-16 w-auto object-contain drop-shadow-xs" 
                />
              </div>
              <div className="h-10 sm:h-14 w-[2px] bg-gradient-to-b from-transparent via-red-600 to-transparent rounded-full" />
              <div className="bg-white/95 p-2 sm:p-3 rounded-2xl border border-white/10 shadow-xl shadow-black/40">
                <img 
                  src="/assets/KML.jpg" 
                  alt="KML Logo" 
                  className="h-12 sm:h-16 w-auto object-contain rounded-xl drop-shadow-xs" 
                />
              </div>
            </div>

            {/* Main Hero Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
              Build. Learn. Innovate. <br className="hidden sm:inline" />
              <span className="text-slate-100">Grow with </span>
              <span className="kriva-3d-text inline-block transform hover:scale-105 transition-transform duration-200">
                KML.
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
              Join the official technical community at KIET where you don't just learn technology — you build real working projects with it.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center text-base font-bold text-white bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-red-600 active:from-red-700 active:to-red-800 px-8 py-4 rounded-xl shadow-lg shadow-red-600/35 hover:shadow-xl hover:shadow-red-600/45 hover:-translate-y-0.5 transition-all gap-2"
              >
                <span>Register for KML Recruitment</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <a
                href="#about"
                className="w-full sm:w-auto inline-flex items-center justify-center text-sm font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-red-500/50 px-6 py-4 rounded-xl shadow-sm transition-all"
              >
                Know About KML
              </a>
            </div>

            {/* Micro stats banner */}
            <div className="mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto pt-8 border-t border-slate-800/80">
              <div className="bg-slate-900/60 border border-slate-800/80 p-3 sm:p-4 rounded-xl">
                <div className="text-xl sm:text-2xl font-bold text-white">First-Year</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">Recruitment Open</div>
              </div>
              <div className="bg-slate-900/60 border border-slate-800/80 p-3 sm:p-4 rounded-xl">
                <div className="text-xl sm:text-2xl font-bold text-red-500">10+</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">Technical Domains</div>
              </div>
              <div className="bg-slate-900/60 border border-slate-800/80 p-3 sm:p-4 rounded-xl">
                <div className="text-xl sm:text-2xl font-bold text-white">Hands-on</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">Project Mentorship</div>
              </div>
              <div className="bg-slate-900/60 border border-slate-800/80 p-3 sm:p-4 rounded-xl">
                <div className="text-xl sm:text-2xl font-bold text-red-400">100%</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">Beginner Friendly</div>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 2 — WHY KML / ABOUT */}
        <section id="about" className="py-16 sm:py-24 bg-black/90 border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <h2 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-2">What KML Offers</h2>
              <p className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Empowering Students to Become Practical Engineers
              </p>
              <p className="text-sm sm:text-base text-slate-400 mt-3">
                KML (KRIVA ML Society) provides first-year students with hands-on technical projects, collaborative teamwork, and real mentorship beyond classroom theory.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-slate-900/60 p-6 sm:p-8 rounded-2xl border border-slate-800/80 glow-card">
                <div className="w-12 h-12 rounded-xl bg-red-950/70 border border-red-800/50 text-red-500 flex items-center justify-center mb-6">
                  <Code2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Learn</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Improve your technical skills through structured workshops, hands-on tutorials, and peer code reviews.
                </p>
              </div>

              <div className="bg-slate-900/60 p-6 sm:p-8 rounded-2xl border border-slate-800/80 glow-card">
                <div className="w-12 h-12 rounded-xl bg-red-950/70 border border-red-800/50 text-red-500 flex items-center justify-center mb-6">
                  <Rocket className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Build</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Work on real-world web apps, mobile apps, ML models, and open-source tools to build a strong portfolio.
                </p>
              </div>

              <div className="bg-slate-900/60 p-6 sm:p-8 rounded-2xl border border-slate-800/80 glow-card">
                <div className="w-12 h-12 rounded-xl bg-red-950/70 border border-red-800/50 text-red-500 flex items-center justify-center mb-6">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Collaborate</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Work with motivated peers across CSE, IT, ECE, and other branches to solve real engineering problems.
                </p>
              </div>

              <div className="bg-slate-900/60 p-6 sm:p-8 rounded-2xl border border-slate-800/80 glow-card">
                <div className="w-12 h-12 rounded-xl bg-red-950/70 border border-red-800/50 text-red-500 flex items-center justify-center mb-6">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Grow</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Develop leadership, problem-solving, and communication skills that prepare you for top hackathons and internships.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 3 — TARGETED FIRST-YEAR SECTION */}
        <section id="why-join" className="py-16 sm:py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="bg-slate-900/90 border border-red-950/80 rounded-3xl p-8 sm:p-12 md:p-16 max-w-4xl mx-auto text-center backdrop-blur-sm shadow-2xl shadow-black/50">
              
              <div className="inline-flex items-center space-x-2 bg-red-950/60 border border-red-800/60 text-red-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                <Sparkles className="w-4 h-4 text-red-500" />
                <span>Beginners Are Welcome</span>
              </div>

              <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Your First Year Is the Best Time to Start Building.
              </h2>

              <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
                You don't need to be a coding expert to apply. Curiosity, consistency, and the willingness to learn matter far more than existing experience.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center text-base font-bold text-white bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-red-600 px-8 py-3.5 rounded-xl shadow-lg shadow-red-600/30 transition-all gap-2 hover:-translate-y-0.5"
                >
                  <span>Apply as First-Year Student</span>
                  <ChevronRight className="w-5 h-5 text-white" />
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 4 — AREAS TO EXPLORE */}
        <section id="explore" className="py-16 sm:py-24 bg-black/90 border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-2">Technical Domains</h2>
              <p className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Areas You Can Explore Through KML
              </p>
              <p className="text-sm sm:text-base text-slate-400 mt-2">
                Discover technologies that align with your interests during recruitment and active club workshops.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
              {INTEREST_OPTIONS.map((area) => {
                const IconComponent = iconMap[area] || Sparkles;
                return (
                  <div 
                    key={area}
                    className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl flex flex-col items-center text-center hover:bg-red-950/30 hover:border-red-500/40 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 text-red-500 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:border-red-500/50 transition-transform shadow-xs">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-300 group-hover:text-red-400 transition-colors">
                      {area}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 5 — RECRUITMENT PROCESS */}
        <section id="process" className="py-16 sm:py-24 bg-slate-950 border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <h2 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-2">Selection Roadmap</h2>
              <p className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Recruitment Timeline
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              
              {/* Step 1 */}
              <div className="bg-slate-900/70 p-6 rounded-2xl border border-slate-800 shadow-xl relative">
                <div className="text-3xl font-black text-red-500/40 mb-2">01</div>
                <h3 className="text-base font-bold text-white mb-1">Register Online</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Fill out the quick online application form with your branch, details, and technical interests.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-900/70 p-6 rounded-2xl border border-slate-800 shadow-xl relative">
                <div className="text-3xl font-black text-red-500/40 mb-2">02</div>
                <h3 className="text-base font-bold text-white mb-1">Application Screening</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Applications are reviewed by the KML team to identify enthusiastic learners.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-900/70 p-6 rounded-2xl border border-slate-800 shadow-xl relative">
                <div className="text-3xl font-black text-red-500/40 mb-2">03</div>
                <h3 className="text-base font-bold text-white mb-1">Interaction Round</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Shortlisted candidates attend a friendly interaction to discuss learning goals and curiosity.
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-slate-900/70 p-6 rounded-2xl border border-slate-800 shadow-xl relative">
                <div className="text-3xl font-black text-red-500/40 mb-2">04</div>
                <h3 className="text-base font-bold text-white mb-1">Welcome to KML</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Selected members join the official club community, workshops, and project teams.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* DEVELOPER SPOTLIGHT SECTION */}
        <DeveloperSection />

        {/* FINAL CTA BANNER */}
        <section className="py-12 sm:py-16 bg-gradient-to-r from-slate-950 via-red-950 to-slate-950 text-white text-center border-t border-red-900/40">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Ready to Take the First Step?</h2>
            <p className="mt-3 text-sm sm:text-base text-rose-200/90">
              Applications for KIET KML Recruitment 2026 are actively being accepted.
            </p>
            <div className="mt-6">
              <Link
                to="/register"
                className="inline-flex items-center justify-center text-base font-bold text-red-700 bg-white hover:bg-rose-50 px-8 py-3.5 rounded-xl shadow-xl shadow-black/40 transition-transform hover:scale-105 gap-2"
              >
                <span>Register for KML Recruitment Now</span>
                <ArrowRight className="w-5 h-5 text-red-600" />
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
