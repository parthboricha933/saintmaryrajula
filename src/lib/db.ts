import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Use env variable if available, otherwise use the hardcoded Neon URL
const databaseUrl = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_9b2xVzACPMOj@ep-winter-band-azhei341-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: databaseUrl,
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
