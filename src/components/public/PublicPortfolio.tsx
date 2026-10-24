import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ExternalLink,
  Award,
  Sparkles,
  User,
  ArrowUpRight,
  Code2,
} from 'lucide-react';
import { academyStore } from '../../services/academyStore';
import { PublicPortfolioItem, UserProfile, Certificate } from '../../types/academy';
import { StarRating } from '../common/StarRating';
import { StudentPortfolioModal } from './StudentPortfolioModal';
import { formatKarachiDate } from '../../utils/dateUtils';

export const PublicPortfolio: React.FC = () => {
  const courses = academyStore.getCourses();
  const allItems = academyStore.getPublicPortfolios();
  const allStudents = academyStore.getAllStudents();
  const allCertificates = academyStore.getCertificates();

  const [selectedCourseId, setSelectedCourseId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<UserProfile | null>(null);

  // Filter items
  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      const matchesCourse = selectedCourseId === 'all' || item.course_id === selectedCourseId;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.student_name.toLowerCase().includes(query) ||
        item.roll_no.toLowerCase().includes(query) ||
        item.course_title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);

      return matchesCourse && matchesSearch;
    });
  }, [allItems, selectedCourseId, searchQuery]);

  const openStudentModal = (studentId: string) => {
    const student = allStudents.find((s) => s.id === studentId) || null;
    setSelectedStudent(student);
  };

  const studentItems = useMemo(() => {
    if (!selectedStudent) return [];
    return allItems.filter((item) => item.student_id === selectedStudent.id);
  }, [selectedStudent, allItems]);

  const studentCerts = useMemo(() => {
    if (!selectedStudent) return [];
    return allCertificates.filter((c) => c.student_id === selectedStudent.id);
  }, [selectedStudent, allCertificates]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Title & Introduction */}
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-blue-700" />
          <span>Curated Graduate Showcase</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Peer-Reviewed Student Portfolios
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Explore real-world software applications, AI models, and design systems crafted by Inspire Business Academy students and certified by our faculty.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-8 space-y-4">
        {/* Search Input */}
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search by student name, roll number, project title, or tech..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-2xl shadow-xs focus:ring-2 focus:ring-blue-900 focus:outline-none placeholder-slate-400"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs font-semibold text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Scrollable Course Filter Chips (ALL first, then active courses) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCourseId('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
              selectedCourseId === 'all'
                ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            ALL Disciplines ({allItems.length})
          </button>

          {courses.map((course) => {
            const count = allItems.filter((i) => i.course_id === course.id).length;
            const isSelected = selectedCourseId === course.id;

            return (
              <button
                key={course.id}
                onClick={() => setSelectedCourseId(course.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{course.title}</span>
                {count > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isSelected ? 'bg-blue-800 text-blue-100' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="mt-8">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-slate-200/80 shadow-xs max-w-lg mx-auto">
            <Code2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">
              {allItems.length === 0 ? 'No approved projects yet.' : 'No matching projects found'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              {allItems.length === 0
                ? 'Student projects are submitted through the Student Portal and reviewed by academy faculty before appearing in the public showcase.'
                : 'No submissions match your active filter or search term. Try switching to "ALL Disciplines" or clearing your search.'}
            </p>
            {selectedCourseId !== 'all' || searchQuery ? (
              <button
                onClick={() => {
                  setSelectedCourseId('all');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 text-xs font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            ) : null}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const student = allStudents.find((s) => s.id === item.student_id);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-blue-400 transition-all duration-200 flex flex-col justify-between overflow-hidden group"
                >
                  <div className="p-6">
                    {/* Header Row: Course tag + Rating */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                        {item.course_title}
                      </span>
                      <StarRating rating={item.rating} size="sm" />
                    </div>

                    {/* Featured ribbon if applicable */}
                    {item.is_featured && (
                      <div className="mb-2 inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>Featured Distinction</span>
                      </div>
                    )}

                    {/* Project Title */}
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>

                    {/* "What I learned" description */}
                    <p className="text-xs text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Student author footer */}
                  <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => openStudentModal(item.student_id)}
                      className="flex items-center gap-2.5 text-left group-hover:opacity-100 cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs font-bold ring-2 ring-white">
                        {student?.avatar_url ? (
                          <img
                            src={student.avatar_url}
                            alt={item.student_name}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          item.student_name.charAt(0)
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 hover:text-blue-900 flex items-center gap-1">
                          <span>{item.student_name}</span>
                          <ArrowUpRight className="w-3 h-3 text-slate-400" />
                        </div>
                        <div className="text-[10px] text-slate-500 font-semibold">{item.roll_no}</div>
                      </div>
                    </button>

                    {item.project_url && (
                      <a
                        href={item.project_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-blue-900 hover:border-blue-300 transition-all shadow-2xs"
                        title="View Live Repository / Prototype"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Student 360 Public Portfolio Modal */}
      <StudentPortfolioModal
        student={selectedStudent}
        items={studentItems}
        certificates={studentCerts}
        onClose={() => setSelectedStudent(null)}
      />
    </div>
  );
};
