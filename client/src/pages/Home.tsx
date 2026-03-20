import Hero from '../components/home/Hero';
import ProductShowcase from '../components/home/ProductShowcase';
import GlobalPresence from '../components/home/GlobalPresence';
import WhyChooseUs from '../components/home/WhyChooseUs';
import AboutPreview from '../components/home/AboutPreview';

const Home = () => {
  return (
    <div className="flex flex-col">
      <Hero />
      <WhyChooseUs />
      <ProductShowcase />
      <GlobalPresence />
      <AboutPreview />
    </div>
  );
};

export default Home;
