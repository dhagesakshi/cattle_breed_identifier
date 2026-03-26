# Chrome Extension Setup

## Quick Start

### 1. Build the Extension

```bash
npm run build
```

This will:
- Build your React app
- Copy `manifest.json` to the `dist` folder
- Copy icon files (if they exist)

### 2. Create Icons (Optional but Recommended)

The extension needs icon files. You have two options:

**Option A: Use the Icon Generator**
1. Open `scripts/create-icons.html` in your browser
2. Click the download buttons for each size (16x16, 48x48, 128x128)
3. Save the downloaded files to `public/icons/` directory
4. Run `npm run build` again

**Option B: Create Your Own Icons**
- Create PNG files: `icon16.png`, `icon48.png`, `icon128.png`
- Save them in `public/icons/` directory
- Run `npm run build` again

### 3. Load Extension in Chrome

1. Open Chrome
2. Go to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top right)
4. Click **Load unpacked**
5. Select the `dist` folder from your project
6. The extension is now installed!

### 4. Use the Extension

- Click the extension icon in Chrome toolbar
- The popup will open with your Cattle Classifier app
- Login with demo credentials: `demo@cattle.com` / `demo123`

## Development

For development, you can still use:

```bash
npm run dev
```

This runs the app in development mode (not as extension).

To test extension changes:
1. Make your code changes
2. Run `npm run build`
3. Go to `chrome://extensions/`
4. Click the refresh icon on your extension
5. Test the changes

## Extension Features

- ✅ Works as Chrome extension popup
- ✅ Chat history saved in localStorage
- ✅ All features from web version
- ✅ HashRouter for extension compatibility

## Troubleshooting

**Extension shows blank page:**
- Open Developer Tools: Right-click extension icon → Inspect popup
- Check Console for errors
- Make sure all files built correctly

**Icons not showing:**
- Check that icon files exist in `dist/icons/`
- Verify icon paths in `manifest.json`
- Extension will work without icons, just shows default Chrome icon

**Build errors:**
- Make sure all dependencies are installed: `npm install`
- Check that Node.js version is compatible

## File Structure

```
Cattle/
├── dist/                 # Built extension (load this in Chrome)
│   ├── index.html
│   ├── manifest.json
│   ├── assets/
│   └── icons/
├── public/
│   └── icons/           # Place your icon files here
├── src/                 # Source code
└── manifest.json        # Extension manifest
```

