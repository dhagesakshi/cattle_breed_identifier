import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Send, Image as ImageIcon, X, Bot, User, MessageSquare, Plus, Zap, Pencil } from 'lucide-react'

function Chat({ onLogout }) {
  const [chatHistory, setChatHistory] = useState(() => {
    // Load chat history from localStorage
    const saved = localStorage.getItem('chatHistory')
    if (!saved) return []

    try {
      const parsed = JSON.parse(saved)
      if (!Array.isArray(parsed)) return []

      // Revive timestamps so we can safely call toLocale* methods
      return parsed.map((chat) => ({
        ...chat,
        timestamp: chat?.timestamp ? new Date(chat.timestamp) : new Date(),
        messages: Array.isArray(chat.messages)
          ? chat.messages.map((message) => ({
              ...message,
              timestamp: message?.timestamp ? new Date(message.timestamp) : new Date(),
            }))
          : [],
      }))
    } catch (error) {
      console.error('Failed to parse chat history from localStorage', error)
      return []
    }
  })
  const [currentChatId, setCurrentChatId] = useState(null)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hello! I can help you classify Indian cattle and buffalo breeds. Please upload an image to get started.',
      timestamp: new Date(),
    },
  ])
  const [inputText, setInputText] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [editingChatId, setEditingChatId] = useState(null)
  const [editingTitle, setEditingTitle] = useState('')
  const fileInputRef = useRef(null)
  const messagesEndRef = useRef(null)
  const navigate = useNavigate()

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory))
  }, [chatHistory])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const createNewChat = () => {
    const newChatId = Date.now()
    const newChat = {
      id: newChatId,
      title: 'New Chat',
      timestamp: new Date(),
      messages: [
        {
          id: 1,
          type: 'bot',
          text: 'Hello! I can help you classify Indian cattle and buffalo breeds. Please upload an image to get started.',
          timestamp: new Date(),
        },
      ],
    }
    setChatHistory((prev) => [newChat, ...prev])
    setCurrentChatId(newChatId)
    setMessages(newChat.messages)
  }

  const loadChat = (chatId) => {
    const chat = chatHistory.find((c) => c.id === chatId)
    if (chat) {
      setCurrentChatId(chatId)
      setMessages(chat.messages)
    }
  }

  const updateChatTitle = (chatId, newTitle) => {
    setChatHistory((prev) =>
      prev.map((chat) =>
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      )
    )
  }

  const startEditingChatTitle = (chat) => {
    setEditingChatId(chat.id)
    setEditingTitle(chat.title || 'Untitled chat')
  }

  const commitChatTitle = (chatId) => {
    const trimmed = editingTitle.trim()
    updateChatTitle(chatId, trimmed || 'Untitled chat')
    setEditingChatId(null)
  }

  const handleChatTitleKeyDown = (e, chatId) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      commitChatTitle(chatId)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setEditingChatId(null)
      setEditingTitle('')
    }
  }

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedImage(file)
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreview(reader.result)
        }
        reader.readAsDataURL(file)
      } else {
        alert('Please select a valid image file')
      }
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSend = async () => {
    if (!inputText.trim() && !selectedImage) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputText || 'Classify this image',
      image: imagePreview,
      timestamp: new Date(),
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInputText('')
    setIsProcessing(true)
    try {
  if (selectedImage) {
    const formData = new FormData()
    formData.append("image", selectedImage)

    const res = await fetch("http://localhost:8000/predict", {
      method: "POST",
      body: formData
    })

    if (!res.ok) throw new Error("Prediction failed")

    const data = await res.json()

    const botResponse = {
      id: Date.now() + 1,
      type: 'bot',
      text: `I've analyzed the image. Based on the characteristics, this appears to be a ${data.breed}.`,
      timestamp: new Date(),
    }

    const finalMessages = [...newMessages, botResponse]
    setMessages(finalMessages)
    removeImage()

    setChatHistory((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? { ...chat, messages: finalMessages, timestamp: new Date() }
          : chat
      )
    )
  }
} catch (error) {
  setMessages(prev => [
    ...prev,
    {
      id: Date.now() + 2,
      type: 'bot',
      text: "Sorry, I couldn't classify this image. Please try again.",
      timestamp: new Date(),
    }
  ])
} finally {
  setIsProcessing(false)   // ✅ THIS STOPS THE "..."
}
    // Update or create chat in history
    let chatId = currentChatId
    if (!chatId) {
      chatId = Date.now()
      const newChat = {
        id: chatId,
        title: inputText.trim().substring(0, 30) || 'Image Classification',
        timestamp: new Date(),
        messages: newMessages,
      }
      setChatHistory((prev) => [newChat, ...prev])
      setCurrentChatId(chatId)
    } else {
      setChatHistory((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? { ...chat, messages: newMessages, timestamp: new Date() }
            : chat
        )
      )
    }

    // Simulate AI processing
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        text: selectedImage
          ? `I've analyzed the image. Based on the characteristics, this appears to be a ${data.breed}.`
      : 'I can help you classify cattle and buffalo breeds. Please upload an image for classification.',
        timestamp: new Date(),
      }
      const finalMessages = [...newMessages, botResponse]
      setMessages(finalMessages)
      setIsProcessing(false)
      removeImage()

      // Update chat history with bot response
      setChatHistory((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? { ...chat, messages: finalMessages, timestamp: new Date() }
            : chat
        )
      )
    }, 2000)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  const deleteChat = (chatId) => {
    setChatHistory((prev) => prev.filter((chat) => chat.id !== chatId))
    if (currentChatId === chatId) {
      setCurrentChatId(null)
      setMessages([
        {
          id: 1,
          type: 'bot',
          text: 'Hello! I can help you classify Indian cattle and buffalo breeds. Please upload an image to get started.',
          timestamp: new Date(),
        },
      ])
    }
  }

  return (
    <div className="h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex overflow-hidden">
      {/* Sidebar - Chat History */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold text-gray-900">Cattle Classifier</h1>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <button
            onClick={createNewChat}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-4 rounded-lg transition flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Chat
          </button>
        </div>

        {/* Chat History List */}
        <div className="flex-1 overflow-y-auto">
          {chatHistory.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              No chat history. Start a new chat!
            </div>
          ) : (
            <div className="p-2">
              {chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  className={`group relative p-3 rounded-lg mb-2 cursor-pointer transition ${
                    currentChatId === chat.id
                      ? 'bg-primary-50 border border-primary-200'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => loadChat(chat.id)}
                >
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      {editingChatId === chat.id ? (
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onBlur={() => commitChatTitle(chat.id)}
                          onKeyDown={(e) => handleChatTitleKeyDown(e, chat.id)}
                          autoFocus
                          className="w-full text-sm font-medium text-gray-900 border border-primary-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      ) : (
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {chat.title || 'Untitled chat'}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {chat.timestamp.toLocaleDateString()} {chat.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      startEditingChatTitle(chat)
                    }}
                    className="absolute right-8 top-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition"
                    title="Rename chat"
                  >
                    <Pencil className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteChat(chat.id)
                    }}
                    className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition"
                    title="Delete chat"
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <h2 className="text-xl font-bold text-gray-900">
              AI Classification Chat
            </h2>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.type === 'bot' && (
                  <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-900 shadow-md'
                  }`}
                >
                  {message.image && (
                    <div className="mb-2 rounded-lg overflow-hidden">
                      <img
                        src={message.image}
                        alt="Uploaded"
                        className="max-w-full h-auto max-h-64 object-contain"
                      />
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.type === 'user'
                        ? 'text-primary-100'
                        : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                {message.type === 'user' && (
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-gray-700" />
                  </div>
                )}
              </div>
            ))}

            {isProcessing && (
              <div className="flex gap-3 justify-start">
                <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="bg-white rounded-2xl px-4 py-3 shadow-md">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="px-6 pb-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Selected Image
                  </span>
                  <button
                    onClick={removeImage}
                    className="p-1 hover:bg-gray-100 rounded transition"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-full h-auto max-h-48 rounded-lg object-contain mx-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition flex-shrink-0"
                title="Upload Image"
              >
                <ImageIcon className="w-5 h-5 text-gray-700" />
              </button>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message or upload an image to classify..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
              <button
                onClick={handleSend}
                disabled={(!inputText.trim() && !selectedImage) || isProcessing}
                className="p-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition flex-shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat
