import type { Metadata } from "next";
import { inter } from "@/app/ui/fonts";
import Footer from "./components/footer/page";
import Header from "./components/header/page";
import "./globals.css";

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
      <body className={`${inter.className} antialiased`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
