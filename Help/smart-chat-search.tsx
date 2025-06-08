import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, Send, Clock, Check, CheckCheck } from 'lucide-react';

const SmartChatSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [highlightedMessages, setHighlightedMessages] = useState(new Set());
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'alice',
      text: 'Hey Bob! How was your weekend trip to the mountains?',
      time: '10:30 AM',
      status: 'read'
    },
    {
      id: 2,
      sender: 'bob',
      text: 'It was absolutely amazing! The hiking trails were breathtaking. We reached the summit just as the sun was setting.',
      time: '10:32 AM',
      status: 'read'
    },
    {
      id: 3,
      sender: 'alice',
      text: 'That sounds incredible! Did you take any photos?',
      time: '10:33 AM',
      status: 'read'
    },
    {
      id: 4,
      sender: 'bob',
      text: 'Of course! I took hundreds of photos. The view from the top was spectacular. I\'ll share them with you later.',
      time: '10:35 AM',
      status: 'read'
    },
    {
      id: 5,
      sender: 'alice',
      text: 'Can\'t wait to see them! By the way, are you free for lunch tomorrow? I want to discuss the new project.',
      time: '10:40 AM',
      status: 'read'
    },
    {
      id: 6,
      sender: 'bob',
      text: 'Sure! How about that Italian restaurant we went to last month? Their pasta was delicious.',
      time: '10:42 AM',
      status: 'read'
    },
    {
      id: 7,
      sender: 'alice',
      text: 'Perfect! Let\'s meet at 1 PM. I have some exciting ideas about the mobile app development.',
      time: '10:45 AM',
      status: 'read'
    },
    {
      id: 8,
      sender: 'bob',
      text: 'Great! I\'ve been working on some wireframes for the user interface. I think you\'ll love the design concepts.',
      time: '10:47 AM',
      status: 'read'
    },
    {
      id: 9,
      sender: 'alice',
      text: 'That\'s fantastic! Our collaboration always produces the best results. See you tomorrow!',
      time: '10:50 AM',
      status: 'read'
    },
    {
      id: 10,
      sender: 'bob',
      text: 'Absolutely! Looking forward to it. Have a great evening, Alice!',
      time: '10:52 AM',
      status: 'read'
    }
  ]);

  const sampleMessages = [
    "What do you think about the weather today?",
    "I just finished reading a great book about artificial intelligence.",
    "Should we order pizza for dinner tonight?",
    "The meeting went really well, thanks for your input!",
    "I'm excited about the upcoming conference next week.",
    "Can you help me with the presentation slides?",
    "The coffee shop on Main Street has amazing espresso.",
    "I learned a new programming language over the weekend.",
    "Let's plan our vacation for next summer.",
    "The movie we watched last night was incredible!"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setHighlightedMessages(new Set());
      return;
    }

    const matchingIds = new Set();
    messages.forEach(message => {
      if (message.text.toLowerCase().includes(term.toLowerCase())) {
        matchingIds.add(message.id);
      }
    });
    setHighlightedMessages(matchingIds);
  };

  const generateRandomMessage = () => {
    const randomMessage = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
    const isAlice = Math.random() > 0.5;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const newMsg = {
      id: messages.length + 1,
      sender: isAlice ? 'alice' : 'bob',
      text: randomMessage,
      time: timeStr,
      status: 'sent'
    };

    setMessages(prev => [...prev, newMsg]);
  };

  const sendMessage = () => {
    if (newMessage.trim() === '') return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const newMsg = {
      id: messages.length + 1,
      sender: 'alice', // Default to Alice for manual messages
      text: newMessage,
      time: timeStr,
      status: 'sent'
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
  };

  const highlightText = (text, searchTerm) => {
    if (!searchTerm) return text;
    
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === searchTerm.toLowerCase() 
        ? <mark key={index} className="bg-yellow-300 text-black rounded px-1">{part}</mark>
        : part
    );
  };

  const MessageStatus = ({ status }) => {
    if (status === 'sent') return <Check className="w-4 h-4 text-gray-400" />;
    if (status === 'delivered') return <CheckCheck className="w-4 h-4 text-gray-400" />;
    if (status === 'read') return <CheckCheck className="w-4 h-4 text-blue-500" />;
    return null;
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-green-600 text-white p-4 shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Smart Chat History Search Engine</h1>
        
        {/* Search Bar */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 w-5 h-5" />
          <input
            type="text"
            placeholder="Search through chat history..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-300"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={generateRandomMessage}
            className="flex items-center gap-2 bg-green-700 hover:bg-green-800 px-4 py-2 rounded-full transition-colors"
          >
            <Plus className="w-4 h-4" />
            Generate Chat
          </button>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto px-4 py-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'alice' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm ${
                message.sender === 'alice'
                  ? 'bg-green-500 text-white rounded-br-md'
                  : 'bg-white text-gray-800 rounded-bl-md'
              } ${
                highlightedMessages.has(message.id) ? 'ring-2 ring-yellow-400 ring-opacity-75' : ''
              }`}>
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <div className={`font-medium text-sm mb-1 ${
                      message.sender === 'alice' ? 'text-green-100' : 'text-green-600'
                    }`}>
                      {message.sender === 'alice' ? 'Alice' : 'Bob'}
                    </div>
                    <p className="text-sm leading-relaxed">
                      {highlightText(message.text, searchTerm)}
                    </p>
                    <div className={`flex items-center justify-end gap-1 mt-2 text-xs ${
                      message.sender === 'alice' ? 'text-green-100' : 'text-gray-500'
                    }`}>
                      <Clock className="w-3 h-3" />
                      {message.time}
                      {message.sender === 'alice' && (
                        <MessageStatus status={message.status} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message as Alice..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button
            onClick={sendMessage}
            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search Results Info */}
      {searchTerm && (
        <div className="bg-yellow-50 border-t border-yellow-200 px-4 py-2">
          <p className="text-sm text-yellow-800 text-center">
            {highlightedMessages.size > 0 
              ? `Found ${highlightedMessages.size} message${highlightedMessages.size === 1 ? '' : 's'} containing "${searchTerm}"`
              : `No messages found containing "${searchTerm}"`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default SmartChatSearch;