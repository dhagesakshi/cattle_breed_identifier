import { useNavigate } from 'react-router-dom'
import { LogOut, MessageCircle, Zap, Sparkles } from 'lucide-react'

function Home({ onLogout }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Cattle Classifier
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-primary-600 transition"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-500 rounded-full mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Cattle Classification
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Identify and classify Indian cattle and buffalo breeds using advanced AI technology.
            Upload an image and get instant breed identification.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Multiple Breeds
            </h3>
            <p className="text-gray-600">
              Classify various Indian cattle and buffalo breeds with high accuracy.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              AI-Powered
            </h3>
            <p className="text-gray-600">
              Advanced machine learning algorithms for precise breed identification.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Interactive Chat
            </h3>
            <p className="text-gray-600">
              Chat with our AI assistant and upload images for classification.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={() => navigate('/chat')}
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 px-8 rounded-lg transition duration-200 flex items-center gap-3 mx-auto text-lg shadow-lg hover:shadow-xl"
          >
            <MessageCircle className="w-6 h-6" />
            Start Classifying
          </button>
        </div>

        {/* Popular Breeds Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Popular Indian Breeds
          </h3>
          <div className="grid md:grid-cols-4 gap-4">
            {['Gir', 'Sahiwal', 'Murrah', 'Jaffrabadi'].map((breed) => (
              <div
                key={breed}
                className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-8 h-8 text-primary-600" />
                </div>
                <h4 className="font-semibold text-gray-900">{breed}</h4>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home

