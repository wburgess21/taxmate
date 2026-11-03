import { defineArrayMember, defineField, defineType } from "sanity";

/** The calculators a post can point to (the site's /calculators/<slug> pages). */
export const CALCULATOR_OPTIONS = [
  { title: "Take-home pay", value: "take-home-pay" },
  { title: "Self-employed tax", value: "self-employed-tax" },
  { title: "Combined income", value: "combined-income" },
  { title: "Home office", value: "home-office" },
  { title: "Business expenses", value: "business-expenses" },
  { title: "Business mileage", value: "business-mileage" },
  { title: "Pension tax relief", value: "pension-contribution" },
  { title: "Payments on account", value: "payments-on-account" },
  { title: "VAT", value: "vat" },
  { title: "Making Tax Digital", value: "making-tax-digital" },
];

export const callout = defineType({
  name: "callout",
  title: "Callout",
  type: "object",
  fields: [
    defineField({ name: "tone", type: "string", options: { list: ["tip", "warning", "example"], layout: "radio", direction: "horizontal" }, initialValue: "tip" }),
    defineField({ name: "title", type: "string" }),
    defineField({ name: "body", type: "text", rows: 3, validation: (r) => r.required() }),
  ],
  preview: { select: { title: "title", subtitle: "body" }, prepare: ({ title, subtitle }) => ({ title: title || "Callout", subtitle }) },
});

export const calculatorLink = defineType({
  name: "calculatorLink",
  title: "Calculator",
  type: "object",
  description: "A card linking to one of the site's free calculators.",
  fields: [defineField({ name: "calculator", type: "string", options: { list: CALCULATOR_OPTIONS }, validation: (r) => r.required() })],
  preview: { select: { title: "calculator" }, prepare: ({ title }) => ({ title: `Calculator: ${title}` }) },
});

export const faqItem = defineType({
  name: "faqItem",
  title: "Question",
  type: "object",
  fields: [
    defineField({ name: "question", type: "string", validation: (r) => r.required() }),
    defineField({ name: "answer", type: "text", rows: 4, validation: (r) => r.required() }),
  ],
  preview: { select: { title: "question", subtitle: "answer" } },
});

export const blockContent = defineType({
  name: "blockContent",
  title: "Body",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading", value: "h2" },
        { title: "Subheading", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [{ title: "Bullet", value: "bullet" }, { title: "Numbered", value: "number" }],
      marks: {
        decorators: [{ title: "Strong", value: "strong" }, { title: "Emphasis", value: "em" }],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              defineField({ name: "href", type: "url", title: "URL", description: "Full URL, or a site path such as /calculators/vat.", validation: (r) => r.uri({ allowRelative: true, scheme: ["http", "https", "mailto"] }) }),
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", type: "string", title: "Alternative text", description: "What the image shows, for screen readers and search.", validation: (r) => r.required() }),
        defineField({ name: "caption", type: "string" }),
      ],
    }),
    defineArrayMember({ type: "callout" }),
    defineArrayMember({ type: "calculatorLink" }),
  ],
});
