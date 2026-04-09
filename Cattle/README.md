# Indian Cattle & Buffalo Classifier 

An AI-powered frontend application for classifying Indian cattle and buffalo breeds. This application features a modern, user-friendly interface with authentication and an interactive chat system for image-based breed classification.

## Features

- 🔐 **Authentication**: Login and Signup pages with form validation
- 🏠 **Home Page**: Beautiful landing page with feature highlights
- 💬 **AI Chat Interface**: Interactive chat with image upload capability 
- 🎨 **Modern UI**: Built with React, Tailwind CSS, and Lucide icons
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices 

## Tech Stack 

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
bash
npm install


2. Start the development server:
bash
npm run dev


3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

bash
npm run build


The built files will be in the `dist` directory.

## Project Structure


Cattle/
├── src/
│   ├── pages/
│   │   ├── Login.jsx      # Login page
│   │   ├── Signup.jsx     # Signup page
│   │   ├── Home.jsx       # Home page
│   │   └── Chat.jsx       # Chat interface with image upload
│   ├── App.jsx            # Main app component with routing
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js


## Usage

1. **Login/Signup**: Start by creating an account or logging in
2. **Home Page**: After authentication, you'll be redirected to the home page
3. **Chat Interface**: Click "Start Classifying" to open the chat interface
4. **Upload Image**: Click the image icon to upload a cattle/buffalo image
5. **Get Classification**: The AI will analyze and classify the breed

## Notes

- This is a frontend-only application. Authentication is simulated using localStorage.
- The AI classification is currently simulated. In a production app, you would integrate with a backend API.
- Image uploads are handled client-side. For production, implement proper file upload to a server.

## License

MIT

