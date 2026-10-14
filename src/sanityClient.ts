import { createClient } from '@sanity/client';
export const sanityClient = createClient({
  projectId: 'bz8msak0',
  dataset: 'production',
  useCdn: false, // Отключаем CDN, чтобы делать прямые и разрешенные CORS-запросы
  apiVersion: '2023-05-03', // Стабильная, проверенная дата API Sanity
  token: 'skiKrv3WW06E1K3jzQMqYZ7NdGo7hfj15VGFhtNE52owjOE1XzMaYGbTz029Fhtq635pddP1LyUZVxj8XpIIYU7IUWDrduDPzsyq70sT1bvLmi61w3da0arOhmEBSHiYLuZTIcMOAyN1EEpW6ZODSaaVcYhZ6HRgaUHY8imSlNpCdIhzuxW1',
});