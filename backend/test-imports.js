// Test file to verify all routes can be imported
try {
  console.log('Testing route imports...');
  
  const fs = require('fs');
  const path = require('path');
  
  console.log('Current directory:', __dirname);
  console.log('Routes directory exists:', fs.existsSync('./routes'));
  
  if (fs.existsSync('./routes')) {
    const files = fs.readdirSync('./routes');
    console.log('Route files found:', files);
    
    files.forEach(file => {
      if (file.endsWith('.js')) {
        try {
          const routePath = `./routes/${file}`;
          console.log(`Trying to import: ${routePath}`);
          require(routePath);
          console.log(`✓ Successfully imported ${file}`);
        } catch (err) {
          console.error(`✗ Failed to import ${file}:`, err.message);
        }
      }
    });
  }
  
  console.log('Import test completed');
} catch (error) {
  console.error('Test failed:', error);
}