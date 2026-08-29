"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";
import { submitCounsellingLead } from "@/services/leads";
import { CommunityCategory } from "@/types";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MessageCircle,
  Phone,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Loader2,
} from "lucide-react";

export default function GuidancePage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [district, setDistrict] = useState("Chennai");
  const [stream, setStream] = useState("Engineering & Technology");
  const [cutoff, setCutoff] = useState("");
  const [community, setCommunity] = useState<CommunityCategory>("BC");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [successRef, setSuccessRef] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
        preferred_stream: stream,
        cutoff_score: cutoff ? parseFloat(cutoff) : undefined,
        community,
        student_notes: notes || undefined,
      });

      if (res.success) {
        setSuccessRef(res.leadReference);
      }
    } catch (err: any) {
      setError(err?.message || "Submission failed. Please check inputs.");
    } finally {
      setLoading(false);
    }
  };

  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    siteConfig.whatsappDefaultMessage
  )}`;

  return (
    <div className="py-12 bg-slate-50 min-h-screen pb-28">
      <Container size="lg" className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="gold" className="text-[10px]">
            Free Student Guidance Desk
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Tamil Nadu Admission Guidance Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Get personalized advice on TNEA counselling choice orders, government vs management quotas, scholarships, and verified cutoff requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Lead Registration Form */}
          <div className="lg:col-span-7">
            <Card className="p-6 sm:p-8 bg-white shadow-md space-y-5">
              {successRef ? (
                <div className="py-8 text-center space-y-4">
                  <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-slate-900">
                      Guidance Request Submitted!
                    </h3>
                    <p className="text-xs text-slate-500">
                      Reference ID: <strong className="text-blue-600">{successRef}</strong>
                    </p>
                  </div>
                  <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                    Our academic advisor will call / WhatsApp you on <strong>{phone}</strong> to guide you through TNEA choices and seat allotments.
                  </p>
                  <div className="pt-3">
                    <a
                      href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
                        `Hi College Guide Team, my reference is ${successRef}. I need counselling help.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="whatsapp" size="lg" className="w-full font-bold">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Chat on WhatsApp Now
                      </Button>
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-base text-slate-900">
                      Book Free Callback
                    </h3>
                    <p className="text-xs text-slate-500">
                      Fill out your details to receive customized college and cutoff options.
                    </p>
                  </div>

                  {error && (
                    <div className="p-3 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 text-xs">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Full Name *</label>
                      <Input
                        required
                        placeholder="e.g. Priyadharshini M"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">WhatsApp Mobile Number *</label>
                      <Input
                        required
                        type="tel"
                        placeholder="10-digit number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">12th Cutoff Score (out of 200)</label>
                      <Input
                        type="number"
                        step="0.25"
                        min="50"
                        max="200"
                        placeholder="e.g. 191.00"
                        value={cutoff}
                        onChange={(e) => setCutoff(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Community Quota *</label>
                      <select
                        value={community}
                        onChange={(e) => setCommunity(e.target.value as CommunityCategory)}
                        className="w-full h-10 rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Academic Stream</label>
                      <select
                        value={stream}
                        onChange={(e) => setStream(e.target.value)}
                        className="w-full h-10 rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {siteConfig.popularStreams.map((s) => (
                          <option key={s.slug} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Preferred District in TN</label>
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full h-10 rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {siteConfig.tamilNaduDistricts.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Your Admission Query</label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. I need guidance on whether to choose PSG Tech ECE or SSN CSE with my cutoff."
                      className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={loading}
                    className="w-full font-bold bg-blue-600 hover:bg-blue-700 h-11"
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Request Expert Callback"}
                  </Button>
                </form>
              )}
            </Card>
          </div>

          {/* Right Direct WhatsApp & Value Highlights */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="p-6 bg-gradient-to-br from-emerald-900 to-slate-900 text-white space-y-4 shadow-xl">
              <div className="space-y-1">
                <Badge variant="gold" className="text-[10px]">
                  Instant WhatsApp Connect
                </Badge>
                <h3 className="text-xl font-extrabold">Speak with an Expert Now</h3>
                <p className="text-xs text-emerald-100/80 leading-relaxed">
                  Have an urgent question about TNEA deadlines, choice orders, or cutoff eligibility? Our Tamil Nadu counsellors are available on WhatsApp.
                </p>
              </div>

              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block">
                <Button variant="whatsapp" size="lg" className="w-full font-bold gap-2 shadow-lg">
                  <MessageCircle className="h-5 w-5" />
                  <span>Start WhatsApp Chat</span>
                </Button>
              </a>
            </Card>

            <Card className="p-6 space-y-3 text-xs text-slate-700">
              <h4 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
                Why Seek Guidance With Us?
              </h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>100% Free, Unbiased Advice for Tamil Nadu Colleges</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Verified TNEA Cutoffs & Seat Matrix Analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>No Spam Guarantee — Your Information Is Kept Secure</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
