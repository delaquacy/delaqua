import type { Metadata } from "next";
import { inter } from "@/app/ui/fonts";
import Footer from "./components/footer/page";
import "./globals.css";
import { ThemeProvider } from "@mui/material";
import { theme } from "./ui/themeMui";
import Header from "./components/header/page";
import Script from "next/script";
import { AmplitudeContextProvider } from "./lib/amplitudeConfig";
import { ToggleProvider } from "./lib/ToggleContext";

export const metadata: Metadata = {
  title: "DelAqua – Water delivery in Limassol, Cyprus",
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
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-Y4KS00EC7H"
        />

        <Script id="google-analytics">
          {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
              
                gtag('config', 'G-Y4KS00EC7H');
          `}
        </Script>
        <link rel="icon" href="/favicon.png" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider theme={theme}>
          <AmplitudeContextProvider>
            <ToggleProvider>
              <Header />
              {children}
              <Footer />
            </ToggleProvider>
          </AmplitudeContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
