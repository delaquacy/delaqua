import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      form: require("./components/locales/en/form.json"),
      main: require("./components/locales/en/main.json"),
      orderslist: require("./components/locales/en/orderslist.json"),
      savedAddresses: require("./components/locales/en/savedAddresses.json"),
      finishModal: require("./components/locales/en/finishModal.json"),
    },
    uk: {
      form: require("./components/locales/uk/form.json"),
      main: require("./components/locales/uk/main.json"),
      orderslist: require("./components/locales/uk/orderslist.json"),
      savedAddresses: require("./components/locales/uk/savedAddresses.json"),
      finishModal: require("./components/locales/uk/finishModal.json"),
    },
    el: {
      form: require("./components/locales/el/form.json"),
      main: require("./components/locales/el/main.json"),
      orderslist: require("./components/locales/el/orderslist.json"),
      savedAddresses: require("./components/locales/el/savedAddresses.json"),
      finishModal: require("./components/locales/el/finishModal.json"),
    },
    ru: {
      form: require("./components/locales/ru/form.json"),
      main: require("./components/locales/ru/main.json"),
      orderslist: require("./components/locales/ru/orderslist.json"),
      savedAddresses: require("./components/locales/ru/savedAddresses.json"),
      finishModal: require("./components/locales/ru/finishModal.json"),
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
