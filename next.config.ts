import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Включаем статический экспорт для GitHub Pages
  output: 'export', 
  
  // 2. Указываем путь к репозиторию (имя вашей папки проекта)
  basePath: '/calculator', 

  // 3. Отключаем оптимизацию картинок (GitHub Pages её не поддерживает)
  images: {
    unoptimized: true,
  },

  // Настройки Turbopack для локальной разработки (оставляем)
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
