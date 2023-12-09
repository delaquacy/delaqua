import type { Metadata } from "next";
import { inter } from "@/app/ui/fonts";
import Footer from "./components/footer/page";
import "./globals.css";
import { ThemeProvider } from "@mui/material";
import { theme } from "./ui/themeMui";
import Header from "./components/header/page";
import { SnackbarProvider } from "notistack";

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
      <head>
        <link rel="icon" href="/favicon.png" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider theme={theme}>
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
