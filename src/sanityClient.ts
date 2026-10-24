import { createClient } from '@sanity/client';

// 1. Настроенный клиент Sanity с вашим верным идентификатором проекта
export const sanityClient = createClient({
  projectId: 'bz8msak0',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-05-03',
});

interface SanityImageSource {
  asset?: {
    _ref?: string;
  };
}

// 2. Экспортируемая функция urlFor
export const urlFor = (source: SanityImageSource | string | null | undefined): string => {
  if (!source) {
    return 'https://placeholder.com';
  }
  
  // Если это уже готовая строка-ссылка, отдаем её сразу
  if (typeof source === 'string') {
    return source;
  }
  
  // Прямо подставляем элементы массива в шаблонную строку, чтобы не плодить неиспользуемые переменные
  if (source.asset && source.asset._ref) {
    const parts = source.asset._ref.split('-');
    
    // parts[1] - это ID картинки, parts[2] - размеры (например, 400x400), parts[3] - формат (png/jpg)
    return `https://sanity.io{parts[1]}-${parts[2]}.${parts[3]}`;
  }
  
  return 'https://placeholder.com';
};
