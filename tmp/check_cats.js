const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const cats = await prisma.category.findMany({ 
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    console.log(JSON.stringify(cats, null, 2));
  } catch (error) {
    console.error('Prisma Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
