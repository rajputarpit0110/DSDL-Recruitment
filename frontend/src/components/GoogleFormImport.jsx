import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, X, RefreshCw } from 'lucide-react';
import api from '../services/api';

export default function GoogleFormImport({ onImportSuccess }) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null); // { success, message, summary, errors, detectedColumns }
  const inputRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    const ext = f.name.toLowerCase();
    if (!ext.endsWith('.csv') && !ext.endsWith('.xlsx') && !ext.endsWith('.xls')) {
      setResult({ success: false, message: 'Invalid file type. Only .csv, .xlsx, or .xls files are allowed.' });
      return;
    }
    setFile(f);
    setResult(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleImport = async () => {
    if (!file) return;
    setImporting(true);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append('sheet', file);

      const response = await api.post('/admin/google-form/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response);
      if (response.success && onImportSuccess) onImportSuccess();
    } catch (err) {
      setResult({ success: false, message: err.message || 'Import failed. Please try again.' });
    } finally {
      setImporting(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragEnter={(e) => { e.preventDefault(); setDragging(true); }}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !file && inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer
          ${file
            ? 'border-emerald-300 bg-emerald-50/60'
            : dragging
              ? 'border-dsdl-400 bg-dsdl-50 scale-[1.01]'
              : 'border-slate-300 bg-slate-50 hover:border-dsdl-400 hover:bg-dsdl-50/50'
          }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />

        {file ? (
          <div className="flex items-center justify-center space-x-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-slate-900 truncate max-w-[220px]">{file.name}</p>
              <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB • Ready to import</p>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleReset(); }}
              className="ml-2 p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2.5">
            <div className="p-3 bg-slate-200 text-slate-500 rounded-xl">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700">
                Drop your Google Form sheet here
              </p>
              <p className="text-xs text-slate-500 mt-0.5">or click to browse — CSV, XLSX, XLS supported</p>
            </div>
          </div>
        )}
      </div>

      {/* Import Button */}
      {file && !result?.success && (
        <button
          type="button"
          disabled={importing}
          onClick={handleImport}
          className="w-full flex items-center justify-center space-x-2 py-2.5 text-sm font-bold text-white bg-dsdl-600 hover:bg-dsdl-700 disabled:opacity-60 rounded-xl transition-colors shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${importing ? 'animate-spin' : ''}`} />
          <span>{importing ? 'Importing...' : 'Import Sheet'}</span>
        </button>
      )}

      {/* Result Card */}
      {result && (
        <div className={`rounded-2xl border p-4 space-y-3 text-xs
          ${result.success
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          <div className="flex items-start space-x-2">
            {result.success
              ? <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              : <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
            }
            <p className="font-semibold leading-snug">{result.message}</p>
          </div>

          {result.success && result.summary && (
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { label: '✅ New',     val: result.summary.imported },
                { label: '🔄 Updated', val: result.summary.updated  },
                { label: '⏭ Skipped', val: result.summary.skipped  },
              ].map(({ label, val }) => (
                <div key={label} className="bg-white/70 rounded-xl p-2.5 text-center border border-emerald-200/60">
                  <p className="font-extrabold text-base text-emerald-800">{val}</p>
                  <p className="text-[10px] text-emerald-700 font-semibold">{label}</p>
                </div>
              ))}
            </div>
          )}

          {result.detectedColumns && result.detectedColumns.length > 0 && (
            <p className="text-[11px] text-emerald-700 font-medium">
              Detected fields: {result.detectedColumns.join(', ')}
            </p>
          )}

          {result.errors && result.errors.length > 0 && (
            <div className="space-y-1 pt-1">
              <p className="font-bold text-rose-700">Row Errors ({result.errors.length}):</p>
              {result.errors.slice(0, 5).map((e, i) => (
                <p key={i} className="text-[11px] text-rose-600 font-mono">
                  Row {e.row} ({e.rollNumber}): {e.error}
                </p>
              ))}
            </div>
          )}

          {result.detectedHeaders && (
            <div className="pt-1">
              <p className="font-bold text-rose-700 mb-1">Your file's headers:</p>
              <p className="text-[11px] font-mono text-rose-600 break-words">
                {result.detectedHeaders.join(' | ')}
              </p>
              <p className="text-[11px] mt-1 text-rose-700">
                Ensure columns include: Name, Roll Number, Email, Phone, Branch, Interests, Rating, Why Join
              </p>
            </div>
          )}

          {result.success && (
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              Import another file →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
