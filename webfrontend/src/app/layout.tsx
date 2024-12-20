import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import ReactQueryProvider from "@/utility/extlib/datatable/ReactQueryProvider";

export const metadata: Metadata = {
  title: "My Flyzer",
  description: "This will be the Flyzer application.",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
