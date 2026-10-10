import React from 'react';
import { Link } from 'react-router-dom';
import { Hero } from '../components/landing/Hero';
import { StatsSection } from '../components/landing/StatsSection';
import { HowItWorks } from '../components/landing/HowItWorks';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { ImpactSection } from '../components/landing/ImpactSection';
import { Testimonials } from '../components/landing/Testimonials';
import { Footer } from '../components/landing/Footer';
import { ToastContainer } from '../components/common/ToastContainer';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, LogIn, LayoutDashboard, Utensils } from 'lucide-react';

export const LandingPage = () => {
  const { isAuthenticated, role } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Public Landing Navbar */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 sm:px-8 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-md shadow-emerald-600/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="font-black text-slate-900 text-lg tracking-tight">
            <span>FoodRescue</span>
            <span className="text-emerald-600">AI</span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600">
          <a href="#how-it-works" className="hover:text-emerald-600 transition-colors">How It Works</a>
          <a href="#features" className="hover:text-emerald-600 transition-colors">AI Capabilities</a>
          <a href="#impact" className="hover:text-emerald-600 transition-colors">Impact Calculator</a>
          <Link to="/simulator" className="text-amber-600 hover:text-amber-700 flex items-center gap-1 font-extrabold">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Rescue Simulator</span>
          </Link>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Go to Dashboard</span>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all"
              >
                Log In
              </Link>
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
              >
                <span>Live Demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Main Landing Sections */}
      <main className="flex-1">
        <Hero />
        <StatsSection />
        <div id="how-it-works">
          <HowItWorks />
        </div>
        <div id="features">
          <FeaturesSection />
        </div>
        <div id="impact">
          <ImpactSection />
        </div>
        <Testimonials />
      </main>

      {/* Footer */}
      <Footer />
      <ToastContainer />
    </div>
  );
};
