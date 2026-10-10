import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-black shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-base font-black text-white tracking-tight">
                FoodRescue <span className="text-emerald-500">AI</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              An intelligent, full-stack food surplus redistribution network fighting hunger and urban waste through algorithmic dispatch.
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-400">
              <a href="#" className="hover:text-emerald-400 transition-colors"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="hover:text-emerald-400 transition-colors"><Linkedin className="w-4 h-4" /></a>
              <a href="#" className="hover:text-emerald-400 transition-colors"><Github className="w-4 h-4" /></a>
              <a href="#" className="hover:text-emerald-400 transition-colors"><Mail className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Platform</h4>
            <ul className="space-y-2">
              <li><Link to="/dashboard" className="hover:text-emerald-400 transition-colors">Main Dashboard</Link></li>
              <li><Link to="/donations" className="hover:text-emerald-400 transition-colors">Donation Listings</Link></li>
              <li><Link to="/ai-matching" className="hover:text-emerald-400 transition-colors">AI Matchmaker</Link></li>
              <li><Link to="/simulator" className="hover:text-amber-400 text-amber-500 font-semibold transition-colors">Rescue Simulator</Link></li>
              <li><Link to="/map" className="hover:text-emerald-400 transition-colors">Interactive Map</Link></li>
            </ul>
          </div>

          {/* User Roles */}
          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">User Workflows</h4>
            <ul className="space-y-2">
              <li><Link to="/donations" className="hover:text-emerald-400 transition-colors">Donor Portal</Link></li>
              <li><Link to="/ngos" className="hover:text-emerald-400 transition-colors">NGO Dashboard</Link></li>
              <li><Link to="/volunteers" className="hover:text-emerald-400 transition-colors">Volunteer Hub</Link></li>
              <li><Link to="/deliveries" className="hover:text-emerald-400 transition-colors">Delivery Tracking</Link></li>
              <li><Link to="/analytics" className="hover:text-emerald-400 transition-colors">Impact Reports</Link></li>
            </ul>
          </div>

          {/* Project Info */}
          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Hackathon Edition</h4>
            <p className="text-slate-400 text-xs mb-3">
              Built with React, Tailwind CSS, Node.js, Express, MongoDB, and Leaflet for college innovation showcase.
            </p>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px]">
              <span className="text-emerald-400 font-bold block mb-0.5">Demo Mode Ready</span>
              <span>Complete resilient state layer ensuring 100% demo stability without external dependencies.</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 FoodRescue AI Network. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Engineered with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for zero hunger & sustainability</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
