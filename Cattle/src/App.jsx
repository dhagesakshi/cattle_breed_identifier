import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Chat from './pages/Chat'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is logged in (stored in localStorage)
    const authStatus = localStorage.getItem('isAuthenticated')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true)
    localStorage.setItem('isAuthenticated', 'true')
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('isAuthenticated')
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to="/chat" /> : <Login onLogin={handleLogin} />
          } 
        />
        <Route 
          path="/signup" 
          element={
            isAuthenticated ? <Navigate to="/chat" /> : <Signup onSignup={handleLogin} />
          } 
        />
        <Route 
          path="/chat" 
          element={
            isAuthenticated ? <Chat onLogout={handleLogout} /> : <Navigate to="/login" />
          } 
        />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/chat" : "/login"} />} />
      </Routes>
    </Router>
  )
}

export default App

