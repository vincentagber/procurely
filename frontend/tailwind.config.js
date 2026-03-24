/* eslint-disable @typescript-eslint/no-require-imports */
const plugin = require("tailwindcss/plugin");

const withOpacity = (cssVariable, fallback) =>
  `rgb(var(${cssVariable}, ${fallback}) / <alpha-value>)`;

const baseThemeTokens = {
  "--font-body": '"Avenir Next", "Avenir", "Segoe UI", sans-serif',
  "--font-display":
    '"Bebas Neue", "Arial Narrow", "Avenir Next Condensed", sans-serif',
  "--color-brand-blue": "#1900ff",
  "--color-brand-navy": "#13184f",
  "--color-brand-accent": "#ff6f4d",
  "--color-brand-peach": "#fde8df",
  "--color-surface-soft": "#f6f7fd",

  /* Procurely Design Spec / Primary Electric Blue */
  "--color-primary-blue-50": "239 238 255",
  "--color-primary-blue-100": "224 220 255",
  "--color-primary-blue-200": "196 188 255",
  "--color-primary-blue-300": "161 145 255",
  "--color-primary-blue-400": "108 87 255",
  "--color-primary-blue-500": "25 0 255",
  "--color-primary-blue-600": "21 0 217",
  "--color-primary-blue-700": "17 0 179",
  "--color-primary-blue-800": "13 0 140",
  "--color-primary-blue-900": "8 0 92",

  /* Procurely Design Spec / Supporting Text Navy */
  "--color-primary-navy-50": "238 240 248",
  "--color-primary-navy-100": "220 224 238",
  "--color-primary-navy-200": "185 193 221",
  "--color-primary-navy-300": "141 154 198",
  "--color-primary-navy-400": "82 97 151",
  "--color-primary-navy-500": "19 24 79",
  "--color-primary-navy-600": "17 21 69",
  "--color-primary-navy-700": "14 18 57",
  "--color-primary-navy-800": "10 13 43",
  "--color-primary-navy-900": "7 9 28",

  /* Procurely Design Spec / Secondary Orange Accent */
  "--color-secondary-orange-50": "255 242 237",
  "--color-secondary-orange-100": "255 226 215",
  "--color-secondary-orange-200": "255 198 177",
  "--color-secondary-orange-300": "255 167 138",
  "--color-secondary-orange-400": "255 136 104",
  "--color-secondary-orange-500": "255 111 77",
  "--color-secondary-orange-600": "235 92 60",
  "--color-secondary-orange-700": "196 70 43",
  "--color-secondary-orange-800": "156 55 35",
  "--color-secondary-orange-900": "117 41 27",

  /* Procurely Design Spec / Neutral Surface & Borders */
  "--color-neutral-0": "255 255 255",
  "--color-neutral-50": "250 251 255",
  "--color-neutral-100": "246 247 253",
  "--color-neutral-150": "238 240 247",
  "--color-neutral-200": "226 231 241",
  "--color-neutral-300": "208 214 227",
  "--color-neutral-400": "168 176 195",
  "--color-neutral-500": "130 140 162",
  "--color-neutral-600": "107 118 142",
  "--color-neutral-700": "77 88 111",
  "--color-neutral-800": "52 60 82",
  "--color-neutral-900": "31 38 58",

  /* Procurely Design Spec / Text Hierarchy */
  "--color-text-navy-50": "238 240 248",
  "--color-text-navy-100": "220 224 238",
  "--color-text-navy-200": "185 193 221",
  "--color-text-navy-300": "141 154 198",
  "--color-text-navy-400": "107 118 142",
  "--color-text-navy-500": "77 88 111",
  "--color-text-navy-600": "52 60 82",
  "--color-text-navy-700": "34 40 59",
  "--color-text-navy-800": "26 31 46",
  "--color-text-navy-900": "19 24 79",
  "--color-text-inverse": "255 255 255",

  /* Procurely Design Spec / Semantic Surfaces */
  "--color-surface-canvas": "255 255 255",
  "--color-surface-soft": "246 247 253",
  "--color-surface-raised": "255 255 255",
  "--color-surface-peach": "253 232 223",
  "--color-surface-footer": "19 24 79",
  "--color-surface-overlay": "15 23 42",

  /* Procurely Design Spec / Semantic States */
  "--color-state-success-50": "236 253 243",
  "--color-state-success-500": "22 163 74",
  "--color-state-success-700": "21 128 61",
  "--color-state-error-50": "255 241 242",
  "--color-state-error-500": "225 29 72",
  "--color-state-error-700": "190 24 93",
  "--color-state-warning-50": "255 247 237",
  "--color-state-warning-500": "249 115 22",
  "--color-state-warning-700": "194 65 12",
  "--color-state-info-50": "239 246 255",
  "--color-state-info-500": "37 99 235",
  "--color-state-info-700": "29 78 216",
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        md: "1.5rem",
      },
      screens: {
        "2xl": "1180px",
      },
    },
    extend: {
      /* Procurely Design Spec / Responsive Breakpoints */
      screens: {
        xs: "375px",
        sm: "480px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px",
      },

      /* Procurely Design Spec / Semantic Color System */
      colors: {
        primary: {
          blue: {
            50: withOpacity("--color-primary-blue-50", "239 238 255"),
            100: withOpacity("--color-primary-blue-100", "224 220 255"),
            200: withOpacity("--color-primary-blue-200", "196 188 255"),
            300: withOpacity("--color-primary-blue-300", "161 145 255"),
            400: withOpacity("--color-primary-blue-400", "108 87 255"),
            500: withOpacity("--color-primary-blue-500", "25 0 255"),
            600: withOpacity("--color-primary-blue-600", "21 0 217"),
            700: withOpacity("--color-primary-blue-700", "17 0 179"),
            800: withOpacity("--color-primary-blue-800", "13 0 140"),
            900: withOpacity("--color-primary-blue-900", "8 0 92"),
            DEFAULT: withOpacity("--color-primary-blue-500", "25 0 255"),
          },
          navy: {
            50: withOpacity("--color-primary-navy-50", "238 240 248"),
            100: withOpacity("--color-primary-navy-100", "220 224 238"),
            200: withOpacity("--color-primary-navy-200", "185 193 221"),
            300: withOpacity("--color-primary-navy-300", "141 154 198"),
            400: withOpacity("--color-primary-navy-400", "82 97 151"),
            500: withOpacity("--color-primary-navy-500", "19 24 79"),
            600: withOpacity("--color-primary-navy-600", "17 21 69"),
            700: withOpacity("--color-primary-navy-700", "14 18 57"),
            800: withOpacity("--color-primary-navy-800", "10 13 43"),
            900: withOpacity("--color-primary-navy-900", "7 9 28"),
            DEFAULT: withOpacity("--color-primary-navy-500", "19 24 79"),
          },
        },
        secondary: {
          orange: {
            50: withOpacity("--color-secondary-orange-50", "255 242 237"),
            100: withOpacity("--color-secondary-orange-100", "255 226 215"),
            200: withOpacity("--color-secondary-orange-200", "255 198 177"),
            300: withOpacity("--color-secondary-orange-300", "255 167 138"),
            400: withOpacity("--color-secondary-orange-400", "255 136 104"),
            500: withOpacity("--color-secondary-orange-500", "255 111 77"),
            600: withOpacity("--color-secondary-orange-600", "235 92 60"),
            700: withOpacity("--color-secondary-orange-700", "196 70 43"),
            800: withOpacity("--color-secondary-orange-800", "156 55 35"),
            900: withOpacity("--color-secondary-orange-900", "117 41 27"),
            DEFAULT: withOpacity("--color-secondary-orange-500", "255 111 77"),
          },
        },
        neutral: {
          0: withOpacity("--color-neutral-0", "255 255 255"),
          50: withOpacity("--color-neutral-50", "250 251 255"),
          100: withOpacity("--color-neutral-100", "246 247 253"),
          150: withOpacity("--color-neutral-150", "238 240 247"),
          200: withOpacity("--color-neutral-200", "226 231 241"),
          300: withOpacity("--color-neutral-300", "208 214 227"),
          400: withOpacity("--color-neutral-400", "168 176 195"),
          500: withOpacity("--color-neutral-500", "130 140 162"),
          600: withOpacity("--color-neutral-600", "107 118 142"),
          700: withOpacity("--color-neutral-700", "77 88 111"),
          800: withOpacity("--color-neutral-800", "52 60 82"),
          900: withOpacity("--color-neutral-900", "31 38 58"),
          DEFAULT: withOpacity("--color-neutral-100", "246 247 253"),
        },
        text: {
          navy: {
            50: withOpacity("--color-text-navy-50", "238 240 248"),
            100: withOpacity("--color-text-navy-100", "220 224 238"),
            200: withOpacity("--color-text-navy-200", "185 193 221"),
            300: withOpacity("--color-text-navy-300", "141 154 198"),
            400: withOpacity("--color-text-navy-400", "107 118 142"),
            500: withOpacity("--color-text-navy-500", "77 88 111"),
            600: withOpacity("--color-text-navy-600", "52 60 82"),
            700: withOpacity("--color-text-navy-700", "34 40 59"),
            800: withOpacity("--color-text-navy-800", "26 31 46"),
            900: withOpacity("--color-text-navy-900", "19 24 79"),
            DEFAULT: withOpacity("--color-text-navy-900", "19 24 79"),
          },
          inverse: withOpacity("--color-text-inverse", "255 255 255"),
        },
        surface: {
          canvas: withOpacity("--color-surface-canvas", "255 255 255"),
          soft: withOpacity("--color-surface-soft", "246 247 253"),
          raised: withOpacity("--color-surface-raised", "255 255 255"),
          peach: withOpacity("--color-surface-peach", "253 232 223"),
          footer: withOpacity("--color-surface-footer", "19 24 79"),
          overlay: withOpacity("--color-surface-overlay", "15 23 42"),
        },
        border: {
          subtle: withOpacity("--color-neutral-200", "226 231 241"),
          strong: withOpacity("--color-neutral-300", "208 214 227"),
          accent: withOpacity("--color-primary-blue-500", "25 0 255"),
          focus: withOpacity("--color-primary-blue-300", "161 145 255"),
        },
        state: {
          success: {
            50: withOpacity("--color-state-success-50", "236 253 243"),
            500: withOpacity("--color-state-success-500", "22 163 74"),
            700: withOpacity("--color-state-success-700", "21 128 61"),
            DEFAULT: withOpacity("--color-state-success-500", "22 163 74"),
          },
          error: {
            50: withOpacity("--color-state-error-50", "255 241 242"),
            500: withOpacity("--color-state-error-500", "225 29 72"),
            700: withOpacity("--color-state-error-700", "190 24 93"),
            DEFAULT: withOpacity("--color-state-error-500", "225 29 72"),
          },
          warning: {
            50: withOpacity("--color-state-warning-50", "255 247 237"),
            500: withOpacity("--color-state-warning-500", "249 115 22"),
            700: withOpacity("--color-state-warning-700", "194 65 12"),
            DEFAULT: withOpacity("--color-state-warning-500", "249 115 22"),
          },
          info: {
            50: withOpacity("--color-state-info-50", "239 246 255"),
            500: withOpacity("--color-state-info-500", "37 99 235"),
            700: withOpacity("--color-state-info-700", "29 78 216"),
            DEFAULT: withOpacity("--color-state-info-500", "37 99 235"),
          },
        },
      },

      /* Procurely Design Spec / Typography */
      fontFamily: {
        sans: ["var(--font-body)", "Avenir Next", "Avenir", "Segoe UI", "sans-serif"],
        body: ["var(--font-body)", "Avenir Next", "Avenir", "Segoe UI", "sans-serif"],
        display: [
          "var(--font-display)",
          "Bebas Neue",
          "Arial Narrow",
          "Avenir Next Condensed",
          "sans-serif",
        ],
      },
      fontWeight: {
        regular: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },
      fontSize: {
        "hero-display": [
          "5.875rem",
          { lineHeight: "0.88", letterSpacing: "-0.065em" },
        ],
        "hero-display-md": [
          "5rem",
          { lineHeight: "0.9", letterSpacing: "-0.06em" },
        ],
        "hero-display-sm": [
          "3.5rem",
          { lineHeight: "0.92", letterSpacing: "-0.05em" },
        ],
        "banner-display": [
          "4rem",
          { lineHeight: "0.95", letterSpacing: "-0.055em" },
        ],
        "section-title": [
          "3rem",
          { lineHeight: "1.05", letterSpacing: "-0.05em" },
        ],
        "section-title-md": [
          "2.5rem",
          { lineHeight: "1.08", letterSpacing: "-0.045em" },
        ],
        "auth-title": [
          "2.4rem",
          { lineHeight: "1.08", letterSpacing: "-0.04em" },
        ],
        "feature-title": [
          "1.8rem",
          { lineHeight: "1.1", letterSpacing: "-0.04em" },
        ],
        "card-title": [
          "1.375rem",
          { lineHeight: "1.2", letterSpacing: "-0.035em" },
        ],
        "product-title": [
          "1.15rem",
          { lineHeight: "1.3", letterSpacing: "-0.03em" },
        ],
        "body-lg": [
          "1.125rem",
          { lineHeight: "1.75rem", letterSpacing: "-0.01em" },
        ],
        "body-base": [
          "1rem",
          { lineHeight: "1.75rem", letterSpacing: "-0.01em" },
        ],
        "body-sm": [
          "0.9375rem",
          { lineHeight: "1.5rem", letterSpacing: "-0.01em" },
        ],
        caption: [
          "0.875rem",
          { lineHeight: "1.35rem", letterSpacing: "-0.005em" },
        ],
        eyebrow: [
          "0.75rem",
          { lineHeight: "1rem", letterSpacing: "0.28em" },
        ],
        nav: [
          "0.875rem",
          { lineHeight: "1.25rem", letterSpacing: "-0.01em" },
        ],
        button: [
          "0.9375rem",
          { lineHeight: "1rem", letterSpacing: "-0.01em" },
        ],
      },
      lineHeight: {
        "hero-display": "0.88",
        "hero-tight": "0.95",
        section: "1.05",
        heading: "1.1",
        relaxed: "1.75rem",
      },
      letterSpacing: {
        "hero-display": "-0.065em",
        "hero-display-md": "-0.06em",
        "section-title": "-0.05em",
        "section-title-md": "-0.045em",
        "card-title": "-0.035em",
        "product-title": "-0.03em",
        body: "-0.01em",
        eyebrow: "0.28em",
      },

      /* Procurely Design Spec / Spacing & Layout */
      spacing: {
        gutter: "1rem",
        "gutter-lg": "1.5rem",
        card: "1.5rem",
        panel: "2rem",
        drawer: "1.25rem",
        auth: "2.5rem",
        section: "4rem",
        "section-lg": "5rem",
        hero: "7rem",
        "4.5": "1.125rem",
        "5.5": "1.375rem",
        "7.5": "1.875rem",
        13: "3.25rem",
        15: "3.75rem",
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem",
        30: "7.5rem",
        34: "8.5rem",
      },
      maxWidth: {
        shell: "1180px",
        "hero-copy": "520px",
        "hero-copy-tight": "420px",
        drawer: "460px",
        "quote-drawer": "520px",
        "auth-form": "320px",
        faq: "760px",
        promo: "1228px",
      },
      gridTemplateColumns: {
        "auth-shell": "minmax(0,0.95fr) minmax(0,1.15fr)",
        footer: "minmax(0,1.15fr) repeat(4,minmax(0,1fr))",
        "catalog-4": "repeat(4, minmax(0, 1fr))",
        "catalog-12": "repeat(12, minmax(0, 1fr))",
      },
      gridAutoRows: {
        category: "160px",
      },

      /* Procurely Design Spec / Component Shape */
      borderRadius: {
        button: "0.75rem",
        "button-pill": "999px",
        field: "0.75rem",
        media: "1.5rem",
        "card-sm": "1.25rem",
        card: "1.75rem",
        "product-card": "1.75rem",
        "category-card": "1.875rem",
        panel: "2.125rem",
        drawer: "1.75rem",
      },

      /* Procurely Design Spec / Elevation */
      boxShadow: {
        field: "inset 0 0 0 1px rgba(15,23,42,0.05)",
        "card-soft": "0 16px 40px rgba(19,24,79,0.04)",
        card: "0 24px 60px rgba(19,24,79,0.06)",
        panel: "0 36px 90px rgba(19,24,79,0.08)",
        banner: "0 28px 70px rgba(19,24,79,0.12)",
        drawer: "-16px 0 48px rgba(19,24,79,0.18)",
        button: "0 18px 42px rgba(25,0,255,0.28)",
        focus: "0 0 0 3px rgba(25,0,255,0.18)",
      },

      /* Procurely Design Spec / Visual Treatments */
      backgroundImage: {
        "hero-overlay":
          "linear-gradient(90deg, rgba(22,14,10,0.95) 0%, rgba(22,14,10,0.88) 58%, rgba(22,14,10,0.22) 100%)",
        "hero-fade":
          "linear-gradient(90deg, rgba(21,15,14,0.56) 0%, rgba(21,15,14,0.32) 44%, rgba(21,15,14,0.08) 75%, rgba(21,15,14,0.02) 100%)",
        "banner-electric":
          "linear-gradient(135deg, rgba(25,0,255,1) 0%, rgba(31,19,255,1) 52%, rgba(42,46,255,1) 100%)",
      },

      /* Procurely Design Spec / Motion */
      transitionProperty: {
        interactive:
          "color, background-color, border-color, opacity, box-shadow, transform, filter",
        "card-hover": "transform, box-shadow, background-color, border-color",
        "loading-state": "opacity, filter, transform",
        drawer: "transform, opacity",
        overlay: "opacity, backdrop-filter",
      },
      transitionDuration: {
        micro: "180ms",
        state: "220ms",
        drawer: "280ms",
        reveal: "550ms",
        slow: "700ms",
      },
      transitionTimingFunction: {
        "procurely-out": "cubic-bezier(0.16, 1, 0.3, 1)",
        settle: "cubic-bezier(0.22, 1, 0.36, 1)",
        press: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      keyframes: {
        "card-entrance": {
          "0%": {
            opacity: "0",
            transform: "translate3d(0, 30px, 0)",
          },
          "100%": {
            opacity: "1",
            transform: "translate3d(0, 0, 0)",
          },
        },
        "drawer-enter": {
          "0%": { transform: "translate3d(100%, 0, 0)" },
          "100%": { transform: "translate3d(0, 0, 0)" },
        },
        "drawer-exit": {
          "0%": { transform: "translate3d(0, 0, 0)" },
          "100%": { transform: "translate3d(100%, 0, 0)" },
        },
        "button-press": {
          "0%, 100%": { transform: "scale3d(1, 1, 1)" },
          "50%": { transform: "scale3d(0.98, 0.98, 1)" },
        },
        "status-pop": {
          "0%": { opacity: "0", transform: "scale3d(0.96, 0.96, 1)" },
          "100%": { opacity: "1", transform: "scale3d(1, 1, 1)" },
        },
        "loading-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
      },
      animation: {
        "card-entrance":
          "card-entrance 550ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "section-reveal":
          "card-entrance 550ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "drawer-enter":
          "drawer-enter 280ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "drawer-exit":
          "drawer-exit 280ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "button-press":
          "button-press 180ms cubic-bezier(0.34, 1.56, 0.64, 1) both",
        "status-pop":
          "status-pop 220ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "loading-pulse": "loading-pulse 1.4s ease-in-out infinite",
      },
      zIndex: {
        header: "30",
        overlay: "40",
        drawer: "50",
        modal: "60",
      },
    },
  },
  plugins: [
    plugin(function ({
      addBase,
      addUtilities,
      addVariant,
      theme,
    }) {
      addBase({
        /*
         * Procurely runtime theme tokens.
         * Region / locale wrappers can override any --color-* or --font-* token
         * at runtime without rebuilding the Tailwind output.
         */
        ":root": baseThemeTokens,
        html: {
          scrollBehavior: "smooth",
        },
        body: {
          backgroundColor: "rgb(var(--color-surface-canvas, 255 255 255) / 1)",
          color: "rgb(var(--color-text-navy-900, 19 24 79) / 1)",
          fontFamily: "var(--font-body)",
          textRendering: "optimizeLegibility",
        },
        "a, button": {
          WebkitTapHighlightColor: "transparent",
        },
      });

      addVariant("state-loading", '&[data-state="loading"]');
      addVariant("state-error", '&[data-state="error"]');
      addVariant("state-success", '&[data-state="success"]');
      addVariant("state-active", '&[data-state="active"]');

      addUtilities({
        /* Procurely typography shortcuts for zero-guess implementation */
        ".type-hero-display": {
          fontFamily: "var(--font-display)",
          fontSize: theme("fontSize.hero-display")[0],
          lineHeight: theme("fontSize.hero-display")[1].lineHeight,
          letterSpacing: theme("fontSize.hero-display")[1].letterSpacing,
          fontWeight: theme("fontWeight.bold"),
        },
        ".type-section-title": {
          fontSize: theme("fontSize.section-title")[0],
          lineHeight: theme("fontSize.section-title")[1].lineHeight,
          letterSpacing: theme("fontSize.section-title")[1].letterSpacing,
          fontWeight: theme("fontWeight.semibold"),
        },
        ".type-product-title": {
          fontSize: theme("fontSize.product-title")[0],
          lineHeight: theme("fontSize.product-title")[1].lineHeight,
          letterSpacing: theme("fontSize.product-title")[1].letterSpacing,
          fontWeight: theme("fontWeight.semibold"),
        },
        ".type-body-base": {
          fontSize: theme("fontSize.body-base")[0],
          lineHeight: theme("fontSize.body-base")[1].lineHeight,
          letterSpacing: theme("fontSize.body-base")[1].letterSpacing,
          fontWeight: theme("fontWeight.regular"),
        },
        ".type-caption": {
          fontSize: theme("fontSize.caption")[0],
          lineHeight: theme("fontSize.caption")[1].lineHeight,
          letterSpacing: theme("fontSize.caption")[1].letterSpacing,
          fontWeight: theme("fontWeight.regular"),
        },
        ".type-eyebrow": {
          fontSize: theme("fontSize.eyebrow")[0],
          lineHeight: theme("fontSize.eyebrow")[1].lineHeight,
          letterSpacing: theme("fontSize.eyebrow")[1].letterSpacing,
          fontWeight: theme("fontWeight.semibold"),
          textTransform: "uppercase",
        },

        /* Procurely motion shortcuts for cards, drawers, and state changes */
        ".transition-interactive": {
          transitionProperty: theme("transitionProperty.interactive"),
          transitionDuration: theme("transitionDuration.state"),
          transitionTimingFunction: theme("transitionTimingFunction.procurely-out"),
        },
        ".transition-card-hover": {
          transitionProperty: theme("transitionProperty.card-hover"),
          transitionDuration: theme("transitionDuration.state"),
          transitionTimingFunction: theme("transitionTimingFunction.procurely-out"),
        },
        ".transition-loading-state": {
          transitionProperty: theme("transitionProperty.loading-state"),
          transitionDuration: theme("transitionDuration.micro"),
          transitionTimingFunction: theme("transitionTimingFunction.settle"),
        },
        ".transition-drawer": {
          transitionProperty: theme("transitionProperty.drawer"),
          transitionDuration: theme("transitionDuration.drawer"),
          transitionTimingFunction: theme("transitionTimingFunction.procurely-out"),
        },

        /* Procurely semantic state shortcuts */
        ".state-disabled": {
          opacity: "0.55",
          cursor: "not-allowed",
          boxShadow: "none",
          filter: "saturate(0.75)",
        },
        ".state-loading": {
          cursor: "progress",
          animation: theme("animation.loading-pulse"),
        },
      });
    }),
  ],
};
