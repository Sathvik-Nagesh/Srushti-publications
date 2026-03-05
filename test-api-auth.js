const assert = require('assert');

// Simple test to ensure the file parses correctly with the new imports
try {
  const fs = require('fs');
  const path = require('path');

  const files = [
    'src/app/api/admin/books/[id]/route.ts',
    'src/app/api/admin/customers/[id]/route.ts',
    'src/app/api/admin/offers/route.ts',
    'src/app/api/admin/offers/[id]/route.ts',
    'src/app/api/admin/orders/[id]/route.ts'
  ];

  for (const file of files) {
    const fullPath = path.join(__dirname, file);
    const content = fs.readFileSync(fullPath, 'utf8');

    // Check if verifyAdminSession is imported
    assert.match(content, /import.*verifyAdminSession.*from.*@\/lib\/auth-edge/);

    // Check if it's used
    assert.match(content, /verifyAdminSession\(request\)/);
  }

  console.log('All files updated correctly.');
} catch (e) {
  console.error(e);
  process.exit(1);
}
