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
    if (whyLength < 30) {
      newErrors.whyJoin = `Please write at least 30 characters (currently ${whyLength}/30).`;
    } else if (whyLength > 500) {
      newErrors.whyJoin = `Motivation message cannot exceed 500 characters (currently ${whyLength}/500).`;
    }

    if (!formData.whatsappConfirmedByUser) {
      newErrors.whatsappConfirmedByUser = 'You must join the DSDL WhatsApp group to complete registration.';
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
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-grow py-8 sm:py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">

          {/* Back button */}
          <Link
            to="/"
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-dsdl-600 mb-6 transition-colors gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          {/* Form Card Header */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 mb-8">

            <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <img src="/assets/dsdl-logo.png" alt="DSDL Logo" className="h-10 w-auto" />
                <div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    DSDL Recruitment 2026
                  </h1>
                  <p className="text-xs font-medium text-dsdl-600">KIET Technical Club Application</p>
                </div>
              </div>

              <div className="hidden sm:block text-right">
                <span className="inline-block text-[11px] font-bold uppercase bg-dsdl-50 text-dsdl-700 border border-dsdl-200 px-2.5 py-1 rounded-md">
                  First-Year Portal
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              Take the first step in your engineering journey. Fill out the application details below to apply for DSDL Technical Club recruitment.
            </p>

            {/* Server Error Alert */}
            {serverError && (
              <div className="mb-6 bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3 text-rose-800 text-xs sm:text-sm">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Submission Notice:</span> {serverError}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Field 1: Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="e.g. Arpit Rajput"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all focus:outline-none focus:ring-2 ${errors.fullName
                      ? 'border-rose-300 bg-rose-50/30 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-dsdl-500 focus:ring-dsdl-100'
                    }`}
                />
                {errors.fullName && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.fullName}</p>}
              </div>

              {/* Field 2: University Roll Number */}
              <div>
                <label htmlFor="rollNumber" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  University Roll Number <span className="text-rose-500">*</span>
                </label>
                <input
                  id="rollNumber"
                  type="text"
                  placeholder="e.g. 202401100200084"
                  value={formData.rollNumber}
                  onChange={(e) => handleInputChange('rollNumber', e.target.value.toUpperCase())}
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all focus:outline-none focus:ring-2 ${errors.rollNumber
                      ? 'border-rose-300 bg-rose-50/30 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-dsdl-500 focus:ring-dsdl-100'
                    }`}
                />
                {errors.rollNumber && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.rollNumber}</p>}
              </div>

              {/* Field 3: College Email ID */}
              <div>
                <label htmlFor="collegeEmail" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  College Email ID <span className="text-rose-500">*</span>
                </label>
                <input
                  id="collegeEmail"
                  type="email"
                  placeholder="e.g. student.24xxxx@kiet.edu"
                  value={formData.collegeEmail}
                  onChange={(e) => handleInputChange('collegeEmail', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all focus:outline-none focus:ring-2 ${errors.collegeEmail
                      ? 'border-rose-300 bg-rose-50/30 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-dsdl-500 focus:ring-dsdl-100'
                    }`}
                />
                <p className="mt-1 text-[11px] text-slate-500">Official KIET domain ending with @kiet.edu</p>
                {errors.collegeEmail && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.collegeEmail}</p>}
              </div>

              {/* Field 4: Phone Number */}
              <div>
                <label htmlFor="phoneNumber" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Phone Number (WhatsApp) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-xs font-semibold text-slate-400">
                    +91
                  </div>
                  <input
                    id="phoneNumber"
                    type="tel"
                    maxLength={10}
                    placeholder="9876543210"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value.replace(/\D/g, ''))}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border text-sm font-medium transition-all focus:outline-none focus:ring-2 ${errors.phoneNumber
                        ? 'border-rose-300 bg-rose-50/30 focus:ring-rose-200'
                        : 'border-slate-200 focus:border-dsdl-500 focus:ring-dsdl-100'
                      }`}
                  />
                </div>
                {errors.phoneNumber && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.phoneNumber}</p>}
              </div>

              {/* Field 5: Branch Select Dropdown */}
              <div>
                <label htmlFor="branch" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Select Your Branch <span className="text-rose-500">*</span>
                </label>
                <select
                  id="branch"
                  value={formData.branch}
                  onChange={(e) => {
                    handleInputChange('branch', e.target.value);
                    if (e.target.value !== 'Other') setOtherBranch('');
                  }}
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-medium bg-white transition-all focus:outline-none focus:ring-2 ${errors.branch
                      ? 'border-rose-300 bg-rose-50/30 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-dsdl-500 focus:ring-dsdl-100'
                    }`}
                >
                  <option value="">-- Choose Branch --</option>
                  {BRANCH_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
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
                      className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all focus:outline-none focus:ring-2 ${errors.branch
                          ? 'border-rose-300 bg-rose-50/30 focus:ring-rose-200'
                          : 'border-dsdl-300 bg-dsdl-50/40 focus:border-dsdl-500 focus:ring-dsdl-100'
                        }`}
                    />
                  </div>
                )}

                {errors.branch && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.branch}</p>}
              </div>

              {/* Field 6: Multi-Select Interest Areas */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Which areas are you interested in? <span className="text-rose-500">*</span>
                </label>
                <p className="text-[11px] text-slate-500 mb-3">Select one or multiple domains you'd like to explore:</p>

                <div className="flex flex-wrap gap-2">
                  {INTEREST_OPTIONS.map((interest) => {
                    const isSelected = formData.interests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${isSelected
                            ? 'bg-dsdl-600 text-white shadow-sm ring-2 ring-dsdl-600/30'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                          }`}
                      >
                        {isSelected ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <span className="w-3.5 h-3.5 border border-slate-400 rounded-full inline-block" />
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
                      className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all focus:outline-none focus:ring-2 ${errors.interests
                          ? 'border-rose-300 bg-rose-50/30 focus:ring-rose-200'
                          : 'border-dsdl-300 bg-dsdl-50/40 focus:border-dsdl-500 focus:ring-dsdl-100'
                        }`}
                    />
                  </div>
                )}

                {errors.interests && <p className="mt-2 text-xs text-rose-600 font-medium">{errors.interests}</p>}
              </div>

              {/* Field 7: Technical Knowledge Rating Component */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
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
                        className="p-1 text-slate-300 hover:text-amber-400 focus:outline-none transition-colors"
                        aria-label={`Rate ${star} stars`}
                      >
                        <Star className={`w-8 h-8 ${active ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                      </button>
                    );
                  })}
                  <span className="text-sm font-bold text-slate-700 ml-2">
                    {formData.technicalRating} / 5
                  </span>
                </div>
                <p className="text-xs text-dsdl-700 font-medium bg-dsdl-50/80 px-3 py-1.5 rounded-lg border border-dsdl-100 w-fit">
                  {TECHNICAL_RATING_LABELS[formData.technicalRating]}
                </p>
                {errors.technicalRating && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.technicalRating}</p>}
              </div>

              {/* Field 8: Why Join DSDL Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="whyJoin" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Why do you want to join DSDL? <span className="text-rose-500">*</span>
                  </label>
                  <span className={`text-xs font-semibold ${formData.whyJoin.trim().length > 500 ? 'text-rose-600' : 'text-slate-400'
                    }`}>
                    {formData.whyJoin.trim().length} / 500
                  </span>
                </div>
                <textarea
                  id="whyJoin"
                  rows={4}
                  placeholder="Tell us what motivates you to join DSDL, your learning goals, or any projects you'd love to work on..."
                  value={formData.whyJoin}
                  onChange={(e) => handleInputChange('whyJoin', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all focus:outline-none focus:ring-2 ${errors.whyJoin
                      ? 'border-rose-300 bg-rose-50/30 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-dsdl-500 focus:ring-dsdl-100'
                    }`}
                />
                {errors.whyJoin && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.whyJoin}</p>}
              </div>

              {/* Field 9: WhatsApp Group Join & Confirmation */}
              <div className={`p-4 rounded-2xl space-y-3 border ${
                errors.whatsappConfirmedByUser
                  ? 'bg-rose-50/60 border-rose-300'
                  : 'bg-emerald-50/80 border-emerald-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className={`w-5 h-5 ${errors.whatsappConfirmedByUser ? 'text-rose-500' : 'text-emerald-600'}`} />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-950">
                      Join Official DSDL WhatsApp Group <span className="text-rose-500">*</span>
                    </span>
                  </div>
                  <a
                    href={DEFAULT_WHATSAPP_GROUP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg transition-colors shadow-xs"
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
                    className="mt-0.5 h-4 w-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                  <span className="text-xs font-semibold text-slate-700">
                    I confirm that I have joined the DSDL WhatsApp group to receive recruitment updates.
                    <span className="text-rose-500 ml-1">(Required)</span>
                  </span>
                </label>
                {errors.whatsappConfirmedByUser && (
                  <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {errors.whatsappConfirmedByUser}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center text-base font-bold text-white bg-dsdl-600 hover:bg-dsdl-700 active:bg-dsdl-800 disabled:bg-dsdl-300 py-4 rounded-xl shadow-lg shadow-dsdl-600/30 transition-all gap-2"
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
