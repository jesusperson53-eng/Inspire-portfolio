import { useNavigate } from 'react-router-dom';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useSafeBack } from '../lib/utils';
import { coursesContent } from '../data/coursesContent';
import { useCoursesViewModel } from '../store/useCoursesViewModel';
import { ArrowLeft, BookOpen, CheckCircle, Monitor, FileText, Table, Presentation, Youtube, Megaphone, ShoppingCart, Bot, Image, Video, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

const iconMap: Record<string, any> = {
  Monitor,
  FileText,
  Table,
  Presentation,
  Youtube,
  Megaphone,
  ShoppingCart,
  Bot,
  Image,
  Video,
  TrendingUp
};

export function Courses() {
  const navigate = useNavigate();
  const goBack = useSafeBack();
  const { getCourseProgress } = useCoursesViewModel();

  return (
    <ScreenWrapper className="bg-gray-50 pb-24">
      <div className="bg-blue-900 text-white pt-12 pb-6 px-6 rounded-b-[2rem] shadow-md z-10 relative">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={goBack} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Courses</h1>
            <p className="text-blue-200 text-sm mt-1">Master new skills offline</p>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coursesContent.map((course, index) => {
          const Icon = iconMap[course.icon] || BookOpen;
          const totalTopics = course.chapters.reduce((acc, chapter) => acc + chapter.topics.length, 0);
          const progress = getCourseProgress(course.id, totalTopics);

          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={course.id}
              onClick={() => navigate(`/workspace/courses/${course.id}`)}
              className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/90 flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all active:scale-98"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shrink-0 ${course.color}`}>
                <Icon size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-800 text-base truncate">{course.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{course.description}</p>

                <div className="mt-3 flex items-center gap-3">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 w-8 text-right">{progress}%</span>
                </div>
              </div>
              {progress === 100 && <CheckCircle size={20} className="text-green-500 shrink-0" />}
            </motion.div>
          );
        })}
        </div>
      </div>
    </ScreenWrapper>
  );
}
