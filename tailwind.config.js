/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',

  theme: {
    extend: {
      colors: {
        // Enterprise Education Theme
        primary: {
          50: '#EEF2FF',   // Subtle BG
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',  // Soft Accent
          500: '#6366F1',
          600: '#4F46E5',  // Brand Primary
          700: '#4338CA',  // Primary Hover
          800: '#3730A3',  // Primary Active
          900: '#312E81',
          950: '#1E1B4B',
        },
        sidebar: {
          DEFAULT: '#0F172A',
          surface: '#1E293B',
          hover: '#334155',
          border: '#334155',
          text: '#F1F5F9',
          muted: '#94A3B8',
          active: '#4F46E5',
        },
        canvas: {
          light: '#F8FAFC',
          dark: '#0B1120',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#162033',
          elevatedLight: '#F1F5F9',
          elevatedDark: '#1E293B',
          hoverLight: '#F8FAFC',
          hoverDark: '#243247',
          inputDark: '#111827',
        },
        border: {
          light: '#E2E8F0',
          strongLight: '#CBD5E1',
          dark: '#334155',
        },
        text: {
          primaryLight: '#0F172A',
          secondaryLight: '#475569',
          mutedLight: '#64748B',
          primaryDark: '#F1F5F9',
          secondaryDark: '#CBD5E1',
          mutedDark: '#94A3B8',
        },
        semantic: {
          success: '#059669',
          successBg: '#ECFDF5',
          successDark: '#6EE7B7',
          warning: '#B45309',
          warningBg: '#FFFBEB',
          warningDark: '#FCD34D',
          danger: '#DC2626',
          dangerBg: '#FEF2F2',
          dangerDark: '#FCA5A5',
          info: '#0369A1',
          infoBg: '#E0F2FE',
          infoDark: '#7DD3FC',
        },
      },

      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },

      borderRadius: {
        card: '14px',
        panel: '16px',
        button: '10px',
        modal: '18px',
      },

      boxShadow: {
        card: '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)',
        'card-hover': '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
        elevated: '0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.05)',
        subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '100%': {
            transform: 'translateX(100%)',
          },
        },
      },

      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        shimmer: 'shimmer 1.5s infinite',
      },
    },
  },

  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
