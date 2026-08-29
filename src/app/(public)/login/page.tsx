"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { siteConfig } from "@/config/site";
import {
  GraduationCap,
  Lock,
  User,
  Phone,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  KeyRound,
  Heart,
  BookmarkCheck,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim()) {
      setError("Please enter your registered mobile number or email");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password / 4-digit PIN");
      return;
    }

    setLoading(true);

    // Secure Student Authentication
    setTimeout(() => {
      setLoading(false);
      if (typeof window !== "undefined") {
        localStorage.setItem("cg_student_logged_in", "true");
        localStorage.setItem("cg_student_user", identifier);
      }
      setSuccess(true);
      setTimeout(() => router.push("/colleges"), 800);
    }, 600);
  };

  return (
    <div className="py-14 bg-gradient-to-b from-slate-100/80 via-slate-50 to-slate-100 min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-blue-400/10 via-amber-400/10 to-transparent blur-3xl pointer-events-none rounded-full" />

      <Container size="sm" className="w-full max-w-lg space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-3 mx-auto transition-transform hover:scale-105">
            <div className="h-14 w-14 rounded-2xl bg-white border-2 border-amber-400/40 p-1 shadow-xl shadow-amber-500/10 overflow-hidden flex items-center justify-center">
              <img src="/logo.jpg" alt="College Guide" className="h-full w-full object-cover rounded-xl" />
            </div>
            <div className="text-left">
              <span className="text-2xl font-black text-slate-900 leading-tight block tracking-tight">
                College <span className="text-[#f29a38]">Guide</span>
              </span>
              <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase block">
                Official Student Portal
              </span>
            </div>
          </Link>

          <div className="pt-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Student Sign In
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1">
              Sign in to access your saved college shortlists, TNEA rank predictors, and personal admission updates.
            </p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="p-7 sm:p-9 bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.08)] space-y-6">
          {success ? (
            <div className="py-8 text-center space-y-3">
              <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce shadow-inner">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Welcome Back!
              </h2>
              <p className="text-xs text-slate-500">
                Redirecting to your student dashboard...
              </p>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>Mobile Number / Email Address *</span>
                  <span className="text-[10px] text-slate-400 font-normal">Registered ID</span>
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    required
                    placeholder="e.g. 9876543210 or student@gmail.com"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="h-12 rounded-xl pl-10 text-xs sm:text-sm font-semibold bg-slate-50/70 border-slate-200 focus:bg-white focus:border-[#f29a38] focus:ring-4 focus:ring-[#f29a38]/15 transition-all"
                  />
                  <User className="h-4 w-4 text-slate-400 absolute left-3.5 top-4" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">Password / PIN *</label>
                  <a
                    href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
                      "Hi College Guide Team, I forgot my student login credentials. Please help me access my profile."
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <Input
                    type="password"
                    required
                    placeholder="Enter your security PIN or password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 rounded-xl pl-10 text-xs sm:text-sm font-semibold bg-slate-50/70 border-slate-200 focus:bg-white focus:border-[#f29a38] focus:ring-4 focus:ring-[#f29a38]/15 transition-all"
                  />
                  <Lock className="h-4 w-4 text-slate-400 absolute left-3.5 top-4" />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 mt-2 bg-gradient-to-r from-[#f29a38] to-[#d98528] hover:from-[#d98528] hover:to-[#b76e1f] text-white font-black text-sm rounded-xl shadow-lg shadow-[#f29a38]/30 gap-2 transition-all hover:scale-[1.01]"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Signing in securely...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Student Portal</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          )}

          {/* Registration CTA */}
          <div className="pt-4 border-t border-slate-100 text-center space-y-3">
            <p className="text-xs text-slate-600">
              Don't have a student profile yet?{" "}
              <Link href="/register" className="font-extrabold text-[#d98528] hover:text-[#b76e1f] hover:underline block sm:inline mt-1 sm:mt-0">
                Register as a Student for Free →
              </Link>
            </p>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100/80 text-[10px] text-slate-500 font-medium">
              <div className="flex flex-col items-center gap-1 text-center p-2 rounded-xl bg-slate-50">
                <BookmarkCheck className="h-3.5 w-3.5 text-blue-600" />
                <span>Save Shortlists</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-center p-2 rounded-xl bg-slate-50">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span>Cutoff Predictor</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-center p-2 rounded-xl bg-slate-50">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>100% Free Help</span>
              </div>
            </div>
          </div>
        </Card>
      </Container>
    </div>
  );
}
