"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import AppShell, { AuthGateCard, AIDisclaimer } from "@/components/AppShell";
import {
  Sparkles,
  ShieldCheck,
  Thermometer,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Printer,
  Download,
  Copy,
  Check,
  Layers,
  Key,
  Terminal,
  Trash2,
  Plus,
  Send,
  Eye,
  Camera,
  Upload,
  RefreshCw,
  ChefHat,
  Search,
  CheckSquare,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import {
  HACCP_PRESETS,
  HaccpAuditPreset,
  TemperatureReading,
  HygieneCheckItem,
  PrepLabelItem,
  CorrectiveTask,
} from "@/lib/presets";
import { APP_METADATA } from "@/lib/sensifai/app-metadata";

export default function WorkspacePage() {
  const [activeTab, setActiveTab] = useState<"studio" | "custom" | "pack" | "api">("studio");
  const [selectedCase, setSelectedCase] = useState<HaccpAuditPreset>(HACCP_PRESETS[0]);
  const [caseList, setCaseList] = useState<HaccpAuditPreset[]>(HACCP_PRESETS);

  // Custom Audit Form State
  const [customStation, setCustomStation] = useState("Walk-In Cooler Line #1");
  const [customCategory, setCustomCategory] = useState("Cold Holding & Protein Storage");
  const [customTemp, setCustomTemp] = useState("37.8");
  const [customUnit, setCustomUnit] = useState<"°F" | "°C">("°F");
  const [customObservations, setCustomObservations] = useState(
    "Morning line audit: raw beef and poultry stored in separate stainless steel cambros. Handwash sink stocked with antimicrobial soap."
  );
  const [customLabels, setCustomLabels] = useState(
    "Prime beef strip loin prepped Nov 15, House herb butter prepped Nov 14 (contains dairy)."
  );

  // Session & Wallet State
  const [session, setSession] = useState<{
    authenticated: boolean;
    user: any;
    wallet?: { balance: number; currency: string } | null;
  } | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [actionErrorMsg, setActionErrorMsg] = useState<string | null>(null);

  // Developer API State
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [newKeyName, setNewKeyName] = useState("Kitchen Tablet POS Audit Key");
  const [generatingKey, setGeneratingKey] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [keyNoticeMsg, setKeyNoticeMsg] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  // Sandbox State
  const [sandboxStation, setSandboxStation] = useState("Cook Line Hot Wells");
  const [sandboxTemp, setSandboxTemp] = useState("142.5");
  const [sandboxResult, setSandboxResult] = useState<any>(null);
  const [sandboxLoading, setSandboxLoading] = useState(false);
  const [sandboxKeyInput, setSandboxKeyInput] = useState("");

  const loadApiKeys = () => {
    fetch("/api/v1/keys", { cache: "no-store" })
      .then((res) => res.json())
      .then((d) => {
        if (d.success && Array.isArray(d.keys)) {
          setApiKeys(d.keys);
        }
      })
      .catch((e) => console.error("Error loading keys:", e));
  };

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setSession(data))
      .catch(() => setSession({ authenticated: false, user: null }));
    loadApiKeys();
  }, []);

  const handleGenerateKey = async () => {
    setGeneratingKey(true);
    setKeyNoticeMsg(null);
    try {
      const res = await fetch("/api/v1/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName }),
      });
      const data = await res.json();
      if (data.success && data.apiKey) {
        setGeneratedKey(data.apiKey);
        setSandboxKeyInput(data.apiKey);
        setKeyNoticeMsg("New dedicated API key created. Store it safely.");
        loadApiKeys();
      } else {
        setKeyNoticeMsg(data.error || "Failed to create key");
      }
    } catch (e: any) {
      setKeyNoticeMsg(e.message || "Network error");
    } finally {
      setGeneratingKey(false);
    }
  };

  const handleRevokeKey = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/keys?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        loadApiKeys();
      }
    } catch (e) {
      console.error("Revoke error:", e);
    }
  };

  const handleRunCustomAudit = async () => {
    setLoadingAction(true);
    setActionSuccessMsg(null);
    setActionErrorMsg(null);

    try {
      const res = await fetch("/api/billable-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stationName: customStation,
          category: customCategory,
          measuredTemp: Number(customTemp) || 38.0,
          unit: customUnit,
          observations: customObservations,
          labelsText: customLabels,
        }),
      });

      const data = await res.json();

      if (res.status === 401) {
        setActionErrorMsg("Authentication required. Please sign in with your Sensifai account.");
        return;
      }

      if (res.status === 402) {
        setActionErrorMsg("Wallet balance insufficient. Please top up your Sensifai wallet.");
        return;
      }

      if (!res.ok) {
        setActionErrorMsg(data.error || "Failed to run audit analysis");
        return;
      }

      if (data.wallet) {
        window.dispatchEvent(
          new CustomEvent("sensifai_wallet_updated", {
            detail: { balance: data.wallet.balance, currency: data.wallet.currency },
          })
        );
      }

      if (data.audit) {
        const newAudit: HaccpAuditPreset = {
          id: `custom-${Date.now()}`,
          title: data.audit.title || customStation,
          category: data.audit.category || customCategory,
          location: data.audit.location || "Custom Inspection Station",
          shift: data.audit.shift || "On-Demand Audit",
          auditor: "Authenticated Kitchen Manager",
          overallScore: data.audit.overallScore || 92,
          ccpStatus: data.audit.ccpStatus || "PASSED",
          summary: data.audit.summary || "Custom kitchen hygiene audit completed successfully.",
          imageSrc: "/images/hero.jpg",
          temperatureReadings: data.audit.temperatureReadings || [],
          hygieneItems: data.audit.hygieneItems || [],
          prepLabels: data.audit.prepLabels || [],
          correctiveTasks: data.audit.correctiveTasks || [],
        };

        setCaseList((prev) => [newAudit, ...prev]);
        setSelectedCase(newAudit);
        setActiveTab("studio");
        setActionSuccessMsg(`Audit verified! Deducted €${data.deducted_eur || "0.05"} from your wallet.`);
      }
    } catch (err: any) {
      setActionErrorMsg(err.message || "Network error executing audit");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleRunSandbox = async () => {
    setSandboxLoading(true);
    setSandboxResult(null);
    try {
      const res = await fetch("/api/v1/audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sandboxKeyInput}`,
        },
        body: JSON.stringify({
          stationName: sandboxStation,
          measuredTemp: Number(sandboxTemp) || 140.0,
          unit: "°F",
          observations: "Automated test from Developer Sandbox",
        }),
      });
      const data = await res.json();
      setSandboxResult(data);
    } catch (e: any) {
      setSandboxResult({ error: e.message });
    } finally {
      setSandboxLoading(false);
    }
  };

  return (
    <AppShell
      appName={APP_METADATA.name}
      appTagline={APP_METADATA.tagline}
      logoSrc="/logo.png"
      primaryColor={APP_METADATA.primaryColor}
      activeTab={activeTab}
      onSelectTab={(id: any) => setActiveTab(id)}
      pricePerActionEur={0.05}
      navItems={[
        { id: "studio", label: "HACCP Studio", icon: <Sparkles className="h-4 w-4" /> },
        { id: "custom", label: "Custom Station Audit", icon: <Camera className="h-4 w-4" />, badge: "Live AI" },
        { id: "pack", label: "Inspector Pack", icon: <FileText className="h-4 w-4" /> },
        { id: "api", label: "Developer API Hub", icon: <Layers className="h-4 w-4" />, badge: "REST" },
      ]}
    >
      <div className="space-y-6">
        {/* Top Notification Alerts */}
        {actionSuccessMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-medium flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{actionSuccessMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => setActionSuccessMsg(null)}
              className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {actionErrorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm font-medium flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{actionErrorMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => setActionErrorMsg(null)}
              className="text-rose-700 hover:text-rose-900 text-xs font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* =========================================================================
            TAB 1: HACCP STUDIO WORKSPACE (PRESETS & DETAILED TELEMETRY)
        ========================================================================== */}
        {activeTab === "studio" && (
          <div className="space-y-6">
            {/* Scenario Selector Ribbon */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Select Kitchen Audit Scenario
                </span>
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckSquare className="h-3.5 w-3.5" />
                  <span>{caseList.length} Scenarios Available</span>
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {caseList.map((c) => {
                  const isSelected = selectedCase.id === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedCase(c)}
                      className={`text-left p-3.5 rounded-xl border transition-all duration-150 flex flex-col justify-between ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-50/50 shadow-xs"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-semibold text-slate-500 truncate">{c.category}</span>
                          <span
                            className={`font-mono text-[11px] font-bold px-1.5 py-0.5 rounded ${
                              c.ccpStatus === "PASSED"
                                ? "bg-emerald-100 text-emerald-800"
                                : c.ccpStatus === "ACTION_REQUIRED"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {c.overallScore}/100
                          </span>
                        </div>
                        <div className="font-bold text-slate-900 text-sm line-clamp-1">{c.title}</div>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-2 truncate">{c.shift}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Executive KPI & Telemetry Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Hygiene Compliance Score */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center gap-4">
                <div className="relative h-14 w-14 shrink-0 flex items-center justify-center">
                  <svg className="h-14 w-14 -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-100"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={
                        selectedCase.overallScore >= 90
                          ? "text-emerald-600"
                          : selectedCase.overallScore >= 75
                          ? "text-amber-500"
                          : "text-rose-600"
                      }
                      strokeDasharray={`${selectedCase.overallScore}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute font-mono font-bold text-xs text-slate-900">
                    {selectedCase.overallScore}%
                  </span>
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">Hygiene Index</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">
                    {selectedCase.overallScore >= 90
                      ? "Grade A Excellent"
                      : selectedCase.overallScore >= 75
                      ? "Needs Correction"
                      : "Critical Alert"}
                  </div>
                </div>
              </div>

              {/* CCP Status */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
                <div className="text-xs text-slate-500 font-medium">Critical Control Point</div>
                <div className="flex items-center gap-2 mt-1">
                  {selectedCase.ccpStatus === "PASSED" ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>PASSED</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 font-bold text-xs border border-amber-200">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>CORRECTION REQ</span>
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 truncate">
                  {selectedCase.hygieneItems.length} Inspection Items Checked
                </div>
              </div>

              {/* Primary Temperature Reading */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
                <div className="text-xs text-slate-500 font-medium">Core Temp Reading</div>
                <div className="font-mono text-xl font-bold text-slate-900 mt-1 tabular-nums flex items-baseline gap-1">
                  <span>{selectedCase.temperatureReadings[0]?.measuredTemp ?? "36.4"}</span>
                  <span className="text-xs font-normal text-slate-500">
                    {selectedCase.temperatureReadings[0]?.unit ?? "°F"}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 truncate">
                  Target: {selectedCase.temperatureReadings[0]?.targetRange ?? "Safe"}
                </div>
              </div>

              {/* Corrective Action Count */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
                <div className="text-xs text-slate-500 font-medium">Corrective Tasks</div>
                <div className="font-mono text-xl font-bold text-slate-900 mt-1 tabular-nums">
                  {selectedCase.correctiveTasks.length} Pending
                </div>
                <div className="text-[11px] text-slate-400 mt-1 truncate">
                  Assigned for immediate resolution
                </div>
              </div>
            </div>

            {/* Case Overview & Photographic Evidence */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Photo Evidence Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
                <div className="h-10 bg-slate-50 border-b border-slate-200/80 px-4 flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Camera className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Station Photographic Proof</span>
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">1280x720</span>
                </div>
                <div className="relative aspect-video w-full bg-slate-900">
                  <Image
                    src={selectedCase.imageSrc}
                    alt={selectedCase.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[10px] font-mono text-white">
                    VERIFIED EVIDENCE
                  </div>
                </div>
                <div className="p-4 text-xs text-slate-600 space-y-1">
                  <div className="font-semibold text-slate-900">{selectedCase.location}</div>
                  <div className="text-slate-500">Audited by: {selectedCase.auditor}</div>
                </div>
              </div>

              {/* Executive Summary & AI Findings */}
              <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                      Sensifai Vision Core · Audit Summary
                    </span>
                    <span className="text-xs text-slate-400 font-mono">ID: {selectedCase.id}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{selectedCase.title}</h3>
                  <p className="text-sm text-slate-700 leading-relaxed mb-4">{selectedCase.summary}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-slate-500">
                    Metered usage: <span className="font-mono font-bold text-slate-800">€0.05</span> from Sensifai prepaid wallet
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => setActiveTab("pack")}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      <span>Generate Inspector Pack</span>
                    </button>
                    <AIDisclaimer />
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Telemetry: Temperatures + Checklist */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Temperature Reading Log */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-emerald-600" />
                    <span>HACCP Temperature Extraction Log</span>
                  </h4>
                  <span className="text-xs text-slate-400 font-mono">
                    {selectedCase.temperatureReadings.length} Probes
                  </span>
                </div>
                <div className="space-y-3">
                  {selectedCase.temperatureReadings.map((reading, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <div className="font-semibold text-slate-900 text-xs">{reading.station}</div>
                        <div className="text-[11px] text-slate-500">
                          {reading.probeType} · Range: {reading.targetRange}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-base font-bold text-slate-900 tabular-nums">
                          {reading.measuredTemp} {reading.unit}
                        </div>
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            reading.status === "SAFE"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {reading.status} ({(reading.confidence * 100).toFixed(0)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Station Hygiene Checklist */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-emerald-600" />
                    <span>Station Hygiene & Cross-Contamination</span>
                  </h4>
                  <span className="text-xs text-slate-400 font-mono">
                    {selectedCase.hygieneItems.length} Checks
                  </span>
                </div>
                <div className="space-y-3">
                  {selectedCase.hygieneItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">{item.station}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.status === "PASS"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600">{item.check}</div>
                      <div className="text-[11px] text-slate-400 italic">Proof: {item.evidence}</div>
                      {item.correctiveAction && (
                        <div className="text-[11px] font-medium text-amber-800 bg-amber-50 p-2 rounded border border-amber-200">
                          Action: {item.correctiveAction}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Prep Label Expiration & Allergen Log */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4 text-emerald-600" />
                  <span>Prep Label Date Expiration & Allergen Callouts</span>
                </h4>
                <span className="text-xs text-slate-400 font-mono">
                  {selectedCase.prepLabels.length} Containers
                </span>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {selectedCase.prepLabels.map((lbl) => (
                  <div
                    key={lbl.id}
                    className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-xs text-slate-900">{lbl.item}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            lbl.status === "COMPLIANT"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {lbl.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 space-y-0.5">
                        <div>Prepped: <span className="font-mono font-medium">{lbl.prepDate}</span></div>
                        <div>Expires: <span className="font-mono font-medium">{lbl.expiryDate}</span></div>
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
                      {lbl.notes}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Corrective Action Task Assignments */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <span>Corrective Action Tasks for Kitchen Staff</span>
                </h4>
                <span className="text-xs text-slate-400 font-mono">
                  {selectedCase.correctiveTasks.length} Assigned
                </span>
              </div>
              <div className="space-y-3">
                {selectedCase.correctiveTasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            t.priority === "CRITICAL"
                              ? "bg-rose-100 text-rose-800"
                              : t.priority === "HIGH"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {t.priority}
                        </span>
                        <span className="font-bold text-xs text-slate-900">{t.title}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Assigned to: <span className="font-semibold">{t.assignedRole}</span> · Deadline: {t.deadline}
                      </div>
                    </div>
                    <div className="text-xs text-slate-400 font-mono shrink-0">
                      HACCP Task Logged
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: CUSTOM AUDIT & PHOTO INGESTION (LIVE AI + 401 GATE)
        ========================================================================== */}
        {activeTab === "custom" && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
              <div className="mb-6 space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                  <Camera className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Custom Kitchen Station Audit</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  Submit Kitchen Photos & Sensor Readings
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Upload photos of walk-in coolers, cook lines, prep labels, or dish machine temperature strips. Sensifai AI verifies critical control points, checks holding ranges, and compiles certified compliance reports.
                </p>
              </div>

              {/* Guest Authentication Gate Card */}
              {!session?.authenticated ? (
                <div className="mb-6">
                  <AuthGateCard
                    authenticated={!!session?.authenticated}
                    primaryColor={APP_METADATA.primaryColor}
                    priceEur={0.05}
                    featureTitle="Run Custom AI Kitchen Audit"
                  />
                </div>
              ) : null}

              {/* Input Form */}
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Kitchen Station Name
                    </label>
                    <input
                      type="text"
                      value={customStation}
                      onChange={(e) => setCustomStation(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                      placeholder="e.g. Walk-in Cooler Line 1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Station Category
                    </label>
                    <select
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                    >
                      <option value="Cold Holding & Protein Storage">Cold Holding & Protein Storage</option>
                      <option value="Salad Prep & Deli Slicer Station">Salad Prep & Deli Slicer Station</option>
                      <option value="Cook Line & Hot Holding Wells">Cook Line & Hot Holding Wells</option>
                      <option value="High-Temp Dish Machine & Sanitation">High-Temp Dish Machine & Sanitation</option>
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Measured Thermometer Reading
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customTemp}
                        onChange={(e) => setCustomTemp(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-mono text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                        placeholder="e.g. 37.8"
                      />
                      <select
                        value={customUnit}
                        onChange={(e: any) => setCustomUnit(e.target.value)}
                        className="w-24 px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-mono text-xs text-slate-900"
                      >
                        <option value="°F">°F</option>
                        <option value="°C">°C</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Station Photo / Media Upload
                    </label>
                    <div className="p-2.5 border border-dashed border-slate-300 rounded-xl bg-slate-50 flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Upload className="h-4 w-4 text-emerald-600" />
                        <span>kitchen-walkin-line.jpg (1.8 MB)</span>
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-700">Ready</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Visual Hygiene Observations
                  </label>
                  <textarea
                    rows={2}
                    value={customObservations}
                    onChange={(e) => setCustomObservations(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                    placeholder="Describe surfaces, cutting board colors, employee glove use, or sanitize bucket ppm..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Food Prep Labels & Expiration Text
                  </label>
                  <textarea
                    rows={2}
                    value={customLabels}
                    onChange={(e) => setCustomLabels(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                    placeholder="Transcribe food container prep dates, batch numbers, or shelf-life labels..."
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleRunCustomAudit}
                    disabled={loadingAction}
                    className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    {loadingAction ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Running Sensifai Vision Core Analysis...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        <span>Run AI Kitchen Audit (€0.05)</span>
                      </>
                    )}
                  </button>

                  {/* Mandatory AI Legal & Accuracy Disclaimer */}
                  <div className="mt-2">
                    <AIDisclaimer />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: INSPECTOR COMPLIANCE PACK (PRINTABLE / EXPORTABLE)
        ========================================================================== */}
        {activeTab === "pack" && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
                <div>
                  <div className="text-xs font-mono text-emerald-700 font-bold uppercase tracking-wider">
                    OFFICIAL HACCP COMPLIANCE AUDIT PACKET
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                    Daily Kitchen Food Safety Inspection Report
                  </h3>
                  <div className="text-xs text-slate-500 mt-1">
                    Generated for Health Department Audits & Municipal Sanitation Review
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors shadow-xs"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>Print Report</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const jsonStr = JSON.stringify(selectedCase, null, 2);
                      const blob = new Blob([jsonStr], { type: "application/json" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `haccp-audit-${selectedCase.id}.json`;
                      a.click();
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Export JSON</span>
                  </button>
                </div>
              </div>

              {/* Packet Details */}
              <div className="py-6 border-b border-slate-200 grid sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="text-slate-400 font-medium">Facility / Location</div>
                  <div className="font-bold text-slate-900 mt-0.5">{selectedCase.location}</div>
                </div>
                <div>
                  <div className="text-slate-400 font-medium">Audit Shift & Time</div>
                  <div className="font-bold text-slate-900 mt-0.5">{selectedCase.shift}</div>
                </div>
                <div>
                  <div className="text-slate-400 font-medium">Auditor / Responsible Party</div>
                  <div className="font-bold text-slate-900 mt-0.5">{selectedCase.auditor}</div>
                </div>
              </div>

              {/* Temperature Chain Audit */}
              <div className="py-6 border-b border-slate-200 space-y-3">
                <h4 className="text-sm font-bold text-slate-900">1. Certified Cold & Hot Temperature Logs</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-semibold">
                      <tr>
                        <th className="p-3">Station / Item</th>
                        <th className="p-3">Reading</th>
                        <th className="p-3">Target Range</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Sensor Type</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedCase.temperatureReadings.map((r, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="p-3 font-semibold text-slate-900">{r.station}</td>
                          <td className="p-3 font-mono font-bold text-slate-900">
                            {r.measuredTemp} {r.unit}
                          </td>
                          <td className="p-3 text-slate-600">{r.targetRange}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                r.status === "SAFE"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-rose-100 text-rose-800"
                              }`}
                            >
                              {r.status}
                            </span>
                          </td>
                          <td className="p-3 text-slate-500 text-[11px]">{r.probeType}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Hygiene Checklist Summary */}
              <div className="py-6 border-b border-slate-200 space-y-3">
                <h4 className="text-sm font-bold text-slate-900">2. Station Hygiene & Cross-Contamination Items</h4>
                <div className="space-y-2">
                  {selectedCase.hygieneItems.map((h) => (
                    <div key={h.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50 text-xs flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-slate-900">{h.station}: {h.check}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{h.evidence}</div>
                      </div>
                      <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                        {h.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inspector Sign-Off Block */}
              <div className="pt-6 grid sm:grid-cols-2 gap-6 text-xs text-slate-600">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="font-bold text-slate-900">Certified Food Safety Manager Signature</div>
                  <div className="h-10 border-b border-dashed border-slate-300" />
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Certified ServSafe #49281-H</span>
                    <span>Date: {new Date().toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="font-bold text-slate-900">Health Authority Inspector Sign-Off</div>
                  <div className="h-10 border-b border-dashed border-slate-300" />
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Municipal Department of Public Health</span>
                    <span>Stamp / Approval Code</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: DEVELOPER & POS API HUB (REST API KEYS & TEST SANDBOX)
        ========================================================================== */}
        {activeTab === "api" && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Key Generation Header */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
              <div className="mb-6 space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                  <Key className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Developer & POS API Integration Hub</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  API Key Management
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Connect commercial kitchen tablets, digital temperature probes, or restaurant ERP systems directly into the Sensifai HACCP verification engine.
                </p>
              </div>

              {/* Generate Key Input */}
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                  placeholder="e.g. Station 2 Kitchen Tablet Key"
                />
                <button
                  type="button"
                  onClick={handleGenerateKey}
                  disabled={generatingKey}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>{generatingKey ? "Creating..." : "Create API Key"}</span>
                </button>
              </div>

              {/* Newly Generated Key Notice */}
              {generatedKey && (
                <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-2">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Your New Dedicated API Key (Copy Now — Not Shown Again)</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 p-2 rounded bg-white border border-emerald-300 font-mono text-slate-900">
                    <span className="truncate">{generatedKey}</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedKey);
                        setCopiedKey(true);
                        setTimeout(() => setCopiedKey(false), 2000);
                      }}
                      className="px-2.5 py-1 rounded bg-emerald-600 text-white font-bold text-[11px] shrink-0"
                    >
                      {copiedKey ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
              )}

              {/* Key List Table */}
              <div className="mt-6 border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold">
                    <tr>
                      <th className="p-3">Key Name</th>
                      <th className="p-3">Masked Secret</th>
                      <th className="p-3">Created</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {apiKeys.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-slate-400">
                          No developer keys generated yet. Create one above to test the REST API.
                        </td>
                      </tr>
                    ) : (
                      apiKeys.map((k) => (
                        <tr key={k.id} className="hover:bg-slate-50/50">
                          <td className="p-3 font-semibold text-slate-900">{k.name}</td>
                          <td className="p-3 font-mono text-slate-600">{k.maskedKey}</td>
                          <td className="p-3 text-slate-400 text-[11px]">
                            {new Date(k.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                k.status === "active"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-slate-200 text-slate-600"
                              }`}
                            >
                              {k.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            {k.status === "active" && (
                              <button
                                type="button"
                                onClick={() => handleRevokeKey(k.id)}
                                className="text-rose-600 hover:text-rose-800 font-semibold text-xs"
                              >
                                Revoke
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Interactive API Sandbox */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
              <h4 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                <Terminal className="h-4 w-4 text-emerald-600" />
                <span>Interactive REST API Sandbox</span>
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                Test a live audit submission to <code className="bg-slate-100 px-1 py-0.5 rounded">POST /api/v1/audit</code> using your generated API key.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Authorization Header Key (rh_live_...)
                  </label>
                  <input
                    type="text"
                    value={sandboxKeyInput}
                    onChange={(e) => setSandboxKeyInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                    placeholder="Paste rh_live_... key here"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Station Name
                    </label>
                    <input
                      type="text"
                      value={sandboxStation}
                      onChange={(e) => setSandboxStation(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Temperature (°F)
                    </label>
                    <input
                      type="text"
                      value={sandboxTemp}
                      onChange={(e) => setSandboxTemp(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRunSandbox}
                  disabled={sandboxLoading || !sandboxKeyInput}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs transition-colors flex items-center gap-2"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{sandboxLoading ? "Calling API..." : "Send Sandbox Request"}</span>
                </button>

                {sandboxResult && (
                  <div className="mt-4 p-4 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto max-h-72">
                    <pre>{JSON.stringify(sandboxResult, null, 2)}</pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
