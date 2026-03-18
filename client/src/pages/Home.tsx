import Hero from '../components/home/Hero';
import TrustStrip from '../components/home/TrustStrip';
import ProductShowcase from '../components/home/ProductShowcase';
import GlobalPresence from '../components/home/GlobalPresence';
import WhyChooseUs from '../components/home/WhyChooseUs';
import AboutPreview from '../components/home/AboutPreview';
import FinalCTA from '../components/home/FinalCTA';

const Home = () => {
  return (
    <div className="flex flex-col">
      <Hero />
      <TrustStrip />
      <WhyChooseUs />
      <ProductShowcase />
      <GlobalPresence />
      <AboutPreview />
      <FinalCTA />
    </div>
  );
};

export default Home;
