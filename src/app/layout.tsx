import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
// import SidebarNav from "@/components/SidebarNav";
import { SavedPropertiesProvider } from "@/context/SavedPropertiesContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Find your perfect home",
  description: "AI-powered rental search",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col h-[100dvh] w-full bg-white text-zinc-900 overflow-hidden font-sans">
        <SavedPropertiesProvider>
          <div className="flex-1 overflow-hidden relative w-full h-full flex flex-col">
            {children}
          </div>
        </SavedPropertiesProvider>
      </body>
    </html>
  );
}
