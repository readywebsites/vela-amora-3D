import type { Metadata } from "next";
import { Sora, Cinzel } from "next/font/google";
import { Toaster } from "react-hot-toast";

import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora-family",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel-family",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Vela Armon | Every Expression of Luxury, Online",
  description:
    "A website agency built for luxury businesses, where hand craft meets machine intelligence.",
  keywords: [
    "vela armon",
    "luxury",
    "residences",
    "horology",
    "yachts",
    "aviation",
    "digital agency",
    "3d experience",
  ],
  other: {
    "theme-color": "#04060d",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sora.variable} ${cinzel.variable} font-sora page bg-[#04060d] text-white relative overflow-x-hidden`}
      >
        {children}
        <aside>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "#0c0e17",
                color: "#fff",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              },
            }}
          />
        </aside>
      </body>
    </html>
  );
}
