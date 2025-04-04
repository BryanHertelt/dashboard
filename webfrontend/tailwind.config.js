const colors = require('tailwindcss/colors')


/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
	boxShadow: {
		flyzerShadow: "0px 0px 10px rgba(0,0,0,0.05),0px 0px 10px rgba(0,0,0,0.05)"
	}, 
  	colors: {
  		current: 'currentColor',
  		black: '#000000',
  		white: '#FFFFFF',
  		gray: '#EFEEF3',
		currentvaluefont: '4A4A4A',
  		blue: '#00327F',
  		icongray: '#7A7A7A',
  		backgroundchild: '#EFEEF3',
		green: '#04B900', 
		lightgreen: 'rgba(4, 185, 0, 0.1)',
		red: '#DA0000',
		lightred: 'rgba(218, 0, 0, 0.1)', 
		bitcoinyellow:"#FFD600" , 
		ethereumblue: "#89C6FF ", 
		flyzerblue: "#005BEA", 
  	},
	screens: {
		sm: "640px", 
		md: "768px", 
		lp:"1100px",
		lg:"1200px", 
		xl:"1600px"
	},
  	extend: {
		boxShadow: {
			'even': '0 0 10px rgba(0, 0, 0, 0.15)', 
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

