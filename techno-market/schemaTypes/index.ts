import product from './product';
import category from './category';
import { brandType } from './brandType'; // 👈 Добавили импорт схемы брендов

export const schemaTypes = [
  product,
  category,
  brandType // 👈 Добавили бренд в список доступных типов
]
