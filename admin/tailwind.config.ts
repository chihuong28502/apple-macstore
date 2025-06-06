/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from "tailwindcss";

const config: Config = {
  important: true,
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        //Layout main
        mainLayout: "var(--bgMainLayout)",

        // Component Topic Card
        textTopicCardWithoutSelect: "var(--textTopicCardWithoutSelect)",
        bgTopicCardWithoutSelect: "var(--bgTopicCardWithoutSelect)",
        textTopicCardSelected: "var(--textTopicCardSelected)",
        bgTopicCardSelected: "var(--bgTopicCardSelected)",

        // Component Category Card
        textCategoryCardWithoutSelect: "var(--textCategoryCardWithoutSelect)",
        textCategoryCardSelect: "var(--textCategoryCardSelect)",
        bgCategoryCardWithoutSelect: "var(--bgCategoryCardWithoutSelect)",
        bgCategoryCardSelect: "var(--bgCategoryCardSelect)",

        notification: "var(--noficationBg)",
        hoverBg: "var(--hoverBg)",
        divideColor: "var(--divideBg)",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        button: "var(--button)",
        buttonText: "var(--textButton)",
        fontColor: "var(--fontColor)",
        layout: "var(--layout)",
        popupLanguage: "var(--popupLanguage)",
        inputBackground: "var(--inputBackground)",
        mainContent: "var(--mainContent)",
        iconBlur: "var(--iconBlur)",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      boxShadow: {
        bgComponentSelect: "0px 2px 12px 0px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
