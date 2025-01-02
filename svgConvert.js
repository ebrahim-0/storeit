const fs = require('fs');
const path = require('path');

// Directory containing SVG files
const svgDir = path.join(__dirname, "public/assets/icons"); // Update with your SVG folder path

// Output file for the SVG sprite
const outputFile = path.join(__dirname, 'public/sprite.svg');

// Read all SVG files from the directory
fs.readdir(svgDir, (err, files) => {
  if (err) {
    console.error('Error reading SVG directory:', err);
    return;
  }

  const svgSymbols = files
    .filter(file => path.extname(file).toLowerCase() === '.svg') // Only process .svg files
    .map(file => {
      const filePath = path.join(svgDir, file);
      const svgContent = fs.readFileSync(filePath, 'utf8');

      // Match <svg> opening tag and extract attributes
      const svgAttributesMatch = svgContent.match(/<svg([^>]*)>/i);
      if (!svgAttributesMatch) {
        console.warn(`Invalid SVG file: ${file}`);
        return '';
      }

      const svgAttributes = svgAttributesMatch[1]
        .replace(/xmlns="[^"]*"/g, '') // Remove the xmlns attribute
        .trim();

      // Extract content between <svg> and </svg>
      const svgInnerContent = svgContent.replace(/<svg[^>]*>/i, '').replace(/<\/svg>/i, '').trim();

      const id = path.basename(file, '.svg'); // Use the file name without extension as the ID

      // Wrap SVG content into a <symbol>
      return `
        <symbol id="${id}" ${svgAttributes}>
          ${svgInnerContent}
        </symbol>
      `.trim();
    })
    .filter(Boolean);

  // Create the final sprite file
  const spriteContent = `
    <?xml version="1.0" encoding="UTF-8"?>
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="0" height="0">
      ${svgSymbols.join('\n')}
    </svg>
  `.trim();

  // Write the sprite to the output file
  fs.writeFileSync(outputFile, spriteContent, 'utf8');
  console.log(`SVG sprite created at: ${outputFile}`);
});
