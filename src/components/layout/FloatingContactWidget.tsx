"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";
import { MessageCircle, Instagram, Phone, X } from "lucide-react";

export function FloatingContactWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    siteConfig.whatsappDefaultMessage
  )}`;

  return (
    <aside aria-label="Quick Contact and Guidance Desk" className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-auto">
      {/* Expanded Quick Contact Menu */}
      {isOpen && (
        <div className="flex flex-col gap-2 bg-[#1e233a]/95 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-300 text-white min-w-[240px]">
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-1">
            <span className="font-bold text-xs text-[#f29a38] uppercase tracking-wider">
              Admission Helpline
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/30 text-emerald-300 transition-all duration-200 group"
          >
            <div className="h-8 w-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <MessageCircle className="h-4 w-4" />
            </div>
            <div>
              <p className="font-bold text-xs text-white">WhatsApp Desk</p>
              <p className="text-[10px] text-emerald-400 font-medium">Chat with Counsellor</p>
            </div>
          </a>

          <a
            href={siteConfig.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/40 border border-rose-500/30 text-rose-300 transition-all duration-200 group"
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-amber-500 to-rose-600 text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Instagram className="h-4 w-4" />
            </div>
            <div>
              <p className="font-bold text-xs text-white">Instagram</p>
              <p className="text-[10px] text-rose-400 font-medium">@college_guide_tamil</p>
            </div>
          </a>

          <a
            href={`tel:+919629653312`}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-300 transition-all duration-200 group"
          >
            <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Phone className="h-4 w-4" />
            </div>
            <div>
              <p className="font-bold text-xs text-white">Direct Call</p>
              <p className="text-[10px] text-blue-300 font-semibold">{siteConfig.phoneDisplay}</p>
            </div>
          </a>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <div className="flex items-center gap-2">
        {!isOpen && (
          <span className="hidden md:inline-block bg-[#1e233a]/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/10 shadow-lg animate-float">
            Need Guidance? Chat with us 👋
          </span>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle admission help menu"
          className="relative h-14 w-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-[0_8px_25px_rgba(16,185,129,0.5)] hover:scale-110 transition-all duration-300 animate-whatsapp-pulse cursor-pointer"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageCircle className="h-7 w-7" />
          )}
        </button>
      </div>
    </aside>
  );
}
