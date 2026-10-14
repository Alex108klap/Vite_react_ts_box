import { createClient } from '@sanity/client';
export const sanityClient = createClient({
  projectId: 'bz8msak0',
  dataset: 'production',
  useCdn: false, // Отключаем CDN, чтобы делать прямые и разрешенные CORS-запросы
  apiVersion: '2023-05-03', // Стабильная, проверенная дата API Sanity
  token: 'skZ90a3mmVVCzjMuhUaAKkPwDu5ujgI92JW3C7EYPDwEIpRJx8gsCLor6udgQ54nJQ6avRjVYd0o2ficrPp01ZRFRYQIZ4uWgpXWW0Wk8Rl7Jnnt3nPl2L6yPXukjs5IBVeR5eD57C8DQOJeuOdqU5O3Vbpk6C6Gz7mIkhhHs0J3buaMox2H',
});