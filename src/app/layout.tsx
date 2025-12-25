import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { AuthProvider } from "@/lib/auth";
import { Footer } from "@/components/layout/Footer";
import { ScrollObserver } from "@/components/util/ScrollObserver";
import { BackgroundCanvas } from "@/components/ui/BackgroundCanvas";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "SportManager - Team Management",
  description: "Manage your sports teams easily.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} font-sans antialiased flex flex-col min-h-screen`}
      >
        <AuthProvider>
          {/* Version key updated to force hard-refresh of canvas logic */}
          <BackgroundCanvas key="v11-clean" />
          <ScrollObserver />
          <Navbar />
          <main>
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
