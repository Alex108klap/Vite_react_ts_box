import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'category',
  title: 'Категории',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Название категории',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug (Ссылка)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
  ],
})
