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
                background: "rgb(var(--background))",
                foreground: "rgb(var(--foreground))",
                surface: "rgb(var(--surface))",
                "surface-glass": "rgb(var(--surface-glass))", // Note: rgb() wrapper might be tricky with slash syntax for opacity in tailwind 4/3 compat, but following standard var usage. 
                // Actually, design system used 'rgb(var(...))' in index.css theme block. 
                // If using tailwind 4, the correct syntax might just be var(--background) if defined as such, but let's stick to the common pattern for now.
                // Wait, the Design System had a specific Tailwind 4 directive "@theme". 
                // If the project is using Tailwind 4 (which the package.json suggests: "^4.1.18"), we might not even need this JS config if we use the CSS-first configuration.
                // However, having valid JS config is safer for tooling.
                primary: "rgb(var(--primary))",
                secondary: "rgb(var(--secondary))",
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['monospace'], // Placeholder, improve if needed
            },
        },
    },
    plugins: [],
}
