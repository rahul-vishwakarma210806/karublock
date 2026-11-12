import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LangProvider } from "@/lib/i18n";
import Header from "@/components/Header";

const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: "Best Friend Test | How well do your friends know you?",
  description: "Create a quiz about yourself, share the link on WhatsApp and see which friend knows you best.",
  openGraph: { title: "Best Friend Test", description: "How well do your friends know you?", images: ["/api/og"] },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LangProvider>
          <Header />
          <main className="mx-auto max-w-xl px-4 pb-16">{children}</main>
        </LangProvider>
      </body>
    </html>
  );
}
