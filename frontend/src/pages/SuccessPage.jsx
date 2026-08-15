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
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-grow py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto">
          
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg p-6 sm:p-10 text-center relative overflow-hidden">
            
            {/* Top decorative accent */}
            <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-dsdl-600 via-emerald-500 to-dsdl-600" />

            {/* Success Icon */}
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Registration Submitted! 🎉
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-md mx-auto">
              Your DSDL Recruitment 2026 application has been successfully stored in our system.
            </p>

            {/* Registration Summary Card */}
            <div className="my-8 bg-slate-50 border border-slate-200/80 rounded-2xl p-6 text-left space-y-4">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Registration ID</span>
                  <span className="text-lg font-extrabold text-dsdl-700 tracking-wider font-mono">
                    {registrationId}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="inline-flex items-center space-x-1 text-xs font-semibold text-dsdl-600 hover:text-dsdl-800 bg-white border border-dsdl-200 px-3 py-1.5 rounded-lg shadow-xs transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy ID'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-bold text-slate-400 block uppercase">Student Name</span>
                  <span className="font-bold text-slate-800 text-sm">{applicant?.fullName || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-400 block uppercase">Roll Number</span>
                  <span className="font-bold text-slate-800 text-sm">{applicant?.rollNumber || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-400 block uppercase">Branch</span>
                  <span className="font-bold text-slate-800">{applicant?.branch || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-400 block uppercase">Submission Date</span>
                  <span className="font-medium text-slate-700">
                    {submittedAt ? new Date(submittedAt).toLocaleDateString('en-IN') : 'Just now'}
                  </span>
                </div>
              </div>

            </div>

            {/* Next Step Banner */}
            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl mb-8 text-left space-y-3">
              <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Next Step — Join the Official WhatsApp Group</span>
              </h3>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Stay updated regarding interview schedules, screening results, and recruitment announcements by joining the WhatsApp group.
              </p>
              
              <a
                href={DEFAULT_WHATSAPP_GROUP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center space-x-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 py-3 rounded-xl shadow-md transition-colors"
              >
                <span>Join Official WhatsApp Group Now</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Action buttons */}
            <div className="flex justify-center">
              <Link
                to="/"
                className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-5 py-2.5 rounded-xl transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Back to DSDL Home</span>
              </Link>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
