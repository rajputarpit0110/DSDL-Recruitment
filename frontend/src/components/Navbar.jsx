import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, Shield } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isRegisterPage = location.pathname === '/register';

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo Composition */}
          <Link to="/" className="flex items-center space-x-3 sm:space-x-4 group">
            {/* KIET University Logo */}
            <div className="flex items-center">
              <img 
                src="/assets/kiet-logo.png" 
                alt="KIET Group of Institutions Logo" 
                className="h-9 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </div>
            
            {/* Divider Line */}
            <div className="h-6 sm:h-8 w-[1px] bg-slate-200" />

            {/* DSDL Technical Club Logo */}
            <div className="flex items-center space-x-2">
              <img 
                src="/assets/dsdl-logo.png" 
                alt="DSDL Technical Club Logo" 
                className="h-10 sm:h-14 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium text-slate-600 hover:text-dsdl-600 transition-colors">
              Home
            </Link>
            <a href="/#about" className="text-sm font-medium text-slate-600 hover:text-dsdl-600 transition-colors">
              About DSDL
            </a>
            <a href="/#why-join" className="text-sm font-medium text-slate-600 hover:text-dsdl-600 transition-colors">
              Why Join
            </a>
            <a href="/#explore" className="text-sm font-medium text-slate-600 hover:text-dsdl-600 transition-colors">
              Areas to Explore
            </a>
            <a href="/#process" className="text-sm font-medium text-slate-600 hover:text-dsdl-600 transition-colors">
              Process
            </a>
            <a href="/#developer" className="text-sm font-medium text-slate-600 hover:text-dsdl-600 transition-colors">
              Developer
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center space-x-3">
            <Link
              to="/admin/login"
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              Admin Portal
            </Link>

            {!isRegisterPage && (
              <Link
                to="/register"
                className="inline-flex items-center justify-center text-sm font-semibold text-white bg-dsdl-600 hover:bg-dsdl-700 active:bg-dsdl-800 px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg shadow-dsdl-600/20 transition-all gap-2"
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
                className="text-xs font-bold text-white bg-dsdl-600 px-3 py-1.5 rounded-lg"
              >
                Register
              </Link>
            )}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-slate-800 hover:text-dsdl-600 py-2 border-b border-slate-100"
          >
            Home
          </Link>
          <a
            href="/#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-slate-800 hover:text-dsdl-600 py-2 border-b border-slate-100"
          >
            About DSDL
          </a>
          <a
            href="/#why-join"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-slate-800 hover:text-dsdl-600 py-2 border-b border-slate-100"
          >
            Why Join
          </a>
          <a
            href="/#explore"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-slate-800 hover:text-dsdl-600 py-2 border-b border-slate-100"
          >
            Areas to Explore
          </a>
          <a
            href="/#process"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-slate-800 hover:text-dsdl-600 py-2 border-b border-slate-100"
          >
            Recruitment Process
          </a>
          <a
            href="/#developer"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-slate-800 hover:text-dsdl-600 py-2 border-b border-slate-100"
          >
            Meet the Developer
          </a>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center text-sm font-semibold text-white bg-dsdl-600 py-3 rounded-xl shadow-md"
            >
              Register for DSDL Recruitment
            </Link>
            <Link
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center text-xs font-semibold text-slate-600 bg-slate-100 py-2.5 rounded-xl"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
