import { useState } from 'react';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useSafeBack } from '../lib/utils';
import { useLearningViewModel } from '../store/useLearningViewModel';
import {
  BookOpen,
  Users,
  CreditCard,
  Briefcase,
  Clock,
  Target,
  BarChart2,
  Star,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Bookmark,
  Search,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const icons: Record<string, any> = {
  BookOpen,
  Users,
  CreditCard,
  Briefcase,
  Clock,
  Target,
  BarChart2,
  Star
};

export function Learning() {
  const goBack = useSafeBack();
  const {
    progress,
    searchQuery,
    setSearchQuery,
    toggleRead,
    toggleBookmark,
    getProgressPercentage,
    filteredContent
  } = useLearningViewModel();

  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedSection(prev => (prev === id ? null : id));
  };

  return (
    <ScreenWrapper className="bg-gray-50 relative pb-24">
      <div className="bg-blue-900 text-white pt-12 pb-6 px-6 rounded-b-[2rem] shadow-md z-10 relative">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={goBack} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Learning Guide</h1>
            <p className="text-blue-200 text-sm mt-1">Master your skills</p>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="bg-white/10 p-4 rounded-2xl border border-white/20">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-medium text-blue-100">Course Progress</span>
            <span className="text-xl font-bold">{getProgressPercentage()}%</span>
          </div>
          <div className="w-full bg-blue-950 rounded-full h-2.5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${getProgressPercentage()}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="bg-yellow-400 h-2.5 rounded-full"
            />
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search topics..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:border-blue-500 shadow-sm"
          />
        </div>

        {/* Content List */}
        <div className="space-y-4 mt-6">
          {filteredContent.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No topics found matching "{searchQuery}"
            </div>
          ) : (
            filteredContent.map((section, idx) => {
              const Icon = icons[section.iconName] || BookOpen;
              const isExpanded = expandedSection === section.id;
              const isRead = progress[section.id]?.isRead;
              const isBookmarked = progress[section.id]?.isBookmarked;

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={section.id}
                  className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-colors ${
                    isRead ? 'border-green-100 bg-green-50/30' : 'border-gray-100'
                  }`}
                >
                  {/* Header */}
                  <div
                    onClick={() => toggleExpand(section.id)}
                    className="p-4 flex items-center justify-between cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                          isRead ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-600'
                        }`}
                      >
                        <Icon size={24} />
                      </div>
                      <div>
                        <h3 className={`font-bold text-sm ${isRead ? 'text-green-900' : 'text-gray-800'}`}>
                          {section.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">{section.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isBookmarked && <Bookmark size={16} className="text-yellow-500 fill-yellow-500" />}
                      {isRead && <CheckCircle2 size={16} className="text-green-500" />}
                      {isExpanded ? (
                        <ChevronUp size={20} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-gray-50"
                      >
                        <div className="p-5 space-y-6 bg-gray-50/50">
                          {section.content.map((sub, i) => (
                            <div key={i} className="space-y-2">
                              <h4 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                {sub.subtitle}
                              </h4>
                              <p className="text-sm text-gray-600 leading-relaxed pl-3.5 border-l-2 border-gray-100 whitespace-pre-line">
                                {sub.text}
                              </p>
                            </div>
                          ))}

                          {/* Action Buttons */}
                          <div className="flex gap-3 pt-4 border-t border-gray-100 mt-6">
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                toggleRead(section.id);
                              }}
                              className={`flex-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                                isRead
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                            >
                              <CheckCircle2 size={18} />
                              {isRead ? 'Mark as Unread' : 'Mark as Read'}
                            </button>
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                toggleBookmark(section.id);
                              }}
                              className={`px-4 rounded-xl flex items-center justify-center transition-colors ${
                                isBookmarked
                                  ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                              }`}
                            >
                              <Bookmark size={20} className={isBookmarked ? 'fill-yellow-600' : ''} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </ScreenWrapper>
  );
}
