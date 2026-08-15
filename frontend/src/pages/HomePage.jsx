import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Sparkles, Code2, Users, Rocket, BrainCircuit, 
  Terminal, Smartphone, Cpu, ShieldCheck, Palette, Cloud, Database, Network, ChevronRight
} from 'lucide-react';
import Navbar from '../components/Navbar';
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
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-grow">
        
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-dsdl-50/60 via-white to-slate-50 pt-12 sm:pt-20 pb-16 sm:pb-24 border-b border-slate-100">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            
            {/* KIET -> DSDL -> Recruitment 2026 Hierarchy Badge */}
            <div className="inline-flex items-center space-x-2 bg-white border border-dsdl-200 px-3.5 py-1.5 rounded-full shadow-sm mb-6 text-xs sm:text-sm font-medium text-dsdl-800">
              <span className="font-bold text-slate-700">KIET University</span>
              <span className="text-dsdl-300">•</span>
              <span className="font-semibold text-dsdl-600">DSDL Technical Club</span>
              <span className="text-dsdl-300">•</span>
              <span className="bg-kiet-100 text-kiet-700 font-bold px-2 py-0.5 rounded-md text-[11px] uppercase tracking-wide">
                Recruitment 2026
              </span>
            </div>

            {/* Logo Hero Composition */}
            <div className="flex items-center justify-center space-x-6 sm:space-x-8 mb-8">
              <img 
                src="/assets/kiet-logo.png" 
                alt="KIET University Official Seal" 
                className="h-16 sm:h-24 w-auto object-contain drop-shadow-sm" 
              />
              <div className="h-12 sm:h-16 w-[2px] bg-gradient-to-b from-dsdl-200 via-dsdl-400 to-dsdl-200 rounded-full" />
              <img 
                src="/assets/dsdl-logo.png" 
                alt="DSDL Technical Club Logo" 
                className="h-20 sm:h-28 w-auto object-contain drop-shadow-md" 
              />
            </div>

            {/* Main Hero Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
              Build. Learn. Innovate. <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-dsdl-700 via-dsdl-600 to-dsdl-500 bg-clip-text text-transparent">
                Grow with DSDL.
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
              Join the official technical community at KIET where you don't just learn technology — you build real working projects with it.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center text-base font-bold text-white bg-dsdl-600 hover:bg-dsdl-700 active:bg-dsdl-800 px-8 py-4 rounded-xl shadow-lg shadow-dsdl-600/30 hover:shadow-xl hover:shadow-dsdl-600/40 hover:-translate-y-0.5 transition-all gap-2"
              >
                <span>Register for DSDL Recruitment</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <a
                href="#about"
                className="w-full sm:w-auto inline-flex items-center justify-center text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 px-6 py-4 rounded-xl shadow-sm transition-colors"
              >
                Know About DSDL
              </a>
            </div>

            {/* Micro stats banner */}
            <div className="mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-8 border-t border-slate-200/80">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-slate-900">First-Year</div>
                <div className="text-xs text-slate-500 font-medium">Recruitment Open</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-dsdl-600">10+</div>
                <div className="text-xs text-slate-500 font-medium">Technical Domains</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-slate-900">Hands-on</div>
                <div className="text-xs text-slate-500 font-medium">Project Mentorship</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-kiet-600">100%</div>
                <div className="text-xs text-slate-500 font-medium">Beginner Friendly</div>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 2 — WHY DSDL / ABOUT */}
        <section id="about" className="py-16 sm:py-24 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <h2 className="text-xs font-bold text-dsdl-600 uppercase tracking-widest mb-2">What DSDL Offers</h2>
              <p className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Empowering Students to Become Practical Engineers
              </p>
              <p className="text-sm sm:text-base text-slate-600 mt-3">
                DSDL (Data Science & Deep Learning Club) provides first-year students with hands-on technical projects, collaborative teamwork, and real mentorship beyond classroom theory.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200/80 glow-card">
                <div className="w-12 h-12 rounded-xl bg-dsdl-100 text-dsdl-600 flex items-center justify-center mb-6">
                  <Code2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Learn</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Improve your technical skills through structured workshops, hands-on tutorials, and peer code reviews.
                </p>
              </div>

              <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200/80 glow-card">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
                  <Rocket className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Build</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Work on real-world web apps, mobile apps, ML models, and open-source tools to build a strong portfolio.
                </p>
              </div>

              <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200/80 glow-card">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Collaborate</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Work with motivated peers across CSE, IT, ECE, and other branches to solve real engineering problems.
                </p>
              </div>

              <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200/80 glow-card">
                <div className="w-12 h-12 rounded-xl bg-kiet-100 text-kiet-700 flex items-center justify-center mb-6">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Grow</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Develop leadership, problem-solving, and communication skills that prepare you for top hackathons and internships.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 3 — TARGETED FIRST-YEAR SECTION */}
        <section id="why-join" className="py-16 sm:py-24 bg-slate-900 text-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-8 sm:p-12 md:p-16 max-w-4xl mx-auto text-center backdrop-blur-sm">
              
              <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                <Sparkles className="w-4 h-4" />
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
                  className="w-full sm:w-auto inline-flex items-center justify-center text-base font-bold text-slate-900 bg-white hover:bg-slate-100 px-8 py-3.5 rounded-xl shadow-md transition-all gap-2"
                >
                  <span>Apply as First-Year Student</span>
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 4 — AREAS TO EXPLORE */}
        <section id="explore" className="py-16 sm:py-24 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-xs font-bold text-dsdl-600 uppercase tracking-widest mb-2">Technical Domains</h2>
              <p className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Areas You Can Explore Through DSDL
              </p>
              <p className="text-sm sm:text-base text-slate-600 mt-2">
                Discover technologies that align with your interests during recruitment and active club workshops.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
              {INTEREST_OPTIONS.map((area) => {
                const IconComponent = iconMap[area] || Sparkles;
                return (
                  <div 
                    key={area}
                    className="p-4 bg-slate-50 border border-slate-200/70 rounded-xl flex flex-col items-center text-center hover:bg-dsdl-50 hover:border-dsdl-300 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 text-dsdl-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-xs">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-dsdl-700">
                      {area}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 5 — RECRUITMENT PROCESS */}
        <section id="process" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <h2 className="text-xs font-bold text-dsdl-600 uppercase tracking-widest mb-2">Selection Roadmap</h2>
              <p className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Recruitment Timeline
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              
              {/* Step 1 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
                <div className="text-3xl font-black text-dsdl-200 mb-2">01</div>
                <h3 className="text-base font-bold text-slate-900 mb-1">Register Online</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Fill out the quick online application form with your branch, details, and technical interests.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
                <div className="text-3xl font-black text-dsdl-200 mb-2">02</div>
                <h3 className="text-base font-bold text-slate-900 mb-1">Application Screening</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Applications are reviewed by the DSDL team to identify enthusiastic learners.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
                <div className="text-3xl font-black text-dsdl-200 mb-2">03</div>
                <h3 className="text-base font-bold text-slate-900 mb-1">Interaction Round</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Shortlisted candidates attend a friendly interaction to discuss learning goals and curiosity.
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
                <div className="text-3xl font-black text-kiet-500 mb-2">04</div>
                <h3 className="text-base font-bold text-slate-900 mb-1">Welcome to DSDL</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Selected members join the official club community, workshops, and project teams.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* FINAL CTA BANNER */}
        <section className="py-12 sm:py-16 bg-gradient-to-r from-dsdl-900 via-dsdl-800 to-dsdl-950 text-white text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Ready to Take the First Step?</h2>
            <p className="mt-3 text-sm sm:text-base text-dsdl-200">
              Applications for KIET DSDL Recruitment 2026 are actively being accepted.
            </p>
            <div className="mt-6">
              <Link
                to="/register"
                className="inline-flex items-center justify-center text-base font-bold text-dsdl-900 bg-white hover:bg-dsdl-50 px-8 py-3.5 rounded-xl shadow-lg transition-transform hover:scale-105 gap-2"
              >
                <span>Register for DSDL Recruitment Now</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
