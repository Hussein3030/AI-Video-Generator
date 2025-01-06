/** @type { import("drizzle-kit").Config} */

export default {
  schema:"./configs/schema.js",
  dialect:"postgresql",
  dbCredentials:{
    url: "postgresql://neondb_owner:E1l4VYHBUach@ep-long-feather-a58s1pt6.us-east-2.aws.neon.tech/ai-short-video-generator?sslmode=require",
  }
}


