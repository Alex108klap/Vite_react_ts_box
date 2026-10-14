import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: 'bz8msak0',
  dataset: 'production',
  useCdn: true, // ИМЕННО ЭТО ПЕРЕКЛЮЧЕНИЕ УБЕРЕТ ОШИБКУ FAILED TO FETCH!
  apiVersion: '2026-10-12',
});
