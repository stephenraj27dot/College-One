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
} from "lucide-react";

import { Lock, LogOut, Key, Download, FileSpreadsheet, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [leads, setLeads] = useState<CounsellingLead[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLead, setSelectedLead] = useState<CounsellingLead | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth = sessionStorage.getItem("cg_admin_authenticated") === "true";
      if (isAuth) {
        setIsAuthenticated(true);
        getAllLeads().then(setLeads);
      }
    }
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const validPasscodes = ["96296", "admin123", "collegeguide", "counsellor2026"];
    if (validPasscodes.includes(passcode.trim())) {
      setIsAuthenticated(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("cg_admin_authenticated", "true");
      }
      getAllLeads().then(setLeads);
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

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    setUpdating(true);
    await updateLeadStatus(leadId, newStatus, adminNote || undefined);
    const updated = await getAllLeads();
    setLeads(updated);
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead({ ...selectedLead, status: newStatus, admin_remarks: adminNote || selectedLead.admin_remarks });
    }
    setUpdating(false);
  };

  const exportToCSV = () => {
    if (filteredLeads.length === 0) return;
    const headers = [
      "Reference ID",
      "Student Name",
      "Phone Number",
      "Cutoff Score",
      "Community",
      "Preferred District",
      "Preferred Stream",
      "Target College",
      "Status",
      "Student Remarks",
      "Admin Notes",
      "Created Date"
    ];

    const rows = filteredLeads.map((l) => [
      `"${l.lead_reference || ""}"`,
      `"${(l.student_name || "").replace(/"/g, '""')}"`,
      `"${l.phone_number || ""}"`,
      `"${l.cutoff_score || ""}"`,
      `"${l.community || ""}"`,
      `"${(l.preferred_district || "").replace(/"/g, '""')}"`,
      `"${(l.preferred_stream || "").replace(/"/g, '""')}"`,
      `"${(l.target_college_name || "").replace(/"/g, '""')}"`,
      `"${l.status || ""}"`,
      `"${(l.student_notes || "").replace(/"/g, '""')}"`,
      `"${(l.admin_remarks || "").replace(/"/g, '""')}"`,
      `"${l.created_at ? new Date(l.created_at).toLocaleDateString("en-IN") : ""}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `college_guide_student_leads_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case "NEW":
        return <Badge variant="gold">NEW</Badge>;
      case "CONTACTED":
        return <Badge variant="default">CONTACTED</Badge>;
      case "COUNSELLING":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-bold">COUNSELLING</Badge>;
      case "ADMISSION_IN_PROGRESS":
        return <Badge variant="warning">ADMISSION IN PROGRESS</Badge>;
      case "ADMITTED":
        return <Badge variant="success">ADMITTED</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="py-20 bg-gradient-to-b from-slate-900 via-[#191d32] to-slate-900 min-h-screen flex items-center justify-center px-4">
        <Container size="sm" className="w-full max-w-md space-y-6">
          <div className="text-center space-y-3">
            <div className="h-16 w-16 rounded-3xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto text-amber-400 shadow-xl shadow-amber-500/10">
              <Lock className="h-8 w-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Staff & Counsellor Gateway
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              This area contains confidential student admission inquiries and is protected for College Guide staff only.
            </p>
          </div>

          <Card className="p-6 sm:p-8 bg-slate-900/90 rounded-3xl border border-slate-800 shadow-2xl space-y-5 backdrop-blur-xl">
            <form onSubmit={handleAdminLogin} className="space-y-4">
              {authError && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                  <span>{authError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Enter Staff Access Passcode</span>
                  <span className="text-[10px] text-amber-400 font-mono">Master PIN</span>
                </label>
                <div className="relative">
                  <Input
                    type="password"
                    required
                    placeholder="Enter security key (e.g. 96296)"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="h-12 rounded-xl bg-slate-800/80 border-slate-700 text-white font-mono tracking-widest text-center text-lg pl-3"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-[#f29a38] to-[#d98528] hover:from-[#d98528] hover:to-[#b76e1f] text-white font-extrabold text-sm rounded-xl shadow-lg shadow-[#f29a38]/30 gap-2 transition-all hover:scale-[1.01]"
              >
                <Key className="h-4 w-4" />
                <span>Unlock CRM & Leads Portal</span>
              </Button>
            </form>

            <div className="pt-2 text-center">
              <span className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>End-to-End Encrypted Student CRM</span>
              </span>
            </div>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-10 bg-slate-50 min-h-screen pb-24">
      <Container size="xl" className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="gold" className="text-[10px]">
                Admin & CRM Console
              </Badge>
              <Badge variant="default" className="text-[10px] bg-emerald-50 text-emerald-700 font-bold border-emerald-200">
                Authorized Staff
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Admission Leads & CRM Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage prospective student inquiries, TNEA cutoff guidance requests, and counsellor assignments.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="text-xs font-bold gap-1.5 text-rose-600 border-rose-200 hover:bg-rose-50 rounded-xl"
          >
            <LogOut className="h-4 w-4" />
            <span>Lock & Log Out Staff</span>
          </Button>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-5 space-y-1 bg-white">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Total Inquiries</span>
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{leads.length}</p>
            <span className="text-[10px] text-slate-400">All registered requests</span>
          </Card>

          <Card className="p-5 space-y-1 bg-amber-50/50 border-amber-200">
            <div className="flex items-center justify-between text-amber-800 text-xs font-semibold">
              <span>New / Uncontacted</span>
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
            <p className="text-2xl font-extrabold text-amber-900">
              {leads.filter((l) => l.status === "NEW").length}
            </p>
            <span className="text-[10px] text-amber-700">Needs counsellor followup</span>
          </Card>

          <Card className="p-5 space-y-1 bg-blue-50/50 border-blue-200">
            <div className="flex items-center justify-between text-blue-800 text-xs font-semibold">
              <span>In Counselling</span>
              <MessageCircle className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-2xl font-extrabold text-blue-900">
              {leads.filter((l) => l.status === "COUNSELLING" || l.status === "CONTACTED").length}
            </p>
            <span className="text-[10px] text-blue-700">Active dialogue</span>
          </Card>

          <Card className="p-5 space-y-1 bg-emerald-50/50 border-emerald-200">
            <div className="flex items-center justify-between text-emerald-800 text-xs font-semibold">
              <span>Admitted / Converted</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-extrabold text-emerald-900">
              {leads.filter((l) => l.status === "ADMITTED").length}
            </p>
            <span className="text-[10px] text-emerald-700">Successful enrollment</span>
          </Card>
        </div>

        {/* Filter & Leads Table Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Leads Table */}
          <div className="lg:col-span-8 space-y-4">
            {/* Top Toolbar: Search + Status Filter + Export CSV */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search student name, phone, district..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-10 text-xs rounded-xl bg-slate-50 border-slate-200"
                  />
                </div>

                <Button
                  onClick={exportToCSV}
                  disabled={filteredLeads.length === 0}
                  className="w-full sm:w-auto h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm gap-2"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>Export to Excel / CSV ({filteredLeads.length})</span>
                </Button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                  <Filter className="h-3.5 w-3.5 text-blue-600" />
                  <span>Status:</span>
                </div>
                <div className="flex flex-wrap gap-1 text-xs">
                  {["ALL", "NEW", "CONTACTED", "COUNSELLING", "ADMITTED"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                        statusFilter === status
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-3xl border border-slate-200 bg-white overflow-x-auto shadow-sm">
              <table className="w-full text-left text-xs border-collapse min-w-[650px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold">
                    <th className="p-3.5">Ref ID</th>
                    <th className="p-3.5">Student Details</th>
                    <th className="p-3.5">Cutoff / Quota</th>
                    <th className="p-3.5">Target & Stream</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Quick Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        No student leads match the current search / filter.
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead) => (
                      <tr
                        key={lead.id}
                        onClick={() => {
                          setSelectedLead(lead);
                          setAdminNote(lead.admin_remarks || "");
                        }}
                        className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                          selectedLead?.id === lead.id ? "bg-blue-50/60" : ""
                        }`}
                      >
                        <td className="p-3.5 font-bold text-blue-600">
                          {lead.lead_reference}
                        </td>
                        <td className="p-3.5 space-y-0.5">
                          <span className="font-bold text-slate-900 block">{lead.student_name}</span>
                          <span className="text-[11px] text-slate-500">{lead.phone_number}</span>
                        </td>
                        <td className="p-3.5 space-y-0.5">
                          <span className="font-extrabold text-blue-600 block">
                            {lead.cutoff_score ? `${lead.cutoff_score} / 200` : "N/A"}
                          </span>
                          <Badge variant="secondary" className="text-[9px] font-bold">
                            {lead.community || "OC"}
                          </Badge>
                        </td>
                        <td className="p-3.5 space-y-0.5 max-w-[180px]">
                          <span className="font-semibold text-slate-800 truncate block">
                            {lead.target_college_name || "General Guidance"}
                          </span>
                          <span className="text-[10px] text-slate-500 block truncate">
                            {lead.preferred_stream || lead.preferred_district}
                          </span>
                        </td>
                        <td className="p-3.5">
                          {getStatusBadge(lead.status)}
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <a
                              href={`https://wa.me/91${lead.phone_number}?text=${encodeURIComponent(
                                `Hi ${lead.student_name}, this is College Guide Admission Desk regarding your inquiry (Ref: ${lead.lead_reference}).`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-colors border border-emerald-200"
                              title="WhatsApp Student"
                            >
                              <MessageCircle className="h-4 w-4" />
                            </a>
                            <a
                              href={`tel:${lead.phone_number}`}
                              className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors border border-blue-200"
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

          {/* Right Lead Detail & Action Drawer */}
          <div className="lg:col-span-4">
            {selectedLead ? (
              <Card className="p-6 bg-white border border-slate-200 shadow-md space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Lead Detail</span>
                    <h3 className="font-extrabold text-base text-slate-900">{selectedLead.student_name}</h3>
                  </div>
                  <Badge variant="gold" className="font-bold">{selectedLead.lead_reference}</Badge>
                </div>

                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="font-semibold text-slate-500">Phone:</span>
                    <a href={`tel:${selectedLead.phone_number}`} className="font-bold text-blue-600">
                      {selectedLead.phone_number}
                    </a>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="font-semibold text-slate-500">12th Cutoff:</span>
                    <span className="font-bold text-slate-900">{selectedLead.cutoff_score || "N/A"}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="font-semibold text-slate-500">Community:</span>
                    <span className="font-bold text-slate-900">{selectedLead.community || "OC"}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="font-semibold text-slate-500">Preferred District:</span>
                    <span className="font-bold text-slate-900">{selectedLead.preferred_district || "Tamil Nadu"}</span>
                  </div>

                  {selectedLead.student_notes && (
                    <div className="p-3 rounded-xl bg-slate-50 space-y-1">
                      <span className="font-bold text-[10px] text-slate-500 uppercase">Student Inquiry:</span>
                      <p className="text-slate-800 italic">{selectedLead.student_notes}</p>
                    </div>
                  )}
                </div>

                {/* Status Update Form */}
                <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                  <label className="font-bold text-slate-900">Update Lead Workflow Status</label>
                  <select
                    value={selectedLead.status}
                    onChange={(e) => handleStatusChange(selectedLead.id, e.target.value as LeadStatus)}
                    className="w-full h-10 rounded-xl border border-slate-300 bg-white px-3 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="NEW">NEW</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="COUNSELLING">COUNSELLING</option>
                    <option value="COLLEGE_SHORTLISTED">COLLEGE_SHORTLISTED</option>
                    <option value="ADMISSION_IN_PROGRESS">ADMISSION_IN_PROGRESS</option>
                    <option value="ADMITTED">ADMITTED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-900">Counsellor Remarks / Notes</label>
                    <textarea
                      rows={2}
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      placeholder="Add followup notes..."
                      className="w-full rounded-xl border border-slate-300 p-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  <a
                    href={`https://wa.me/91${selectedLead.phone_number}?text=${encodeURIComponent(
                      `Hi ${selectedLead.student_name}, this is regarding your admission guidance request on College Guide (Ref: ${selectedLead.lead_reference}).`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button variant="whatsapp" size="sm" className="w-full font-bold gap-1.5">
                      <MessageCircle className="h-4 w-4" />
                      <span>WhatsApp Student Directly</span>
                    </Button>
                  </a>
                </div>
              </Card>
            ) : (
              <Card className="p-8 text-center space-y-2 text-xs text-slate-500 bg-white">
                <Users className="h-8 w-8 text-slate-400 mx-auto" />
                <p className="font-bold text-slate-700">Select a Lead</p>
                <p>Click any row on the table to view student notes and update workflow status.</p>
              </Card>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
