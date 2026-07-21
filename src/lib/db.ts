import { PrismaClient } from '@prisma/client'

const DATABASE_URL = "postgresql://neondb_owner:npg_9b2xVzACPMOj@ep-winter-band-azhei341-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: DATABASE_URL,
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
