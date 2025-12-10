import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: {
                    DEFAULT: "var(--primary)",
                    foreground: "#ffffff",
                    hover: "var(--primary-hover)",
                    light: "var(--primary-light)",
                },
                secondary: {
                    DEFAULT: "var(--secondary)",
                    foreground: "#ffffff",
                    hover: "var(--secondary-hover)",
                },
                accent: {
                    DEFAULT: "var(--accent)",
                    foreground: "#ffffff",
                },
                muted: {
                    DEFAULT: "var(--muted)",
                    foreground: "var(--foreground)",
                },
                danger: "var(--danger)",
                success: "var(--success)",
                surface: "var(--surface)",
                "surface-glass": "var(--surface-glass)",
            },
        },
    },
    plugins: [],
};
export default config;
