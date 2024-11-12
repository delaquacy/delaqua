import { AnnouncementManagement } from "@/app/components/AnnouncementManagement";
import TranslationsProvider from "@/app/components/TranslationsProvider/TranslationsProvider";
import initTranslations from "@/app/i18n";

const i18nNamespaces = [
  "finishModal",
  "form",
  "orderslist",
  "orderTable",
  "savedAddresses",
  "main",
];

export default async function AnnouncementManagementPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const { resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <>
      <TranslationsProvider
        namespaces={i18nNamespaces}
        locale={locale}
        resources={resources}
      >
        <AnnouncementManagement />
      </TranslationsProvider>
    </>
  );
}
