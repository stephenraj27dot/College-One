"use client";

import { useState } from "react";
import { DetailedCollege, CommunityCategory } from "@/types";
import { submitCounsellingLead } from "@/services/leads";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, CheckCircle2, ShieldCheck, MessageCircle, Loader2 } from "lucide-react";

interface GuidanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetCollege?: DetailedCollege | null;
  targetCourseName?: string | null;
}

export function GuidanceModal({
  isOpen,
  onClose,
  targetCollege,
  targetCourseName,
}: GuidanceModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [district, setDistrict] = useState(targetCollege?.district || "Chennai");
  const [cutoff, setCutoff] = useState("");
  const [community, setCommunity] = useState<CommunityCategory>("BC");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [successRef, setSuccessRef] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await submitCounsellingLead({
        student_name: name,
        phone_number: phone,
        email: email || undefined,
        preferred_district: district,
        preferred_course: targetCourseName || undefined,
        preferred_stream: targetCollege?.category_name || "Engineering & Technology",
        target_college_id: targetCollege?.id,
        target_college_name: targetCollege?.name,
        cutoff_score: cutoff ? parseFloat(cutoff) : undefined,
        community,
        student_notes: notes || undefined,
      });

      if (res.success) {
        setSuccessRef(res.leadReference);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to submit guidance request. Please verify inputs.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccessRef(null);
    setError(null);
    setName("");
    setPhone("");
    setEmail("");
    setCutoff("");
    setNotes("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {successRef ? (
          <div className="py-6 text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-slate-900">
                Request Registered Successfully!
              </h3>
              <p className="text-xs text-slate-500">
                Application Reference: <strong className="text-blue-600">{successRef}</strong>
              </p>
            </div>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              Our Tamil Nadu admission specialist has received your academic details and will provide personalized cutoff analysis and seat recommendations shortly.
            </p>
            <div className="pt-4 flex flex-col gap-2">
              <a
                href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
                  `Hi College Guide Team, my request reference is ${successRef}. I need fast-track admission advice for ${targetCollege?.name || "Tamil Nadu colleges"}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="whatsapp" size="lg" className="w-full font-bold">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Chat Instantly on WhatsApp
                </Button>
              </a>
              <Button variant="secondary" size="md" onClick={handleReset}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="gold" className="text-[10px]">
                  Free Admission Guidance
                </Badge>
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>100% Confidential</span>
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {targetCollege ? `Apply / Guidance for ${targetCollege.short_name || targetCollege.name}` : "Tamil Nadu Admission Guidance Desk"}
              </h3>
              <p className="text-xs text-slate-500">
                Connect directly with certified counsellors for TNEA cutoffs, seat matrix, and fee scholarships.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">
                    Student Full Name *
                  </label>
                  <Input
                    required
                    placeholder="Enter full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-10 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">
                    Mobile / WhatsApp Number *
                  </label>
                  <Input
                    type="tel"
                    required
                    placeholder="Enter mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-10 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">
                    12th / Cutoff Score (Optional)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Enter cutoff (e.g. 185)"
                    value={cutoff}
                    onChange={(e) => setCutoff(e.target.value)}
                    className="h-10 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">
                    Community / Quota *
                  </label>
                  <select
                    className="flex h-10 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={community}
                    onChange={(e) => setCommunity(e.target.value as CommunityCategory)}
                  >
                    <option value="OC">OC (Open Competition)</option>
                    <option value="BC">BC (Backward Class)</option>
                    <option value="BCM">BCM (BC Muslim)</option>
                    <option value="MBC">MBC / DNC</option>
                    <option value="SC">SC (Scheduled Caste)</option>
                    <option value="SCA">SCA (SC Arunthathiyar)</option>
                    <option value="ST">ST (Scheduled Tribe)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">
                  Preferred District in Tamil Nadu
                </label>
                <select
                  className="flex h-10 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                >
                  {siteConfig.tamilNaduDistricts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">
                  Your Query or Course Interest
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Which round of TNEA can I get CSE at this cutoff? What are the hostel fees?"
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading}
                className="w-full font-bold bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Request Free Expert Callback"
                )}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
