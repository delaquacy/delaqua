import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "./components/footer/page";
import Header from "./components/header/page";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DelAqua",
  description: "Water delivery",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
