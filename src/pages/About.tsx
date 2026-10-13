import { useLoaderData } from 'react-router-dom';

export function About() {
  // Хук useLoaderData автоматически забирает данные, которые вернул наш loader
  const companyData = useLoaderData();
  
  return (
    <div>
      <h1>ℹ️ О нас</h1>
      <p>Добро пожаловать в {companyData.name}!</p>
      <p>Наша миссия: {companyData.mission}</p>
      <p>Год основания: {companyData.founded}</p>
    </div>
  );
}

// Создаем функцию-загрузчик.
// Обычно здесь делают реальный запрос к API (например, через fetch).
export async function aboutLoader() {
  // Имитируем задержку сети в 1 секунду, чтобы увидеть, как это работает
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Возвращаем объект с данными
  return {
    name: "MegaTech Corp",
    mission: "Делать мир лучше с помощью кода",
    founded: 2026
  };
}
