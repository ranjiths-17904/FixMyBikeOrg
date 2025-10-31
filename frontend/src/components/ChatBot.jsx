import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, MapPin, Phone, Clock, Wrench, DollarSign, Star, Shield } from 'lucide-react';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'வணக்கம்! நான் FixMyBike உதவியாளர். இன்று உங்களுக்கு எப்படி உதவ முடியும்? (Hello! I\'m FixMyBike Assistant. How can I help you today?)',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickReplies = [
    { text: 'Book a Service', icon: <Wrench className="h-3 w-3" /> },
    { text: 'Service Prices', icon: <DollarSign className="h-3 w-3" /> },
    { text: 'Find Shop Location', icon: <MapPin className="h-3 w-3" /> },
    // { text: 'Service Status', icon: <Clock className="h-3 w-3" /> },
    { text: 'Contact Support', icon: <Phone className="h-3 w-3" /> },
    // { text: 'Our Services', icon: <Star className="h-3 w-3" /> }
  ];

  const handleQuickReply = (reply) => {
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: reply.text,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    
    // Simulate bot response
    setIsTyping(true);
    setTimeout(() => {
      const botResponse = getBotResponse(reply.text);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const getBotResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('book') || input.includes('service')) {
      return `Great! To book a service with FixMyBike Chennai:

1. Click "Book Services" on our homepage
2. Choose your service type:
   • Wash & Polish - ₹300
   • General Service - ₹800
   • Engine Service - ₹1200
   • Major Repairs - ₹1500+
   • Breakdown Service - ₹1500+

3. Select your preferred location (Shop/Home)
4. Choose date and time
5. Complete payment

Our expert mechanics will take care of your bike! 🏍️`;
    } 
    else if (input.includes('price') || input.includes('cost')) {
      return `Here are our service prices in Chennai:

🛁 Wash & Polish: ₹300
🔧 General Service: ₹800
⚙️ Engine Service: ₹1200
🔨 Major Repairs: ₹1500+
🚨 Breakdown Service: ₹1500+

*Prices may vary based on bike model and service complexity.

We offer competitive rates and quality service! 💰`;
    }
    else if (input.includes('location') || input.includes('shop')) {
      return `📍 FixMyBike Chennai Locations:

🏪 Main Shop: 
   123 Anna Salai, Bike Service Street, Coimbatore - 600001
   📞 +91 73958 60211

🏪 Branch: 
   456 Mount Road, Egmore, Chennai - 600008
   📞 +91 98765 43211

🕒 Operating Hours: 8:00 AM - 8:00 PM (Daily)

Click "Find Shop" to see exact locations on map! 🗺️`;
    } 
    else if (input.includes('status') || input.includes('track')) {
      return `To check your service status:

1. Log into your dashboard
2. Go to "My Bookings" section
3. View real-time updates

Status updates include:
⏳ Pending → Confirmed → In Progress → Completed

You'll also receive SMS/email notifications at each step!

Need immediate help? Call us: +91 7395860211📱`;
    } 
    else if (input.includes('contact') || input.includes('support')) {
      return `📞 Contact FixMyBike Coimbatore:

Customer Support: +91 7395860211
WhatsApp: +91 7395860212
Email: support@fixmybike.com

🕒 Support Hours: 24/7

📍 Address: 123 Bike Service Salai, Coimbatore - 600017

We're here to help you anytime! 🤝`;
    }
    else if (input.includes('services') || input.includes('what do you do')) {
      return `🚀 FixMyBike Coimbatore Services:

🛁 Wash & Polish
   • Complete bike cleaning
   • Polish and waxing
   • Interior cleaning

🔧 General Service
   • Oil change
   • Filter replacement
   • Brake inspection
   • Tire pressure check

⚙️ Engine Service
   • Engine tune-up
   • Carburetor cleaning
   • Spark plug replacement
   • Performance optimization

🔨 Major Repairs
   • Engine overhaul
   • Transmission repair
   • Electrical work
   • Custom modifications

🚨 Breakdown Service
   • 24/7 emergency service
   • On-site repair
   • Towing service

All services with warranty! 🛡️`;
    }
    else if (input.includes('hello') || input.includes('hi') || input.includes('வணக்கம்')) {
      return `வணக்கம்! Hello! 👋

Welcome to FixMyBike Chennai - Your trusted bike service partner in Tamil Nadu!

I can help you with:
• Booking services
• Checking prices
• Finding locations
• Tracking service status
• Contact information

How can I assist you today? 😊`;
    }
    else if (input.includes('warranty') || input.includes('guarantee')) {
      return `🛡️ FixMyBike Warranty Policy:

✅ All services come with 30-day warranty
✅ Genuine parts warranty: 6 months
✅ Labor warranty: 3 months
✅ Free re-service if issues persist

Our commitment to quality ensures your satisfaction! 

For warranty claims, contact: +91 98765 43210`;
    }
    else if (input.includes('payment') || input.includes('pay')) {
      return `💳 Payment Options at FixMyBike:

✅ Cash
✅ UPI (Google Pay, PhonePe, Paytm)
✅ Credit/Debit Cards
✅ Net Banking
✅ EMI available for repairs above ₹5000

Secure and convenient payment methods! 

Book online and pay at service completion. 💰`;
    }
    else {
      return `I'm here to help! Please choose from these options or ask me about:

• Service booking and prices
• Shop locations in Chennai
• Service status tracking
• Contact information
• Our service types
• Payment options
• Warranty information

Or type your question and I'll assist you! 🤖`;
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    
    // Simulate bot response
    setIsTyping(true);
    setTimeout(() => {
      const botResponse = getBotResponse(inputMessage);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
        aria-label="Toggle chat"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-5 w-5" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-30 w-80 h-80 bg-white rounded-xl shadow-xl border border-gray-200 flex flex-col">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-3 rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-semibold">FixMyBike Assistant</h3>
                <p className="text-sm text-green-100">Online • Coimbatore</p>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <div className="grid grid-cols-2 gap-2">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(reply)}
                    className="flex items-center justify-center space-x-2 p-2 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    {reply.icon}
                    <span className="truncate">{reply.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
