import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Users, Calendar, Star, Award, Search, Filter, Download, RefreshCw, LogOut, 
  ChevronLeft, ChevronRight, Eye, Trash2, CheckCircle, Clock, Copy, X, AlertCircle, FileSpreadsheet, Layers
} from 'lucide-react';
import api from '../services/api';
import { BRANCH_OPTIONS, INTEREST_OPTIONS, STATUS_OPTIONS } from '../config/recruitmentConfig';

// Lazy load heavy analytics component
const AdminAnalytics = lazy(() => import('../components/AdminAnalytics'));

export default function AdminDashboardPage({ admin, onLogout }) {
  const navigate = useNavigate();

  // Registrations & Pagination State
  const [registrations, setRegistrations] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 25, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Analytics State
  const [analytics, setAnalytics] = useState(null);

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [selectedInterest, setSelectedInterest] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Modals & Active Applicant State
  const [activeApplicant, setActiveApplicant] = useState(null);
  const [applicantModalOpen, setApplicantModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Action Status Alerts
  const [actionAlert, setActionAlert] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [syncingSheets, setSyncingSheets] = useState(false);

  // Fetch registrations from server
  const fetchRegistrations = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: pagination.limit,
        search: search.trim() || undefined,
        branch: selectedBranch || undefined,
        rating: selectedRating || undefined,
        interest: selectedInterest || undefined,
        status: selectedStatus || undefined
      };

      const response = await api.get('/admin/registrations', { params });
      if (response.success) {
        setRegistrations(response.registrations || []);
        setPagination(response.pagination || { page: 1, limit: 25, total: 0, totalPages: 1 });
      }
    } catch (err) {
      if (err.status === 401) {
        if (onLogout) onLogout();
        navigate('/admin/login', { replace: true });
      } else {
        setActionAlert({ type: 'error', message: err.message || 'Failed to load registrations.' });
      }
    } finally {
      setLoading(false);
    }
  }, [pagination.limit, search, selectedBranch, selectedRating, selectedInterest, selectedStatus, navigate, onLogout]);

  // Fetch analytics summary
  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/admin/analytics');
      if (response.success) {
        setAnalytics(response.analytics);
      }
    } catch (err) {
      // Non-blocking analytics error
    }
  };

  useEffect(() => {
    fetchRegistrations(1);
    fetchAnalytics();
  }, [fetchRegistrations]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRegistrations(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedBranch('');
    setSelectedRating('');
    setSelectedInterest('');
    setSelectedStatus('');
  };

  // Status Change Handler
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const response = await api.patch(`/admin/registrations/${id}/status`, { status: newStatus });
      if (response.success) {
        setActionAlert({ type: 'success', message: `Status updated to "${newStatus}"` });
        fetchRegistrations(pagination.page);
        fetchAnalytics();

        if (activeApplicant && activeApplicant._id === id) {
          setActiveApplicant(response.registration);
        }
      }
    } catch (err) {
      setActionAlert({ type: 'error', message: err.message || 'Failed to update status.' });
    }
  };

  // Delete Handler
  const handleDeleteApplicant = async (id) => {
    try {
      const response = await api.delete(`/admin/registrations/${id}`);
      if (response.success) {
        setActionAlert({ type: 'success', message: 'Applicant registration deleted.' });
        setDeleteConfirmId(null);
        if (applicantModalOpen) setApplicantModalOpen(false);
        fetchRegistrations(pagination.page);
        fetchAnalytics();
      }
    } catch (err) {
      setActionAlert({ type: 'error', message: err.message || 'Failed to delete record.' });
    }
  };

  // Filtered Export Handler
  const handleExport = async (format) => {
    setExporting(true);
    try {
      const params = new URLSearchParams({
        format,
        search: search.trim() || '',
        branch: selectedBranch || '',
        rating: selectedRating || '',
        interest: selectedInterest || '',
        status: selectedStatus || ''
      });

      const exportUrl = `${import.meta.env.VITE_API_URL || '/api'}/admin/export?${params.toString()}`;
      window.open(exportUrl, '_blank');
      setActionAlert({ type: 'success', message: `Exporting ${format.toUpperCase()} data...` });
    } catch (err) {
      setActionAlert({ type: 'error', message: 'Export request failed.' });
    } finally {
      setExporting(false);
    }
  };

  // Google Sheets Sync Handler
  const handleGoogleSheetsSync = async () => {
    setSyncingSheets(true);
    try {
      const response = await api.post('/admin/google-sheets/sync');
      if (response.success) {
        setActionAlert({ type: 'success', message: response.message });
      } else {
        setActionAlert({ type: 'warning', message: response.message });
      }
    } catch (err) {
      setActionAlert({ type: 'error', message: err.message || 'Google Sheets sync failed.' });
    } finally {
      setSyncingSheets(false);
    }
  };

  // Admin Logout Handler
  const handleLogout = async () => {
    try {
      await api.post('/admin/logout');
    } catch (err) {
      // Logout clean-up regardless of response
    }
    if (onLogout) onLogout();
    navigate('/admin/login', { replace: true });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Selected': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Shortlisted': return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'Contacted': return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'Rejected': return 'bg-rose-100 text-rose-800 border-rose-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      
      {/* Top Admin Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-800 rounded-xl border border-slate-700">
                <Layers className="w-5 h-5 text-dsdl-400" />
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight text-white">DSDL Admin Dashboard</h1>
                <p className="text-[11px] text-slate-400">KIET Technical Club Recruitment 2026</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="hidden sm:inline-block text-xs text-slate-300 font-medium">
                Logged in as <strong className="text-dsdl-400">{admin?.username || 'Admin'}</strong>
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-rose-300 hover:text-rose-200 bg-rose-950/60 border border-rose-800/80 px-3 py-1.5 rounded-lg transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Action Status Toast Alert */}
        {actionAlert && (
          <div className={`mb-6 p-4 rounded-2xl border text-xs sm:text-sm font-medium flex items-center justify-between ${
            actionAlert.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
            actionAlert.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' :
            'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            <span>{actionAlert.message}</span>
            <button type="button" onClick={() => setActionAlert(null)} className="p-1 hover:opacity-75">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* METRICS CARDS OVERVIEW */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
            <div className="p-3 bg-dsdl-50 text-dsdl-600 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-400">Total Applications</p>
              <h3 className="text-2xl font-extrabold text-slate-900">{analytics?.totalRegistrations ?? pagination.total}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-400">Today's Registrations</p>
              <h3 className="text-2xl font-extrabold text-slate-900">{analytics?.todayRegistrations ?? 0}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-400">Average Tech Rating</p>
              <h3 className="text-2xl font-extrabold text-slate-900">{analytics?.averageRating ?? '0.0'} / 5</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-400">Top Branch</p>
              <h3 className="text-base font-extrabold text-slate-900 truncate max-w-[120px]">
                {analytics?.branchDistribution?.[0]?.name || 'N/A'}
              </h3>
            </div>
          </div>

        </div>

        {/* LAZY LOADED ANALYTICS CHARTS */}
        <Suspense fallback={
          <div className="h-48 bg-white rounded-2xl border border-slate-200 mb-8 flex items-center justify-center text-xs text-slate-400">
            Loading Recruitment Analytics...
          </div>
        }>
          <AdminAnalytics analytics={analytics} />
        </Suspense>

        {/* SEARCH, FILTER & EXPORT CONTROLS BAR */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs mb-8 space-y-4">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Search by Name, Roll No, Email, Phone, or Reg ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:border-dsdl-500 focus:ring-1 focus:ring-dsdl-500"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 text-xs font-bold text-white bg-dsdl-600 hover:bg-dsdl-700 rounded-xl transition-colors"
              >
                Search
              </button>
            </form>

            {/* Action Export Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={exporting}
                onClick={() => handleExport('csv')}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-2.5 rounded-xl border border-slate-200 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>

              <button
                type="button"
                disabled={exporting}
                onClick={() => handleExport('excel')}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-2.5 rounded-xl transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Export Excel (.xlsx)</span>
              </button>

              <button
                type="button"
                disabled={syncingSheets}
                onClick={handleGoogleSheetsSync}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-dsdl-700 bg-dsdl-50 hover:bg-dsdl-100 border border-dsdl-200 px-3 py-2.5 rounded-xl transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncingSheets ? 'animate-spin' : ''}`} />
                <span>Sync Google Sheets</span>
              </button>
            </div>

          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Filter className="w-3.5 h-3.5" />
              <span>Filters:</span>
            </div>

            {/* Branch Filter */}
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:border-dsdl-500"
            >
              <option value="">All Branches</option>
              {BRANCH_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>

            {/* Rating Filter */}
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:border-dsdl-500"
            >
              <option value="">All Ratings</option>
              {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
            </select>

            {/* Interest Filter */}
            <select
              value={selectedInterest}
              onChange={(e) => setSelectedInterest(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:border-dsdl-500"
            >
              <option value="">All Interests</option>
              {INTEREST_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:border-dsdl-500"
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            {(search || selectedBranch || selectedRating || selectedInterest || selectedStatus) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-bold text-rose-600 hover:underline px-2 py-1"
              >
                Clear Filters
              </button>
            )}
          </div>

        </div>

        {/* APPLICANTS TABLE / CARDS SECTION */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          
          {/* Table Header Controls */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Recruitment Applications
              </h2>
              <p className="text-xs text-slate-500">
                Showing {pagination.total > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0}–
                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} records
              </p>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-500 font-medium">Per page:</span>
              <select
                value={pagination.limit}
                onChange={(e) => setPagination(prev => ({ ...prev, limit: Number(e.target.value), page: 1 }))}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-700 focus:outline-none"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          {/* Desktop Table View */}
          {loading ? (
            <div className="p-12 text-center text-xs font-semibold text-slate-400">
              Loading applications...
            </div>
          ) : registrations.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <p className="text-sm font-bold text-slate-700">No registrations found.</p>
              <p className="text-xs text-slate-500">Try clearing your search query or active filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
                    <th className="py-3.5 px-4">Registration ID</th>
                    <th className="py-3.5 px-4">Applicant</th>
                    <th className="py-3.5 px-4">Branch</th>
                    <th className="py-3.5 px-4">Rating</th>
                    <th className="py-3.5 px-4">Interests</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                  {registrations.map((applicant) => (
                    <tr key={applicant._id} className="hover:bg-slate-50/80 transition-colors">
                      
                      <td className="py-3.5 px-4 font-mono font-bold text-dsdl-700">
                        {applicant.registrationId}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{applicant.fullName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{applicant.rollNumber}</div>
                        <div className="text-[11px] text-slate-400">{applicant.collegeEmail}</div>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {applicant.branch}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center text-amber-500 font-bold">
                          <span>{applicant.technicalRating}★</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {applicant.interests?.slice(0, 2).map(i => (
                            <span key={i} className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                              {i}
                            </span>
                          ))}
                          {applicant.interests?.length > 2 && (
                            <span className="text-[10px] font-bold text-slate-400">+{applicant.interests.length - 2}</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={applicant.status}
                          onChange={(e) => handleUpdateStatus(applicant._id, e.target.value)}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full border focus:outline-none ${getStatusBadgeClass(applicant.status)}`}
                        >
                          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {applicant.createdAt ? new Date(applicant.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            type="button"
                            onClick={() => { setActiveApplicant(applicant); setApplicantModalOpen(true); }}
                            className="p-1.5 text-dsdl-600 hover:text-dsdl-800 hover:bg-dsdl-50 rounded-lg"
                            title="View Applicant Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(applicant._id)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                            title="Delete Applicant"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Footer */}
          {pagination.totalPages > 1 && (
            <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
              <span className="text-xs text-slate-500 font-medium">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  disabled={pagination.page <= 1}
                  onClick={() => fetchRegistrations(pagination.page - 1)}
                  className="p-2 text-slate-600 border border-slate-200 rounded-xl bg-white disabled:opacity-40 hover:bg-slate-100"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => fetchRegistrations(pagination.page + 1)}
                  className="p-2 text-slate-600 border border-slate-200 rounded-xl bg-white disabled:opacity-40 hover:bg-slate-100"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

      </main>

      {/* APPLICANT DETAIL MODAL WITH STATUS HISTORY */}
      {applicantModalOpen && activeApplicant && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-dsdl-600 uppercase tracking-widest block">Applicant Detail</span>
                <h3 className="text-xl font-bold text-slate-900">{activeApplicant.fullName}</h3>
              </div>
              <button
                type="button"
                onClick={() => setApplicantModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                <span className="font-bold text-slate-400 block uppercase text-[10px]">Registration ID</span>
                <span className="font-mono font-bold text-dsdl-700 text-sm">{activeApplicant.registrationId}</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                <span className="font-bold text-slate-400 block uppercase text-[10px]">University Roll Number</span>
                <span className="font-mono font-bold text-slate-800 text-sm">{activeApplicant.rollNumber}</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                <span className="font-bold text-slate-400 block uppercase text-[10px]">College Email</span>
                <span className="font-semibold text-slate-800">{activeApplicant.collegeEmail}</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                <span className="font-bold text-slate-400 block uppercase text-[10px]">Phone Number</span>
                <span className="font-semibold text-slate-800">+91 {activeApplicant.phoneNumber}</span>
              </div>
            </div>

            {/* Technical Interests & Rating */}
            <div className="space-y-3">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Branch & Technical Rating</span>
                <div className="flex items-center space-x-3 text-xs">
                  <span className="font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">{activeApplicant.branch}</span>
                  <span className="font-bold text-amber-500 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">{activeApplicant.technicalRating} / 5 Stars</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Selected Interests</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeApplicant.interests?.map(i => (
                    <span key={i} className="text-xs font-semibold bg-dsdl-50 text-dsdl-700 px-2.5 py-1 rounded-lg border border-dsdl-200">
                      {i}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Why DSDL Statement */}
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Why Join DSDL Statement</span>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 leading-relaxed italic">
                "{activeApplicant.whyJoin}"
              </div>
            </div>

            {/* Status History Timeline */}
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Status Timeline History</span>
              <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl space-y-2 text-xs font-mono">
                {activeApplicant.statusHistory && activeApplicant.statusHistory.length > 0 ? (
                  activeApplicant.statusHistory.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b border-slate-800 pb-1.5 last:border-0 last:pb-0">
                      <span className="text-dsdl-400 font-bold">{item.status}</span>
                      <span className="text-slate-400 text-[11px]">
                        {new Date(item.changedAt).toLocaleString('en-IN')} by {item.changedBy}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-slate-500">Registered on {new Date(activeApplicant.createdAt).toLocaleString('en-IN')}</div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(activeApplicant._id)}
                className="text-xs font-bold text-rose-600 hover:text-rose-800"
              >
                Delete Applicant
              </button>

              <button
                type="button"
                onClick={() => setApplicantModalOpen(false)}
                className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-5 py-2.5 rounded-xl"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Confirm Applicant Deletion</h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to permanently remove this recruitment registration? This action cannot be undone.
            </p>

            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteApplicant(deleteConfirmId)}
                className="text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 px-4 py-2.5 rounded-xl shadow-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
