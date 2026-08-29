"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { siteConfig } from "@/config/site";
import { submitCounsellingLead } from "@/services/leads";
import {
  GraduationCap,
  CheckCircle2,
  Sparkles,
  Phone,
  MessageCircle,
  MapPin,
  BookOpen,
  Award,
  ShieldCheck,
  ArrowRight,
  Loader2,
  UserCheck,
} from "lucide-react";

const tnDistricts = [
  "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri",
  "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur",
  "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris",
  "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivagangai",
  "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli",
  "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore",
  "Viluppuram", "Virudhunagar"
];

export default function StudentRegisterPage() {
  const [formData, setFormData] = useState({
    student_name: "",
    phone_number: "",
    whatsapp_number: "",
    email: "",
    city: "",
    district: "Chennai",
    education_level: "12th Std Completed",
    board_of_study: "Tamil Nadu State Board",
    cutoff_score: "",
    community: "BC",
    preferred_stream: "Engineering & Technology",
    preferred_course: "",
    preferred_district: "Chennai",
    target_college_name: "",
    budget_range: "Govt Quota (₹50k - ₹85k/yr)",
    hostel_needed: "Yes",
    student_notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.student_name.trim()) {
      setErrorMessage("Please enter student's full name");
      return;
    }

    if (!/^\d{10}$/.test(formData.phone_number.replace(/\D/g, ""))) {
      setErrorMessage("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);

    try {
      const notesCombined = [
        `City: ${formData.city || formData.district}`,
        `Education: ${formData.education_level} (${formData.board_of_study})`,
        `Hostel: ${formData.hostel_needed}`,
        `Budget: ${formData.budget_range}`,
        formData.student_notes ? `Notes: ${formData.student_notes}` : "",
      ].filter(Boolean).join(" | ");

      const res = await submitCounsellingLead({
        student_name: formData.student_name,
        phone_number: formData.phone_number,
        email: formData.email || undefined,
        preferred_district: formData.preferred_district || formData.district,
        preferred_course: formData.preferred_course || undefined,
        preferred_stream: formData.preferred_stream,
        target_college_name: formData.target_college_name || undefined,
        cutoff_score: formData.cutoff_score ? parseFloat(formData.cutoff_score) : undefined,
        community: formData.community as any,
        budget_range: formData.budget_range,
        student_notes: notesCombined,
      });

      if (res.success) {
        setSubmittedRef(res.leadReference);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to submit registration. Please verify details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 bg-gradient-to-b from-slate-50 to-slate-100/60 min-h-screen pb-32">
      <Container size="lg" className="space-y-8">
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="gold" className="px-3.5 py-1 text-xs uppercase tracking-widest font-bold">
            Free Admission & Counselling Registration 2026
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Student Profile & Admission Desk
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Register your academic details to get verified college shortlists, TNEA cutoff guidance, and direct admission counselling across Tamil Nadu.
          </p>
        </div>

        {submittedRef ? (
          /* Success Card */
          <Card className="max-w-2xl mx-auto p-8 sm:p-12 text-center bg-white rounded-3xl border-emerald-200 shadow-xl space-y-6">
            <div className="h-20 w-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Registration Successful!
              </h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Thank you, <strong className="text-slate-900">{formData.student_name}</strong>! Your application has been logged in College Guide Central Admissions.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-sm mx-auto">
              <span className="text-xs text-slate-500 font-medium block">Application Reference ID:</span>
              <span className="text-xl font-mono font-bold text-blue-700 tracking-wider">
                {submittedRef}
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <a
                href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
                  `Hi College Guide Team, I registered on the portal. My Reference ID is ${submittedRef}. Student Name: ${formData.student_name}, Cutoff: ${formData.cutoff_score || "N/A"}, Stream: ${formData.preferred_stream}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full max-w-sm px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Connect with Counsellor on WhatsApp</span>
              </a>

              <div>
                <Link href="/colleges" className="text-xs text-slate-500 hover:text-blue-600 font-semibold underline">
                  Explore Tamil Nadu Colleges & Cutoffs →
                </Link>
              </div>
            </div>
          </Card>
        ) : (
          /* Form Card */
          <Card className="p-6 sm:p-10 bg-white rounded-3xl border-slate-200 shadow-xl space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {errorMessage && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {errorMessage}
                </div>
              )}

              {/* Step 1: Personal Contact Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <UserCheck className="h-5 w-5 text-[#f29a38]" />
                  <h2 className="text-lg font-bold text-slate-900">1. Student Contact Information</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">Student Full Name *</label>
                    <Input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={formData.student_name}
                      onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                      className="h-11 rounded-xl bg-white text-slate-900 border-slate-300 focus:border-[#f29a38]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">Mobile / WhatsApp Number *</label>
                    <Input
                      type="tel"
                      required
                      placeholder="Enter your mobile number"
                      value={formData.phone_number}
                      onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                      className="h-11 rounded-xl bg-white text-slate-900 border-slate-300 focus:border-[#f29a38]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">Email Address (Optional)</label>
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="h-11 rounded-xl bg-white text-slate-900 border-slate-300 focus:border-[#f29a38]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">Native City / Town *</label>
                    <Input
                      type="text"
                      placeholder="Enter your native city / town"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="h-11 rounded-xl bg-white text-slate-900 border-slate-300 focus:border-[#f29a38]"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-800">Home District in Tamil Nadu *</label>
                    <select
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full h-11 rounded-xl border border-slate-300 bg-white text-slate-900 px-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#f29a38]/20 focus:border-[#f29a38]"
                    >
                      {tnDistricts.map((d) => (
                        <option key={d} value={d} className="bg-white text-slate-900">
                          {d} District
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 2: Academic Background & Cutoff */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Award className="h-5 w-5 text-[#f29a38]" />
                  <h2 className="text-lg font-bold text-slate-900">2. Academic Status & Cutoff Score</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">Current Status</label>
                    <select
                      value={formData.education_level}
                      onChange={(e) => setFormData({ ...formData, education_level: e.target.value })}
                      className="w-full h-11 rounded-xl border border-slate-300 bg-white text-slate-900 px-3 text-xs font-semibold focus:ring-2 focus:ring-[#f29a38]/20 focus:border-[#f29a38]"
                    >
                      <option value="12th Std Appearing" className="bg-white text-slate-900">12th Std Appearing (2026)</option>
                      <option value="12th Std Completed" className="bg-white text-slate-900">12th Std Completed</option>
                      <option value="Diploma Lateral Entry" className="bg-white text-slate-900">Diploma (Lateral Entry)</option>
                      <option value="UG Degree Completed" className="bg-white text-slate-900">UG Degree Completed (For PG/MBA)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">12th / Cutoff Mark (Out of 200)</label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      max="200"
                      placeholder="Enter 12th cutoff mark"
                      value={formData.cutoff_score}
                      onChange={(e) => setFormData({ ...formData, cutoff_score: e.target.value })}
                      className="h-11 rounded-xl font-bold bg-white text-slate-900 border-slate-300 focus:border-[#f29a38]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">Community / Category *</label>
                    <select
                      value={formData.community}
                      onChange={(e) => setFormData({ ...formData, community: e.target.value })}
                      className="w-full h-11 rounded-xl border border-slate-300 bg-white text-slate-900 px-3 text-xs font-bold focus:ring-2 focus:ring-[#f29a38]/20 focus:border-[#f29a38]"
                    >
                      <option value="OC" className="bg-white text-slate-900">OC (Open Competition)</option>
                      <option value="BC" className="bg-white text-slate-900">BC (Backward Class)</option>
                      <option value="BCM" className="bg-white text-slate-900">BCM (Backward Class Muslim)</option>
                      <option value="MBC" className="bg-white text-slate-900">MBC & DNC</option>
                      <option value="SC" className="bg-white text-slate-900">SC (Scheduled Caste)</option>
                      <option value="SCA" className="bg-white text-slate-900">SCA (SC Arunthathiyar)</option>
                      <option value="ST" className="bg-white text-slate-900">ST (Scheduled Tribe)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 3: Course & College Preferences */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <BookOpen className="h-5 w-5 text-[#f29a38]" />
                  <h2 className="text-lg font-bold text-slate-900">3. Course & College Preferences</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">Preferred Stream *</label>
                    <select
                      value={formData.preferred_stream}
                      onChange={(e) => setFormData({ ...formData, preferred_stream: e.target.value })}
                      className="w-full h-11 rounded-xl border border-slate-300 bg-white text-slate-900 px-3 text-xs font-semibold focus:ring-2 focus:ring-[#f29a38]/20 focus:border-[#f29a38]"
                    >
                      <option value="Engineering & Technology" className="bg-white text-slate-900">Engineering & Technology (B.E. / B.Tech)</option>
                      <option value="Medical & Dental" className="bg-white text-slate-900">Medical & Dental (MBBS / BDS / Allied Health)</option>
                      <option value="Arts, Science & Commerce" className="bg-white text-slate-900">Arts, Science & Commerce (B.Sc / B.Com / BBA)</option>
                      <option value="Law & Legal Studies" className="bg-white text-slate-900">Law (BA LLB / BBA LLB / 3-Year LLB)</option>
                      <option value="Agriculture & Allied Sciences" className="bg-white text-slate-900">Agriculture (B.Sc Agriculture / Horticulture)</option>
                      <option value="Management & Business" className="bg-white text-slate-900">Management (MBA / MCA)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">Desired Course / Branch</label>
                    <Input
                      type="text"
                      placeholder="e.g. B.E. Computer Science / AI & DS / B.Com"
                      value={formData.preferred_course}
                      onChange={(e) => setFormData({ ...formData, preferred_course: e.target.value })}
                      className="h-11 rounded-xl bg-white text-slate-900 border-slate-300 focus:border-[#f29a38]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">Preferred Study Location / District</label>
                    <select
                      value={formData.preferred_district}
                      onChange={(e) => setFormData({ ...formData, preferred_district: e.target.value })}
                      className="w-full h-11 rounded-xl border border-slate-300 bg-white text-slate-900 px-3 text-xs font-semibold focus:ring-2 focus:ring-[#f29a38]/20 focus:border-[#f29a38]"
                    >
                      <option value="Chennai" className="bg-white text-slate-900">Chennai & Suburbs</option>
                      <option value="Coimbatore" className="bg-white text-slate-900">Coimbatore & Erode</option>
                      <option value="Madurai" className="bg-white text-slate-900">Madurai & South TN</option>
                      <option value="Tiruchirappalli" className="bg-white text-slate-900">Tiruchirappalli & Central TN</option>
                      <option value="Salem" className="bg-white text-slate-900">Salem & West TN</option>
                      <option value="Any District" className="bg-white text-slate-900">Any Top College in Tamil Nadu</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">Target College (Optional)</label>
                    <Input
                      type="text"
                      placeholder="e.g. PSG Tech / MIT / Loyola / SKCET"
                      value={formData.target_college_name}
                      onChange={(e) => setFormData({ ...formData, target_college_name: e.target.value })}
                      className="h-11 rounded-xl bg-white text-slate-900 border-slate-300 focus:border-[#f29a38]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">Expected Annual Budget Range</label>
                    <select
                      value={formData.budget_range}
                      onChange={(e) => setFormData({ ...formData, budget_range: e.target.value })}
                      className="w-full h-11 rounded-xl border border-slate-300 bg-white text-slate-900 px-3 text-xs font-semibold focus:ring-2 focus:ring-[#f29a38]/20 focus:border-[#f29a38]"
                    >
                      <option value="Govt Quota (₹15k - ₹50k/yr)" className="bg-white text-slate-900">Government Quota (₹15k - ₹50k/year)</option>
                      <option value="Standard (₹50k - ₹1L/yr)" className="bg-white text-slate-900">Standard Self-Financing (₹50k - ₹1 Lakh/year)</option>
                      <option value="Autonomous (₹1L - ₹2L/yr)" className="bg-white text-slate-900">Premier Autonomous (₹1L - ₹2 Lakhs/year)</option>
                      <option value="Management Quota (₹2L+ /yr)" className="bg-white text-slate-900">Management Quota / Deemed University (₹2 Lakhs+/year)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">Hostel Accommodation Needed?</label>
                    <select
                      value={formData.hostel_needed}
                      onChange={(e) => setFormData({ ...formData, hostel_needed: e.target.value })}
                      className="w-full h-11 rounded-xl border border-slate-300 bg-white text-slate-900 px-3 text-xs font-semibold focus:ring-2 focus:ring-[#f29a38]/20 focus:border-[#f29a38]"
                    >
                      <option value="Yes" className="bg-white text-slate-900">Yes, Hostel Required</option>
                      <option value="No" className="bg-white text-slate-900">No, Dayscholar (Bus / Local)</option>
                      <option value="Maybe" className="bg-white text-slate-900">Depends on College Distance</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">Any Questions for our Admission Counsellor?</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us what you are looking for (e.g. cutoff comparison, hostel fee, choice filling list, scholarship help)..."
                    value={formData.student_notes}
                    onChange={(e) => setFormData({ ...formData, student_notes: e.target.value })}
                    className="w-full rounded-2xl border border-slate-300 bg-white text-slate-900 p-3.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#f29a38]/20 focus:border-[#f29a38]"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-gradient-to-r from-[#1e233a] to-[#2e375e] hover:from-[#2a3152] hover:to-[#3b4778] text-white font-extrabold text-base rounded-2xl shadow-xl shadow-slate-900/20 gap-2 transition-all hover:scale-[1.01]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Saving Profile to Database...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 text-[#f29a38]" />
                      <span>Submit Profile & Get Free College Guidance</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </Button>

                <p className="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>100% Privacy Guaranteed. Your details are shared strictly with College Guide counsellors.</span>
                </p>
              </div>
            </form>
          </Card>
        )}
      </Container>
    </div>
  );
}
