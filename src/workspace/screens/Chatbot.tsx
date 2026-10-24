import { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, ArrowLeft, Loader2, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useSafeBack } from '../lib/utils';
import { coursesContent } from '../data/coursesContent';
import { learningContent } from '../data/learningContent';
import { shortcutsData } from '../data/shortcutsData';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const SECURE_BACKEND_URL = (import.meta.env.VITE_AI_BACKEND_URL || '').trim();

export function Chatbot() {
  const goBack = useSafeBack('/workspace/home');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your offline learning assistant. I know everything about the courses, PDFs, and shortcuts in this app. Ask me anything!",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Ensure any legacy client-side key in localStorage is removed for security compliance
  useEffect(() => {
    localStorage.removeItem('inspire_gemini_api_key');
  }, []);

  const generateOfflineResponse = (query: string): string => {
    const q = query.toLowerCase();

    // 1. Check Shortcuts
    if (q.includes('shortcut') || q.includes('key')) {
      const cleaned = q.replace(/shortcut|key|how to|what is the/gi, '').trim();
      const matchedShortcuts = shortcutsData.filter(
        s =>
          (cleaned && s.description.toLowerCase().includes(cleaned)) ||
          s.keys.toLowerCase().includes(q)
      );
      if (matchedShortcuts.length > 0) {
        return `Here are some shortcuts I found:\n${matchedShortcuts
          .slice(0, 5)
          .map(s => `- **${s.keys}**: ${s.description} (${s.category})`)
          .join('\n')}`;
      }
    }

    // 2. Check Courses
    for (const course of coursesContent) {
      if (course.title.toLowerCase().includes(q) || course.description.toLowerCase().includes(q)) {
        return `I found information in the course **${course.title}**. It covers: ${course.description}. It has ${course.chapters.length} chapters.`;
      }
      for (const chapter of course.chapters) {
        if (chapter.title.toLowerCase().includes(q)) {
          return `In the course **${course.title}**, there is a chapter called **${chapter.title}**.`;
        }
        for (const topic of chapter.topics) {
          if (topic.title.toLowerCase().includes(q) || topic.content.toLowerCase().includes(q)) {
            const snippet = topic.content.substring(0, 220) + '...';
            return `From **${course.title}** > **${chapter.title}** > **${topic.title}**:\n${snippet}`;
          }
        }
      }
    }

    // 3. Check Learning PDFs
    for (const pdf of learningContent) {
      if (pdf.title.toLowerCase().includes(q) || pdf.category.toLowerCase().includes(q)) {
        return `I found a section called **${pdf.title}** in the PDFs. Category: ${pdf.category}.`;
      }
      for (const section of pdf.content) {
        if (section.subtitle.toLowerCase().includes(q) || section.text.toLowerCase().includes(q)) {
          const snippet = section.text.substring(0, 220) + '...';
          return `From PDF **${pdf.title}** > **${section.subtitle}**:\n${snippet}`;
        }
      }
    }

    if (q.includes('hello') || q.includes('hi') || q.includes('salam') || q.includes('assalam')) {
      return 'Hello! How can I help you with your studies today? Ask me about any course topic, client hunting, payment rules, or keyboard shortcuts.';
    }

    return "I couldn't find a specific answer to that in the app's offline data. Try asking about specific course topics (e.g., Excel, Photoshop, CapCut, YouTube, Dropshipping), PDF rules, or software shortcuts.";
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // If a separate external secure backend is configured via VITE_AI_BACKEND_URL, call it
    if (SECURE_BACKEND_URL) {
      try {
        const res = await fetch(SECURE_BACKEND_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userMsg.text,
            offlineContext: generateOfflineResponse(userMsg.text)
          })
        });
        if (res.ok) {
          const data = await res.json();
          setMessages(prev => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              text: data.reply || generateOfflineResponse(userMsg.text),
              sender: 'bot',
              timestamp: new Date()
            }
          ]);
          setIsTyping(false);
          return;
        }
      } catch (e) {
        console.error('External AI backend unavailable, using offline assistant:', e);
      }
    }

    // Default static hosting mode: Offline Knowledge Base Assistant
    setTimeout(() => {
      const botResponseText = generateOfflineResponse(userMsg.text);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 400);
  };

  const formatText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <ScreenWrapper className="bg-gray-50 flex flex-col pb-0">
      <div className="bg-teal-600 text-white pt-12 pb-4 px-6 rounded-b-[2rem] shadow-md z-10 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={goBack} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft size={24} />
            </button>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Bot size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold">Offline Assistant</h1>
                <p className="text-teal-100 text-xs flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${SECURE_BACKEND_URL ? 'bg-green-400' : 'bg-yellow-300'}`} />
                  {SECURE_BACKEND_URL ? 'Connected to External AI Backend' : 'Knowledge Base AI (Offline Mode)'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!SECURE_BACKEND_URL && (
        <div className="mx-4 mt-3 px-3.5 py-2.5 bg-teal-50 border border-teal-200 rounded-xl flex items-start gap-2 text-xs text-teal-900 shrink-0">
          <ShieldAlert size={16} className="text-teal-600 shrink-0 mt-0.5" />
          <span>
            <strong>Static Hosting Mode:</strong> Online LLM API calls are disabled to protect private API keys on static
            hosting. Answering from the built-in Inspire Academy offline knowledge base.
          </span>
        </div>
      )}

      <div className="flex-1 p-4 space-y-4 pb-6">
        {messages.map(msg => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[85%] gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div
                className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.sender === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-teal-100 text-teal-600'
                }`}
              >
                {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div
                className={`p-3 rounded-2xl text-sm whitespace-pre-wrap ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-sm'
                    : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-tl-sm'
                }`}
              >
                {formatText(msg.text)}
              </div>
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
            <div className="flex max-w-[85%] gap-2 flex-row">
              <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-teal-100 text-teal-600">
                <Bot size={16} />
              </div>
              <div className="p-3 rounded-2xl text-sm bg-white text-gray-800 border border-gray-100 shadow-sm rounded-tl-sm flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-teal-600" />
                <span className="text-gray-500">Thinking...</span>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-20 mt-auto shrink-0">
        <div className="flex items-center gap-2 max-w-md mx-auto relative">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask about courses, PDFs, or shortcuts..."
            className="flex-1 bg-gray-100 border-transparent focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-full py-3 pl-4 pr-12 text-sm transition-all"
            disabled={isTyping}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            aria-label="Send Message"
            className="absolute right-2 p-2 bg-teal-600 text-white rounded-full disabled:opacity-50 disabled:bg-gray-400 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </ScreenWrapper>
  );
}
