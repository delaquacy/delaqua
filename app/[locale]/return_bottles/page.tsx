import { ReturnBottles } from "@/app/components/ReturnBottles";
import TranslationsProvider from "@/app/components/TranslationsProvider/TranslationsProvider";
import initTranslations from "@/app/i18n";
import { Box } from "@mui/material";

const i18nNamespaces = [
  "finishModal",
  "form",
  "orderslist",
  "orderTable",
  "savedAddresses",
  "main",
];

export default async function AdminPage({
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
        <Box
          sx={{
            flex: 1,
            display: "flex",
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ReturnBottles />
        </Box>
      </TranslationsProvider>
    </>
  );
}
