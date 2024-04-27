import initTranslations from "../i18n";
import TranslationsProvider from "../components/TranslationsProvider/TranslationsProvider";
import MainPage from "../components/MainPage/MainPage";
import WrapperHeader from "../components/WrapperHeader/WrapperHeader";
import WrapperFooter from "../components/WrapperFooter/WrapperFooter";

const i18nNamespaces = ["main"];

export default async function Home({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const { resources } = await initTranslations(
    locale,
    i18nNamespaces
  );

  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={locale}
      resources={resources}
    >
      <WrapperHeader />
      <MainPage />
      <WrapperFooter />
    </TranslationsProvider>
  );
}
