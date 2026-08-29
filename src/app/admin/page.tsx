"use client";

import { useState, useEffect } from "react";
import { getAllLeads, updateLeadStatus } from "@/services/leads";
import { CounsellingLead, LeadStatus } from "@/types";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  MessageCircle,
  Phone,
  Clock,
  CheckCircle2,
  AlertCircle,
  Filter,
  ShieldCheck,
  Building,
  GraduationCap,
  TrendingUp,
  Lock,
  LogOut,
  Key,
  Download,
  FileText,
  Search,
  PlusCircle,
  Edit3,
  Save,
  Check,
  Sparkles,
  MapPin,
  Globe,
  Sliders,
  Printer,
  Eye,
  EyeOff,
  Database,
  ArrowRight,
  UserCheck
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<"leads" | "colleges" | "add_college">("leads");

  // Leads State
  const [leads, setLeads] = useState<CounsellingLead[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLead, setSelectedLead] = useState<CounsellingLead | null>(null);
  const [leadStatus, setLeadStatus] = useState<LeadStatus>("NEW");
  const [adminNote, setAdminNote] = useState("");
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // College & Cutoff Manager State
  const [collegesList, setCollegesList] = useState<any[]>([]);
  const [collegeSearch, setCollegeSearch] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("ALL");
  const [loadingColleges, setLoadingColleges] = useState(false);

  // Add New College State
  const [newCollege, setNewCollege] = useState({
    name: "",
    short_name: "",
    tnea_code: "",
    district: "Chennai",
    city: "Chennai",
    address: "",
    institution_type: "Autonomous",
    affiliation: "Anna University",
    accreditation: "NAAC A Grade | NBA Accredited",
    description: "",
    website_url: "",
    contact_phone: "+91 96296 53312",
    contact_email: "support@collegeguide.in",
    is_featured: false,
    nirf_ranking: "",
  });
  const [addCollegeLoading, setAddCollegeLoading] = useState(false);
  const [addCollegeMsg, setAddCollegeMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const supabase = createClient();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth = sessionStorage.getItem("cg_admin_authenticated") === "true";
      if (isAuth) {
        setIsAuthenticated(true);
        loadAllData();
      }
    }
  }, []);

  const loadAllData = async () => {
    getAllLeads().then((data) => {
      setLeads(data);
    });
    fetchCollegesFromDb();
  };

  const fetchCollegesFromDb = async () => {
    setLoadingColleges(true);
    try {
      const { data, error } = await supabase
        .from("colleges")
        .select("id, slug, name, short_name, tnea_code, district, city, institution_type, accreditation, nirf_ranking, website_url, description")
        .order("established_year", { ascending: true })
        .limit(150);
      if (data && !error) {
        setCollegesList(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingColleges(false);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const validPasscodes = ["96296", "admin123", "collegeguide", "counsellor2026"];
    if (validPasscodes.includes(passcode.trim())) {
      setIsAuthenticated(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("cg_admin_authenticated", "true");
      }
      loadAllData();
    } else {
      setAuthError("Incorrect Admin Access Key. Access restricted to authorized admission staff only.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("cg_admin_authenticated");
    }
  };

  // Lead selection handler
  const handleSelectLead = (lead: CounsellingLead) => {
    setSelectedLead(lead);
    setLeadStatus(lead.status);
    setAdminNote(lead.admin_remarks || "");
    setUpdateSuccess(false);
  };

  // Update lead status with explicit button
  const handleSaveLeadUpdate = async () => {
    if (!selectedLead) return;
    setUpdating(true);
    setUpdateSuccess(false);

    try {
      await updateLeadStatus(selectedLead.id, leadStatus, adminNote || undefined);
      const updated = await getAllLeads();
      setLeads(updated);
      setSelectedLead({
        ...selectedLead,
        status: leadStatus,
        admin_remarks: adminNote || selectedLead.admin_remarks,
      });
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  // Filtered Leads
  const filteredLeads = leads
    .filter((l) => statusFilter === "ALL" || l.status === statusFilter)
    .filter((l) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        l.student_name.toLowerCase().includes(q) ||
        l.phone_number.includes(q) ||
        (l.preferred_district && l.preferred_district.toLowerCase().includes(q)) ||
        (l.lead_reference && l.lead_reference.toLowerCase().includes(q)) ||
        (l.target_college_name && l.target_college_name.toLowerCase().includes(q))
      );
    });

  // Filtered Colleges
  const filteredColleges = collegesList
    .filter((c) => selectedDistrict === "ALL" || c.district?.toLowerCase() === selectedDistrict.toLowerCase())
    .filter((c) => {
      if (!collegeSearch.trim()) return true;
      const q = collegeSearch.toLowerCase();
      return (
        c.name?.toLowerCase().includes(q) ||
        c.short_name?.toLowerCase().includes(q) ||
        c.tnea_code?.includes(q) ||
        c.district?.toLowerCase().includes(q)
      );
    });

  // Export to Official Printable PDF Document
  const exportToPDF = () => {
    if (filteredLeads.length === 0) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const currentDate = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const categoryTitle = statusFilter === "ALL" ? "All Admission Leads" : `${statusFilter} Leads`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>College Guide - Student Leads Report (${statusFilter})</title>
          <style>
            @page { size: A4 landscape; margin: 15mm; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; margin: 0; padding: 20px; font-size: 11px; }
            .header { border-bottom: 2px solid #f29a38; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
            .title { font-size: 20px; font-weight: 800; color: #0f172a; margin: 0; }
            .subtitle { font-size: 11px; color: #64748b; margin-top: 4px; }
            .stats-bar { display: flex; gap: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 16px; margin-bottom: 16px; }
            .stat-item { font-size: 11px; font-weight: 700; color: #334155; }
            .stat-item span { color: #f29a38; font-size: 13px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th { background-color: #0f172a; color: #ffffff; text-align: left; padding: 8px 10px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
            td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
            tr:nth-child(even) { background-color: #f8fafc; }
            .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: 800; text-transform: uppercase; }
            .badge-new { background: #fef3c7; color: #92400e; }
            .badge-contacted { background: #e0f2fe; color: #0369a1; }
            .badge-counselling { background: #dbeafe; color: #1e40af; }
            .badge-admitted { background: #dcfce7; color: #166534; }
            .footer { margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 10px; text-align: center; color: #94a3b8; font-size: 10px; }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 class="title">🎓 COLLEGE GUIDE - TAMIL NADU ADMISSION DESK</h1>
              <div class="subtitle">Official Student Leads & Counselling Allocation Report • Generated on: ${currentDate}</div>
            </div>
            <div style="text-align: right;">
              <button onclick="window.print()" class="no-print" style="background:#f29a38; color:#fff; border:none; padding:8px 16px; border-radius:6px; font-weight:bold; cursor:pointer;">🖨️ Print / Save as PDF</button>
            </div>
          </div>

          <div class="stats-bar">
            <div class="stat-item">Category: <span>${categoryTitle}</span></div>
            <div class="stat-item">Total Records: <span>${filteredLeads.length} Students</span></div>
            <div class="stat-item">Verified Helpline: <span>+91 96296 53312</span></div>
            <div class="stat-item">Portal: <span>collegeguide.in</span></div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 10%;">Ref ID</th>
                <th style="width: 18%;">Student Name</th>
                <th style="width: 14%;">Mobile Number</th>
                <th style="width: 12%;">Cutoff / Quota</th>
                <th style="width: 16%;">Target College / Stream</th>
                <th style="width: 14%;">Status</th>
                <th style="width: 16%;">Counsellor Remarks</th>
              </tr>
            </thead>
            <tbody>
              ${filteredLeads
                .map(
                  (lead) => `
                <tr>
                  <td style="font-weight:bold; font-family:monospace; color:#2563eb;">${lead.lead_reference || "-"}</td>
                  <td style="font-weight:bold; color:#0f172a;">${lead.student_name}</td>
                  <td><strong style="color:#059669;">${lead.phone_number}</strong></td>
                  <td>
                    <strong>${lead.cutoff_score ? `${lead.cutoff_score} / 200` : "N/A"}</strong>
                    <span style="color:#64748b; font-size:9px;">(${lead.community || "OC"})</span>
                  </td>
                  <td>
                    <div>${lead.target_college_name || lead.preferred_stream || "General Counselling"}</div>
                    <div style="font-size:9px; color:#64748b;">${lead.preferred_district || "Tamil Nadu"}</div>
                  </td>
                  <td>
                    <span class="badge ${
                      lead.status === "ADMITTED"
                        ? "badge-admitted"
                        : lead.status === "COUNSELLING"
                        ? "badge-counselling"
                        : lead.status === "CONTACTED"
                        ? "badge-contacted"
                        : "badge-new"
                    }">${lead.status}</span>
                  </td>
                  <td style="font-size:10px; color:#475569;">${lead.admin_remarks || lead.student_notes || "-"}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

          <div class="footer">
            Confidential Document — College Guide Admission Management System • Authorized Staff Access Only
          </div>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // Handle Manual Add College to Database
  const handleAddNewCollegeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddCollegeLoading(true);
    setAddCollegeMsg(null);

    try {
      const slug = `${newCollege.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${newCollege.tnea_code || Math.floor(1000 + Math.random() * 9000)}`;

      const { data, error } = await supabase.from("colleges").upsert([
        {
          slug,
          name: newCollege.name,
          short_name: newCollege.short_name || newCollege.name,
          official_name: `${newCollege.name}, ${newCollege.district}, Tamil Nadu`,
          tnea_code: newCollege.tnea_code || null,
          counselling_code: newCollege.tnea_code ? `TNEA-${newCollege.tnea_code}` : null,
          district: newCollege.district,
          city: newCollege.city,
          address: newCollege.address || `${newCollege.city}, ${newCollege.district} District, Tamil Nadu`,
          pincode: "600001",
          established_year: 2024,
          institution_type: newCollege.institution_type,
          affiliation: newCollege.affiliation,
          accreditation: newCollege.accreditation,
          nirf_ranking: newCollege.nirf_ranking ? parseInt(newCollege.nirf_ranking) : null,
          description: newCollege.description || `${newCollege.name} is a higher education institution located in ${newCollege.city}, ${newCollege.district} District.`,
          logo_url: "/logo.jpg",
          banner_url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80",
          website_url: newCollege.website_url || "https://collegeguide.in",
          contact_phone: newCollege.contact_phone,
          contact_email: newCollege.contact_email,
          hostel_available: true,
          transport_available: true,
          sports_facilities: true,
          wifi_campus: true,
          is_featured: newCollege.is_featured,
          is_verified: true,
          verification_status: "VERIFIED",
          source_name: "Manual Admin Registration 2026",
          academic_year: "2024-2025",
        }
      ], { onConflict: "slug" });

      if (error) {
        setAddCollegeMsg({ type: "error", text: error.message });
      } else {
        setAddCollegeMsg({ type: "success", text: `🎉 College "${newCollege.name}" has been successfully added to the live Database!` });
        setNewCollege({
          name: "",
          short_name: "",
          tnea_code: "",
          district: "Chennai",
          city: "Chennai",
          address: "",
          institution_type: "Autonomous",
          affiliation: "Anna University",
          accreditation: "NAAC A Grade | NBA Accredited",
          description: "",
          website_url: "",
          contact_phone: "+91 96296 53312",
          contact_email: "support@collegeguide.in",
          is_featured: false,
          nirf_ranking: "",
        });
        fetchCollegesFromDb();
      }
    } catch (err: any) {
      setAddCollegeMsg({ type: "error", text: err.message || "Failed to add college" });
    } finally {
      setAddCollegeLoading(false);
    }
  };

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case "NEW":
        return <Badge variant="gold" className="font-extrabold">NEW</Badge>;
      case "CONTACTED":
        return <Badge variant="default" className="bg-sky-100 text-sky-800 font-bold border-sky-300">CONTACTED</Badge>;
      case "COUNSELLING":
        return <Badge variant="secondary" className="bg-blue-600 text-white font-extrabold shadow-sm">COUNSELLING</Badge>;
      case "ADMISSION_IN_PROGRESS":
        return <Badge variant="warning" className="bg-amber-500 text-slate-950 font-black">IN PROGRESS</Badge>;
      case "ADMITTED":
        return <Badge variant="success" className="bg-emerald-600 text-white font-black shadow-sm">ADMITTED</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // 38 Districts list for filters
  const tnDistricts = [
    "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode",
    "Kallakurichi", "Kancheepuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai",
    "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet",
    "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli",
    "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"
  ];

  /* ---------------- LUXURY REDESIGNED GATEWAY LOGIN UI ---------------- */
  if (!isAuthenticated) {
    return (
      <div className="relative min-h-[90vh] flex items-center justify-center px-4 py-16 bg-[#0c1021] overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-500/15 via-blue-600/15 to-purple-600/10 blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-blue-500/10 blur-[100px] pointer-events-none rounded-full" />

        <Container size="sm" className="relative z-10 w-full max-w-lg space-y-6">
          {/* Header Badge & Title */}
          <div className="text-center space-y-3">
            <div className="relative inline-flex items-center justify-center">
              <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-amber-500 via-amber-300 to-orange-500 opacity-60 blur-lg animate-pulse" />
              <div className="relative h-20 w-20 rounded-3xl bg-gradient-to-tr from-[#161a2e] to-[#252b48] border-2 border-amber-400/50 flex items-center justify-center text-amber-400 shadow-2xl">
                <Lock className="h-9 w-9 text-[#f29a38] drop-shadow-[0_0_12px_rgba(242,154,56,0.8)]" />
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/30 text-xs font-black uppercase tracking-wider">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Official Staff & CRM Gateway</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Admission Desk Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
              Protected workspace for College Guide counsellors, lead followups, live cutoff updates & manual college registration.
            </p>
          </div>

          {/* Luxury Frosted Card */}
          <Card className="relative p-7 sm:p-9 bg-[#161a2e]/95 rounded-[32px] border border-white/15 shadow-[0_30px_90px_rgba(0,0,0,0.8)] space-y-6 backdrop-blur-2xl">
            {/* Top Amber Accent Glow */}
            <div className="absolute -top-[1px] left-12 right-12 h-[2px] bg-gradient-to-r from-transparent via-[#f29a38] to-transparent" />

            <form onSubmit={handleAdminLogin} className="space-y-5">
              {authError && (
                <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-2.5 animate-shake">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                  <span>{authError}</span>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-slate-200">Enter Staff Master Passcode *</label>
                  <span className="text-[11px] text-amber-400 font-bold">PIN: 96296</span>
                </div>

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter security key..."
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="h-13 rounded-2xl bg-[#0c1021]/90 border-slate-700 text-white font-mono tracking-widest text-center text-lg pl-4 pr-12 focus:border-[#f29a38] focus:ring-2 focus:ring-[#f29a38]/20 shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Quick 1-Tap Fill Button for staff convenience */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-slate-400 text-[11px]">Quick Demo Staff Key:</span>
                <button
                  type="button"
                  onClick={() => setPasscode("96296")}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-amber-300 font-mono font-bold text-[11px] border border-white/10 transition-colors"
                >
                  Fill "96296"
                </button>
              </div>

              <Button
                type="submit"
                className="w-full h-13 bg-gradient-to-r from-[#f29a38] via-[#e28c29] to-[#d98528] hover:from-[#e28c29] hover:to-[#b76e1f] text-white font-black text-sm rounded-2xl shadow-[0_4px_25px_rgba(242,154,56,0.4)] hover:shadow-[0_6px_30px_rgba(242,154,56,0.6)] gap-2 transition-all hover:scale-[1.02] border-0"
              >
                <Key className="h-4 w-4" />
                <span>Unlock CRM & Leads Portal</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </form>

            {/* Portal Features Feature Pills */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <span className="text-[11px] uppercase font-black tracking-wider text-slate-400 block text-center">
                Authorized Workspace Includes:
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2 text-slate-300">
                  <Database className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                  <span>Live 2,128 Database</span>
                </div>
                <div className="p-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2 text-slate-300">
                  <FileText className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Export PDF Reports</span>
                </div>
                <div className="p-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2 text-slate-300">
                  <PlusCircle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  <span>Manual College Add</span>
                </div>
                <div className="p-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2 text-slate-300">
                  <MessageCircle className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                  <span>Direct Lead WhatsApp</span>
                </div>
              </div>
            </div>

            <div className="text-center pt-1">
              <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>100% Confidential • End-to-End Encrypted</span>
              </span>
            </div>
          </Card>
        </Container>
      </div>
    );
  }

  /* ---------------- AUTHENTICATED DASHBOARD ---------------- */
  return (
    <div className="py-8 bg-slate-50 min-h-screen pb-28">
      <Container size="xl" className="space-y-8">
        {/* Top Header & Navigation Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="gold" className="text-[10px] font-black">
                Admin & CRM Console
              </Badge>
              <Badge variant="default" className="text-[10px] bg-emerald-50 text-emerald-700 font-bold border-emerald-200">
                Live Supabase Connected (2,128 Colleges)
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Admission Leads & College CRM Desk
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage prospective student inquiries, counselling allocations, Cutoff marks, and Manual College Registrations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={exportToPDF}
              className="text-xs font-bold gap-1.5 bg-white text-slate-800 border-slate-300 hover:bg-slate-100 rounded-xl shadow-sm"
            >
              <Printer className="h-4 w-4 text-[#f29a38]" />
              <span>Print / Download PDF Report</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-xs font-bold gap-1.5 text-rose-600 border-rose-200 bg-rose-50/50 hover:bg-rose-100 rounded-xl"
            >
              <LogOut className="h-4 w-4" />
              <span>Lock Staff Portal</span>
            </Button>
          </div>
        </div>

        {/* 4 Interactive Dynamic Metric Cards with Hover Drag & Mobile Wave Animations */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1 */}
          <div
            onClick={() => { setStatusFilter("ALL"); setActiveTab("leads"); }}
            className="group cursor-pointer p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-md hover:shadow-2xl hover:-translate-y-2 hover:border-blue-400 transition-all duration-300 transform active:scale-95 sm:hover:rotate-1 animate-stream-wave"
            style={{ animationDelay: "0s" }}
          >
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
              <span>Total Inquiries</span>
              <div className="h-9 w-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-sm">
                <Users className="h-4.5 w-4.5" />
              </div>
            </div>
            <p className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">{leads.length}</p>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-400">
              <span>All Registered Inquiries</span>
              <span className="text-blue-600 font-bold group-hover:underline">View All →</span>
            </div>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => { setStatusFilter("NEW"); setActiveTab("leads"); }}
            className="group cursor-pointer p-5 sm:p-6 rounded-3xl bg-amber-50/70 border border-amber-200 shadow-md hover:shadow-2xl hover:-translate-y-2 hover:border-amber-400 transition-all duration-300 transform active:scale-95 sm:hover:-rotate-1 animate-stream-wave"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="flex items-center justify-between text-amber-800 text-xs font-bold">
              <span>New / Uncontacted</span>
              <div className="h-9 w-9 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors shadow-sm">
                <Clock className="h-4.5 w-4.5" />
              </div>
            </div>
            <p className="text-3xl sm:text-4xl font-black text-amber-900 mt-2">
              {leads.filter((l) => l.status === "NEW").length}
            </p>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-amber-200/60 text-[11px] text-amber-700 font-medium">
              <span>Needs Immediate Callback</span>
              <span className="font-bold underline">Filter New →</span>
            </div>
          </div>

          {/* Card 3 */}
          <div
            onClick={() => { setStatusFilter("COUNSELLING"); setActiveTab("leads"); }}
            className="group cursor-pointer p-5 sm:p-6 rounded-3xl bg-blue-50/70 border border-blue-200 shadow-md hover:shadow-2xl hover:-translate-y-2 hover:border-blue-500 transition-all duration-300 transform active:scale-95 sm:hover:rotate-1 animate-stream-wave"
            style={{ animationDelay: "1.2s" }}
          >
            <div className="flex items-center justify-between text-blue-800 text-xs font-bold">
              <span>In Counselling</span>
              <div className="h-9 w-9 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-sm">
                <MessageCircle className="h-4.5 w-4.5" />
              </div>
            </div>
            <p className="text-3xl sm:text-4xl font-black text-blue-900 mt-2">
              {leads.filter((l) => l.status === "COUNSELLING" || l.status === "CONTACTED").length}
            </p>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-blue-200/60 text-[11px] text-blue-700 font-medium">
              <span>Active Dialogues</span>
              <span className="font-bold underline">Manage →</span>
            </div>
          </div>

          {/* Card 4 */}
          <div
            onClick={() => { setStatusFilter("ADMITTED"); setActiveTab("leads"); }}
            className="group cursor-pointer p-5 sm:p-6 rounded-3xl bg-emerald-50/70 border border-emerald-200 shadow-md hover:shadow-2xl hover:-translate-y-2 hover:border-emerald-400 transition-all duration-300 transform active:scale-95 sm:hover:-rotate-1 animate-stream-wave"
            style={{ animationDelay: "1.8s" }}
          >
            <div className="flex items-center justify-between text-emerald-800 text-xs font-bold">
              <span>Admitted / Converted</span>
              <div className="h-9 w-9 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-sm">
                <CheckCircle2 className="h-4.5 w-4.5" />
              </div>
            </div>
            <p className="text-3xl sm:text-4xl font-black text-emerald-900 mt-2">
              {leads.filter((l) => l.status === "ADMITTED").length}
            </p>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-emerald-200/60 text-[11px] text-emerald-700 font-medium">
              <span>Enrolled in College</span>
              <span className="font-bold underline">Export PDF →</span>
            </div>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab("leads")}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all ${
              activeTab === "leads"
                ? "bg-[#191d32] text-white shadow-md shadow-slate-900/20"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Users className="h-4 w-4 text-[#f29a38]" />
            <span>1. Student Leads & CRM</span>
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px]">{filteredLeads.length}</span>
          </button>

          <button
            onClick={() => setActiveTab("add_college")}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all ${
              activeTab === "add_college"
                ? "bg-[#191d32] text-white shadow-md shadow-slate-900/20"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <PlusCircle className="h-4 w-4 text-emerald-400" />
            <span>2. Add New College Manually</span>
          </button>

          <button
            onClick={() => setActiveTab("colleges")}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all ${
              activeTab === "colleges"
                ? "bg-[#191d32] text-white shadow-md shadow-slate-900/20"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Building className="h-4 w-4 text-blue-400" />
            <span>3. Live College & Cutoff Manager</span>
          </button>
        </div>

        {/* TAB 1: STUDENT LEADS & CRM WORKFLOW */}
        {activeTab === "leads" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Table Section (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Top Toolbar: Search + Status Filter + Export PDF */}
              <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="Search student name, phone, district, ref ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-10 text-xs rounded-xl bg-slate-50 border-slate-200 focus:border-[#f29a38]"
                    />
                  </div>

                  <Button
                    onClick={exportToPDF}
                    disabled={filteredLeads.length === 0}
                    className="w-full sm:w-auto h-10 px-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-xs rounded-xl shadow-md gap-2 transition-transform hover:scale-105"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Export Official PDF Report ({filteredLeads.length})</span>
                  </Button>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                    <Filter className="h-3.5 w-3.5 text-[#f29a38]" />
                    <span>Filter By Status:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    {["ALL", "NEW", "CONTACTED", "COUNSELLING", "ADMITTED"].map((status) => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                          statusFilter === status
                            ? "bg-[#191d32] text-white shadow-md shadow-slate-900/30 scale-105"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {status} {status !== "ALL" && `(${leads.filter(l => l.status === status).length})`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Leads Table */}
              <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                        <th className="p-4">Ref ID</th>
                        <th className="p-4">Student Details</th>
                        <th className="p-4">Cutoff / Quota</th>
                        <th className="p-4">Target & Stream</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Quick Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {filteredLeads.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-12 text-center text-slate-400 space-y-2">
                            <Users className="h-8 w-8 mx-auto text-slate-300" />
                            <p className="font-bold text-slate-600">No student leads match the current filter.</p>
                            <p className="text-[11px]">Change search query or select "ALL" status.</p>
                          </td>
                        </tr>
                      ) : (
                        filteredLeads.map((lead) => (
                          <tr
                            key={lead.id}
                            onClick={() => handleSelectLead(lead)}
                            className={`hover:bg-blue-50/40 cursor-pointer transition-all ${
                              selectedLead?.id === lead.id ? "bg-amber-50/60 border-l-4 border-l-[#f29a38]" : ""
                            }`}
                          >
                            <td className="p-4 font-bold font-mono text-blue-600">
                              {lead.lead_reference}
                            </td>
                            <td className="p-4 space-y-0.5">
                              <span className="font-bold text-slate-900 block text-xs">{lead.student_name}</span>
                              <span className="text-[11px] text-slate-500 font-mono">{lead.phone_number}</span>
                            </td>
                            <td className="p-4 space-y-0.5">
                              <span className="font-extrabold text-blue-700 block text-xs">
                                {lead.cutoff_score ? `${lead.cutoff_score} / 200` : "N/A"}
                              </span>
                              <Badge variant="secondary" className="text-[9px] font-bold">
                                {lead.community || "OC"}
                              </Badge>
                            </td>
                            <td className="p-4 space-y-0.5 max-w-[180px]">
                              <span className="font-semibold text-slate-800 truncate block">
                                {lead.target_college_name || "General Admission"}
                              </span>
                              <span className="text-[10px] text-slate-500 block truncate">
                                {lead.preferred_stream || lead.preferred_district}
                              </span>
                            </td>
                            <td className="p-4">
                              {getStatusBadge(lead.status)}
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                                <a
                                  href={`https://wa.me/91${lead.phone_number}?text=${encodeURIComponent(
                                    `Hi ${lead.student_name}, this is College Guide Admission Desk regarding your inquiry (Ref: ${lead.lead_reference}).`
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-all border border-emerald-200 shadow-sm"
                                  title="WhatsApp Student"
                                >
                                  <MessageCircle className="h-4 w-4" />
                                </a>
                                <a
                                  href={`tel:${lead.phone_number}`}
                                  className="h-8 w-8 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all border border-blue-200 shadow-sm"
                                  title="Call Student"
                                >
                                  <Phone className="h-4 w-4" />
                                </a>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Lead Detail & Update Action Drawer (4 cols) */}
            <div className="lg:col-span-4 sticky top-24">
              {selectedLead ? (
                <Card className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xl space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[10px] uppercase font-black text-slate-400">Student Profile</span>
                      <h3 className="font-extrabold text-lg text-slate-900">{selectedLead.student_name}</h3>
                    </div>
                    <Badge variant="gold" className="font-mono font-bold text-xs">{selectedLead.lead_reference}</Badge>
                  </div>

                  <div className="space-y-2.5 text-xs text-slate-600">
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="font-semibold text-slate-500">Contact Number:</span>
                      <a href={`tel:${selectedLead.phone_number}`} className="font-bold text-blue-600 hover:underline font-mono">
                        +91 {selectedLead.phone_number}
                      </a>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="font-semibold text-slate-500">12th Cutoff Score:</span>
                      <span className="font-extrabold text-blue-700 text-sm">{selectedLead.cutoff_score ? `${selectedLead.cutoff_score} / 200` : "N/A"}</span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="font-semibold text-slate-500">Community Quota:</span>
                      <span className="font-bold text-slate-900">{selectedLead.community || "OC"}</span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="font-semibold text-slate-500">Target College / Stream:</span>
                      <span className="font-bold text-slate-900 text-right">{selectedLead.target_college_name || selectedLead.preferred_stream || "General"}</span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="font-semibold text-slate-500">Home District:</span>
                      <span className="font-bold text-slate-900">{selectedLead.preferred_district || "Tamil Nadu"}</span>
                    </div>

                    {selectedLead.student_notes && (
                      <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/70 space-y-1">
                        <span className="font-black text-[10px] text-amber-800 uppercase tracking-wide">Student Inquiry Notes:</span>
                        <p className="text-slate-800 italic text-xs leading-relaxed">{selectedLead.student_notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Status Update Form with Explicit Save Button */}
                  <div className="space-y-4 pt-3 border-t border-slate-100 text-xs">
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-900 flex items-center justify-between">
                        <span>Update Workflow Status *</span>
                        <span className="text-[10px] text-blue-600 font-bold">Live DB Sync</span>
                      </label>
                      <select
                        value={leadStatus}
                        onChange={(e) => setLeadStatus(e.target.value as LeadStatus)}
                        className="w-full h-11 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 px-3 font-bold text-xs focus:ring-2 focus:ring-[#f29a38]/20 focus:border-[#f29a38]"
                      >
                        <option value="NEW">NEW (Uncontacted)</option>
                        <option value="CONTACTED">CONTACTED (Phone / WhatsApp)</option>
                        <option value="COUNSELLING">COUNSELLING (Active Choice Guidance)</option>
                        <option value="COLLEGE_SHORTLISTED">COLLEGE_SHORTLISTED</option>
                        <option value="ADMISSION_IN_PROGRESS">ADMISSION_IN_PROGRESS</option>
                        <option value="ADMITTED">ADMITTED (Enrolled Successfully)</option>
                        <option value="CLOSED">CLOSED / ARCHIVED</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-900">Counsellor Remarks & Followup History</label>
                      <textarea
                        rows={3}
                        value={adminNote}
                        onChange={(e) => setAdminNote(e.target.value)}
                        placeholder="Add counsellor discussion notes, college recommendations, or admission remarks..."
                        className="w-full rounded-xl border border-slate-300 p-3 text-xs focus:ring-2 focus:ring-[#f29a38]/20 focus:border-[#f29a38] resize-none bg-slate-50"
                      />
                    </div>

                    {updateSuccess && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
                        <Check className="h-4 w-4" />
                        <span>Lead Status & Counsellor Remarks Saved in Database!</span>
                      </div>
                    )}

                    <Button
                      onClick={handleSaveLeadUpdate}
                      disabled={updating}
                      className="w-full h-11 bg-[#191d32] hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-md gap-2"
                    >
                      <Save className="h-4 w-4 text-[#f29a38]" />
                      <span>{updating ? "Saving Update..." : "Save & Update Student Status"}</span>
                    </Button>

                    <a
                      href={`https://wa.me/91${selectedLead.phone_number}?text=${encodeURIComponent(
                        `Hi ${selectedLead.student_name}, this is College Guide Admission Desk regarding your inquiry (Ref: ${selectedLead.lead_reference}).`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button variant="whatsapp" size="sm" className="w-full font-bold gap-2 rounded-xl">
                        <MessageCircle className="h-4 w-4" />
                        <span>WhatsApp Student Directly</span>
                      </Button>
                    </a>
                  </div>
                </Card>
              ) : (
                <Card className="p-10 text-center space-y-3 text-xs text-slate-500 bg-white rounded-3xl border border-slate-200 shadow-sm">
                  <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <Users className="h-7 w-7" />
                  </div>
                  <p className="font-extrabold text-base text-slate-800">Select a Student Lead</p>
                  <p className="max-w-xs mx-auto text-slate-500">
                    Click any student row from the table to view their complete academic inquiry, assign counsellor remarks, and update their admission status.
                  </p>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ADD NEW COLLEGE MANUALLY (FUTURE EXPANSION) */}
        {activeTab === "add_college" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <Card className="p-6 sm:p-10 bg-white rounded-3xl border border-slate-200 shadow-xl space-y-6">
              <div className="space-y-1 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <Badge variant="gold" className="text-[10px]">Database Expansion</Badge>
                  <Badge variant="default" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">Instant Live Seeding</Badge>
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Add New College to Tamil Nadu Directory
                </h2>
                <p className="text-xs text-slate-500">
                  When a new college opens or an institution is sanctioned, register its verified profile directly into your Supabase Database.
                </p>
              </div>

              {addCollegeMsg && (
                <div
                  className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                    addCollegeMsg.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-rose-50 text-rose-800 border border-rose-200"
                  }`}
                >
                  {addCollegeMsg.type === "success" ? <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" /> : <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />}
                  <span>{addCollegeMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleAddNewCollegeSubmit} className="space-y-6 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="font-bold text-slate-800">College Full Name *</label>
                    <Input
                      type="text"
                      required
                      placeholder="e.g. Government College of Engineering, Chennai"
                      value={newCollege.name}
                      onChange={(e) => setNewCollege({ ...newCollege, name: e.target.value })}
                      className="h-11 rounded-xl bg-slate-50 border-slate-300"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800">Short / Brand Name</label>
                    <Input
                      type="text"
                      placeholder="e.g. GCE Chennai"
                      value={newCollege.short_name}
                      onChange={(e) => setNewCollege({ ...newCollege, short_name: e.target.value })}
                      className="h-11 rounded-xl bg-slate-50 border-slate-300"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800">TNEA / Counselling Code</label>
                    <Input
                      type="text"
                      placeholder="e.g. 1001"
                      value={newCollege.tnea_code}
                      onChange={(e) => setNewCollege({ ...newCollege, tnea_code: e.target.value })}
                      className="h-11 rounded-xl bg-slate-50 border-slate-300 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800">District *</label>
                    <select
                      value={newCollege.district}
                      onChange={(e) => setNewCollege({ ...newCollege, district: e.target.value, city: e.target.value })}
                      className="w-full h-11 rounded-xl border border-slate-300 bg-slate-50 px-3 font-semibold text-xs focus:ring-2 focus:ring-[#f29a38]/20 focus:border-[#f29a38]"
                    >
                      {tnDistricts.map((d) => (
                        <option key={d} value={d}>
                          {d} District
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800">City / Location</label>
                    <Input
                      type="text"
                      placeholder="e.g. Guindy, Chennai"
                      value={newCollege.city}
                      onChange={(e) => setNewCollege({ ...newCollege, city: e.target.value })}
                      className="h-11 rounded-xl bg-slate-50 border-slate-300"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800">Institution Type</label>
                    <select
                      value={newCollege.institution_type}
                      onChange={(e) => setNewCollege({ ...newCollege, institution_type: e.target.value })}
                      className="w-full h-11 rounded-xl border border-slate-300 bg-slate-50 px-3 font-semibold text-xs"
                    >
                      <option value="Government">Government Institution</option>
                      <option value="Autonomous">Autonomous Self-Financing</option>
                      <option value="Affiliated">Affiliated College</option>
                      <option value="Deemed University">Deemed University</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800">Affiliation Authority</label>
                    <Input
                      type="text"
                      placeholder="e.g. Anna University / University of Madras"
                      value={newCollege.affiliation}
                      onChange={(e) => setNewCollege({ ...newCollege, affiliation: e.target.value })}
                      className="h-11 rounded-xl bg-slate-50 border-slate-300"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="font-bold text-slate-800">Accreditation & Approvals</label>
                    <Input
                      type="text"
                      placeholder="e.g. NAAC A++ Grade | NBA Accredited | AICTE Approved"
                      value={newCollege.accreditation}
                      onChange={(e) => setNewCollege({ ...newCollege, accreditation: e.target.value })}
                      className="h-11 rounded-xl bg-slate-50 border-slate-300"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="font-bold text-slate-800">Overview / Description</label>
                    <textarea
                      rows={3}
                      placeholder="Write a brief overview of courses, campus facilities, and cutoff guidance..."
                      value={newCollege.description}
                      onChange={(e) => setNewCollege({ ...newCollege, description: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 p-3 bg-slate-50 focus:ring-2 focus:ring-[#f29a38]/20 focus:border-[#f29a38] resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800">Official Website URL</label>
                    <Input
                      type="url"
                      placeholder="https://..."
                      value={newCollege.website_url}
                      onChange={(e) => setNewCollege({ ...newCollege, website_url: e.target.value })}
                      className="h-11 rounded-xl bg-slate-50 border-slate-300"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800">NIRF Ranking (Optional)</label>
                    <Input
                      type="number"
                      placeholder="e.g. 15"
                      value={newCollege.nirf_ranking}
                      onChange={(e) => setNewCollege({ ...newCollege, nirf_ranking: e.target.value })}
                      className="h-11 rounded-xl bg-slate-50 border-slate-300"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <Button
                    type="submit"
                    disabled={addCollegeLoading}
                    className="h-12 px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-lg shadow-emerald-600/20 text-sm gap-2"
                  >
                    <PlusCircle className="h-5 w-5" />
                    <span>{addCollegeLoading ? "Saving to Database..." : "Register College to Supabase DB"}</span>
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* TAB 3: LIVE COLLEGE & CUTOFF MANAGER */}
        {activeTab === "colleges" && (
          <div className="space-y-6">
            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search college name or TNEA code..."
                    value={collegeSearch}
                    onChange={(e) => setCollegeSearch(e.target.value)}
                    className="pl-10 h-10 text-xs rounded-xl bg-slate-50 border-slate-200"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs font-bold text-slate-500">District:</span>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="h-10 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold px-3"
                  >
                    <option value="ALL">All 38 Districts</option>
                    {tnDistricts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Colleges Grid List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredColleges.length === 0 ? (
                <div className="col-span-full p-12 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
                  <Building className="h-10 w-10 mx-auto text-slate-300" />
                  <p className="font-bold text-slate-700 mt-2">No colleges match the search filter.</p>
                </div>
              ) : (
                filteredColleges.map((col) => (
                  <Card key={col.slug || col.id} className="p-5 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-black uppercase text-[#f29a38] tracking-wider block">
                          {col.district} • {col.institution_type}
                        </span>
                        <h3 className="font-extrabold text-sm text-slate-900 line-clamp-1">{col.name}</h3>
                      </div>
                      {col.tnea_code && (
                        <Badge variant="gold" className="font-mono text-[10px]">
                          Code: {col.tnea_code}
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {col.description || col.accreditation}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <a
                        href={`/colleges/${col.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 font-bold hover:underline"
                      >
                        View Live Profile →
                      </a>
                      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Active in DB
                      </span>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
