import React, { useState } from 'react';
import {
  Award,
  Search,
  CheckCircle2,
  XCircle,
  Printer,
  Calendar,
  User,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { academyStore } from '../../services/academyStore';
import { Certificate } from '../../types/academy';
import { InspireLogo } from '../common/InspireLogo';
import { formatKarachiDate } from '../../utils/dateUtils';

export const CertificateVerification: React.FC = () => {
  const [searchCode, setSearchCode] = useState('');
  const [result, setResult] = useState<Certificate | null>(null);
  const [searched, setSearched] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;

    const cert = academyStore.verifyCertificateByCode(searchCode);
    setResult(cert);
    setSearched(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-bold uppercase tracking-wider">
          <Award className="w-3.5 h-3.5 text-amber-600" />
          <span>Credential Trust Gateway</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Official Certificate Verification
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Verify the authenticity of digital diplomas and specialization certificates issued by Inspire Business Academy.
        </p>
      </div>

      {/* Verification Form */}
      <form onSubmit={handleVerify} className="mt-8 max-w-md mx-auto">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              required
              placeholder="e.g. IBA-2026-WD-084"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-sm bg-white border border-slate-200 rounded-2xl shadow-xs focus:ring-2 focus:ring-blue-900 focus:outline-none uppercase font-mono tracking-wider"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </div>

          <button
            type="submit"
            className="px-5 py-3 rounded-2xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-blue-900/20 transition-all cursor-pointer"
          >
            Verify
          </button>
        </div>
      </form>

      {/* Verification Result */}
      {searched && (
        <div className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {result ? (
            <div className="bg-white rounded-3xl border-2 border-emerald-500/30 shadow-xl overflow-hidden">
              {/* Verification Header Banner */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                  <span className="font-extrabold text-sm uppercase tracking-wider">
                    Official Authentic Certificate Found
                  </span>
                </div>
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
              </div>

              {/* Printable Diploma Style Canvas */}
              <div className="p-8 sm:p-12 text-center bg-radial from-amber-50/20 via-white to-slate-50 border-8 border-double border-slate-200 m-4 rounded-2xl relative">
                <div className="flex justify-center mb-4">
                  <InspireLogo size="lg" />
                </div>

                <div className="text-[11px] font-black uppercase tracking-[0.25em] text-blue-900 mt-2">
                  CERTIFICATE OF PROFESSIONAL EXCELLENCE
                </div>

                <p className="text-xs text-slate-500 mt-4 italic">
                  This is to certify and officially verify that
                </p>

                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2 font-serif">
                  {result.student_name}
                </h3>
                <div className="text-xs font-semibold text-slate-500">
                  Student ID: <span className="font-mono text-slate-800">{result.roll_no}</span>
                </div>

                <p className="text-xs text-slate-600 max-w-md mx-auto mt-4 leading-relaxed">
                  has successfully completed all rigorous theoretical modules, code submissions, and comprehensive capstone project requirements for
                </p>

                <div className="mt-3 inline-block px-4 py-1.5 rounded-xl bg-blue-900 text-white font-bold text-sm tracking-wide shadow-xs">
                  {result.course_title}
                </div>

                <div className="mt-3 text-xs font-bold text-amber-700">
                  {result.grade_text}
                </div>

                {/* Footer validation seal */}
                <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      Credential Code
                    </div>
                    <div className="font-mono font-bold text-xs text-blue-900">
                      {result.certificate_code}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                        Issue Date
                      </div>
                      <div className="text-xs font-bold text-slate-700">
                        {formatKarachiDate(result.issued_date)}
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-full border-2 border-amber-400 bg-amber-50 flex items-center justify-center text-amber-600 font-black text-[9px] text-center p-1 leading-tight uppercase">
                      Official Seal
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-3xl border border-rose-200 shadow-sm max-w-md mx-auto">
              <XCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">Certificate Not Found</h3>
              <p className="text-xs text-slate-600 mt-1">
                No record matches certificate code "{searchCode}". Please verify the code or contact academy administration for support.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
