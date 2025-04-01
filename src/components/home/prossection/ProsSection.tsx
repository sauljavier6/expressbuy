"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "@/components/home/prossection/ProsSection.module.scss";
import Image from "next/image";

const ProsSection = () => {
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // Evita el error de hidratación

  const pros = [
    {
      icon: "/icons/transport.png",
      title: t("freeShipping"),
      description: t("freeShippingDescription"),
    },
    {
      icon: "/icons/dollar.png",
      title: t("moneyBackGuarantee"),
      description: t("moneyBackDescription"),
    },
    {
      icon: "/icons/24-hours-support.png",
      title: t("onlineSupport"),
      description: t("onlineSupportDescription"),
    },
    {
      icon: "/icons/secure-payment.png",
      title: t("securePayment"),
      description: t("securePaymentDescription"),
    },
  ];

  return (
    <section className={styles.container}>
      <div className={styles.container__content}>
        {pros.map((pro, index) => (
          <div key={index} className={styles.container__content__proItem}>
            <Image src={pro.icon} alt={pro.title} width={50} height={50}/>
            <div>
              <h3>{pro.title}</h3>
              <p>{pro.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProsSection;
