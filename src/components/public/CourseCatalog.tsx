import React, { useState } from 'react';
import {
  BookOpen,
  Clock,
  CheckCircle,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { academyStore } from '../../services/academyStore';
import { Course } from '../../types/academy';

interface CourseCatalogProps {
  onSelectCourse?: (courseId: string) => void;
  onStudentRegister?: () => void;
}

export const CourseCatalog: React.FC<CourseCatalogProps> = ({
  onSelectCourse,
  onStudentRegister,
}) => {
  const courses = academyStore.getActiveCourses();
  const batches = academyStore.getBatches();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold uppercase tracking-wider mb-2">
          <BookOpen className="w-3.5 h-3.5 text-blue-700" />
          <span>Professional Specializations</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Industry-Accredited Curriculum
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
          The 10 official vocational and technical courses offered at Inspire Business Academy, designed to build practical competence and real student portfolios.
        </p>
      </div>

      {/* Courses Grid */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
          return (
            <div
              key={course.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-blue-300 transition-all duration-200 flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {/* Course banner */}
                <div className="h-36 w-full overflow-hidden relative bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 flex flex-col justify-between p-4">
                  {course.cover_image ? (
                    <>
                      <img
                        src={course.cover_image}
                        alt={course.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent"></div>
                    </>
                  ) : null}

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-blue-900/90 backdrop-blur-xs text-[10px] font-bold tracking-wider uppercase border border-blue-400/30 text-white">
                      {course.code || 'IBA'}
                    </span>
                    <span className="p-2 rounded-xl bg-white/10 text-amber-300 backdrop-blur-xs">
                      <Sparkles className="w-4 h-4" />
                    </span>
                  </div>

                  <div className="relative z-10 flex items-center justify-between text-white text-xs font-semibold">
                    <span className="text-blue-200 font-mono text-[11px]">{course.id}</span>
                    {course.duration ? (
                      <span className="text-xs font-semibold text-slate-200 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {course.duration}
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {course.category ? (
                    <div className="text-[11px] font-bold uppercase tracking-wider text-blue-700 mb-1">
                      {course.category}
                    </div>
                  ) : null}
                  <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-blue-900 transition-colors">
                    {course.title}
                  </h3>
                  {course.description ? (
                    <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                      {course.description}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400 mt-2 italic">
                      Official Academy Program. Detailed syllabus and schedule available upon enrollment.
                    </p>
                  )}

                  {/* Modules preview if populated */}
                  {course.modules && course.modules.length > 0 ? (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                        Key Modules:
                      </span>
                      <div className="space-y-1.5">
                        {course.modules.slice(0, 3).map((mod, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{mod}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Action footer */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => setSelectedCourse(course)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-blue-50 text-blue-900 border border-slate-200 hover:border-blue-200 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  <span>View Program Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 p-6 sm:p-8 text-white">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md bg-blue-700/80 text-xs font-bold tracking-wider">
                  {selectedCourse.code} • {selectedCourse.duration}
                </span>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10"
                >
                  ✕
                </button>
              </div>
              <h3 className="text-xl sm:text-2xl font-black mt-3">{selectedCourse.title}</h3>
              <p className="text-xs text-slate-300 mt-2">{selectedCourse.description}</p>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
                  Comprehensive Syllabus Modules
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedCourse.modules.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5 text-xs text-slate-800"
                    >
                      <span className="w-5 h-5 rounded-full bg-blue-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-medium">{m}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                  Active Batches & Class Schedule
                </h4>
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-blue-950">Morning & Evening Intakes</div>
                    <div className="text-[11px] text-slate-600">
                      Physical campus sessions + recorded LMS archive + live GitHub code reviews.
                    </div>
                  </div>
                  {onStudentRegister && (
                    <button
                      onClick={() => {
                        setSelectedCourse(null);
                        onStudentRegister();
                      }}
                      className="px-4 py-2 rounded-xl bg-blue-900 text-white font-bold text-xs uppercase tracking-wider shadow-sm hover:bg-blue-800 cursor-pointer"
                    >
                      Enroll Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
