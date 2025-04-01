"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./SummerCollection.module.scss";

const SummerCollection = () => {
  const { t } = useTranslation(); // Usar hook para traducción
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <h2 className="text-2xl text-center">{t("loading")}</h2>; // Mensaje de carga

  return (
    <section className={styles.container}>
      <h2 className="text-2xl font-semibold text-center">
        {t("summerCollection")}
      </h2>
      <p className="text-gray-500 text-center mb-6">
        {t("featuredDescription")}
      </p>

      <div className={styles.container__content}>
        {/* Imagen grande a la izquierda */}
        <div className={styles.container__content__imageContainer}>
          <img
            src="/summercollection/tenis-correr.jpg"
            alt={t("summerCollection")}
            className={styles.largeImage}
          />
        </div>

        {/* Contenedor de los cuadros "For Her" y "For Him" */}
        <div className={styles.container__content__collectionDetails}>
          <div className={styles.container__content__collectionDetails__collectionTitle}>
            {t("forHer")}
          </div>
          <div className={styles.container__content__collectionDetails__collectionTitle}>
            {t("forHim")}
          </div>
        </div>

        {/* Contenedor de las imágenes "For Her" y "For Him" */}
        <div className={styles.container__content__imgDetails}>
          <img src="/summercollection/ella.jpg" alt={t("forHer")} />
          <img src="/summercollection/el.jpg" alt={t("forHim")} />
        </div>
      </div>
    </section>
  );
};

export default SummerCollection;
