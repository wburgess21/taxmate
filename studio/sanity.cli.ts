import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET || "production",
  },
  // Deployed at https://taxmate.sanity.studio with `npm run deploy`.
  studioHost: "taxmate",
  deployment: { autoUpdates: true },
});
