import BestDeals from "@/components/BestDeals";
import BestSellers from "@/components/BestSeller";
import FeaturedBrands from "@/components/FeaturedBrands";
import FeaturedCategories from "@/components/FeaturedCategories";
import Footer from "@/components/Footer";
import GiftsAndBundles from "@/components/GiftsandBundles";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import NewArrivals from "@/components/NewArriaval";
import PromotionalBanner from "@/components/PromotionalBanner";
import ServicesSection from "@/components/ServicesSection";
import Testimonials from "@/components/Testimonials";
import TrendingProducts from "@/components/TrendingProduct";
import React from "react";

const Homepage = () => {
  return (
    <>
      {/* <Header /> */}
      <Header />
      {/* <Hero /> */}
      <Hero />
      {/* <ServicesSection /> */}
      <ServicesSection />
      {/* <FeaturedCategories /> */}
      <FeaturedCategories />
      {/* <TrendingProducts /> */}
      <TrendingProducts />
      {/* <BestDeals /> */}
      <BestSellers />
      {/* <NewArrivals /> */}
      <NewArrivals />
      {/* <GiftsAndBundles /> */}
      {/* <GiftsAndBundles /> */}
      {/* <FeaturedBrands /> */}
      <FeaturedBrands />
      <Testimonials />
      <PromotionalBanner />
      {/* <Footer /> */}
      <Footer />
    </>
  );
};

export default Homepage;
