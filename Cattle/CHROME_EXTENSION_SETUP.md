# Chrome Extension Setup Guide

## Step 1: Build the Extension

Run the build command to create the extension files:

```bash
npm run build
```

This will create a `dist` folder with all the necessary files.

## Step 2: Create Extension Icons

You need to create icon files for the extension. Create these files in the `public/icons/` directory:

- `icon16.png` - 16x16 pixels
- `icon48.png` - 48x48 pixels  
- `icon128.png` - 128x128 pixels

Or you can use any image editor to create simple icons. For now, you can use placeholder images or create simple colored squares.

**Quick Solution:** You can create simple icons using an online tool or use these commands (if you have ImageMagick installed):
- Or just create simple PNG files with your logo/brand

## Step 3: Copy Icons to Dist Folder

After building, copy the icons folder to the dist directory:

```bash
# Windows PowerShell
Copy-Item -Path "public\icons" -Destination "dist\icons" -Recurse

# Or manually copy the icons folder from public/icons to dist/icons
```

## Step 4: Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in the top right)
3. Click **Load unpacked**
4. Select the `dist` folder from your project directory
5. The extension should now appear in your extensions list

## Step 5: Access the Extension

- Click the extension icon in the Chrome toolbar
- The popup will open with your Cattle Classifier app

## Troubleshooting

### If the extension doesn't load:
- Make sure all files are in the `dist` folder
- Check that `manifest.json` is in the `dist` folder
- Verify icons exist in `dist/icons/`
- Check the browser console for errors (right-click extension icon → Inspect popup)

### If you see blank screen:
- Open Developer Tools (right-click extension popup → Inspect)
- Check the Console tab for errors
- Make sure all assets are loading correctly

## Development Workflow

For development, you can:
1. Make changes to your code
2. Run `npm run build` to rebuild
3. Go to `chrome://extensions/`
4. Click the refresh icon on your extension card
5. Test your changes

## Notes

- The extension uses HashRouter instead of BrowserRouter (required for Chrome extensions)
- localStorage works the same way in extensions
- The extension popup has a default size, but you can adjust it in the CSS if needed

