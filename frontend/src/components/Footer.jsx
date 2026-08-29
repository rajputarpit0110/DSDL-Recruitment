import React from 'react';
import { Instagram, MessageSquare, ExternalLink, Heart, Github, Linkedin } from 'lucide-react';
import { DEFAULT_INSTAGRAM_URL, DEFAULT_WHATSAPP_GROUP_URL } from '../config/recruitmentConfig';

export default function Footer() {
  return (
    <footer className="bg-black text-slate-400 border-t border-slate-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3 bg-white/95 p-2 rounded-xl w-fit border border-white/10 shadow-lg">
              <img src="/assets/kiet-logo.png" alt="KIET Logo" className="h-7 w-auto object-contain" />
              <div className="h-5 w-[1px] bg-slate-300" />
              <img src="/assets/KML.jpg" alt="KML Logo" className="h-7 w-auto rounded-sm object-contain" />
            </div>
            <div>
              <h3 className="text-white text-base font-bold tracking-tight">KML Technical Club</h3>
              <p className="text-xs text-red-400 font-semibold uppercase tracking-wider mt-0.5">
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
              <li><a href="/" className="hover:text-red-400 transition-colors">Home</a></li>
              <li><a href="/#about" className="hover:text-red-400 transition-colors">About KML</a></li>
              <li><a href="/#why-join" className="hover:text-red-400 transition-colors">Why Join</a></li>
              <li><a href="/#developer" className="hover:text-red-400 transition-colors">Meet the Developer</a></li>
              <li><a href="/register" className="hover:text-red-400 transition-colors">Register for Recruitment</a></li>
              <li><a href="/admin/login" className="hover:text-red-400 transition-colors">Admin Login</a></li>
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
                className="inline-flex items-center space-x-2 text-xs font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 border border-emerald-800/50 px-3 py-2 rounded-lg transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Join Official WhatsApp Group</span>
                <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
              </a>

              <a
                href={DEFAULT_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-950/40 border border-rose-800/50 px-3 py-2 rounded-lg transition-colors"
              >
                <Instagram className="w-4 h-4" />
                <span>Follow KML on Instagram</span>
                <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
              </a>
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 KML Technical Club, KIET Group of Institutions. All rights reserved.</p>
          <div className="flex items-center space-x-3 text-slate-400">
            <span className="flex items-center gap-1">
              <span>Developed by</span>
              <strong className="text-slate-200 font-bold">Arpit Rajput</strong>
            </span>
            <div className="flex items-center space-x-2">
              <a
                href="https://github.com/rajputarpit0110"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
                title="Arpit's GitHub"
              >
                <Github className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://www.linkedin.com/in/arpit-rajput-272296365/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-rose-400 transition-colors"
                title="Arpit's LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
