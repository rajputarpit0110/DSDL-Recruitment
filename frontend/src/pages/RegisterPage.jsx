import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Star, CheckCircle2, AlertCircle, ArrowLeft, Loader2, MessageSquare, ExternalLink, ShieldCheck
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';
import {
  BRANCH_OPTIONS, INTEREST_OPTIONS, TECHNICAL_RATING_LABELS, DEFAULT_WHATSAPP_GROUP_URL
} from '../config/recruitmentConfig';
import { saveDraft, loadDraft, clearDraft } from '../utils/draftStorage';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    rollNumber: '',
    collegeEmail: '',
    phoneNumber: '',
    branch: '',
    interests: [],
    technicalRating: 3,
    whyJoin: '',
    whatsappConfirmedByUser: false
  });

  // "Other" custom text fields — kept separate from formData
  const [otherBranch, setOtherBranch] = useState('');
  const [otherInterest, setOtherInterest] = useState('');

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  // Load draft on mount
  useEffect(() => {
    const saved = loadDraft();
    if (saved) {
      setFormData(prev => ({ ...prev, ...saved }));
    }
  }, []);

  // Save draft on state changes
  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      saveDraft(updated);
      return updated;
    });

    // Clear specific field error on typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (serverError) setServerError('');
  };

  // Toggle multi-select interest chips
  const toggleInterest = (interest) => {
    let updated;
    if (formData.interests.includes(interest)) {
      updated = formData.interests.filter(i => i !== interest);
      // Clear the custom text if "Other" is being deselected
      if (interest === 'Other') setOtherInterest('');
    } else {
      updated = [...formData.interests, interest];
    }
    handleInputChange('interests', updated);
  };

  // Client-side Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter your full name (at least 2 characters).';
    }

    if (!formData.rollNumber.trim()) {
      newErrors.rollNumber = 'University Roll Number is required.';
    }

    if (!formData.collegeEmail.trim()) {
      newErrors.collegeEmail = 'College email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.collegeEmail)) {
      newErrors.collegeEmail = 'Please enter a valid email address.';
    } else if (!formData.collegeEmail.toLowerCase().endsWith('@kiet.edu')) {
      newErrors.collegeEmail = 'Please use your official college email (@kiet.edu)';
    }

    const cleanPhone = formData.phoneNumber.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10 || !/^[6-9]/.test(cleanPhone)) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit Indian mobile number.';
    }

    if (!formData.branch) {
      newErrors.branch = 'Please select your branch.';
    } else if (formData.branch === 'Other' && !otherBranch.trim()) {
      newErrors.branch = 'Please specify your branch.';
    }

    if (!formData.interests || formData.interests.length === 0) {
      newErrors.interests = 'Please select at least one interest area.';
    } else if (formData.interests.includes('Other') && !otherInterest.trim()) {
      newErrors.interests = 'Please specify your other interest area.';
    }

    if (!formData.technicalRating) {
      newErrors.technicalRating = 'Please rate your technical knowledge.';
    }

    const whyLength = formData.whyJoin.trim().length;
    if (formData.whyJoin.trim() && whyLength < 30) {
      newErrors.whyJoin = `Please write at least 30 characters (currently ${whyLength}/30).`;
    } else if (whyLength > 500) {
      newErrors.whyJoin = `Motivation message cannot exceed 500 characters (currently ${whyLength}/500).`;
    }

    if (!formData.whatsappConfirmedByUser) {
      newErrors.whatsappConfirmedByUser = 'You must join the KML WhatsApp group to complete registration.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Build final submission payload — replace "Other" with the custom typed text
  const buildPayload = () => {
    const finalBranch = formData.branch === 'Other' && otherBranch.trim()
      ? otherBranch.trim()
      : formData.branch;

    const finalInterests = formData.interests.map(i =>
      i === 'Other' && otherInterest.trim() ? otherInterest.trim() : i
    );

    return {
      ...formData,
      branch: finalBranch,
      interests: finalInterests,
      rollNumber: formData.rollNumber.trim().toUpperCase(),
      collegeEmail: formData.collegeEmail.trim().toLowerCase(),
      phoneNumber: formData.phoneNumber.trim().replace(/\D/g, '')
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!validateForm()) {
      // Scroll to top error
      window.scrollTo({ top: 200, behavior: 'smooth' });
      return;
    }

    setSubmitting(true);
    setServerError('');

    try {
      const response = await api.post('/registrations', buildPayload());

      if (response.success) {
        clearDraft(); // Clear draft on successful submit
        navigate('/success', {
          state: {
            registrationId: response.registrationId,
            applicant: response.applicant,
            submittedAt: response.submittedAt
          },
          replace: true
        });
      }
    } catch (err) {
      console.error('Registration Error:', err);
      setServerError(err.message || 'Registration failed. Please check your inputs and try again.');
      window.scrollTo({ top: 200, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-red-600 selection:text-white">
      <Navbar />

      <main className="flex-grow py-8 sm:py-14 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl mx-auto relative z-10">

          {/* Back button */}
          <Link
            to="/"
            className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-white mb-6 transition-colors gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          {/* Form Card Header */}
          <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-10 mb-8 backdrop-blur-md">

            <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="bg-white/95 p-1.5 rounded-xl border border-white/10 shadow-xs">
                  <img src="/assets/KML.jpg" alt="KML Logo" className="h-9 w-auto rounded-md object-contain" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                    KML Recruitment 2026
                  </h1>
                  <p className="text-xs font-medium text-red-400">KIET Technical Club Application</p>
                </div>
              </div>

              <div className="hidden sm:block text-right">
                <span className="inline-block text-[11px] font-bold uppercase bg-red-950/80 text-red-400 border border-red-800/60 px-2.5 py-1 rounded-md">
                  First-Year Portal
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Take the first step in your engineering journey. Fill out the application details below to apply for KML Technical Club recruitment.
            </p>

            {/* Server Error Alert */}
            {serverError && (
              <div className="mb-6 bg-rose-950/60 border border-rose-800 rounded-2xl p-4 flex items-start gap-3 text-rose-300 text-xs sm:text-sm">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Submission Notice:</span> {serverError}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Field 1: Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="e.g. Arpit Rajput"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-medium bg-slate-950 text-white placeholder-slate-500 transition-all focus:outline-none focus:ring-2 ${errors.fullName
                      ? 'border-rose-500 bg-rose-950/20 focus:ring-rose-500/20'
                      : 'border-slate-800 focus:border-red-500 focus:ring-red-500/20'
                    }`}
                />
                {errors.fullName && <p className="mt-1 text-xs text-rose-400 font-medium">{errors.fullName}</p>}
              </div>

              {/* Field 2: University Roll Number */}
              <div>
                <label htmlFor="rollNumber" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  University Roll Number <span className="text-rose-500">*</span>
                </label>
                <input
                  id="rollNumber"
                  type="text"
                  placeholder="e.g. 202401100200084"
                  value={formData.rollNumber}
                  onChange={(e) => handleInputChange('rollNumber', e.target.value.toUpperCase())}
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-medium bg-slate-950 text-white placeholder-slate-500 transition-all focus:outline-none focus:ring-2 ${errors.rollNumber
                      ? 'border-rose-500 bg-rose-950/20 focus:ring-rose-500/20'
                      : 'border-slate-800 focus:border-red-500 focus:ring-red-500/20'
                    }`}
                />
                {errors.rollNumber && <p className="mt-1 text-xs text-rose-400 font-medium">{errors.rollNumber}</p>}
              </div>

              {/* Field 3: College Email ID */}
              <div>
                <label htmlFor="collegeEmail" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  College Email ID <span className="text-rose-500">*</span>
                </label>
                <input
                  id="collegeEmail"
                  type="email"
                  placeholder="e.g. student.24xxxx@kiet.edu"
                  value={formData.collegeEmail}
                  onChange={(e) => handleInputChange('collegeEmail', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-medium bg-slate-950 text-white placeholder-slate-500 transition-all focus:outline-none focus:ring-2 ${errors.collegeEmail
                      ? 'border-rose-500 bg-rose-950/20 focus:ring-rose-500/20'
                      : 'border-slate-800 focus:border-red-500 focus:ring-red-500/20'
                    }`}
                />
                <p className="mt-1 text-[11px] text-slate-500">Official KIET domain ending with @kiet.edu</p>
                {errors.collegeEmail && <p className="mt-1 text-xs text-rose-400 font-medium">{errors.collegeEmail}</p>}
              </div>

              {/* Field 4: Phone Number */}
              <div>
                <label htmlFor="phoneNumber" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Phone Number (WhatsApp) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-xs font-semibold text-slate-500">
                    +91
                  </div>
                  <input
                    id="phoneNumber"
                    type="tel"
                    maxLength={10}
                    placeholder="9876543210"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value.replace(/\D/g, ''))}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border text-sm font-medium bg-slate-950 text-white placeholder-slate-500 transition-all focus:outline-none focus:ring-2 ${errors.phoneNumber
                        ? 'border-rose-500 bg-rose-950/20 focus:ring-rose-500/20'
                        : 'border-slate-800 focus:border-red-500 focus:ring-red-500/20'
                      }`}
                  />
                </div>
                {errors.phoneNumber && <p className="mt-1 text-xs text-rose-400 font-medium">{errors.phoneNumber}</p>}
              </div>

              {/* Field 5: Branch Select Dropdown */}
              <div>
                <label htmlFor="branch" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Select Your Branch <span className="text-rose-500">*</span>
                </label>
                <select
                  id="branch"
                  value={formData.branch}
                  onChange={(e) => {
                    handleInputChange('branch', e.target.value);
                    if (e.target.value !== 'Other') setOtherBranch('');
                  }}
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-medium bg-slate-950 text-white transition-all focus:outline-none focus:ring-2 ${errors.branch
                      ? 'border-rose-500 bg-rose-950/20 focus:ring-rose-500/20'
                      : 'border-slate-800 focus:border-red-500 focus:ring-red-500/20'
                    }`}
                >
                  <option value="">-- Choose Branch --</option>
                  {BRANCH_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="bg-slate-900 text-white">{opt}</option>
                  ))}
                </select>

                {/* "Other" branch text input — shown only when Other is selected */}
                {formData.branch === 'Other' && (
                  <div className="mt-2">
                    <input
                      id="otherBranch"
                      type="text"
                      autoFocus
                      placeholder="Please specify your branch..."
                      value={otherBranch}
                      onChange={(e) => {
                        setOtherBranch(e.target.value);
                        if (errors.branch) setErrors(prev => ({ ...prev, branch: '' }));
                      }}
                      className={`w-full px-4 py-3 rounded-xl border text-sm font-medium bg-slate-950 text-white transition-all focus:outline-none focus:ring-2 ${errors.branch
                          ? 'border-rose-500 bg-rose-950/20 focus:ring-rose-500/20'
                          : 'border-red-800 bg-red-950/30 focus:border-red-500 focus:ring-red-500/20'
                        }`}
                    />
                  </div>
                )}

                {errors.branch && <p className="mt-1 text-xs text-rose-400 font-medium">{errors.branch}</p>}
              </div>

              {/* Field 6: Multi-Select Interest Areas */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Which areas are you interested in? <span className="text-rose-500">*</span>
                </label>
                <p className="text-[11px] text-slate-400 mb-3">Select one or multiple domains you'd like to explore:</p>

                <div className="flex flex-wrap gap-2">
                  {INTEREST_OPTIONS.map((interest) => {
                    const isSelected = formData.interests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${isSelected
                            ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-sm ring-2 ring-red-500/40'
                            : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800 hover:border-slate-700'
                          }`}
                      >
                        {isSelected ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        ) : (
                          <span className="w-3.5 h-3.5 border border-slate-600 rounded-full inline-block" />
                        )}
                        <span>{interest}</span>
                      </button>
                    );
                  })}
                </div>

                {/* "Other" interest text input — shown only when Other chip is selected */}
                {formData.interests.includes('Other') && (
                  <div className="mt-3">
                    <input
                      id="otherInterest"
                      type="text"
                      autoFocus
                      placeholder="Please specify your interest area..."
                      value={otherInterest}
                      onChange={(e) => {
                        setOtherInterest(e.target.value);
                        if (errors.interests) setErrors(prev => ({ ...prev, interests: '' }));
                      }}
                      className={`w-full px-4 py-3 rounded-xl border text-sm font-medium bg-slate-950 text-white transition-all focus:outline-none focus:ring-2 ${errors.interests
                          ? 'border-rose-500 bg-rose-950/20 focus:ring-rose-500/20'
                          : 'border-red-800 bg-red-950/30 focus:border-red-500 focus:ring-red-500/20'
                        }`}
                    />
                  </div>
                )}

                {errors.interests && <p className="mt-2 text-xs text-rose-400 font-medium">{errors.interests}</p>}
              </div>

              {/* Field 7: Technical Knowledge Rating Component */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  How would you rate your technical knowledge? <span className="text-rose-500">*</span>
                </label>

                <div className="flex items-center space-x-2 my-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = star <= formData.technicalRating;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleInputChange('technicalRating', star)}
                        className="p-1 text-slate-600 hover:text-amber-400 focus:outline-none transition-colors"
                        aria-label={`Rate ${star} stars`}
                      >
                        <Star className={`w-8 h-8 ${active ? 'text-amber-400 fill-amber-400' : 'text-slate-800'}`} />
                      </button>
                    );
                  })}
                  <span className="text-sm font-bold text-slate-300 ml-2">
                    {formData.technicalRating} / 5
                  </span>
                </div>
                <p className="text-xs text-red-300 font-medium bg-red-950/60 px-3 py-1.5 rounded-lg border border-red-800/60 w-fit">
                  {TECHNICAL_RATING_LABELS[formData.technicalRating]}
                </p>
                {errors.technicalRating && <p className="mt-1 text-xs text-rose-400 font-medium">{errors.technicalRating}</p>}
              </div>

              {/* Field 8: Why Join KML Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="whyJoin" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Why do you want to join KML? <span className="text-rose-500">*</span>
                  </label>
                  <span className={`text-xs font-semibold ${formData.whyJoin.trim().length > 500 ? 'text-rose-400' : 'text-slate-500'
                    }`}>
                    {formData.whyJoin.trim().length} / 500
                  </span>
                </div>
                <textarea
                  id="whyJoin"
                  rows={4}
                  placeholder="Tell us what motivates you to join KML, your learning goals, or any projects you'd love to work on..."
                  value={formData.whyJoin}
                  onChange={(e) => handleInputChange('whyJoin', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-medium bg-slate-950 text-white placeholder-slate-500 transition-all focus:outline-none focus:ring-2 ${errors.whyJoin
                      ? 'border-rose-500 bg-rose-950/20 focus:ring-rose-500/20'
                      : 'border-slate-800 focus:border-red-500 focus:ring-red-500/20'
                    }`}
                />
                {errors.whyJoin && <p className="mt-1 text-xs text-rose-400 font-medium">{errors.whyJoin}</p>}
              </div>

              {/* Field 9: WhatsApp Group Join & Confirmation */}
              <div className={`p-4 rounded-2xl space-y-3 border ${
                errors.whatsappConfirmedByUser
                  ? 'bg-rose-950/40 border-rose-800'
                  : 'bg-emerald-950/40 border-emerald-800/60'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className={`w-5 h-5 ${errors.whatsappConfirmedByUser ? 'text-rose-400' : 'text-emerald-400'}`} />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                      Join Official KML WhatsApp Group <span className="text-rose-400">*</span>
                    </span>
                  </div>
                  <a
                    href={DEFAULT_WHATSAPP_GROUP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded-lg transition-colors shadow-xs"
                  >
                    <span>Join WhatsApp</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <label className="flex items-start space-x-3 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={formData.whatsappConfirmedByUser}
                    onChange={(e) => {
                      handleInputChange('whatsappConfirmedByUser', e.target.checked);
                      if (errors.whatsappConfirmedByUser) setErrors(prev => ({ ...prev, whatsappConfirmedByUser: '' }));
                    }}
                    className="mt-0.5 h-4 w-4 text-emerald-600 rounded border-slate-700 bg-slate-950 focus:ring-emerald-500"
                  />
                  <span className="text-xs font-semibold text-slate-300">
                    I confirm that I have joined the KML WhatsApp group to receive recruitment updates.
                    <span className="text-rose-400 ml-1">(Required)</span>
                  </span>
                </label>
                {errors.whatsappConfirmedByUser && (
                  <p className="text-xs text-rose-400 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {errors.whatsappConfirmedByUser}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center text-base font-bold text-white bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-red-600 active:from-red-700 active:to-red-800 disabled:opacity-50 py-4 rounded-xl shadow-lg shadow-red-600/30 transition-all gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>Submit Registration</span>
                  </>
                )}
              </button>

            </form>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
