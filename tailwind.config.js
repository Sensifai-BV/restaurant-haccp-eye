/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "var(--brand-primary, #059669)",
          hover: "var(--brand-primary-hover, #047857)",
          light: "var(--brand-primary-light, #ECFDF5)",
          accent: "var(--brand-accent, #14B8A6)",
        },
        surface: {
          bg: "var(--surface-bg, #F7FBF9)",
          card: "var(--surface-card, #FFFFFF)",
        },
        sidebar: {
          bg: "var(--sidebar-bg, #062C22)",
          text: "var(--sidebar-text, #ECFDF5)",
        },
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "monospace"],
      },
    },
  },
  plugins: [],
};
