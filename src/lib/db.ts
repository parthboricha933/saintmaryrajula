import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool } from '@neondatabase/serverless'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const neonUrl = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_9b2xVzACPMOj@ep-winter-band-azhei341-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

const pool = new Pool({ connectionString: neonUrl })
const adapter = new PrismaNeon(pool)

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
