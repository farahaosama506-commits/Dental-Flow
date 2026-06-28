import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import type { Metadata } from "next";
import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export const metadata: Metadata = {
  title: {
    default: "DentalFlow | نظام إدارة عيادات الأسنان",
    template: "%s | DentalFlow",
  },
  description:
    "نظام متكامل لإدارة عيادات الأسنان - إدارة المواعيد، المرضى، العلاجات، التحليلات والتقويم بسهولة واحترافية.",
  keywords: [
    "عيادة أسنان",
    "إدارة عيادة",
    "مواعيد أسنان",
    "نظام SaaS",
    "DentalFlow",
    "إدارة مرضى",
    "تقويم أسنان",
  ],
  authors: [{ name: "DentalFlow" }],
  creator: "DentalFlow",
  openGraph: {
    type: "website",
    locale: "ar_SA",
    siteName: "DentalFlow",
    title: "DentalFlow | نظام إدارة عيادات الأسنان",
    description: "نظام متكامل لإدارة عيادات الأسنان - إدارة المواعيد، المرضى، العلاجات، التحليلات والتقويم.",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: "width=device-width, initial-scale=1.0",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();

  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}