import React from "react";

function Footer() {
  return (
    <footer className="py-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            
            <span className="text-sm font-bold tracking-tight text-white">
              AI Optimizer
            </span>
          </div>
          <div className="flex gap-8 text-xs font-medium text-slate-500">
            <a className="hover:text-primary transition-colors" href="#">
              Documentation
            </a>
          </div>
          <div className="text-xs text-slate-600">
            © 2024 AI Optimizer Inc. Built for the modern kernel.
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
