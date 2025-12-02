/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                dark: '#0a0a0a',      // Deepest Matte Black
                'dark-light': '#1a1a1a', // Soft Black for cards
                primary: '#D4AF37',   // Metallic Gold
                secondary: '#F5F5F5', // Off-White/Cream
                accent: '#333333',    // Dark Gray
            },
            animation: {
                'spin-slow': 'spin 8s linear infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
