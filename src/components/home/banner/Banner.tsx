"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./Banner.module.scss";
import SideBar from "@/components/home/sidebar/SideBar";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const Banner = () => {
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // Evita el error de hidratación

  const icons = [
    {
      icon: "/icons/user.png",
      title: t("freeShippingReturn"),
      link: "/account"
    },
    {
      icon: "/icons/cart.png",
      title: t("freeShippingReturn"),
      link: "/cart"
    },
  ];

  return (
    <div className={styles.banner}>
      <div className={styles.banner__sidebar}><SideBar /></div>
      <div className={styles.banner__content}>
        <h1>{t("newBrownCollection")}</h1>
        <h2>{t("summerSale")}</h2>
        <h3>{t("thirtyPercentOff")}</h3>
        <div>
          <p>{t("startingAt")}: $39.99</p>
        </div>
      </div>
      <div className={styles.image}>
        <Image src="/banner/mocasines.png" alt="Summer Sale Shoes" width={500} height={500} />
        <div className={styles.image__icons}>
          {icons.map((pro, index) => (
            <Link key={index} href={pro.link}>
              <Image src={pro.icon} alt={pro.title} width={24} height={24} priority />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;
