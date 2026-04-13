import path from 'path'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  earlyAccess: true,
  schema: path.join('prisma', 'schema.prisma'),
  datasource: {
    url: 'postgresql://sravyagorinta@localhost:5432/aijobtracker',
  },
  migrate: {
    adapter: async () => {
      const { PrismaPg } = await import('@prisma/adapter-pg')
      const { Pool } = await import('pg')
      const pool = new Pool({
        connectionString: 'postgresql://sravyagorinta@localhost:5432/aijobtracker',
      })
      return new PrismaPg(pool)
    },
  },
})