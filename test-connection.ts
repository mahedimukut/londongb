// test-connection.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testConnection() {
  try {
    await prisma.$connect()
    console.log('✅ Database connected successfully!')
    
    // Test a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Query test passed:', result)
    
    await prisma.$disconnect()
  } catch (error) {
    console.error('❌ Database connection failed:', error)
  }
}

testConnection()