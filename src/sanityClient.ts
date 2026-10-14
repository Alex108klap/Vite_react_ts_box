import { createClient } from '@sanity/client';
export const sanityClient = createClient({
  projectId: 'bz8msak0',
  dataset: 'production',
  useCdn: false, // Отключаем CDN, чтобы делать прямые и разрешенные CORS-запросы
  apiVersion: '2023-05-03', // Стабильная, проверенная дата API Sanity
});