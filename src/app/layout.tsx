import type { Metadata } from "next";
import "./globals.css";

import { cookies } from "next/headers";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarConfigProvider } from "@/contexts/sidebar-context";
import { Toaster } from "@/components/ui/sonner";
import { inter } from "@/lib/fonts";
import { I18nProvider } from "@/components/i18n-provider";

export const metadata: Metadata = {
  title: "WorkedIn",
  description: "Secure IT Marketplace",
};

const SUPPORTED_LANGS = ["en", "fr"];

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const rawLang = cookieStore.get("app_language")?.value ?? "en";
  // Validate against supported languages to prevent injection
  const initialLang = SUPPORTED_LANGS.includes(rawLang) ? rawLang : "en";

  return (
    <html lang={initialLang} className={`${inter.variable} antialiased`}>
      <body className={inter.className}>
        <I18nProvider initialLang={initialLang}>
          <ThemeProvider defaultTheme="system" storageKey="nextjs-ui-theme">
            <SidebarConfigProvider>
              {children}
            </SidebarConfigProvider>
            <Toaster position="top-right" />
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
