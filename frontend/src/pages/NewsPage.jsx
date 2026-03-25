import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import NewsHero from "../components/sections/news/NewsHero";
import NewsCategories from "../components/sections/news/NewsCategories";
import NewsList from "../components/sections/news/NewsList";

import "../styles/news.css";

export default function NewsPage() {
  const [activeTag, setActiveTag] = useState("");

  return (
    <>
      <Navbar />

      <NewsHero />
      <NewsCategories activeTag={activeTag} onTagSelect={setActiveTag} />
      <NewsList activeTag={activeTag} />

      <Footer />
    </>
  );
}
