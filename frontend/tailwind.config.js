/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        border: 'var(--border)',

        // ── Harvard Crimson palette ──────────────────
        crimson: {
          DEFAULT: '#A41034',
          hover:   '#C4122F',
          dark:    '#7A0C24',
          soft:    'rgba(164, 16, 52, 0.12)',
          50:  '#fff1f2',
          100: '#ffe0e3',
          200: '#ffc6cc',
          300: '#ff98a1',
          400: '#ff596a',
          500: '#ff2340',
          600: '#f00026',
          700: '#C4122F',
          800: '#A41034',
          900: '#7A0C24',
          950: '#45060f',
        },

        // ── Harvard Navy (secondary) ─────────────────
        navy: {
          DEFAULT: '#1D2440',
          soft:    'rgba(29, 36, 64, 0.08)',
          50:  '#eef1fb',
          100: '#d9dff5',
          200: '#b9c5ed',
          300: '#8ea0e0',
          400: '#6178d1',
          500: '#4159c3',
          600: '#3244a8',
          700: '#2a3789',
          800: '#26306f',
          900: '#1D2440',
          950: '#0f1220',
        },

        // ── Warm Surface tones ───────────────────────
        surface: {
          dark:  '#33363B',
          light: '#FAF7F2',
        },

        // ── Remap "indigo" → Harvard Crimson shades ──
        indigo: {
          50:  '#fff1f2',
          100: '#ffe0e3',
          200: '#ffc6cc',
          300: '#ff98a1',
          400: '#e38c96',
          500: '#C4122F',
          600: '#A41034',
          700: '#7A0C24',
          800: '#5c0a1c',
          900: '#3d0712',
          950: '#1f030a',
        },

        // ── Sidebar token map ────────────────────────
        sidebar: {
          bg:          'var(--sidebar-bg)',
          hover:       'var(--sidebar-hover)',
          accent:      'var(--sidebar-accent)',
          accentHover: 'var(--sidebar-accent-hover)',
          border:      'var(--border)',
          activityBg:  'var(--activity-bar-bg)',
          text:        'var(--foreground)',
          muted:       'var(--sidebar-text-secondary)',
          mutedExtra:  'var(--sidebar-text-muted)',
        },

        // ── Legacy accent map (now crimson) ──────────
        accent: {
          indigo: 'var(--sidebar-accent)',
          cyan:   '#C4122F',
          gray:   '#9A9A9A',
          blue:   'var(--sidebar-accent)',
        },

        // ── Codeforces rating tier colors ────────────
        rating: {
          newbie:          '#808080',
          pupil:           '#008000',
          specialist:      '#03a89e',
          expert:          '#0000ff',
          candidateMaster: '#aa00aa',
          master:          '#ff8c00',
          grandmaster:     '#ff0000',
        },
      },

      // ── Font families ────────────────────────────
      fontFamily: {
        serif: ['"EB Garamond"', 'Georgia', 'serif'],
        sans:  ['Inter', 'Helvetica Neue', 'sans-serif'],
        mono:  ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },

      // ── Crimson box shadows ──────────────────────
      boxShadow: {
        crimson:    '0 0 20px rgba(164, 16, 52, 0.20)',
        'crimson-lg':'0 8px 40px rgba(164, 16, 52, 0.25)',
      },
    },
  },
  plugins: [],
}
