// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ApolloWrapper } from "@/lib/apollo-provider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Store - Your Online Shopping Destination",
  description: "Shop the best products at great prices. Fast shipping, secure payments with Sonali Bank.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ApolloWrapper>
          <div className="flex flex-col min-h-screen">
            {/* Navigation */}
            <Navbar />
            
            {/* Main Content */}
            <main className="flex-1">
              {children}
            </main>
            
            {/* Footer */}
            <Footer />
          </div>
        </ApolloWrapper>
      </body>
    </html>
  );
}