import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      dashboard: "Dashboard",
      patients: "Patients",
      followups: "Follow-Ups",
      support: "Support",
      welcome: "Welcome to ClinIQ",
      submit: "Submit",
      language: "Language"
    }
  },
  hi: {
    translation: {
      dashboard: "डैशबोर्ड",
      patients: "मरीज",
      followups: "फॉलो-अप",
      support: "सहायता",
      welcome: "ClinIQ में आपका स्वागत है",
      submit: "सबमिट करें",
      language: "भाषा"
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  interpolation: { escapeValue: false }
});

export default i18n;
