"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import TailoringLoader from "@/components/svgs/TailoringLoader.svgs";

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageLoading: boolean;
  onImageLoad: () => void;
  galleryImages: string[];
  currentImageIndex: number;
  onChangeImage: (index: number) => void;
  onPrevImage: () => void;
  onNextImage: () => void;
}

export const GalleryModal = ({
  isOpen,
  onClose,
  imageLoading,
  onImageLoad,
  galleryImages,
  currentImageIndex,
  onChangeImage,
  onPrevImage,
  onNextImage,
}: GalleryModalProps) => {
  const modalRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      setTimeout(() => {
        modalRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
        modalRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div
        ref={modalRef}
        tabIndex={-1}
        className="bg-white/10 border border-white/30 backdrop-blur-md p-6 rounded-lg max-w-4xl w-full mx-auto my-8 outline-none"
        style={{ maxHeight: "calc(100vh - 20vh)" }}
      >
        <h3 className="text-2xl font-bold mb-4 text-white flex justify-between items-center">
          <span>Gallery</span>
          <Button
            onClick={onClose}
            variant="ghost"
            className="h-8 w-8 p-0 bg-black text-white rounded-full"
          >
            <span className="sr-only">Close</span>
            <X className="h-6 w-6" />
          </Button>
        </h3>
        <div className="relative w-full h-[60vh] mb-6">
          {imageLoading && <TailoringLoader />}
          <Image
            src={galleryImages[currentImageIndex] || "/placeholder.svg"}
            alt={`Gallery image ${currentImageIndex + 1}`}
            fill
            style={{ objectFit: "contain" }}
            quality={80}
            priority={isOpen}
            className="rounded-md"
            onLoadingComplete={onImageLoad}
          />
        </div>
        <div className="flex justify-center gap-2 mb-4">
          {galleryImages.map((_, index) => (
            <Button
              key={index}
              onClick={() => onChangeImage(index)}
              className={`h-3 w-3 p-3 rounded-full flex items-center justify-center ${
                currentImageIndex === index
                  ? "bg-[#F0C38E] text-black"
                  : "bg-gray-300 text-gray-600"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              {index + 1}
            </Button>
          ))}
        </div>
        <div className="flex justify-between">
          <Button
            onClick={onPrevImage}
            className="bg-[#F0C38E] text-black hover:bg-[#F0C38E]/80"
          >
            Previous
          </Button>
          <Button
            onClick={onNextImage}
            className="bg-[#F0C38E] text-black hover:bg-[#F0C38E]/80"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GalleryModal;
