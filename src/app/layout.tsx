import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import { RootProviders } from "./providers";

const rubik = Rubik({ subsets: ["latin"], variable: "--font-rubik" });

export const metadata: Metadata = {
  title: "EdgeStack Todos",
  description: "Full-stack Next.js todo list with MikroORM + Mongo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={rubik.variable}>
      <body>
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
