/**
 * Restaurant HACCP Eye — Sample Kitchen Audit Presets (`src/lib/presets.ts`)
 *
 * Covers core food safety critical control points (CCPs) across real-world commercial kitchens.
 */

export interface TemperatureReading {
  station: string;
  measuredTemp: number;
  unit: "°F" | "°C";
  targetRange: string;
  status: "SAFE" | "WARNING" | "DANGER";
  probeType: string;
  confidence: number;
}

export interface HygieneCheckItem {
  id: string;
  station: string;
  check: string;
  status: "PASS" | "NEEDS_FIX" | "FAIL";
  confidence: number;
  evidence: string;
  correctiveAction?: string;
}

export interface PrepLabelItem {
  id: string;
  item: string;
  prepDate: string;
  expiryDate: string;
  shelfLife: string;
  status: "COMPLIANT" | "EXPIRED" | "MISSING_TAG";
  allergenTagged: boolean;
  notes: string;
}

export interface CorrectiveTask {
  id: string;
  title: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  assignedRole: string;
  deadline: string;
  resolved: boolean;
}

export interface HaccpAuditPreset {
  id: string;
  title: string;
  category: string;
  location: string;
  shift: string;
  auditor: string;
  overallScore: number;
  ccpStatus: "PASSED" | "ACTION_REQUIRED" | "CRITICAL_VIOLATION";
  summary: string;
  imageSrc: string;
  temperatureReadings: TemperatureReading[];
  hygieneItems: HygieneCheckItem[];
  prepLabels: PrepLabelItem[];
  correctiveTasks: CorrectiveTask[];
}

