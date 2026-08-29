import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle2, MessageSquare, ExternalLink, Home, Copy, Check } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { DEFAULT_WHATSAPP_GROUP_URL } from '../config/recruitmentConfig';

export default function SuccessPage() {
  const location = useLocation();
  const state = location.state;
  const [copied, setCopied] = React.useState(false);

  // If no registration state is present, redirect to home
  if (!state || !state.registrationId) {
    return <Navigate to="/" replace />;
  }

  const { registrationId, applicant, submittedAt } = state;

  const handleCopyId = () => {
    navigator.clipboard.writeText(registrationId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-red-600 selection:text-white">
      <Navbar />

      <main className="flex-grow py-12 sm:py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-xl mx-auto relative z-10">
          
          <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-10 text-center relative overflow-hidden backdrop-blur-md">
            
            {/* Top decorative accent */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-rose-500 to-red-600" />

            {/* Success Icon */}
            <div className="w-16 h-16 bg-red-950/70 border border-red-800/60 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-950/40">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Registration Submitted! 🎉
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-md mx-auto">
              Your KML Recruitment 2026 application has been successfully stored in our system.
            </p>

            {/* Registration Summary Card */}
            <div className="my-8 bg-slate-950/70 border border-slate-800/90 rounded-2xl p-6 text-left space-y-4">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Registration ID</span>
                  <span className="text-lg font-extrabold text-red-400 tracking-wider font-mono">
                    {registrationId}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg shadow-xs transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy ID'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-bold text-slate-500 block uppercase">Student Name</span>
                  <span className="font-bold text-white text-sm">{applicant?.fullName || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-500 block uppercase">Roll Number</span>
                  <span className="font-bold text-white text-sm">{applicant?.rollNumber || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-500 block uppercase">Branch</span>
                  <span className="font-bold text-slate-300">{applicant?.branch || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-500 block uppercase">Submission Date</span>
                  <span className="font-medium text-slate-400">
                    {submittedAt ? new Date(submittedAt).toLocaleDateString('en-IN') : 'Just now'}
                  </span>
                </div>
              </div>

            </div>

            {/* Next Step Banner */}
            <div className="bg-emerald-950/40 border border-emerald-800/60 p-6 rounded-2xl mb-8 text-left space-y-3">
              <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Next Step — Join the Official WhatsApp Group</span>
              </h3>
              <p className="text-xs text-emerald-200/80 leading-relaxed">
                Stay updated regarding interview schedules, screening results, and recruitment announcements by joining the WhatsApp group.
              </p>
              
              <a
                href={DEFAULT_WHATSAPP_GROUP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center space-x-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 py-3 rounded-xl shadow-md transition-colors"
              >
                <span>Join Official WhatsApp Group Now</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Action buttons */}
            <div className="flex justify-center">
              <Link
                to="/"
                className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-5 py-2.5 rounded-xl border border-slate-700 transition-colors"
              >
                <Home className="w-4 h-4 text-red-500" />
                <span>Back to KML Home</span>
              </Link>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
