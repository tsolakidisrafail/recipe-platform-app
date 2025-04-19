/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],

    theme: {
        extend: {
            colors: {
                primary: '#4f46e5',
                secondary: '#ec4899',
                'brand-green': '#10B981',
                'brand-gray': {
                    light: '#F3F4F6',
                    DEFAULT: '#6B7280',
                    dark: '#374151',
                },
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Merriweather', 'serif'],
            },
        },
    },

    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
        require('@tailwindcss/aspect-ratio'),
    ],
}
