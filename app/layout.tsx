import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { WebsiteSchema, PersonSchema } from "@/components/StructuredData";
import { PositionProvider } from "@/contexts/PositionContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://dunghoang.com'),
  title: {
    default: "Dung Hoang - COO",
    template: "%s | Dung Hoang - COO",
  },
  description: "Chia sẻ kiến thức IT, công việc quản lý và định hướng nghề nghiệp trong lĩnh vực công nghệ",
  keywords: ["IT", "COO", "Tech Blog", "Software Engineering", "Career", "Dung Hoang"],
  authors: [{ name: "Dung Hoang" }],
  creator: "Dung Hoang",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  openGraph: {
    title: "Dung Hoang - COO",
    description: "Chia sẻ kiến thức IT, công việc quản lý và định hướng nghề nghiệp",
    type: "website",
    locale: "vi_VN",
    siteName: "Dung Hoang Blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dung Hoang - COO",
    description: "Chia sẻ kiến thức IT và công việc quản lý",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <WebsiteSchema />
        <PersonSchema />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PositionProvider>
            {children}
          </PositionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
