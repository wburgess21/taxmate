import { defineArrayMember, defineField, defineType } from "sanity";
import { CALCULATOR_OPTIONS } from "./blockContent";

export const post = defineType({
  name: "post",
  title: "Post",
  type: "document",
  groups: [{ name: "content", default: true }, { name: "seo", title: "Search & sharing" }],
  fields: [
    defineField({ name: "title", type: "string", group: "content", validation: (r) => r.required().max(90) }),
    defineField({ name: "slug", type: "slug", group: "content", options: { source: "title", maxLength: 80 }, validation: (r) => r.required() }),
    defineField({ name: "excerpt", type: "text", rows: 3, group: "content", description: "One or two sentences for cards, search results and llms.txt.", validation: (r) => r.required().max(220) }),
    defineField({ name: "category", type: "reference", to: [{ type: "category" }], group: "content" }),
    defineField({ name: "author", type: "reference", to: [{ type: "author" }], group: "content" }),
    defineField({ name: "publishedAt", type: "datetime", group: "content", initialValue: () => new Date().toISOString(), validation: (r) => r.required() }),
    defineField({ name: "updatedAt", type: "datetime", group: "content", description: "Set when you make a meaningful update, such as new tax year figures." }),
    defineField({ name: "taxYear", type: "string", group: "content", description: "The tax year the figures apply to, e.g. 2026/27. Shown on the post." }),
    defineField({
      name: "mainImage",
      title: "Image",
      type: "image",
      group: "content",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Alternative text", validation: (r) => r.required() })],
    }),
    defineField({ name: "body", type: "blockContent", group: "content", validation: (r) => r.required() }),
    defineField({ name: "faq", title: "Questions", type: "array", group: "content", description: "Shown at the end of the post and published as FAQ structured data.", of: [defineArrayMember({ type: "faqItem" })] }),
    defineField({ name: "calculators", title: "Related calculators", type: "array", group: "content", of: [defineArrayMember({ type: "string", options: { list: CALCULATOR_OPTIONS } })], validation: (r) => r.unique().max(3) }),
    defineField({ name: "seoTitle", title: "Search title", type: "string", group: "seo", description: "Defaults to the title. Aim for under 60 characters.", validation: (r) => r.max(70) }),
    defineField({ name: "seoDescription", title: "Search description", type: "text", rows: 3, group: "seo", description: "Defaults to the excerpt. Aim for 140 to 160 characters.", validation: (r) => r.max(170) }),
    defineField({ name: "noindex", title: "Hide from search engines", type: "boolean", group: "seo", initialValue: false }),
  ],
  orderings: [{ title: "Newest", name: "publishedDesc", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: {
    select: { title: "title", date: "publishedAt", media: "mainImage", category: "category.title" },
    prepare: ({ title, date, media, category }) => ({
      title,
      media,
      subtitle: [category, date ? new Date(date).toLocaleDateString("en-GB") : "Draft"].filter(Boolean).join(" · "),
    }),
  },
});
