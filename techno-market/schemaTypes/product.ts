import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'product',
  title: 'Товары',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Название товара',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Категория',
      type: 'reference',
      to: [{ type: 'category' }],
    }),
    defineField({
      name: 'brand',
      title: 'Бренд',
      type: 'reference', // 👈 Динамическая связь с нашей новой схемой бренда
      to: [{ type: 'brand' }],
    }),
    defineField({
      name: 'price',
      title: 'Цена ($)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'discount',
      title: 'Скидка (%)',
      type: 'number',
      description: 'Укажите процент скидки (например, 10 для 10%). Оставьте пустым, если скидки нет.',
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: 'image',
      title: 'Изображение товара',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'features',
      title: 'Характеристики',
      type: 'array', // 👈 Массив для добавления произвольного списка параметров
      description: 'Добавьте технические характеристики товара',
      of: [
        {
          type: 'object',
          name: 'featureItem',
          title: 'Параметр',
          fields: [
            { name: 'label', type: 'string', title: 'Название (например: Вес, Мощность, Время работы)' },
            { name: 'value', type: 'string', title: 'Значение (например: 250г, 50 Вт, 12 часов)' }
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'value'
            }
          }
        }
      ]
    }),
  ],
});
