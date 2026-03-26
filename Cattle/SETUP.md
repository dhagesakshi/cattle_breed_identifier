# Setup Instructions

## If you see a blank screen, follow these steps:

### Step 1: Check if Node.js is installed
Open PowerShell or Command Prompt and run:
```bash
node --version
npm --version
```

If these commands don't work, you need to install Node.js first:
- Download from: https://nodejs.org/
- Install the LTS version
- Restart your terminal after installation

### Step 2: Install Dependencies
Navigate to the project folder and run:
```bash
cd "C:\Users\ayush\OneDrive\Desktop\Cattle"
npm install
```

### Step 3: Start the Development Server
```bash
npm run dev
```

You should see output like:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 4: Open in Browser
Open your browser and go to: **http://localhost:5173**

## Common Issues:

1. **Blank screen**: Make sure you're accessing `http://localhost:5173` and NOT opening `index.html` directly
2. **npm not found**: Install Node.js from nodejs.org
3. **Port already in use**: Vite will automatically use the next available port (5174, 5175, etc.)

## If you still see nothing:

1. Open browser Developer Tools (F12)
2. Check the Console tab for any errors
3. Check the Network tab to see if files are loading

