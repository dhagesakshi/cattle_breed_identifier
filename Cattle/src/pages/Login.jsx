import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogIn, Mail, Lock, Zap, User } from 'lucide-react'

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Demo credentials
  const DEMO_EMAIL = 'demo@cattle.com'
  const DEMO_PASSWORD = 'demo123'

  const handleDemoLogin = () => {
    setEmail(DEMO_EMAIL)
    setPassword(DEMO_PASSWORD)
    setError('')
    // Auto login after a brief moment
    setTimeout(() => {
      onLogin()
      navigate('/chat')
    }, 100)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // Simple validation
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    // Check for demo credentials or allow any login for demo purposes
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      onLogin()
      navigate('/chat')
    } else {
      // For demo purposes, accept any email/password combination
      // In production, this would validate against a backend
      onLogin()
      navigate('/chat')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-full mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Cattle Classifier
            </h1>
            <p className="text-gray-600">
              Classify Indian Cattle & Buffalo Breeds
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              Sign In
            </button>
          </form>

          {/* Demo Account Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="bg-primary-50 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-semibold text-primary-900">Demo Account</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">
                Email: <span className="font-mono text-primary-700">{DEMO_EMAIL}</span>
              </p>
              <p className="text-xs text-gray-600 mb-3">
                Password: <span className="font-mono text-primary-700">{DEMO_PASSWORD}</span>
              </p>
              <button
                onClick={handleDemoLogin}
                className="w-full bg-primary-100 hover:bg-primary-200 text-primary-700 font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2 text-sm"
              >
                <Zap className="w-4 h-4" />
                Quick Login with Demo Account
              </button>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

