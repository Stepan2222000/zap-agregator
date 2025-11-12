import HeroSection from '@/components/HeroSection';
import AboutPlatform from '@/components/AboutPlatform';
import PopularBrands from '@/components/PopularBrands';
import WhyAutoHub from '@/components/WhyAutoHub';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section с поиском */}
      <HeroSection />

      {/* О платформе */}
      <AboutPlatform />

      {/* Популярные бренды */}
      <PopularBrands />

      {/* Почему AutoHub AI */}
      <WhyAutoHub />
    </div>
  );
}
