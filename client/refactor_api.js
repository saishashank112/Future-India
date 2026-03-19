const fs = require('fs');
const path = require('path');

const projectRoot = 'c:\\Users\\Sai shashank\\OneDrive\\Desktop\\crawlup\\Future India Exim\\client\\src';

const files = [
    'pages/Payment.tsx',
    'pages/MyAccount.tsx',
    'pages/Checkout.tsx',
    'pages/admin/Delivery.tsx',
    'pages/admin/Dashboard.tsx',
    'pages/admin/Invoice.tsx',
    'context/AuthProvider.tsx',
    'pages/admin/Enquiries.tsx',
    'pages/admin/Orders.tsx',
    'pages/admin/Products.tsx',
    'pages/admin/Customers.tsx',
    'context/CartProvider.tsx',
    'pages/admin/Progress.tsx',
    'pages/admin/Reports.tsx',
    'pages/admin/AdminLayout.tsx',
    'pages/admin/Settings.tsx',
    'components/home/ProductShowcase.tsx',
    'pages/Products.tsx',
    'components/layout/Navbar.tsx',
    'components/ui/EnquiryModal.tsx'
];

files.forEach(fileRelPath => {
    const fullPath = path.join(projectRoot, fileRelPath);
    if (!fs.existsSync(fullPath)) {
        console.log(`File not found: ${fullPath}`);
        return;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Determine relative path to config/api
    const depth = fileRelPath.split(/[\\\/]/).length - 1;
    const importPath = depth === 0 ? './config/api' : '../'.repeat(depth) + 'config/api';
    
    const importLine = `import { getApiUrl } from '${importPath}';\n`;
    
    // Case 1: 'http://localhost:5001/api/path'
    const regex1 = /'http:\/\/localhost:5001\/api(\/[^']+)'/g;
    // Case 2: `http://localhost:5001/api/path/${var}`
    const regex2 = /`http:\/\/localhost:5001\/api(\/[^`]+)`/g;

    let modified = false;
    
    if (content.includes('http://localhost:5001/api')) {
        content = content.replace(regex1, (match, p1) => {
            modified = true;
            return `getApiUrl('${p1}')`;
        });
        content = content.replace(regex2, (match, p1) => {
            modified = true;
            return `getApiUrl(\`${p1}\`)`;
        });
    }

    if (modified) {
        // Add import at the top if not present
        if (!content.includes('import { getApiUrl }')) {
            content = importLine + content;
        }
        fs.writeFileSync(fullPath, content);
        console.log(`Updated: ${fileRelPath}`);
    }
});
