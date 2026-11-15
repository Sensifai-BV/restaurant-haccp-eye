import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { APP_METADATA } from "@/lib/sensifai/app-metadata";
import {
  ShieldCheck,
  Thermometer,
  FileText,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ClipboardCheck,
  Clock,
  Building2,
  Eye,
  CheckSquare,
  ChevronRight,
  ChefHat,
  UtensilsCrossed,
  Key,
  Terminal,
  Cpu,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F7FBF9] text-[#0F172A] flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Marketing Navigation Bar */}
      <Navbar
        appName={APP_METADATA.name}
        logoSrc="/logo.png"
        primaryColor={APP_METADATA.primaryColor}
        navLinks={[
          { label: "Audit Studio", href: "/workspace" },
          { label: "Compliance Proof", href: "#proof" },
          { label: "Capabilities", href: "#features" },
          { label: "Workflow", href: "#workflow" },
          { label: "Developer API", href: "#api" },
          { label: "Pricing", href: "#pricing" },
        ]}
        ctaLabel="Launch Kitchen Audit"
        ctaHref="/workspace"
      />

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        {/* Subtle Brand Ambient Radial Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-600/15 via-teal-500/5 to-transparent pointer-events-none -z-10" />

        <div className="text-center max-w-3xl mx-auto space-y-5">
          {/* Badge Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold shadow-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>SENSIFAI VISION CORE · DAILY HACCP AUDIT & HYGIENE VERIFICATION</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.14]">
            Daily Kitchen Hygiene <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 bg-clip-text text-transparent">
              & HACCP Photo Audits
            </span>
          </h1>

          {/* Clean Plain-Text Subheadline */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Eliminate pencil-whipped paper logs. Snap kitchen station photos, fridge thermometer readings, and food prep labels to auto-populate certified HACCP temperature logs and inspector-ready compliance packs in under sixty seconds.
          </p>

          {/* Hero CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/workspace"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md transition-all duration-150 hover:shadow-lg"
            >
              <Sparkles className="h-4 w-4" />
              <span>Launch Audit Studio</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
            <Link
              href="#proof"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200 shadow-xs transition-all duration-150"
            >
              <Eye className="h-4 w-4 text-slate-500" />
              <span>View Compliance Proof</span>
            </Link>
          </div>

          {/* Trust Metrics Strip */}
          <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto border-t border-slate-200/80">
            {APP_METADATA.stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="font-mono text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Visual Frame (Editorial Split Visual) */}
        <div className="mt-12 relative rounded-2xl border border-slate-200/80 bg-white shadow-xl overflow-hidden">
          <div className="h-11 bg-slate-50 border-b border-slate-200/80 px-4 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-rose-400" />
              <span className="h-3 w-3 rounded-full bg-amber-400" />
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
            </div>
            <div className="px-3 py-1 rounded-md bg-white border border-slate-200 text-xs font-mono text-slate-500">
              https://restaurant-haccp-eye.sensifai.com/workspace
            </div>
            <div className="text-xs font-medium text-emerald-600 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Vision Engine</span>
            </div>
          </div>
          <div className="relative aspect-video w-full bg-slate-900">
            <Image
              src="/images/hero.jpg"
              alt="Restaurant HACCP Eye Kitchen Inspection Station"
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover object-center"
            />
            {/* Telemetry Glass Overlay */}
            <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md bg-slate-950/80 backdrop-blur-md border border-white/10 rounded-xl p-4 text-white shadow-2xl">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4" />
                  <span>CRITICAL CONTROL POINT AUDIT</span>
                </span>
                <span className="font-mono text-slate-400">PASSED · 99.2%</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Walk-in cooler probe reading at 36.4°F (Safe: 32°F-40°F). Cutting board color segregation verified. Prep container expiry dates compliant for 72h service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Before / After Proof Section */}
      <section id="proof" className="py-16 md:py-24 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              The Inspection Difference
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
              From Messy Kitchen Photos to Certified HACCP Packets
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Health inspectors look for verifiable temperature chains and labeled batch integrity. See how Sensifai AI translates raw kitchen evidence into actionable compliance data.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {/* The Before / Manual Way */}
            <div className="rounded-2xl border border-rose-200 bg-rose-50/30 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-rose-100">
                  <div className="flex items-center gap-2 text-rose-700 font-semibold text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    <span>The Manual & Paper Log Way</span>
                  </div>
                  <span className="text-xs font-mono font-medium text-rose-600 bg-rose-100 px-2 py-0.5 rounded">
                    High Violation Risk
                  </span>
                </div>
                <ul className="mt-4 space-y-3 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>Pencil-whipped paper binders filled out hours after shift changes.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>Unnoticed walk-in cooler temperature creep causing food spoilage.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>Missing use-by date stickers and allergen tags on secondary containers.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>No photographic evidence trail when health department inspectors challenge records.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 p-4 rounded-xl bg-white border border-rose-200 text-xs text-rose-900 font-medium">
                Average cost of a failed health inspection: 2-day shutdown, €4,500+ in wasted inventory, and brand reputation damage.
              </div>
            </div>

            {/* The After / Sensifai HACCP Way */}
            <div className="rounded-2xl border border-emerald-300 bg-emerald-50/30 p-6 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-emerald-100">
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Restaurant HACCP Eye Solution</span>
                  </div>
                  <span className="text-xs font-mono font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Verified Compliant
                  </span>
                </div>
                <ul className="mt-4 space-y-3 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Direct optical reading of thermometer gauges and digital probe displays.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Automated date calculations comparing prep times with mandatory shelf-life standards.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Cross-contamination inspection: cutting board color rules, raw meat isolation, PPE.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>One-click printable and exportable HACCP summary packet with timestamped photo crops.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 p-4 rounded-xl bg-white border border-emerald-200 text-xs text-emerald-950 font-medium flex items-center justify-between">
                <span>Straight-through audit pass rate: 98.4%</span>
                <Link
                  href="/workspace"
                  className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-bold"
                >
                  <span>Test Scenarios</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Ribbon Section */}
      <section id="workflow" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Automated Pipeline
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
            How Restaurant HACCP Eye Works in 3 Steps
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            A frictionless workflow built for busy kitchen operators and executive chefs during opening and closing lines.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-mono font-bold text-base mb-4 border border-emerald-200">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                1. Capture Station Photos
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Snap photos of walk-in coolers, cook lines, sanitizer test strips, food container prep labels, and employee glove compliance on any mobile phone.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500 font-medium">
              <Clock className="h-3.5 w-3.5 text-emerald-600" />
              <span>Capture time: under 15 seconds</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-mono font-bold text-base mb-4 border border-emerald-200">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                2. Sensifai Vision Core & Verification
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Multimodal AI reads temperatures, cross-references cold-holding thresholds (below 41°F) and hot-holding limits (above 135°F), and evaluates date labels.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500 font-medium">
              <Thermometer className="h-3.5 w-3.5 text-emerald-600" />
              <span>Deterministic food safety rule engine</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-mono font-bold text-base mb-4 border border-emerald-200">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                3. Certified Inspector Pack
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Receive an immediate pass/fix scorecard with color-coded corrective action assignments and exportable compliance records ready for health inspectors.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500 font-medium">
              <ClipboardCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>PDF, JSON & CSV export ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section id="features" className="py-16 md:py-24 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Core Capabilities
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
              Built for High-Volume Food Service Operations
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Engineered for restaurant chains, ghost kitchens, catering commissaries, and independent fine-dining establishments.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-xs hover:shadow-md transition-shadow">
              <div className="relative aspect-video w-full bg-slate-100">
                <Image
                  src="/images/feature-1.jpg"
                  alt="Temperature Logging"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs mb-2">
                  <Thermometer className="h-4 w-4" />
                  <span>TEMPERATURE LOGS</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Probe & Walk-In Reading Extraction
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Extracts temperatures from both digital LED meters and analog dials. Automatically flags dangerous thermal abuse ranges outside critical control boundaries.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-xs hover:shadow-md transition-shadow">
              <div className="relative aspect-video w-full bg-slate-100">
                <Image
                  src="/images/feature-2.jpg"
                  alt="Prep Label Audits"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs mb-2">
                  <FileText className="h-4 w-4" />
                  <span>DATE & ROTATION AUDIT</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Food Prep Label Expiration Spotting
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Transcribes handwritten prep day dots and printed batch labels. Calculates remaining shelf life and highlights expired prep pans before they reach service lines.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-xs hover:shadow-md transition-shadow">
              <div className="relative aspect-video w-full bg-slate-100">
                <Image
                  src="/images/feature-3.jpg"
                  alt="Inspector Packets"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs mb-2">
                  <ShieldCheck className="h-4 w-4" />
                  <span>INSPECTION PREPARATION</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Station Hygiene & Auditor Packets
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Audits sink sanitize buckets, cutting board segregation, chemical storage separation, and employee PPE, compiling a unified defense packet for official health visits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Developer & POS REST API Section */}
      <section id="api" className="py-12 md:py-20 px-4 sm:px-6 max-w-6xl mx-auto w-full border-t border-slate-200/80">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="text-xs font-bold tracking-wider text-emerald-800 uppercase">
            Enterprise & Developer REST API
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Automate HACCP Auditing in Your POS or Tablets
          </h2>
          <p className="text-sm text-slate-600">
            Embed real-time temperature log verification, prep label expiration spotting, and FDA Food Code CCP compliance directly into kitchen display systems, temperature probes, and multi-unit restaurant portals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Key className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Dedicated Cryptographic Keys</h3>
                  <p className="text-xs text-slate-500">App-scoped tokens (rh_live_...) with zero personal user credential exposure.</p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Cpu className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Sub-Second Telemetry Execution</h3>
                  <p className="text-xs text-slate-500">Benchmark Walk-In Coolers, Salad Prep Rails, Seafood Bars, and Dish Machines in milliseconds.</p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Terminal className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Structured JSON Output</h3>
                  <p className="text-xs text-slate-500">Full CCP compliance status, temperature flags, findings, and staff corrective tasks.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/workspace?tab=api"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition-colors"
              >
                <span>Launch API Hub & Mint Keys</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 rounded-2xl bg-slate-900 text-slate-100 border border-slate-800 overflow-hidden shadow-xl">
            <div className="h-10 bg-slate-950 border-b border-slate-800 px-4 flex items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-slate-300 font-semibold">POST /api/v1/audit</span>
              </div>
              <span className="text-[11px] text-slate-500">cURL REST Example</span>
            </div>

            <div className="p-5 font-mono text-xs space-y-4 overflow-x-auto">
              <div>
                <span className="text-slate-500"># Send kitchen station photo and probe telemetry</span>
                <div className="text-emerald-400 mt-1">curl -X POST https://restaurant-haccp-eye.sensifai.com/api/v1/audit \</div>
                <div className="pl-4 text-slate-300">-H &quot;Authorization: Bearer rh_live_sample_key&quot; \</div>
                <div className="pl-4 text-slate-300">-H &quot;Content-Type: application/json&quot; \</div>
                <div className="pl-4 text-emerald-300">-d &apos;{JSON.stringify({ stationName: "Walk-In Cooler Line", measuredTemp: 37.8, unit: "°F" }, null, 0)}&apos;</div>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <span className="text-slate-500"># Sample JSON Response (HTTP 200 OK)</span>
                <div className="text-slate-300 mt-1 text-[11px] leading-relaxed whitespace-pre font-mono">
{`{
  "success": true,
  "reportId": "HACCP-20261115-4819",
  "stationName": "Walk-In Cooler Line",
  "overallScore": 96,
  "ccpStatus": "PASSED",
  "temperatureStatus": "SAFE",
  "findings": [
    { "type": "Temperature Telemetry", "description": "37.8°F conforms with FDA Food Code § 3-501.16", "confidence": 0.98 }
  ],
  "correctiveActions": []
}`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transparent Pricing Section */}
      <section id="pricing" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="max-w-3xl mx-auto rounded-3xl border border-emerald-200 bg-gradient-to-b from-white to-emerald-50/40 p-8 sm:p-12 text-center shadow-lg">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
            Transparent Sensifai Prepaid Metering
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 mb-3">
            €0.05 per Kitchen Audit
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base leading-relaxed mb-6">
            No mandatory recurring subscriptions or complex hardware contracts. Pay strictly for what you inspect, metered directly from your connected Sensifai prepaid wallet.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 text-left max-w-xl mx-auto mb-8">
            <div className="p-3.5 bg-white rounded-xl border border-emerald-100 shadow-xs">
              <div className="font-semibold text-xs text-slate-900 mb-1">Station Audit</div>
              <div className="text-xs text-slate-500">Hygiene check, PPE audit, and cross-contamination flags</div>
            </div>
            <div className="p-3.5 bg-white rounded-xl border border-emerald-100 shadow-xs">
              <div className="font-semibold text-xs text-slate-900 mb-1">Temperature Log</div>
              <div className="text-xs text-slate-500">Auto-extracted digital probe reading and threshold check</div>
            </div>
            <div className="p-3.5 bg-white rounded-xl border border-emerald-100 shadow-xs">
              <div className="font-semibold text-xs text-slate-900 mb-1">Inspector Report</div>
              <div className="text-xs text-slate-500">Exportable daily audit log with crop-level evidence</div>
            </div>
          </div>

          <Link
            href="/workspace"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all duration-150 hover:shadow-lg"
          >
            <Sparkles className="h-4 w-4" />
            <span>Open Audit Studio Now</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Restaurant HACCP Eye Logo"
              width={28}
              height={28}
              className="object-contain"
            />
            <span className="font-bold text-slate-900 text-sm">
              Restaurant HACCP Eye
            </span>
            <span className="text-xs text-slate-400">· Powered by Sensifai</span>
          </div>

          <div className="text-xs text-slate-500 text-center sm:text-right space-y-1">
            <p>Built for restaurant chains, catering operations, and commercial ghost kitchens.</p>
            <p>© 2026 Sensifai BV. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
