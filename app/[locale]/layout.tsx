import { inter } from "@/app/ui/fonts";
import { ThemeProvider } from "@mui/material";
import { theme } from "../ui/themeMui";
import Script from "next/script";
import { AmplitudeContextProvider } from "../lib/amplitudeConfig";
import { ToggleProvider } from "../lib/ToggleContext";
import initTranslations from "../i18n";
import i18nConfig from "@/i18nConfig";
import "../globals.css";

export function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { t } = await initTranslations(locale, ["main"]);

  return (
    <html lang={locale}>
      <head>
        <title>{t("title_tag")}</title>
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
        <meta name="description" content={t("description_tag")} />
        <link rel="icon" href="/favicon.png" />
        <link
          rel="alternate"
          href="https://delaqua.cy"
          hrefLang="en"
        />
        <link
          rel="alternate"
          href="https://delaqua.cy/el"
          hrefLang="el"
        />
        <link
          rel="alternate"
          href="https://delaqua.cy/ru"
          hrefLang="ru"
        />
        <link
          rel="alternate"
          href="https://delaqua.cy/uk"
          hrefLang="uk"
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider theme={theme}>
          <AmplitudeContextProvider>
            <ToggleProvider>{children}</ToggleProvider>
          </AmplitudeContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
