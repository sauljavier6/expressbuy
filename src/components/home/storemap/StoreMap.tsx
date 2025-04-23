"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function StoreMap (){
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <section className="py-12 px-6 md:px-12 bg-white dark:bg-neutral-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Mapa */}
        <div className="w-full h-72 md:h-96">
          <iframe
            title="Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3316.1212472837797!2d-117.22069499999999!3d33.783367000000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80dca1d535624e45%3A0xeac65ae1cfc8099f!2sPerris%20Indoor%20Swapmeet!5e0!3m2!1ses!2smx!4v1745352894707!5m2!1ses!2smx"
            className="w-full h-full rounded-lg shadow"
            allowFullScreen
            loading="lazy"
          />
        </div>

        {/* Info del Local */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">CINDERELLA HEELS</h2>

          <p className="text-gray-700 mb-2">
            📍 <span className="font-semibold">{t("map.address")}:</span> 440 E 4th street, perris California 92570 # D4 & D5
          </p>

          <p className="text-gray-700 mb-2">
            📞 <span className="font-semibold">{t("map.phone")}:</span> (01) 6197949429
          </p>

          <p className="text-gray-700 mb-2">
            ✉️ <span className="font-semibold">{t("map.email")}:</span> mileniumbeatriz@hotmail.com
          </p>

          <p className="text-sm text-gray-500 mt-4">
          {t("map.invitation")}
          </p>
        </div>
      </div>
    </section>
  );
};
