import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AuthProvider } from "@/components/auth/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  applicationName: "Kriyavo",
  title: "Kriyavo - Create, Design, Share & Grow",
  description: "Create social posts, festival designs, resumes and more with Kriyavo.",
  icons: {
    icon: [
      { url: "/kriyavo/kriyavo-icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/kriyavo/kriyavo-icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/kriyavo/kriyavo-icon-192.png", sizes: "192x192" }],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body><AuthProvider>{children}</AuthProvider></body>
    </html>
  );
}
