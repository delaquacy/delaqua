import initTranslations from "../../i18n";
import TranslationsProvider from "../../components/TranslationsProvider/TranslationsProvider";
import Account from "../../components/Account/Account";
import WrapperHeader from "@/app/components/WrapperHeader/WrapperHeader";
import WrapperFooter from "@/app/components/WrapperFooter/WrapperFooter";

const i18nNamespaces = [
  "finishModal",
  "form",
  "orderslist",
  "savedAddresses",
  "main",
];

export default async function MyAccount({
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
      <Account />
      <WrapperFooter />
    </TranslationsProvider>
  );
}
