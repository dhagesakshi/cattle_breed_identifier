import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

// Create a simple SVG icon and convert to data URL
// Since we can't easily create PNG without canvas library, we'll create a simple HTML file
// that can be used to generate icons, or we'll update manifest to not require icons

const iconsDir = join(projectRoot, 'public/icons')
const distIconsDir = join(projectRoot, 'dist/icons')

// Create directories
if (!existsSync(iconsDir)) {
  mkdirSync(iconsDir, { recursive: true })
}
if (!existsSync(distIconsDir)) {
  mkdirSync(distIconsDir, { recursive: true })
}

// Create a simple HTML file that generates icons using canvas
const iconGeneratorHTML = `<!DOCTYPE html>
<html>
<head>
    <title>Generate Extension Icons</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        canvas { border: 1px solid #ccc; margin: 10px; }
        button { padding: 10px 20px; margin: 5px; cursor: pointer; }
    </style>
</head>
<body>
    <h1>Extension Icon Generator</h1>
    <p>Click the buttons below to download icons. Save them in the <code>public/icons/</code> folder.</p>
    
    <div id="canvases"></div>
    
    <script>
        const sizes = [16, 48, 128];
        const container = document.getElementById('canvases');
        
        sizes.forEach(size => {
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            canvas.style.width = size * 2 + 'px';
            canvas.style.height = size * 2 + 'px';
            const ctx = canvas.getContext('2d');
            
            // Draw icon
            ctx.fillStyle = '#0ea5e9';
            ctx.fillRect(0, 0, size, size);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold ' + (size * 0.6) + 'px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('CC', size/2, size/2);
            
            const div = document.createElement('div');
            div.innerHTML = '<p>icon' + size + '.png (' + size + 'x' + size + ')</p>';
            div.appendChild(canvas);
            
            const button = document.createElement('button');
            button.textContent = 'Download icon' + size + '.png';
            button.onclick = () => {
                canvas.toBlob(blob => {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'icon' + size + '.png';
                    a.click();
                    URL.revokeObjectURL(url);
                });
            };
            div.appendChild(button);
            container.appendChild(div);
        });
    </script>
</body>
</html>`

writeFileSync(join(projectRoot, 'generate-icons.html'), iconGeneratorHTML)
console.log('✓ Created generate-icons.html')
console.log('  Open this file in a browser to generate and download icons')
console.log('  Save the downloaded files to public/icons/ directory')

