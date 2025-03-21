// 📌 src/context/LanguageProvider.tsx
"use client"; // Se ejecuta en el lado cliente

import { ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n"; // Importa la configuración de i18next

export default function LanguageProvider({ children }: { children: ReactNode }) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
