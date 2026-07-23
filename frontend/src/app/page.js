import Hero from "@/components/home/Hero";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import BestDeals from "@/components/home/BestDeals";
import PopularBrands from "@/components/home/PopularBrands";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";
import HowItWorks from "@/components/home/HowItWorks";
import TechServices from "@/components/home/TechServices";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedCategories />
      <FeaturedProducts />
      <WhyChooseUs />
      <BestDeals />
      <PopularBrands />
      <Testimonials />
      <Newsletter />
      <HowItWorks />
      <TechServices />
    </>
  );
}
