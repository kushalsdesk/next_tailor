"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import TailoringLoader from "@/components/svgs/TailoringLoader.svgs";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageLoading: boolean;
  onImageLoad: () => void;
}

export const CertificateModal = ({
  isOpen,
  onClose,
  imageLoading,
  onImageLoad,
}: CertificateModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

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
        tabIndex={-1} // Make it focusable but not in tab order
        className="bg-white/10 backdrop-blur-md border border-white/30 p-6 rounded-lg max-w-4xl w-full mx-auto my-8 outline-none"
        style={{ maxHeight: "calc(100vh - 20vh)" }}
      >
        <h3 className="text-2xl font-bold mb-4 text-white flex justify-between items-center">
          <span>Sample Certificate</span>
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
            src="/sample.jpeg"
            alt="Sample Certificate"
            fill
            style={{ objectFit: "contain" }}
            quality={60}
            priority={isOpen}
            className="rounded-md"
            onLoadingComplete={onImageLoad}
          />
        </div>
        <div className="flex justify-end">
          <Button
            onClick={onClose}
            className="bg-[#F0C38E] text-black hover:bg-[#F0C38E]/80"
          >
            Close Preview
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CertificateModal;
