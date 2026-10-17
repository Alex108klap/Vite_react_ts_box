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
      type: 'reference', // 👈 Изменили со string на динамическую связь (reference)
      to: [{ type: 'category' }], // 👈 Указали жесткую связь со схемой категорий в единственном числе
    }),
    defineField({
      name: 'price',
      title: 'Цена ($)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'image',
      title: 'Изображение товара',
      type: 'image',
      options: { hotspot: true }, // Позволит клиенту кадрировать и обрезать фото
    }),
  ],
});
