import { UserConfig } from "next-i18next";

const NextI18NextConfig: UserConfig = {
  i18n: {
    locales: ["en", "es", "fr"], // Idiomas disponibles
    defaultLocale: "en", // Idioma por defecto
  },
};

export default NextI18NextConfig;
