/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		// Gaming/Fantasy animations
  		animation: {
  			'float': 'float 3s ease-in-out infinite',
  			'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
  			'spin-slow': 'spin 20s linear infinite',
  			'gradient-shift': 'gradient-shift 8s ease infinite',
  			'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
  			'glow': 'glow 2s ease-in-out infinite alternate',
  		},
  		keyframes: {
  			'float': {
  				'0%, 100%': { transform: 'translateY(0px)' },
  				'50%': { transform: 'translateY(-20px)' },
  			},
  			'pulse-slow': {
  				'0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
  				'50%': { opacity: '0.8', transform: 'scale(1.1)' },
  			},
  			'gradient-shift': {
  				'0%': { backgroundPosition: '0% 50%' },
  				'50%': { backgroundPosition: '100% 50%' },
  				'100%': { backgroundPosition: '0% 50%' },
  			},
  			'fade-in-up': {
  				'from': { opacity: '0', transform: 'translateY(20px)' },
  				'to': { opacity: '1', transform: 'translateY(0)' },
  			},
  			'glow': {
  				'from': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)' },
  				'to': { boxShadow: '0 0 40px rgba(139, 92, 246, 0.6), 0 0 60px rgba(6, 182, 212, 0.3)' },
  			},
  			'expandPulse': {
  				'0%, 100%': { transform: 'scale(1)', opacity: '0.5' },
  				'50%': { transform: 'scale(1.2)', opacity: '0.8' },
  			},
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
