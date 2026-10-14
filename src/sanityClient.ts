import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: 'bz8msak0',
  dataset: 'production',
  useCdn: true, // Принудительно включаем CDN (это уберёт ошибку Failed to fetch в браузере)
  apiVersion: '2026-10-12', // Актуальная дата апи
});
