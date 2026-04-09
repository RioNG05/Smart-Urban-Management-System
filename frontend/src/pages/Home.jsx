import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Hero from "../components/sections/Hero";
import AboutSection from "../components/sections/AboutSection";
import ProjectsSection from "../components/sections/ProjectsSection";
import NewsSection from "../components/sections/NewsSection";
import ServicesSection from "../components/sections/ServicesSection";
import ContactSection from "../components/sections/ContactSection";
import { serviceCatalog } from "../data/serviceCatalog";
import {
  getApartmentTypeImages,
  getApartmentTypes,
} from "../services/apartmentService";
import { getNewsList } from "../services/newsService";
import {
  createApartmentTypeImageMap,
  mapApartmentTypeToCard,
} from "../services/propertyMapper";

const sortByNewest = (items = [], dateKey) =>
  [...items].sort((a, b) => {
    const aTime = new Date(a?.[dateKey] ?? 0).getTime();
    const bTime = new Date(b?.[dateKey] ?? 0).getTime();

    if (Number.isNaN(aTime) || Number.isNaN(bTime) || aTime === bTime) {
      return Number(b?.id ?? 0) - Number(a?.id ?? 0);
    }

    return bTime - aTime;
  });

export default function Home() {
  const [featuredTypes, setFeaturedTypes] = useState([]);
  const [latestNews, setLatestNews] = useState([]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [apartmentTypes, apartmentTypeImages, newsItems] = await Promise.all([
          getApartmentTypes(),
          getApartmentTypeImages(),
          getNewsList(),
        ]);
        const apartmentTypeImageMap = createApartmentTypeImageMap(
          apartmentTypes,
          apartmentTypeImages,
        );

        setFeaturedTypes(
          sortByNewest(apartmentTypes, "createdAt")
            .slice(0, 3)
            .map((apartmentType) =>
              mapApartmentTypeToCard(apartmentType, apartmentTypeImageMap),
            ),
        );
        setLatestNews(sortByNewest(newsItems, "lastUpdateRaw").slice(0, 3));
      } catch (error) {
        console.error("Failed to load home page data:", error);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <>
      <Navbar />

      <Hero />
      <AboutSection />
      <ProjectsSection apartmentTypes={featuredTypes} />
      <NewsSection newsItems={latestNews} />
      <ServicesSection services={serviceCatalog.slice(0, 5)} />
      <ContactSection />

      <Footer />
    </>
  );
}
