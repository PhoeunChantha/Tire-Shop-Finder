import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { getImageUrl } from '@/lib/imageHelper';

interface Banner {
  id: number;
  title: string;
  descriptions: string;
  image: string | null;
  url: string | null;
  sort_order: number;
}

interface BannerCarouselProps {
  banners: Banner[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
  backgroundOnly?: boolean;
}

export function BannerCarousel({ 
  banners, 
  autoPlay = true, 
  autoPlayInterval = 10000,
  className = "",
  backgroundOnly = false
}: BannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (autoPlay && banners.length > 1) {
      const interval = setInterval(nextSlide, autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [autoPlay, autoPlayInterval, banners.length, nextSlide]);

  if (banners.length === 0) {
    return null;
  }

  const handleBannerClick = (banner: Banner) => {
    if (banner.url) {
      window.open(banner.url, '_blank', 'noopener,noreferrer');
    }
  };

  const isBackground = className.includes('h-full') || backgroundOnly;

  return (
    <div className={`relative w-full ${className}`}>
      <div className={`relative overflow-hidden bg-gray-100 ${
        isBackground ? 'h-full' : 'rounded-lg aspect-[3/1] md:aspect-[4/1]'
      }`}>
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {banner.image ? (
              <div 
                className={`relative w-full h-full ${
                  banner.url && !backgroundOnly ? 'cursor-pointer' : ''
                }`}
                onClick={() => !backgroundOnly && handleBannerClick(banner)}
              >
                <img
                  src={getImageUrl(banner.image, 'banners')}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Failed to load banner image:', banner.image);
                    (e.target as HTMLImageElement).src = getImageUrl(null, 'banners');
                  }}
                />
                {/* Only show overlay and content if not used as background */}
                {!backgroundOnly && !isBackground && (
                  <>
                    <div className="absolute inset-0 bg-black bg-opacity-40" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white px-4 max-w-4xl">
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4">
                          {banner.title}
                        </h2>
                        {banner.descriptions && (
                          <p className="text-sm md:text-lg lg:text-xl mb-4 opacity-90">
                            {banner.descriptions}
                          </p>
                        )}
                        {banner.url && (
                          <div className="inline-flex items-center gap-2 text-sm md:text-base bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                            <ExternalLink className="w-4 h-4" />
                            <span>Click to learn more</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center">
                {!isBackground && (
                  <div className="text-center text-white px-4 max-w-4xl">
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4">
                      {banner.title}
                    </h2>
                    {banner.descriptions && (
                      <p className="text-sm md:text-lg lg:text-xl mb-4 opacity-90">
                        {banner.descriptions}
                      </p>
                    )}
                    {banner.url && (
                      <Button 
                        variant="secondary" 
                        className="mt-4"
                        onClick={() => handleBannerClick(banner)}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Learn More
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Buttons - Only show when not used as background */}
      {banners.length > 1 && !backgroundOnly && !isBackground && (
        <>
          <Button
            variant="outline"
            size="sm"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg z-10"
            onClick={prevSlide}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg z-10"
            onClick={nextSlide}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex 
                    ? 'bg-white' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}