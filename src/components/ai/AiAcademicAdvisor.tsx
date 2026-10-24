import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  BookOpen,
  Code2,
  FileCheck,
  BrainCircuit,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';
import { academyStore } from '../../services/academyStore';

import { DEFAULT_COURSE_ID } from '../../config/courseCatalog';

export const AiAcademicAdvisor: React.FC = () => {
  const currentUser = academyStore.getCurrentUser();
  const courses = academyStore.getCourses();

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(currentUser?.course_id || DEFAULT_COURSE_ID);
  const [conversation, setConversation] = useState<
    Array<{ role: 'user' | 'assistant'; content: string; thoughtSummary?: string }>
  >([
    {
      role: 'assistant',
      content: `Welcome to the **Inspire Business Academy Senior AI Academic & Industry Mentor** (enabled with Gemini High Thinking Reasoning).\n\nHow can I assist your studies today?\n- **Assignment Architecture**: Project structure, tools, and best practices\n- **Pre-Submission Review**: Checking against evaluation rubrics\n- **Technical Guidance**: Computer fundamentals, MS Office, Graphic Design, Video Editing, AI Tools, and Marketing\n- **Career Counseling**: Portfolio polishing and freelance client outreach.`,
    },
  ]);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    const userMessage = prompt.trim();
    setPrompt('');
    setConversation((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    const activeCourseObj = courses.find((c) => c.id === selectedCourse);

    try {
      const response = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMessage,
          mode: currentUser?.role === 'admin' ? 'faculty_reviewer' : 'student_mentor',
          courseContext: activeCourseObj,
          studentContext: currentUser
            ? { name: currentUser.full_name, roll_no: currentUser.roll_no, course: currentUser.course_title }
            : null,
        }),
      });

      const data = await response.json();
      if (data.text) {
        setConversation((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.text,
          },
        ]);
      } else {
        setConversation((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.error || 'Failed to receive academic reasoning. Please try again.',
          },
        ]);
      }
    } catch (err: any) {
      setConversation((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Unable to reach the academy AI server. Please verify your connection.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const setPromptTemplate = (text: string) => {
    setPrompt(text);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-900 text-xs font-bold uppercase tracking-wider mb-2">
            <BrainCircuit className="w-3.5 h-3.5 text-purple-600" />
            <span>High Thinking AI Reasoning Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Inspire Academic & Code Mentor
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Grounded in Inspire Business Academy's curriculum standards, rubric criteria, and modern engineering practices.
          </p>
        </div>

        {/* Course Context Picker */}
        <div className="shrink-0">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Focus Specialization
          </label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Suggested Prompts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <button
          onClick={() =>
            setPromptTemplate('Can you provide an architectural checklist for building a production MERN capstone with TypeScript and secure authentication?')
          }
          className="p-3 text-left rounded-2xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-xs transition-all text-xs"
        >
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-purple-600" />
            <span>Capstone Architecture</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
            Production MERN checklist with TypeScript & auth
          </div>
        </button>

        <button
          onClick={() =>
            setPromptTemplate('What specific rubric criteria will Inspire faculty use to evaluate my database schema and indexing?')
          }
          className="p-3 text-left rounded-2xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-xs transition-all text-xs"
        >
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <FileCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Grading Rubric Criteria</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
            What faculty look for in schema and query tests
          </div>
        </button>

        <button
          onClick={() =>
            setPromptTemplate('How should I articulate the "What I Learned" reflection to maximize my evaluation score and showcase appeal?')
          }
          className="p-3 text-left rounded-2xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-xs transition-all text-xs"
        >
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
            <span>Submission Reflection</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
            How to craft an impactful reflection note
          </div>
        </button>
      </div>

      {/* Chat Area */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md flex flex-col h-[520px] overflow-hidden">
        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {conversation.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-700 to-indigo-800 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-900 text-white rounded-br-none shadow-xs'
                    : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-bl-none whitespace-pre-wrap'
                }`}
              >
                {msg.content}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-700 text-white flex items-center justify-center shrink-0 animate-pulse">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900 text-xs flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-600 animate-ping"></div>
                <span>Engaging high-level academic thinking & code reasoning...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleAsk} className="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            required
            placeholder="Ask about assignment code, debugging, architecture, or grading criteria..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
            className="flex-1 px-4 py-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-600 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="px-5 py-3 rounded-2xl bg-purple-700 hover:bg-purple-600 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Inquire</span>
          </button>
        </form>
      </div>
    </div>
  );
};
