import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create Admin
  const hashedPassword = await bcrypt.hash('SrushtiAdmin@2024', 12)
  await prisma.admin.upsert({
    where: { email: 'admin@srushtipublication.com' },
    update: {},
    create: { email: 'admin@srushtipublication.com', password: hashedPassword, name: 'Admin' }
  })
  console.log('✅ Admin created')

  // Create Categories
  const categories = [
    { name: 'ಸಾಹಿತ್ಯ', nameEn: 'Literature', slug: 'literature', sortOrder: 1 },
    { name: 'ಶೈಕ್ಷಣಿಕ', nameEn: 'Academic', slug: 'academic', sortOrder: 2 },
    { name: 'ಮಕ್ಕಳ ಪುಸ್ತಕಗಳು', nameEn: 'Children', slug: 'children', sortOrder: 3 },
    { name: 'ಪರೀಕ್ಷಾ ಮಾರ್ಗದರ್ಶಿ', nameEn: 'Exam Guides', slug: 'exam-guides', sortOrder: 4 },
    { name: 'ಇತರೆ', nameEn: 'Others', slug: 'others', sortOrder: 5 }
  ]

  for (const cat of categories) {
    await prisma.category.upsert({ where: { slug: cat.slug }, update: {}, create: cat })
  }
  console.log('✅ Categories created')

  // Create Site Settings
  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      businessName: 'ಸೃಷ್ಟಿ ಪಬ್ಲಿಕೇಷನ್ಸ್',
      businessNameEn: 'Srushti Publications',
      tagline: 'ಕನ್ನಡ ಅನುವಾದ ಪುಸ್ತಕಗಳ ಜಗತ್ತು',
      email: 'srushtinagesh@gmail.com',
      phone: '+91 98450 96668',
      address: 'ಬೆಂಗಳೂರು, ಕರ್ನಾಟಕ',
      gstNumber: '29XXXXX1234X1Z5',
      defaultShipping: 50,
      freeShippingMin: 500,
      estimatedDays: '5-7 ದಿನಗಳು'
    }
  })
  console.log('✅ Site settings created')

  // Seed Books
  const dbCategories = await prisma.category.findMany()
  const catMap = Object.fromEntries(dbCategories.map(c => [c.slug, c.id]))

  const authors = ['ಕುವೆಂಪು', 'ಡಿ.ವಿ. ಗುಂಡಪ್ಪ', 'ಶಿವರಾಮ ಕಾರಂತ', 'ಮಾಸ್ತಿ', 'ಭೈರಪ್ಪ', 'ಪೂರ್ಣಚಂದ್ರ ತೇಜಸ್ವಿ', 'ಯಂಡಮೂರಿ', 'ಅನಂತಮೂರ್ತಿ', 'ಗಿರೀಶ್ ಕಾರ್ನಾಡ್', 'ಚಂದ್ರಶೇಖರ ಕಂಬಾರ']
  const bookTitles = [
    'ಮಲೆಗಳಲ್ಲಿ ಮದುಮಗಳು', 'ಕಾನೂರು ಹೆಗ್ಗಡತಿ', 'ಮೂಕಜ್ಜಿಯ ಕನಸುಗಳು', 'ಚೋಮನ ದುಡಿ', 'ಸಂಸ್ಕಾರ', 'ಕರ್ವಾಲೊ', 'ಪರ್ವ', 'ಮಂದ್ರ', 'ತುಘಲಕ್', 'ಸಿರಿಸಂಪಿಗೆ',
    'ಕರ್ನಾಟಕ ಇತಿಹಾಸ', 'ಕನ್ನಡ ವ್ಯಾಕರಣ', 'ಭಾರತದ ಸಂವಿಧಾನ', 'ಸಾಮಾನ್ಯ ಜ್ಞಾನ', 'ಗಣಿತ ಮಾರ್ಗದರ್ಶಿ', 'ವಿಜ್ಞಾನ ಪಠ್ಯ', 'ಇತಿಹಾಸ ಅಧ್ಯಯನ', 'ಭೂಗೋಳಶಾಸ್ತ್ರ', 'ಅರ್ಥಶಾಸ್ತ್ರ', 'ರಾಜ್ಯಶಾಸ್ತ್ರ',
    'ಪಂಚತಂತ್ರ ಕಥೆಗಳು', 'ಈಸೋಪನ ನೀತಿಕಥೆಗಳು', 'ತೆನಾಲಿ ರಾಮಕೃಷ್ಣ', 'ವಿಕ್ರಮ ಬೇತಾಳ', 'ಅಕ್ಬರ್ ಬೀರ್ಬಲ್', 'ಜಾತಕ ಕಥೆಗಳು', 'ಬಾಲ ಕಥೆಗಳು', 'ನೀತಿ ಕಥೆಗಳು', 'ಪ್ರೇರಣಾದಾಯಕ ಕಥೆಗಳು', 'ರಾಮಾಯಣ ಕಥೆಗಳು'
  ]

  for (let i = 0; i < 200; i++) {
    const catSlug = ['literature', 'academic', 'children', 'exam-guides', 'others'][i % 5]
    const mrp = Math.floor(Math.random() * 600) + 150
    const discount = Math.random() > 0.5 ? Math.floor(Math.random() * 25) + 5 : 0
    const sellingPrice = Math.round(mrp * (1 - discount / 100))
    
    await prisma.book.create({
      data: {
        title: bookTitles[i % bookTitles.length] + (i >= bookTitles.length ? ` - ಭಾಗ ${Math.floor(i / bookTitles.length) + 1}` : ''),
        slug: `book-${i + 1}-${Date.now()}`,
        author: authors[i % authors.length],
        description: 'ಈ ಪುಸ್ತಕವು ಕನ್ನಡ ಓದುಗರಿಗೆ ಅತ್ಯುತ್ತಮ ಆಯ್ಕೆಯಾಗಿದೆ.',
        coverImage: '/placeholder-book.jpg',
        additionalImages: [],
        mrp, sellingPrice, discount,
        stockQuantity: Math.floor(Math.random() * 100) + 5,
        pages: Math.floor(Math.random() * 400) + 100,
        publicationYear: 2020 + (i % 5),
        isNewRelease: i % 7 === 0,
        isBestSeller: i % 10 === 0,
        isOnSale: discount > 0,
        salesCount: Math.floor(Math.random() * 200),
        categoryId: catMap[catSlug]
      }
    })
  }
  console.log('✅ 200 Books seeded')
  console.log('🎉 Database seeded successfully!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
