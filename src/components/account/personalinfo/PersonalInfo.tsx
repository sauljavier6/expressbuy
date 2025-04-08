// src/components/PersonalInfo.tsx
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface PersonalInfoProps {
  user: {
    name: string;
    email: string;
  };
}

const PersonalInfo = ({ user }: PersonalInfoProps) => {
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // Evita el error de hidratación

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-3">
        {t("personalInfo.title")}
      </h2>
      <p className="text-gray-700">
        <span className="font-medium">{t("personalInfo.name")}:</span> {user.name}
      </p>
      <p className="text-gray-700">
        <span className="font-medium">{t("personalInfo.email")}:</span> {user.email}
      </p>
    </div>
  );
};

export default PersonalInfo;
