import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-6xl font-black text-dsdl-600">404</div>
          <h1 className="text-2xl font-extrabold text-slate-900">Page Not Found</h1>
          <p className="text-xs sm:text-sm text-slate-600">
            The page you are looking for does not exist or has been moved.
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 text-xs font-bold text-white bg-dsdl-600 hover:bg-dsdl-700 px-5 py-2.5 rounded-xl shadow-sm"
            >
              <Home className="w-4 h-4" />
              <span>Return Home</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
