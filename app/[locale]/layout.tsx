import { inter } from "@/app/ui/fonts";
import i18nConfig from "@/i18nConfig";
import { ThemeProvider } from "@mui/material/styles";
import Script from "next/script";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LayoutContent from "../components/LayoutContent";
import TranslationsProvider from "../components/TranslationsProvider/TranslationsProvider";
import { GoodsProvider } from "../contexts/GoodsContext";
import { OrderDetailsProvider } from "../contexts/OrderDetailsContext";
import { OrdersTableProvider } from "../contexts/OrdersTableContext";
import { UserProvider } from "../contexts/UserContext";
import "../globals.css";
import initTranslations from "../i18n";
import { ToggleProvider } from "../lib/ToggleContext";
import { AmplitudeContextProvider } from "../lib/amplitudeConfig";
import { theme } from "../ui/themeMui";

export function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
}

const i18nNamespaces = [
  "finishModal",
  "form",
  "orderslist",
  "orderTable",
  "savedAddresses",
  "main",
];

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { t, resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <html lang={locale}>
      <head>
        <title>{t("title_tag", { ns: "main" })}</title>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-Y4KS00EC7H"
        />
        <Script src="https://www.google.com/recaptcha/api.js?render=explicit" />

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
        <link rel="alternate" href="https://delaqua.cy" hrefLang="en" />
        <link rel="alternate" href="https://delaqua.cy/el" hrefLang="el" />
        <link rel="alternate" href="https://delaqua.cy/ru" hrefLang="ru" />
        <link rel="alternate" href="https://delaqua.cy/uk" hrefLang="uk" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider theme={theme}>
          <AmplitudeContextProvider>
            <ToggleProvider>
              <TranslationsProvider
                namespaces={i18nNamespaces}
                locale={locale}
                resources={resources}
              >
                <UserProvider>
                  <OrdersTableProvider>
                    <OrderDetailsProvider>
                      <GoodsProvider>
                        <ToastContainer />
                        <LayoutContent>{children}</LayoutContent>
                      </GoodsProvider>
                    </OrderDetailsProvider>
                  </OrdersTableProvider>
                </UserProvider>
              </TranslationsProvider>
            </ToggleProvider>
          </AmplitudeContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
