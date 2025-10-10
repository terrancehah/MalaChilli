/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			// MalaChilli Brand Colors (Malaysian Green Food Theme)
  			primary: {
  				DEFAULT: '#0A5F0A', // Forest Green
  				dark: '#004D00',     // Deep Green
  				light: '#7CB342',    // Lime Green
  				foreground: '#FFFFFF'
  			},
  			secondary: {
  				DEFAULT: '#F9FAFB',  // Off-White
  				foreground: '#111827'
  			},
  			// Semantic Colors
  			success: '#10B981',
  			warning: '#F59E0B',
  			error: '#EF4444',
  			info: '#3B82F6',
  			// Gray Scale
  			gray: {
  				50: '#F9FAFB',
  				100: '#E5E7EB',
  				600: '#6B7280',
  				900: '#111827'
  			},
  			// Original shadcn colors for compatibility
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			}
  		},
  		fontFamily: {
  			sans: ['Inter', 'Segoe UI', 'system-ui', '-apple-system', 'sans-serif'],
  			display: ['Pacifico', 'Brush Script MT', 'cursive']
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)',
  			pill: '50px',  // Full pill shape for buttons
  			card: '24px'   // Card border radius
  		},
  		spacing: {
  			'1': '4px',
  			'2': '8px',
  			'3': '12px',
  			'4': '16px',
  			'5': '24px',
  			'6': '32px',
  			'7': '48px',
  			'8': '64px'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
