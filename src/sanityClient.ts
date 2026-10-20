import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: 'bz8msak0',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2026-10-12',
  token: import.meta.env.VITE_SANITY_API_TOKEN,
});

// Ваш хелпер собирает прямую и надежную ссылку на картинку из облака Sanity
export const urlFor = (source: { asset?: { _ref?: string } } | null | undefined): string => {
  if (!source?.asset?._ref) return 'placeholder.png';
  
  // Извлекаем ID картинки из ссылки Sanity (например: image-abcdefg-200x200-png -> abcdefg-200x200.png)
  const ref = source.asset._ref;
  const parts = ref.split('-');
  
  // Вернули правильные индексы элементов массива, чтобы TypeScript был доволен:
  const id = parts[1];
  const dimensions = parts[2];
  const extension = parts[3];
  
  return `https://sanity.io{id}-${dimensions}.${extension}`;
};
