import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ASHAA Dress Tailoring Institute",
    short_name: "ASHAA",
    description:
      "Learn tailoring and dress designing at ASHAA Dress Designing Institute",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/asha_logo.jpg",
        sizes: "192x192",
        type: "image/jpg",
        purpose: "maskable",
      },
      {
        src: "/asha_logo.jpg",
        sizes: "512x512",
        type: "image/jpg",
        purpose: "any",
      },
    ],
  };
}
