/**
 * Sensifai Application Metadata & Clean Plain-Text Copy
 * (`src/lib/sensifai/app-metadata.ts`)
 *
 * All descriptions are pure human-readable plain text without raw Markdown syntax,
 * backticks, broken HTML tags, or escaped control characters.
 */

export const APP_CONFIG = {
  appId: "restaurant-haccp-eye",
  name: "Restaurant HACCP Eye",
  tagline: "Daily Kitchen Hygiene & HACCP Photo Audits",
  canonicalUrl: "https://restaurant-haccp-eye.sensifai.com",
  category: "health",
  primaryColor: "#059669",
  shortDescription:
    "Upload kitchen station photos, fridge thermometer readings, and prep labels to generate verified HACCP logs, temperature audits, and inspector-ready compliance packs in under 60 seconds.",
  longDescription:
    "Restaurant HACCP Eye is an automated kitchen hygiene and HACCP compliance intelligence engine built for restaurant chains, commercial catering operators, ghost kitchens, and food safety consultants. In under 60 seconds, it analyzes station hygiene photos, fridge thermometer displays, and food prep expiration labels to auto-populate daily temperature logs, detect critical control point violations, and compile inspector-ready compliance audit packets.\n\nDaily food safety compliance is essential to preventing foodborne illness outbreaks and passing sudden health department inspections. Yet frontline restaurant staff routinely struggle with manual paper logs, pencil-whipping temperature records during peak service, or missing critical label expiration dates across prep stations. When health inspectors arrive, missing or inconsistent records risk heavy fines, score downgrades, or temporary closure.\n\nRestaurant HACCP Eye replaces manual guesswork with high-precision Sensifai AI multimodal vision and deterministic food safety rule verification. It reads digital and analog thermometer probes from photos, transcribes prep labels with expiration date logic, checks sanitation stations and cross-contamination hazards, and generates structured compliance checklists with line-by-line confidence scores and verifiable photographic evidence.",
  features: [
    {
      id: "station-hygiene",
      title: "Station-by-Station Hygiene Inspection",
      description:
        "Analyzes food contact surfaces, sanitize buckets, handwash stations, and cutting board segregation to identify cross-contamination risks instantly.",
    },
    {
      id: "temperature-logging",
      title: "Automated Fridge & Hot Holding Logs",
      description:
        "Extracts temperature readings directly from digital probes, dial thermometers, and walk-in cooler displays into formatted HACCP logs.",
    },
    {
      id: "prep-label-verification",
      title: "Prep Label Expiration & Allergen Audits",
      description:
        "Transcribes shelf-life labels, prep date stamps, and allergen callouts to identify expired batch containers and labeling omissions.",
    },
    {
      id: "compliance-pack",
      title: "Inspector-Ready HACCP Daily Packs",
      description:
        "Compiles time-stamped visual audit evidence, corrective actions, and manager sign-off logs ready for municipal health inspections.",
    },
  ],
  stats: [
    { value: "< 60s", label: "Audit Turnaround Time" },
    { value: "98.4%", label: "Temperature Extraction Accuracy" },
    { value: "100%", label: "Inspector Evidence Trail" },
    { value: "€0.05", label: "Metered Cost per Audit" },
  ],
};

export const APP_METADATA = APP_CONFIG;
