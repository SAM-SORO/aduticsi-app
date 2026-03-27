import { config } from "dotenv";
import { defineConfig } from "@prisma/config";

// Load .env.local file
config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL,
    // @ts-expect-error - directUrl is required by Prisma CLI but may not be in types yet
    directUrl: process.env.DIRECT_URL,
  },
});
