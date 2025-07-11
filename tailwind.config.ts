import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			brand: {
  				primary: {
  					'50': '#fdf2f8',
  					'100': '#fce7f3',
  					'200': '#fbcfe8',
  					'300': '#f9a8d4',
  					'400': '#f472b6',
  					'500': '#ec4899',
  					'600': '#db2777',
  					'700': '#be185d'
  				},
  				secondary: {
  					'50': '#f0fdfa',
  					'100': '#ccfbf1',
  					'200': '#99f6e4',
  					'300': '#5eead4',
  					'400': '#2dd4bf',
  					'500': '#14b8a6',
  					'600': '#0d9488'
  				},
  				neutral: {
  					'50': '#fafaf9',
  					'100': '#f5f5f4',
  					'200': '#e7e5e4',
  					'300': '#d6d3d1',
  					'400': '#a8a29e',
  					'500': '#78716c',
  					'600': '#57534e',
  					'700': '#44403c',
  					'800': '#292524',
  					'900': '#1c1917'
  				},
  				gold: {
  					'100': '#fef3c7',
  					'200': '#fde68a',
  					'300': '#fcd34d',
  					'400': '#fbbf24',
  					'500': '#f59e0b',
  					'600': '#d97706'
  				},
  				sky: {
  					'50': '#f0f9ff',
  					'100': '#e0f2fe',
  					'200': '#bae6fd',
  					'300': '#7dd3fc',
  					'400': '#38bdf8',
  					'500': '#0ea5e9'
  				}
  			},
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
  		},
  		animation: {
  			bounce: 'bounce 2s infinite',
  			pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
  		},
  		fontFamily: {
  			sans: [
  				'var(--font-nunito-sans)',
  				'sans-serif'
  			],
  		},
  		boxShadow: {
  			soft: '0 4px 14px 0 rgba(0, 0, 0, 0.05)',
  			card: '0 4px 20px rgba(0, 0, 0, 0.08)',
  			button: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;