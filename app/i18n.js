import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      form: require("./components/locales/en/form.json"),
      main: require("./components/locales/en/main.json"),
      orderslist: require("./components/locales/en/orderslist.json"),
      savedAddresses: require("./components/locales/en/savedAddresses.json"),
    },
    ua: {
      form: require("./components/locales/ua/form.json"),
      main: require("./components/locales/ua/main.json"),
      orderslist: require("./components/locales/ua/orderslist.json"),
      savedAddresses: require("./components/locales/ua/savedAddresses.json"),
    },
    el: {
      form: require("./components/locales/el/form.json"),
      main: require("./components/locales/el/main.json"),
      orderslist: require("./components/locales/el/orderslist.json"),
      savedAddresses: require("./components/locales/el/savedAddresses.json"),
    },
    ru: {
      form: require("./components/locales/ru/form.json"),
      main: require("./components/locales/ru/main.json"),
      orderslist: require("./components/locales/el/orderslist.json"),
      savedAddresses: require("./components/locales/el/savedAddresses.json"),
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
