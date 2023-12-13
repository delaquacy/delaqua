import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      form: require("./components/locales/en/form.json"),
      main: require("./components/locales/en/main.json"),
    },
    ua: {
      form: require("./components/locales/ua/form.json"),
      main: require("./components/locales/ua/main.json"),
    },
    el: {
      form: require("./components/locales/el/form.json"),
      main: require("./components/locales/el/main.json"),
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
