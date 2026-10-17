import product from './product';
import category from './category' // 👈 Добавили импорт схемы категорий

export const schemaTypes = [
  product,
  category // 👈 Добавили категорию в список доступных типов
]
