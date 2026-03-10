import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { getChatResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

export const GardeningChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hello! I'm your AI gardening assistant. Ask me anything about planting, care, or troubleshooting your garden!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      const response = await getChatResponse(history, userMsg);
      setMessages(prev => [...prev, { role: 'model', text: response || "I'm sorry, I couldn't process that." }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-garden-green text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50"
      >
        <MessageCircle size={32} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-28 right-8 w-[90vw] max-w-[400px] h-[600px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden z-50 border border-black/5"
          >
            <div className="bg-garden-green p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-serif font-bold">Garden Assistant</h3>
                <p className="text-xs opacity-60">Always here to help</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-garden-earth/30">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-garden-leaf text-white' : 'bg-garden-green text-white'}`}>
                      {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-garden-leaf text-white rounded-tr-none' : 'bg-white text-garden-soil rounded-tl-none shadow-sm'}`}>
                      <div className="markdown-body">
                        <Markdown>{msg.text}</Markdown>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3 items-center text-garden-leaf">
                    <Loader2 className="animate-spin" size={16} />
                    <span className="text-xs italic">Tending to your question...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 bg-white border-t border-black/5">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask a question..."
                  className="w-full pl-4 pr-12 py-3 bg-garden-earth/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-garden-green/20"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-garden-green hover:bg-garden-green hover:text-white rounded-lg transition-all disabled:opacity-30"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const X = ({ size, className }: { size?: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
  </svg>
);
