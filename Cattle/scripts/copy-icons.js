import { copyFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

const iconsDir = join(projectRoot, 'public/icons')
const distIconsDir = join(projectRoot, 'dist/icons')

// Create dist/icons directory if it doesn't exist
if (!existsSync(distIconsDir)) {
  mkdirSync(distIconsDir, { recursive: true })
}

// Copy icon files if they exist
const iconSizes = [16, 48, 128]
let copiedCount = 0

iconSizes.forEach(size => {
  const src = join(iconsDir, `icon${size}.png`)
  const dest = join(distIconsDir, `icon${size}.png`)
  
  if (existsSync(src)) {
    try {
      copyFileSync(src, dest)
      console.log(`✓ Copied icon${size}.png`)
      copiedCount++
    } catch (err) {
      console.error(`Error copying icon${size}.png:`, err)
    }
  } else {
    console.warn(`⚠ icon${size}.png not found in ${iconsDir}`)
    console.warn(`  Create it or use scripts/create-icons.html to generate icons`)
  }
})

if (copiedCount === 0) {
  console.log('\n⚠ No icons found. The extension will work but may show default Chrome icons.')
  console.log('  To create icons:')
  console.log('  1. Open generate-icons.html in a browser (created in project root)')
  console.log('  2. Click the download buttons for each size')
  console.log('  3. Save them in public/icons/ directory')
  console.log('  4. Run npm run build again')
  console.log('  Note: Icons are optional - extension works without them!\n')
} else {
  console.log(`\n✓ Successfully copied ${copiedCount} icon(s) to dist/icons/\n`)
}

