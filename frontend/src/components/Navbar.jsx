import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, Shield } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isRegisterPage = location.pathname === '/register';

  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-850 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo Composition */}
          <Link to="/" className="flex items-center space-x-3 sm:space-x-4 group">
            {/* KIET University Logo */}
            <div className="flex items-center bg-white/95 px-2 py-1 rounded-lg border border-white/10 shadow-xs">
              <img 
                src="/assets/kiet-logo.png" 
                alt="KIET Group of Institutions Logo" 
                className="h-7 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </div>
            
            {/* Divider Line */}
            <div className="h-6 sm:h-8 w-[1px] bg-slate-800" />

            {/* KML Technical Club Logo */}
            <div className="flex items-center space-x-2 bg-white/95 px-2 py-1 rounded-lg border border-white/10 shadow-xs">
              <img 
                src="/assets/KML.jpg" 
                alt="KML Logo" 
                className="h-7 sm:h-9 w-auto object-contain rounded-md transition-transform group-hover:scale-105"
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium text-slate-300 hover:text-red-500 transition-colors">
              Home
            </Link>
            <a href="/#about" className="text-sm font-medium text-slate-300 hover:text-red-500 transition-colors">
              About KML
            </a>
            <a href="/#why-join" className="text-sm font-medium text-slate-300 hover:text-red-500 transition-colors">
              Why Join
            </a>
            <a href="/#explore" className="text-sm font-medium text-slate-300 hover:text-red-500 transition-colors">
              Areas to Explore
            </a>
            <a href="/#process" className="text-sm font-medium text-slate-300 hover:text-red-500 transition-colors">
              Process
            </a>
            <a href="/#developer" className="text-sm font-medium text-slate-300 hover:text-red-500 transition-colors">
              Developer
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center space-x-3">
            <Link
              to="/admin/login"
              className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800/80 transition-colors flex items-center gap-1.5 border border-transparent hover:border-slate-700"
            >
              <Shield className="w-3.5 h-3.5 text-red-500" />
              Admin Portal
            </Link>

            {!isRegisterPage && (
              <Link
                to="/register"
                className="inline-flex items-center justify-center text-sm font-semibold text-white bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-red-600 active:from-red-700 active:to-red-800 px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg shadow-red-600/30 transition-all gap-2 hover:-translate-y-0.5"
              >
                <span>Register Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex sm:hidden items-center space-x-2">
            {!isRegisterPage && (
              <Link
                to="/register"
                className="text-xs font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 px-3.5 py-1.5 rounded-lg shadow-sm"
              >
                Register
              </Link>
            )}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3 shadow-2xl">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-slate-200 hover:text-red-400 py-2 border-b border-slate-800"
          >
            Home
          </Link>
          <a
            href="/#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-slate-200 hover:text-red-400 py-2 border-b border-slate-800"
          >
            About KML
          </a>
          <a
            href="/#why-join"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-slate-200 hover:text-red-400 py-2 border-b border-slate-800"
          >
            Why Join
          </a>
          <a
            href="/#explore"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-slate-200 hover:text-red-400 py-2 border-b border-slate-800"
          >
            Areas to Explore
          </a>
          <a
            href="/#process"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-slate-200 hover:text-red-400 py-2 border-b border-slate-800"
          >
            Recruitment Process
          </a>
          <a
            href="/#developer"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-slate-200 hover:text-red-400 py-2 border-b border-slate-800"
          >
            Meet the Developer
          </a>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center text-sm font-bold text-white bg-gradient-to-r from-red-600 via-rose-600 to-red-700 py-3.5 rounded-xl shadow-md shadow-red-600/30"
            >
              Register for KML Recruitment
            </Link>
            <Link
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 py-2.5 rounded-xl border border-slate-700"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
