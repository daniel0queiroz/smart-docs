import { config } from 'dotenv'
import { defineConfig, env } from 'prisma/config'

// Load .env.local file
config({ path: '.env.local' })

export default defineConfig({
  schema: 'src/prisma/schema.prisma',
  migrations: {
    path: 'src/prisma/migrations',
    seed: 'tsx ./prisma/seed.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
})