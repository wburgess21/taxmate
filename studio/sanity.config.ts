import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID!;
const dataset = process.env.SANITY_STUDIO_DATASET || "production";

export default defineConfig({
  name: "taxmate",
  title: "TaxMate",
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.documentTypeListItem("post").title("Posts"),
            S.documentTypeListItem("category").title("Categories"),
            S.documentTypeListItem("author").title("Authors"),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
  document: {
    // Opens the published page from the document's menu.
    productionUrl: async (prev, { document }) => {
      const slug = (document as { slug?: { current?: string } }).slug?.current;
      return document._type === "post" && slug ? `https://www.taxmate-app.com/blog/${slug}` : prev;
    },
  },
});
