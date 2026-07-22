"use client";

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Camera, X, ChevronLeft, ChevronRight, ZoomIn, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type GalleryImage = {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  alt: string | null;
  active: boolean;
  order: number;
};

const allCategories = [
  "All",
  "Classrooms",
  "Annual Function",
  "Sports Day",
  "Science Activities",
  "Cultural Events",
  "School Campus",
  "Celebrations",
];

// Fallback color for when image fails to load
function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    Classrooms: "#1B2A4A",
    "Annual Function": "#C5963A",
    "Sports Day": "#2D8B4E",
    "Science Activities": "#3B82F6",
    "Cultural Events": "#9333EA",
    "School Campus": "#059669",
    Celebrations: "#DC2626",
  };
  return colors[category] || "#6B7280";
}

export default function GallerySection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [erroredImages, setErroredImages] = useState<Set<string>>(new Set());
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });

  // Fetch gallery images from API
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("/api/gallery");
        if (res.ok) {
          const data = await res.json();
          setImages(data);
        }
      } catch (err) {
        console.error("Error fetching gallery images:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  // Get categories that exist in our images + "All"
  const categories = images.length > 0
    ? ["All", ...Array.from(new Set(images.map((img) => img.category))).filter(Boolean)]
    : allCategories;

  const filteredImages =
    activeCategory === "All"
      ? images
      : images.filter((img) => img.category === activeCategory);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const goToPrev = () =>
    setLightboxIndex((prev) =>
      prev !== null
        ? (prev - 1 + filteredImages.length) % filteredImages.length
        : null
    );
  const goToNext = () =>
    setLightboxIndex((prev) =>
      prev !== null ? (prev + 1) % filteredImages.length : null
    );

  const handleImageLoad = (id: string) => {
    setLoadedImages((prev) => new Set(prev).add(id));
  };

  const handleImageError = (id: string) => {
    setErroredImages((prev) => new Set(prev).add(id));
  };

  return (
    <section id="gallery" className="py-16 lg:py-24 bg-white">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-10 lg:mb-14">
          <div className="inline-flex items-center gap-2 bg-gold/10 text-gold-dark rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
            <Camera className="w-3.5 h-3.5" />
            Campus Gallery
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-3">
            Our Campus <span className="text-gold">Gallery</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Explore the vibrant life at Saint Mary School through our collection
            of photographs capturing academics, celebrations, sports, and more.
          </p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 lg:mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-gold text-white shadow-md"
                  : "bg-secondary text-navy hover:bg-gold/10 hover:text-gold"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 mx-auto text-gold animate-spin mb-3" />
            <p className="text-muted-foreground text-sm">Loading gallery...</p>
          </div>
        ) : (
          /* Masonry grid */
          <div className="masonry-grid">
            {filteredImages.map((image, index) => {
              const hasError = erroredImages.has(image.id);
              const isLoaded = loadedImages.has(image.id);
              const bgColor = getCategoryColor(image.category);

              return (
                <div
                  key={`${image.id}-${activeCategory}`}
                  className={`masonry-item ${
                    inView ? "animate-fade-in-up" : "opacity-0"
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div
                    className="relative h-64 sm:h-72 rounded-xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-lg transition-all duration-300"
                    style={{ backgroundColor: bgColor }}
                    onClick={() => openLightbox(index)}
                  >
                    {/* Real image */}
                    {!hasError && (
                      <img
                        src={image.imageUrl}
                        alt={image.alt || image.title}
                        loading="lazy"
                        onLoad={() => handleImageLoad(image.id)}
                        onError={() => handleImageError(image.id)}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                          isLoaded ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    )}

                    {/* Loading skeleton */}
                    {!isLoaded && !hasError && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white/40 border-t-white/80 rounded-full animate-spin" />
                      </div>
                    )}

                    {/* Fallback placeholder if image fails */}
                    {hasError && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white/80">
                        <Camera className="w-8 h-8 mb-2 opacity-50" />
                        <p className="text-sm font-medium text-center opacity-70">
                          {image.category}
                        </p>
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/50 transition-all duration-300 flex items-center justify-center z-10">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center text-white">
                        <ZoomIn className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm font-medium">{image.title}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filteredImages.length === 0 && !loading && (
          <div className="text-center py-12 text-muted-foreground">
            <Camera className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No images in this category yet.</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && filteredImages[lightboxIndex] && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div
            className="relative max-w-4xl max-h-[85vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute -top-12 right-0 text-white hover:text-gold transition-colors z-10"
              aria-label="Close lightbox"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Image display */}
            <div className="w-full h-[70vh] rounded-t-xl overflow-hidden bg-black flex items-center justify-center">
              <img
                src={filteredImages[lightboxIndex].imageUrl}
                alt={filteredImages[lightboxIndex].alt || filteredImages[lightboxIndex].title}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Info bar */}
            <div className="bg-white rounded-b-xl p-4 flex items-center justify-between">
              <div>
                <h3 className="text-navy font-semibold">
                  {filteredImages[lightboxIndex].title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {filteredImages[lightboxIndex].category} &middot; Image{" "}
                  {lightboxIndex + 1} of {filteredImages.length}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToPrev}
                  className="rounded-lg"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToNext}
                  className="rounded-lg"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
