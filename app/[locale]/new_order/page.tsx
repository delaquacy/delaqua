import Account from "../../components/Account/Account";
import TranslationsProvider from "../../components/TranslationsProvider/TranslationsProvider";
import initTranslations from "../../i18n";

const i18nNamespaces = [
  "finishModal",
  "form",
  "orderslist",
  "savedAddresses",
  "orderTable",
  "main",
];

export default async function MyAccount({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const { resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={locale}
      resources={resources}
    >
      <Account />
    </TranslationsProvider>
  );
}
