import React, { useState } from 'react';
import {
  Award,
  Search,
  Plus,
  CheckCircle2,
  Printer,
  Calendar,
} from 'lucide-react';
import { academyStore } from '../../services/academyStore';
import { Certificate } from '../../types/academy';
import { formatKarachiDate } from '../../utils/dateUtils';

export const AdminCertificates: React.FC = () => {
  const certificates = academyStore.getCertificates();
  const students = academyStore.getAllStudents();
  const courses = academyStore.getCourses();

  const [searchQuery, setSearchQuery] = useState('');
  const [isIssuing, setIsIssuing] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');
  const [gradeText, setCertGradeText] = useState('Grade A (85%)');
  const [issuedCode, setIssuedCode] = useState<string | null>(null);

  const filtered = certificates.filter(
    (c) =>
      c.certificate_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.course_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleIssue = (e: React.FormEvent) => {
    e.preventDefault();
    const res = academyStore.issueCertificate({
      student_id: selectedStudentId,
      course_id: selectedCourseId,
      grade_text: gradeText,
    });
    if (res.success && res.certificate) {
      setIsIssuing(false);
      setIssuedCode(res.certificate.certificate_code);
      setTimeout(() => setIssuedCode(null), 8000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900">Institutional Credential Registry</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Issue and verify cryptographic-style tamper-resistant digital certificates.
          </p>
        </div>

        <button
          onClick={() => setIsIssuing(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Issue New Credential</span>
        </button>
      </div>

      {issuedCode && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Certificate successfully registered! Verification code: <strong className="font-mono">{issuedCode}</strong></span>
          </div>
          <button onClick={() => setIssuedCode(null)} className="text-emerald-600 hover:text-emerald-900 font-bold ml-2">✕</button>
        </div>
      )}

      {/* Search Input */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Filter by certificate code, candidate, or program..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl shadow-2xs focus:ring-2 focus:ring-blue-900 focus:outline-none"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
      </div>

      {isIssuing && (
        <form onSubmit={handleIssue} className="bg-white p-6 rounded-3xl border border-amber-300 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="font-bold text-sm text-slate-900">Issue Official Certificate</h4>
            <button
              type="button"
              onClick={() => setIsIssuing(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select Candidate *</label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.full_name} ({s.roll_no})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Course Specialization *</label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Grade / Distinction Notation</label>
            <input
              type="text"
              required
              value={gradeText}
              onChange={(e) => setCertGradeText(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm cursor-pointer"
            >
              Confirm Credential Registration
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
            <tr>
              <th className="py-3 px-6">Certificate Code</th>
              <th className="py-3 px-6">Graduate Name</th>
              <th className="py-3 px-6">Academic Program</th>
              <th className="py-3 px-6">Issued Date</th>
              <th className="py-3 px-6 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400 text-xs">
                  No certificates issued yet. Click "Issue New Credential" to register a graduate credential.
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-6 font-mono font-bold text-blue-900">
                    {c.certificate_code}
                  </td>
                  <td className="py-3.5 px-6">
                    <div className="font-bold text-slate-900">{c.student_name}</div>
                    <div className="font-mono text-[10px] text-slate-500">{c.roll_no}</div>
                  </td>
                  <td className="py-3.5 px-6 font-semibold text-slate-700">{c.course_title}</td>
                  <td className="py-3.5 px-6 text-slate-500">{formatKarachiDate(c.issued_date)}</td>
                  <td className="py-3.5 px-6 text-right">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-xs bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Authentic
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