export const HACCP_PRESETS: HaccpAuditPreset[] = [
  {
    id: "preset-walkin-cooler",
    title: "Walk-In Cooler & Raw Protein Line",
    category: "Cold Holding & Cross-Contamination",
    location: "Main Kitchen — Walk-In Cooler #2 & Raw Prep Station",
    shift: "Morning Opening Shift (06:30 AM)",
    auditor: "Chef Station Lead · Station 1",
    overallScore: 96,
    ccpStatus: "PASSED",
    summary:
      "All cold-holding critical control points within safe regulatory boundaries. Raw chicken stored on the lowest rack below beef and seafood. Door gasket seal intact with zero frost buildup. Thermometer calibrated within 0.2°F variance.",
    imageSrc: "/images/feature-1.jpg",
    temperatureReadings: [
      {
        station: "Walk-In Cooler #2 Ambient",
        measuredTemp: 36.4,
        unit: "°F",
        targetRange: "32.0°F - 38.0°F",
        status: "SAFE",
        probeType: "Fixed Wall Digital Probe Display",
        confidence: 0.99,
      },
      {
        station: "Raw Beef Strip Loin (Core)",
        measuredTemp: 35.8,
        unit: "°F",
        targetRange: "32.0°F - 38.0°F",
        status: "SAFE",
        probeType: "Penetration Needle Thermometer",
        confidence: 0.98,
      },
      {
        station: "Raw Poultry Bin Bottom Shelf",
        measuredTemp: 34.9,
        unit: "°F",
        targetRange: "32.0°F - 36.0°F",
        status: "SAFE",
        probeType: "Infrared Surface + Needle Sensor",
        confidence: 0.97,
      },
    ],
    hygieneItems: [
      {
        id: "h-1",
        station: "Walk-In Shelving",
        check: "Vertical protein segregation (Poultry bottom, Beef middle, Ready-to-Eat top)",
        status: "PASS",
        confidence: 0.98,
        evidence: "Photo verifies sealed cambros on stainless wire shelving in correct HACCP order.",
      },
      {
        id: "h-2",
        station: "Floor Clearance",
        check: "All food storage elevated 6 inches above floor level",
        status: "PASS",
        confidence: 0.99,
        evidence: "Stainless dunnage racks elevate all boxes 8.5 inches above tile floor.",
      },
      {
        id: "h-3",
        station: "Condensation Drainage",
        check: "Evaporator coil drain pan clear without standing water",
        status: "PASS",
        confidence: 0.95,
        evidence: "Drain lines clear, zero puddling or drip pan overflow detected.",
      },
    ],
    prepLabels: [
      {
        id: "pl-1",
        item: "Marinated Chicken Breast (Batch 04)",
        prepDate: "Nov 14 · 14:00",
        expiryDate: "Nov 17 · 14:00",
        shelfLife: "72 Hours",
        status: "COMPLIANT",
        allergenTagged: true,
        notes: "Contains Soy (Tamari marinade clearly marked with yellow label)",
      },
      {
        id: "pl-2",
        item: "Prime Rib Trim for Jus",
        prepDate: "Nov 15 · 06:00",
        expiryDate: "Nov 18 · 06:00",
        shelfLife: "72 Hours",
        status: "COMPLIANT",
        allergenTagged: false,
        notes: "Single ingredient beef trim, clean covered lid",
      },
    ],
    correctiveTasks: [
      {
        id: "ct-1",
        title: "Log mid-day defrost cycle at 12:00 PM to verify temperature recovery",
        priority: "LOW",
        assignedRole: "Opening Sous Chef",
        deadline: "Today at 12:30 PM",
        resolved: false,
      },
    ],
  },
  {
    id: "preset-prep-deli",
    title: "Salad Prep Line & Deli Slicer Station",
    category: "Cold-Rail & Equipment Sanitation",
    location: "Garde Manger & Slicer Station Line A",
    shift: "Mid-Day Line Audit (11:45 AM)",
    auditor: "Sous Chef QA Inspector",
    overallScore: 78,
    ccpStatus: "ACTION_REQUIRED",
    summary:
      "Cold-rail top insert temperature rose to 43.1°F due to overfilled ingredient pans obstructing airflow. One cambro of sliced turkey reached 7-day expiration at 09:00 AM. Corrective action required immediately: restock insert with ice bath and discard expired deli turkey.",
    imageSrc: "/images/feature-2.jpg",
    temperatureReadings: [
      {
        station: "Cold Rail Top Pan (Sliced Turkey)",
        measuredTemp: 43.1,
        unit: "°F",
        targetRange: "33.0°F - 41.0°F",
        status: "DANGER",
        probeType: "Penetration Probe Thermometer",
        confidence: 0.96,
      },
      {
        station: "Cold Rail Bottom Reach-In",
        measuredTemp: 38.2,
        unit: "°F",
        targetRange: "33.0°F - 41.0°F",
        status: "SAFE",
        probeType: "Digital Probe Display",
        confidence: 0.98,
      },
      {
        station: "Salad Greens Well",
        measuredTemp: 39.5,
        unit: "°F",
        targetRange: "33.0°F - 41.0°F",
        status: "SAFE",
        probeType: "Infrared Optical Probe",
        confidence: 0.97,
      },
    ],
    hygieneItems: [
      {
        id: "h-4",
        station: "Deli Slicer Blade Guard",
        check: "Equipment sanitizing breakdown completed every 4 hours",
        status: "PASS",
        confidence: 0.94,
        evidence: "Quaternary ammonium sanitizer bucket reads 200 ppm, log sheet initialed at 08:00 AM.",
      },
      {
        id: "h-5",
        station: "Food Pan Fill Level",
        check: "Ingredients kept below cold-rail chill line",
        status: "NEEDS_FIX",
        confidence: 0.96,
        evidence: "Sliced turkey pan heaped 1.5 inches above chill line, impeding air curtain circulation.",
        correctiveAction: "Level ingredient pans below perimeter chill rim immediately.",
      },
      {
        id: "h-6",
        station: "Handwash Station",
        check: "Soap, single-use paper towels, and 100°F water available",
        status: "PASS",
        confidence: 0.99,
        evidence: "Soap dispenser full, paper towel roll installed, water temp tested at 104°F.",
      },
    ],
    prepLabels: [
      {
        id: "pl-3",
        item: "Smoked Turkey Breast Slices",
        prepDate: "Nov 08 · 09:00",
        expiryDate: "Nov 15 · 09:00",
        shelfLife: "7 Days (Max)",
        status: "EXPIRED",
        allergenTagged: false,
        notes: "Expired 2.75 hours ago. Discard immediately to prevent Listeria hazard.",
      },
      {
        id: "pl-4",
        item: "House Basil Pesto Dressing",
        prepDate: "Nov 14 · 10:00",
        expiryDate: "Nov 19 · 10:00",
        shelfLife: "5 Days",
        status: "COMPLIANT",
        allergenTagged: true,
        notes: "Contains Tree Nuts (Pine nuts) and Dairy (Parmesan) clearly flagged.",
      },
    ],
    correctiveTasks: [
      {
        id: "ct-2",
        title: "Discard 1.2 kg expired smoked turkey breast and log waste in inventory",
        priority: "CRITICAL",
        assignedRole: "Line Cook 2",
        deadline: "Immediate (Under 10 mins)",
        resolved: false,
      },
      {
        id: "ct-3",
        title: "Swap out cold rail inserts with chilled reserve pans from Walk-In Cooler",
        priority: "HIGH",
        assignedRole: "Prep Lead",
        deadline: "Before 12:00 PM Lunch Rush",
        resolved: false,
      },
    ],
  },
  {
    id: "preset-seafood-hotwell",
    title: "Raw Seafood Bar & Hot Holding Wells",
    category: "Hot Holding & Shellfish Traceability",
    location: "Cook Line 1 & Seafood Raw Bar Station",
    shift: "Evening Service Peak (07:30 PM)",
    auditor: "Executive Chef Health Liaison",
    overallScore: 98,
    ccpStatus: "PASSED",
    summary:
      "Hot holding soup and sauce wells verified above 140°F (well exceeding 135°F minimum). Crushed ice bed on raw oyster bar holds bivalves at 33.5°F. Shellfish harvester tags retained in date order for 90-day compliance.",
    imageSrc: "/images/feature-3.jpg",
    temperatureReadings: [
      {
        station: "Hot Holding Well #1 (Lobster Bisque)",
        measuredTemp: 154.2,
        unit: "°F",
        targetRange: ">= 135.0°F",
        status: "SAFE",
        probeType: "Calibrated Stem Thermometer",
        confidence: 0.99,
      },
      {
        station: "Hot Holding Well #2 (Demi-Glace)",
        measuredTemp: 148.6,
        unit: "°F",
        targetRange: ">= 135.0°F",
        status: "SAFE",
        probeType: "Calibrated Stem Thermometer",
        confidence: 0.98,
      },
      {
        station: "Raw Oyster Crushed Ice Bed",
        measuredTemp: 33.5,
        unit: "°F",
        targetRange: "32.0°F - 36.0°F",
        status: "SAFE",
        probeType: "Optical Thermocouple",
        confidence: 0.99,
      },
    ],
    hygieneItems: [
      {
        id: "h-7",
        station: "Shellfish Harvester Tag Binder",
        check: "Tags kept 90 days from harvest bag empty date",
        status: "PASS",
        confidence: 0.99,
        evidence: "Maine PEI mussel and Malpeque oyster tags filed with harvest dates and vessel ID.",
      },
      {
        id: "h-8",
        station: "Cook Line Glove Compliance",
        check: "Single-use nitrile gloves worn during ready-to-eat plating",
        status: "PASS",
        confidence: 0.97,
        evidence: "Glove boxes stocked, line cooks observed changing gloves between stations.",
      },
      {
        id: "h-9",
        station: "Hot Holding Water Levels",
        check: "Steam table wells maintained with minimum 2 inches of water",
        status: "PASS",
        confidence: 0.96,
        evidence: "Wells properly filled, no dry heating or heat coil scorching detected.",
      },
    ],
    prepLabels: [
      {
        id: "pl-5",
        item: "Shucked Day-Boat Scallops",
        prepDate: "Nov 15 · 16:00",
        expiryDate: "Nov 17 · 16:00",
        shelfLife: "48 Hours",
        status: "COMPLIANT",
        allergenTagged: true,
        notes: "Molluscan Shellfish allergen tag present. Stored on drain tray with ice.",
      },
    ],
    correctiveTasks: [
      {
        id: "ct-4",
        title: "Replenish crushed ice on raw oyster presentation display at 09:00 PM",
        priority: "MEDIUM",
        assignedRole: "Oyster Shucker",
        deadline: "Tonight at 09:00 PM",
        resolved: false,
      },
    ],
  },
  {
    id: "preset-dish-bakery",
    title: "High-Temp Dish Machine & Bakery Station",
    category: "Sanitizing Temperature & Chemical Isolation",
    location: "Scullery Dish Pit & Pastry Line",
    shift: "Closing Shift (10:30 PM)",
    auditor: "Closing Kitchen Supervisor",
    overallScore: 94,
    ccpStatus: "PASSED",
    summary:
      "High-temp commercial dish machine final sanitizing rinse achieved 182.4°F (regulatory requirement: >= 180°F). Single-use heat test strip turned black confirming plate contact surface thermal kill. Commercial detergent and degreasers locked in lower chemical cabinet away from dry flour bags.",
    imageSrc: "/images/hero.jpg",
    temperatureReadings: [
      {
        station: "Dish Machine Wash Cycle",
        measuredTemp: 162.0,
        unit: "°F",
        targetRange: "150.0°F - 165.0°F",
        status: "SAFE",
        probeType: "In-Line Digital Machine Gauge",
        confidence: 0.98,
      },
      {
        station: "Dish Machine Final Sanitizing Rinse",
        measuredTemp: 182.4,
        unit: "°F",
        targetRange: ">= 180.0°F",
        status: "SAFE",
        probeType: "Thermo-Label 180°F Test Strip & Gauge",
        confidence: 0.99,
      },
      {
        station: "Pastry Butter Lamination Box",
        measuredTemp: 56.5,
        unit: "°F",
        targetRange: "54.0°F - 60.0°F",
        status: "SAFE",
        probeType: "Digital Probe",
        confidence: 0.95,
      },
    ],
    hygieneItems: [
      {
        id: "h-10",
        station: "Chemical Storage Locker",
        check: "Dish soaps, sanitizers, and floor degreasers stored away from food contact items",
        status: "PASS",
        confidence: 0.99,
        evidence: "Chemicals stored in labeled metal cabinet with latch, below dish staging tables.",
      },
      {
        id: "h-11",
        station: "Clean Dish Racking",
        check: "Plates, ramekins, and hotel pans inverted to prevent dust accumulation",
        status: "PASS",
        confidence: 0.97,
        evidence: "All cambros and inserts racked upside down on wire carts.",
      },
      {
        id: "h-12",
        station: "Three-Compartment Sink",
        check: "Wash (110°F), Rinse (clear), Sanitize (200-400 ppm quat) verified",
        status: "PASS",
        confidence: 0.96,
        evidence: "Test strip reads 300 ppm quat sanitizer, water clear and warm.",
      },
    ],
    prepLabels: [
      {
        id: "pl-6",
        item: "Brioche Dough Poolish",
        prepDate: "Nov 15 · 18:00",
        expiryDate: "Nov 16 · 18:00",
        shelfLife: "24 Hours Fermentation",
        status: "COMPLIANT",
        allergenTagged: true,
        notes: "Contains Wheat (Gluten), Eggs, and Dairy clearly tagged.",
      },
    ],
    correctiveTasks: [
      {
        id: "ct-5",
        title: "Delime dish machine wash arms and curtain baffles during weekly clean",
        priority: "LOW",
        assignedRole: "Night Steward",
        deadline: "Sunday Night Closing",
        resolved: false,
      },
    ],
  },
];
