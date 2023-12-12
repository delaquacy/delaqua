import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      form: require("./components/locales/en/form.json"),
      home: require("./components/locales/en/home.json"),
    },
    ua: {
      form: require("./components/locales/ua/form.json"),
      home: require("./components/locales/ua/home.json"),
    },
    el: {
      form: require("./components/locales/el/form.json"),
      home: require("./components/locales/el/home.json"),
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
