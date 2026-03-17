import { useState } from 'react';

interface PremiumImageProps {
  src: string;
  alt: string;
  className?: string;
}

const PremiumImage = ({ src, alt, className = "" }: PremiumImageProps) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const placeholder = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800"; // High-end spices placeholder

  return (
    <div className={`relative overflow-hidden bg-gray-100 ${className}`}>
      {loading && (
        <div className="absolute inset-0 animate-pulse bg-gray-200" />
      )}
      <img
        src={error ? placeholder : src}
        alt={alt}
        loading="lazy"
        className={`w-full h-full object-cover transition-transform duration-700 hover:scale-105 ${loading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
      />
    </div>
  );
};

export default PremiumImage;
