"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, X, GripVertical, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";
import useSWR from "swr";
import imageCompression from "browser-image-compression";

interface GalleryItem {
  _id: string;
  contentType: string;
  order: number;
  createdAt: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminGallery() {
  const { data: serverImages, mutate, isLoading } = useSWR<GalleryItem[]>("/api/gallery", fetcher);
  
  // Local state for optimistic UI and drag-and-drop
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync server data to local state when it arrives
  useEffect(() => {
    if (serverImages) {
      // Sort locally just in case, though server should sort it
      setImages([...serverImages].sort((a, b) => a.order - b.order));
    }
  }, [serverImages]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    setIsUploading(true);
    
    try {
      // 1. Compress Image (Max 500KB, Max Width 1920px)
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      
      const compressedFile = await imageCompression(file, options);
      
      // 2. Upload to Server
      const formData = new FormData();
      formData.append("file", compressedFile);

      const res = await fetch("/api/gallery", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      // 3. Refresh Data
      toast.success("Image uploaded successfully!");
      mutate(); // Triggers a re-fetch
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const confirmDelete = async () => {
    if (!imageToDelete) return;

    // Optimistic UI
    const previousImages = [...images];
    setImages((prev) => prev.filter((img) => img._id !== imageToDelete));
    setImageToDelete(null);

    try {
      const res = await fetch(`/api/gallery/${imageToDelete}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Image deleted");
      mutate();
    } catch (error) {
      console.error(error);
      setImages(previousImages); // Rollback on failure
      toast.error("Failed to delete image");
    }
  };

  // --- Native HTML5 Drag and Drop Logic ---
  const handleDragStart = (index: number) => {
    setDraggedItemIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault(); // Necessary to allow dropping
    if (draggedItemIndex === null || draggedItemIndex === index) return;

    // Swap logic for live preview while dragging
    const newImages = [...images];
    const draggedItem = newImages[draggedItemIndex];
    
    // Remove from old position and insert at new position
    newImages.splice(draggedItemIndex, 1);
    newImages.splice(index, 0, draggedItem);
    
    setDraggedItemIndex(index); // Update dragged index to new spot
    setImages(newImages);
  };

  const handleDrop = async () => {
    if (draggedItemIndex === null) return;
    setDraggedItemIndex(null);
    
    // Calculate new orders
    const updates = images.map((img, idx) => ({
      _id: img._id,
      order: idx,
    }));

    // Optimistically update local order state
    setImages((prev) => prev.map((img, idx) => ({ ...img, order: idx })));

    try {
      const res = await fetch("/api/gallery/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });

      if (!res.ok) throw new Error("Failed to save order");
      
      toast.success("Gallery order saved");
      mutate(); // Sync with server
    } catch (error) {
      console.error(error);
      toast.error("Failed to reorder images");
      mutate(); // Revert to server state on error
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm flex flex-col min-h-[600px]">
      
      {/* Header & Upload Controls */}
      <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Manage Gallery</h2>
          <p className="text-sm text-muted-foreground mt-1">Upload, delete, and drag-to-reorder images for the public gallery.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileSelect}
          />
          <Button 
            onClick={() => fileInputRef.current?.click()} 
            disabled={isUploading}
            className="bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Upload className="w-4 h-4 mr-2" />
            )}
            {isUploading ? "Uploading..." : "Upload New Image"}
          </Button>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="p-6 flex-1 bg-secondary/5">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary opacity-50" />
            <p className="text-muted-foreground mt-4 text-sm">Loading gallery images...</p>
          </div>
        ) : images.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border-2 border-dashed border-border rounded-xl">
            <ImageIcon className="w-12 h-12 mb-4 opacity-20" />
            <p>No images in gallery.</p>
            <p className="text-sm">Upload some photos to showcase your foundation.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 auto-rows-[200px] gap-4">
            {images.map((image, index) => (
              <div
                key={image._id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDrop}
                className={`relative group bg-card border border-border rounded-xl overflow-hidden shadow-sm transition-all duration-200 cursor-grab active:cursor-grabbing ${
                  draggedItemIndex === index ? "opacity-50 scale-95 shadow-lg border-primary" : "hover:border-primary/50"
                }`}
              >
                {/* Image Display - Using our native streaming API. Object contain helps preserve dimensions */}
                <Image 
                  src={`/api/gallery/${image._id}/image`} 
                  alt="Gallery item" 
                  fill 
                  className="object-cover"
                  unoptimized // Next.js struggles to optimize pure binary streams without sharp configs sometimes, unoptimized is safer for this DB stream
                />

                {/* Hover Overlay Controls */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-2">
                  <div className="flex justify-between items-start">
                    <div className="bg-background/80 backdrop-blur-sm text-foreground text-xs font-bold px-2 py-1 rounded-md flex items-center shadow-sm">
                      <GripVertical className="w-3 h-3 mr-1 opacity-50" />
                      #{index + 1}
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent drag action
                        setImageToDelete(image._id);
                      }}
                      className="bg-destructive text-white p-1.5 rounded-md hover:bg-red-600 transition-colors shadow-sm"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom Delete Confirmation Modal */}
      {imageToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border shadow-2xl rounded-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-foreground mb-2">Delete Image</h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete this image? It will be permanently removed from the public gallery and the database.
            </p>
            <div className="flex items-center justify-end gap-3">
              <Button variant="outline" onClick={() => setImageToDelete(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Yes, Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
