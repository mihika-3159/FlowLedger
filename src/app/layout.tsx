import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "FlowLedger — AI Workflow Waste Detection",
  description: "AI-powered workflow waste detection and automation command center. Identify bottlenecks, calculate cost waste, and generate automation recommendations.",
  keywords: ["workflow automation", "waste detection", "internal tools", "efficiency", "bottleneck analysis"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-[#07070b] text-white`}>
        <StoreProvider>
          <TooltipProvider>
            <div className="flex min-h-screen">
              <Sidebar />
              <div className="flex-1 lg:ml-[240px]">
                <Header />
                <main className="min-h-[calc(100vh-4rem)]">
                  {children}
                </main>
              </div>
            </div>
          </TooltipProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
