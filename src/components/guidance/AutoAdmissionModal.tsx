"use client";

import { useState, useEffect } from "react";
import { submitCounsellingLead } from "@/services/leads";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  X,
  CheckCircle2,
  Sparkles,
  MessageCircle,
  Phone,
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  Loader2,
  Award,
} from "lucide-react";

export function AutoAdmissionModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [district, setDistrict] = useState("Chennai");
  const [cutoff, setCutoff] = useState("");
  const [stream, setStream] = useState("Engineering & Technology");
  const [loading, setLoading] = useState(false);
  const [successRef, setSuccessRef] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if already shown or dismissed in this session
    if (typeof window !== "undefined") {
      const dismissed = sessionStorage.getItem("cg_auto_modal_dismissed");
      if (!dismissed) {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 2800); // 2.8 second natural entry delay

        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("cg_auto_modal_dismissed", "true");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter student name");
      return;
    }

    if (!/^\d{10}$/.test(phone.replace(/\D/g, ""))) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);

    try {
      const res = await submitCounsellingLead({
        student_name: name,
        phone_number: phone,
        preferred_district: district,
        preferred_stream: stream,
        cutoff_score: cutoff ? parseFloat(cutoff) : undefined,
        community: "BC",
        student_notes: `Auto Onboarding Modal Registration | District: ${district}`,
      });

      if (res.success) {
        setSuccessRef(res.leadReference);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="relative bg-gradient-to-r from-[#191d32] via-[#242b4d] to-[#191d32] p-6 text-white text-center">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-extrabold uppercase tracking-wider mb-2">
            <Sparkles className="h-3 w-3" /> Free Admission Guidance 2026
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Get Verified College & Cutoff Advice
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
            Speak directly with Tamil Nadu admission counsellors for cutoffs, choice lists & scholarship quotas.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-5">
          {successRef ? (
            <div className="py-4 text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-slate-900">Application Received!</h3>
                <p className="text-xs text-slate-600">
                  Your reference ID is <strong className="text-blue-700 font-mono">{successRef}</strong>.
                </p>
              </div>

              <a
                href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
                  `Hi College Guide Team, I submitted the quick enquiry. Ref ID: ${successRef}, Student: ${name}, Cutoff: ${cutoff || "N/A"}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/30"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Chat with Counsellor on WhatsApp</span>
              </a>

              <Button variant="outline" size="sm" onClick={handleClose} className="w-full text-xs font-semibold">
                Continue Browsing
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Student Full Name *</label>
                <Input
                  type="text"
                  required
                  placeholder="e.g. Anbarasan M"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Mobile Number *</label>
                  <Input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-10 rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">12th Cutoff (Out of 200)</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 187.5"
                    value={cutoff}
                    onChange={(e) => setCutoff(e.target.value)}
                    className="h-10 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">District in TN</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full h-10 rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:ring-2 focus:ring-[#f29a38]"
                  >
                    <option value="Chennai">Chennai</option>
                    <option value="Coimbatore">Coimbatore</option>
                    <option value="Madurai">Madurai</option>
                    <option value="Tiruchirappalli">Trichy</option>
                    <option value="Salem">Salem</option>
                    <option value="Erode">Erode</option>
                    <option value="Tirunelveli">Tirunelveli</option>
                    <option value="Vellore">Vellore</option>
                    <option value="Thanjavur">Thanjavur</option>
                    <option value="Other">Other District</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Preferred Stream</label>
                  <select
                    value={stream}
                    onChange={(e) => setStream(e.target.value)}
                    className="w-full h-10 rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:ring-2 focus:ring-[#f29a38]"
                  >
                    <option value="Engineering & Technology">Engineering (B.E/B.Tech)</option>
                    <option value="Medical & Dental">Medical / MBBS / Allied</option>
                    <option value="Arts, Science & Commerce">Arts & Science</option>
                    <option value="Law & Legal Studies">Law</option>
                    <option value="Agriculture & Allied Sciences">Agriculture</option>
                  </select>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-[#f29a38] to-[#d98528] hover:from-[#d98528] hover:to-[#b76e1f] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-[#f29a38]/30 gap-2 transition-all hover:scale-[1.01]"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Connecting with Desk...</span>
                  </>
                ) : (
                  <>
                    <span>Submit & Get Free Cutoff Guidance</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  100% Unbiased & Confidential
                </span>
                <button type="button" onClick={handleClose} className="hover:text-slate-600 underline">
                  Skip for now
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
