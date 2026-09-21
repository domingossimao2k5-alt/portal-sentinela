import type { MetadataRoute } from "next";


const BASE_URL = "https://portal-sentinela-vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/denuncia", "/transparencia", "/privacidade", "/identificacao-cadaveres"];
  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
  }));
}
