/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--p-primary) / <alpha-value>)',
        'primary-hover': 'hsl(var(--p-primary-hover) / <alpha-value>)',
        bg: 'hsl(var(--p-bg) / <alpha-value>)',
        surface: 'hsl(var(--p-surface) / <alpha-value>)',
        text: 'hsl(var(--p-text) / <alpha-value>)',
        'text-muted': 'hsl(var(--p-text-muted) / <alpha-value>)',
        border: 'hsl(var(--p-border) / <alpha-value>)',
        success: 'hsl(var(--p-success) / <alpha-value>)',
        error: 'hsl(var(--p-error) / <alpha-value>)',
        warning: 'hsl(var(--p-warning) / <alpha-value>)',
      },
      borderRadius: {
        premium: 'var(--p-radius)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

