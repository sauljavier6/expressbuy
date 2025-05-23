import React from "react";
import Banner from "@/components/home/banner/Banner";
import ProsSection from "@/components/home/prossection/ProsSection";
import FeaturedProducts from "@/components/home/featuredproducts/FeaturedProducts";
import styles from "@/components/home/banner/Banner.module.scss";
import SummerCollection from "@/components/home/summercollection/SummerCollection";
import BestSellerProducts from "@/components/home/bestproducts/BestSellerProducts";
import BrandsSection from "@/components/home/brandssection/BrandsSection";
import StoreMap from "@/components/home/storemap/StoreMap";

export default function Home() {
  return (
    <div className={styles.container}>
      <Banner />
      <ProsSection />
      <FeaturedProducts />
      <SummerCollection />
      <BestSellerProducts />
      <StoreMap />
    </div>
  );
}
