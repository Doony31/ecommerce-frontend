import { Hero } from '../components/Hero';
import { BestSellers } from '../components/BestSellers';
import { SizeGuide } from '../components/SizeGuide';
import { MainCategories } from '../components/MainCategories';

export const Home = () => {
  return (
    <div className="w-full bg-white">
      <Hero />
      <BestSellers />
      <SizeGuide />
      <MainCategories />
    </div>
  );
};