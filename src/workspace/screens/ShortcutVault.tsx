import { useState, useMemo } from 'react';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useSafeBack } from '../lib/utils';
import { shortcutsData } from '../data/shortcutsData';
import { ArrowLeft, Search, Command, Keyboard } from 'lucide-react';
import { motion } from 'motion/react';

export function ShortcutVault() {
  const goBack = useSafeBack();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = useMemo(() => Array.from(new Set(shortcutsData.map(s => s.category))), []);

  const filteredShortcuts = useMemo(() => {
    let result = shortcutsData;
    if (activeCategory) {
      result = result.filter(s => s.category === activeCategory);
    }
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        s => s.keys.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [query, activeCategory]);

  return (
    <ScreenWrapper className="bg-gray-50 pb-24">
      <div className="bg-purple-600 text-white pt-12 pb-6 px-6 rounded-b-[2rem] shadow-md z-10 relative">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={goBack} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Command size={24} /> Shortcut Vault
            </h1>
            <p className="text-purple-200 text-sm mt-1">100 Essential Shortcuts</p>
          </div>
        </div>

        <div className="relative mt-4">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300" />
          <input
            type="text"
            placeholder="Search shortcuts..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-white/10 border border-purple-400/30 text-white placeholder:text-purple-300 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
          />
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar -mx-6 px-6">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
              !activeCategory ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                activeCategory === cat ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredShortcuts.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <Keyboard size={48} className="mx-auto text-gray-300 mb-4" />
            <p>No shortcuts found matching your search.</p>
          </div>
        ) : (
          filteredShortcuts.map((shortcut, index) => (
            <motion.div
              key={shortcut.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-purple-500 uppercase tracking-wider mb-1">{shortcut.category}</p>
                <p className="text-gray-800 font-medium text-sm leading-snug">{shortcut.description}</p>
              </div>
              <div className="shrink-0 bg-gray-100 px-3 py-2 rounded-lg border border-gray-200 shadow-inner">
                <span className="font-mono font-bold text-gray-700 text-sm">{shortcut.keys}</span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </ScreenWrapper>
  );
}
