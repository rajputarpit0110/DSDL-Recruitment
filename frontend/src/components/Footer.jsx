import React from 'react';
import { Instagram, MessageSquare, ExternalLink, Heart } from 'lucide-react';
import { DEFAULT_INSTAGRAM_URL, DEFAULT_WHATSAPP_GROUP_URL } from '../config/recruitmentConfig';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3 bg-slate-800/60 p-2.5 rounded-xl w-fit border border-slate-700/50">
              <img src="/assets/kiet-logo.png" alt="KIET Logo" className="h-8 w-auto" />
              <div className="h-6 w-[1px] bg-slate-700" />
              <img src="/assets/dsdl-logo.png" alt="DSDL Logo" className="h-9 w-auto" />
            </div>
            <div>
              <h3 className="text-white text-base font-bold tracking-tight">DSDL Technical Club</h3>
              <p className="text-xs text-kiet-500 font-semibold uppercase tracking-wider mt-0.5">
                KIET Group of Institutions • Recruitment 2026
              </p>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              The student technical community at KIET University dedicated to practical software engineering, machine learning, data science, and collaborative building.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="/" className="hover:text-dsdl-300 transition-colors">Home</a></li>
              <li><a href="/#about" className="hover:text-dsdl-300 transition-colors">About DSDL</a></li>
              <li><a href="/#why-join" className="hover:text-dsdl-300 transition-colors">Why Join</a></li>
              <li><a href="/register" className="hover:text-dsdl-300 transition-colors">Register for Recruitment</a></li>
              <li><a href="/admin/login" className="hover:text-dsdl-300 transition-colors">Admin Login</a></li>
            </ul>
          </div>

          {/* Connect & Socials */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Connect With Us</h4>
            <div className="flex flex-col gap-2">
              <a
                href={DEFAULT_WHATSAPP_GROUP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-xs font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-950/50 border border-emerald-800/50 px-3 py-2 rounded-lg transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Join Official WhatsApp Group</span>
                <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
              </a>

              <a
                href={DEFAULT_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-xs font-medium text-pink-400 hover:text-pink-300 bg-pink-950/50 border border-pink-800/50 px-3 py-2 rounded-lg transition-colors"
              >
                <Instagram className="w-4 h-4" />
                <span>Follow DSDL on Instagram</span>
                <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
              </a>
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 DSDL Technical Club, KIET Group of Institutions. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for KIET First-Year Students</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
