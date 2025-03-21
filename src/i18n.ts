// 📌 src/i18n.ts
"use client"; // Asegura que es del lado cliente

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

i18n
  .use(HttpApi) // Carga archivos JSON desde `public/locales/`
  .use(LanguageDetector) // Detecta el idioma del navegador
  .use(initReactI18next) // Configura react-i18next
  .init({
    supportedLngs: ["en", "es", "fr"],
    fallbackLng: "es",
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: "/locales/{{lng}}/common.json", // Ruta de los archivos JSON
    },
    detection: {
      order: ["localStorage", "navigator"], // Primero revisa localStorage, luego el navegador
      caches: ["localStorage"], // Guarda el idioma seleccionado en localStorage
    },
  });

export default i18n;
