import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import NewsHero from "../components/sections/news/NewsHero";
import NewsList from "../components/sections/news/NewsList";

import "../styles/news.css";

export default function NewsPage() {
  return (
    <>
      <Navbar />

      <NewsHero />
      <NewsList />

      <Footer />
    </>
  );
}
