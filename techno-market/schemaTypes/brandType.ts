import { defineField, defineType } from 'sanity'

export const brandType = defineType({
  name: 'brand',
  title: 'Бренды',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Название бренда',
      type: 'string',
      validation: (Rule) => Rule.required().error('Название бренда обязательно'),
    }),
    defineField({
      name: 'slug',
      title: 'Ссылка (Slug)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required().error('Ссылка обязательна для генерации'),
    }),
    defineField({
      name: 'logo',
      title: 'Логотип бренда',
      type: 'image',
      options: {
        hotspot: true, // Позволяет кадрировать логотип прямо в админке
      },
    }),
    defineField({
      name: 'description',
      title: 'Описание бренда',
      type: 'text',
      rows: 3,
    }),
  ],
})
