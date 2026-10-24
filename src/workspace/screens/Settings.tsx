import React, { useRef, useState } from 'react';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useSafeBack } from '../lib/utils';
import { useBackupViewModel } from '../store/useBackupViewModel';
import {
  ArrowLeft,
  Download,
  Upload,
  Share2,
  ShieldCheck,
  AlertTriangle,
  FileJson,
  Clock,
  Archive,
  HardDrive
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ConfirmModal } from '../components/ConfirmModal';

export function Settings() {
  const goBack = useSafeBack();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    lastBackup,
    isRestoring,
    isExportingPortfolio,
    message,
    manualBackup,
    shareBackup,
    restoreBackup,
    exportPortfolio
  } = useBackupViewModel();

  const [pendingRestoreFile, setPendingRestoreFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingRestoreFile(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <ScreenWrapper className="bg-gray-50 relative pb-24">
      <div className="bg-blue-900 text-white pt-12 pb-6 px-6 rounded-b-[2rem] shadow-md z-10 relative">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={goBack} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Backup & Restore</h1>
            <p className="text-blue-200 text-sm mt-1">Keep your data safe</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Status Message */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-xl flex items-start gap-3 text-sm font-medium ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message.type === 'success' ? (
                <ShieldCheck size={20} className="text-green-600 shrink-0" />
              ) : (
                <AlertTriangle size={20} className="text-red-600 shrink-0" />
              )}
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Local Storage Architecture Notice */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
            <HardDrive size={18} className="text-blue-600" />
            <span>Local Browser Storage Notice</span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Your skills, daily tasks, reports, course progress, and game scores are saved locally in this browser's{' '}
            <strong>localStorage</strong>, and portfolio files are stored in <strong>IndexedDB</strong>. Local browser
            data does not automatically synchronize across separate browsers or devices. Use the JSON Backup and
            Portfolio ZIP Export tools below to move your data between devices.
          </p>
        </div>

        {/* Backup Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Download size={20} />
            </div>
            <div>
              <h2 className="font-bold text-gray-800">Create App Backup</h2>
              <p className="text-xs text-gray-500 mt-0.5">Save your app data locally</p>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
              <Clock size={16} className="text-gray-400" />
              <span>
                Last backup: <strong className="text-gray-800">{lastBackup || 'Never'}</strong>
              </span>
            </div>

            <div className="flex items-start gap-3 text-sm text-blue-800 bg-blue-50 p-3 rounded-xl border border-blue-100">
              <AlertTriangle size={18} className="text-blue-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Note:</strong> App backups include tasks, targets, reports, and portfolio metadata.{' '}
                <strong>Large portfolio files are NOT included</strong> to keep backups small. Use the Portfolio Export
                below to save actual files.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={manualBackup}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
              >
                <FileJson size={18} />
                Save JSON
              </button>
              <button
                onClick={shareBackup}
                className="flex-1 bg-white text-blue-600 border border-blue-200 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors"
              >
                <Share2 size={18} />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Portfolio Export Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
              <Archive size={20} />
            </div>
            <div>
              <h2 className="font-bold text-gray-800">Export Portfolio Files</h2>
              <p className="text-xs text-gray-500 mt-0.5">Download actual files as ZIP</p>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <p className="text-sm text-gray-500 leading-relaxed">
              Export all your uploaded portfolio images, videos, and documents into a single ZIP file.
            </p>
            <button
              onClick={exportPortfolio}
              disabled={isExportingPortfolio}
              className={`w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors shadow-sm ${
                isExportingPortfolio
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700 shadow-purple-200'
              }`}
            >
              {isExportingPortfolio ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin" />
                  Zipping Files...
                </>
              ) : (
                <>
                  <Archive size={18} />
                  Export Portfolio ZIP
                </>
              )}
            </button>
          </div>
        </div>

        {/* Restore Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
              <Upload size={20} />
            </div>
            <div>
              <h2 className="font-bold text-gray-800">Restore Data</h2>
              <p className="text-xs text-gray-500 mt-0.5">Recover from a backup file</p>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div className="flex items-start gap-3 text-sm text-yellow-800 bg-yellow-50 p-3 rounded-xl border border-yellow-100">
              <AlertTriangle size={18} className="text-yellow-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Restoring will <strong>overwrite</strong> all current data. Make sure you select the correct backup
                file.
              </p>
            </div>

            <input
              type="file"
              accept=".json,application/json"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isRestoring}
              className={`w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors shadow-sm ${
                isRestoring
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-yellow-500 text-white hover:bg-yellow-600 shadow-yellow-200'
              }`}
            >
              {isRestoring ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin" />
                  Restoring...
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Select Backup File
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={Boolean(pendingRestoreFile)}
        title="Restore Backup Data?"
        message="WARNING: Restoring a backup will overwrite all your current data. This action cannot be undone. Are you sure you want to proceed?"
        confirmLabel="Restore Data"
        onConfirm={() => {
          if (pendingRestoreFile) {
            restoreBackup(pendingRestoreFile);
          }
        }}
        onCancel={() => setPendingRestoreFile(null)}
      />
    </ScreenWrapper>
  );
}
