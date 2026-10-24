import React, { useState, useRef, useEffect } from 'react';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useSkillsViewModel } from '../store/useSkillsViewModel';
import { usePortfolioViewModel } from '../store/usePortfolioViewModel';
import { useTasksViewModel } from '../store/useTasksViewModel';
import { PortfolioEntity } from '../types';
import {
  Plus,
  FolderOpen,
  Video,
  Music,
  FileText,
  Trash2,
  Edit2,
  Eye,
  HardDrive,
  Search,
  LayoutGrid,
  List,
  X,
  Upload,
  ArrowRightLeft,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { COURSE_TITLES } from '../../config/courseCatalog';
import { ConfirmModal } from '../components/ConfirmModal';

const FileThumbnail = ({ file }: { file: PortfolioEntity; viewMode: 'grid' | 'list' }) => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file.fileType.startsWith('image/')) {
      const objectUrl = URL.createObjectURL(file.fileData);
      setUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [file]);

  if (file.fileType.startsWith('image/') && url) {
    return <img src={url} alt={file.fileName} className="w-full h-full object-cover" />;
  }
  if (file.fileType.startsWith('video/')) return <Video size={24} className="text-purple-500" />;
  if (file.fileType.startsWith('audio/')) return <Music size={24} className="text-yellow-500" />;
  if (file.fileType === 'application/pdf') return <FileText size={24} className="text-red-500" />;
  return <FileText size={24} className="text-gray-500" />;
};

export function Portfolio() {
  const { skills } = useSkillsViewModel();
  const {
    files,
    loading,
    error,
    uploadFile,
    removeFile,
    renameFile,
    updateFileDetails,
    moveFile,
    getTotalStorageUsed
  } = usePortfolioViewModel();
  const { updateTodayTask } = useTasksViewModel();

  const [activeTab, setActiveTab] = useState<'showcase' | 'practice'>('showcase');
  const [selectedSkill, setSelectedSkill] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [isUploading, setIsUploading] = useState(false);
  const [uploadSkill, setUploadSkill] = useState(skills[0] || COURSE_TITLES[0]);
  const [uploadTag, setUploadTag] = useState('');
  const [uploadName, setUploadName] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [previewFile, setPreviewFile] = useState<PortfolioEntity | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileToDelete, setFileToDelete] = useState<PortfolioEntity | null>(null);

  // Modal state for Rename / Edit Description without window.prompt
  const [editingMeta, setEditingMeta] = useState<{
    file: PortfolioEntity;
    mode: 'rename' | 'description';
    value: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (skills.length > 0 && !uploadSkill) {
      setUploadSkill(skills[0]);
    }
  }, [skills, uploadSkill]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setUploadName(file.name);
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) return;

    const category = uploadSkill || skills[0] || 'General';
    const tag = uploadTag;

    const success = await uploadFile(selectedFile, category, tag, activeTab, uploadName, uploadDescription);
    if (success && activeTab === 'practice') {
      updateTodayTask({ portfolioImproved: true });
    }
    setIsUploading(false);
    setUploadTag('');
    setUploadName('');
    setUploadDescription('');
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const openPreview = (file: PortfolioEntity) => {
    setPreviewFile(file);
    setPreviewUrl(URL.createObjectURL(file.fileData));
  };

  const closePreview = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewFile(null);
    setPreviewUrl(null);
  };

  const filteredFiles = files.filter(f => {
    const matchesTab = f.portfolioType === activeTab || (!f.portfolioType && activeTab === 'practice');
    const matchesSkill = selectedSkill === 'All' || f.skillCategory === selectedSkill;
    const matchesSearch =
      f.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.tag || '').toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSkill && matchesSearch;
  });

  const skillOptions = skills.length > 0 ? skills : COURSE_TITLES;

  return (
    <ScreenWrapper className="bg-gray-50 relative">
      <div className="bg-blue-900 text-white pt-12 pb-6 px-6 rounded-b-[2rem] shadow-md z-10 relative">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">Portfolio</h1>
            <p className="text-blue-200 text-sm mt-1 flex items-center gap-1">
              <HardDrive size={14} /> {formatBytes(getTotalStorageUsed())} used
            </p>
          </div>
          <div className="flex gap-2 bg-white/10 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Grid View"
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-white text-blue-900' : 'text-white'}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              aria-label="List View"
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-white text-blue-900' : 'text-white'}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        <div className="flex bg-white/10 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('showcase')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'showcase' ? 'bg-white text-blue-900' : 'text-white'
            }`}
          >
            Client Showcase
          </button>
          <button
            onClick={() => setActiveTab('practice')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'practice' ? 'bg-white text-blue-900' : 'text-white'
            }`}
          >
            Practice Lab
          </button>
        </div>
      </div>

      <div className="px-6 py-6 space-y-4 pb-24">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <select
            value={selectedSkill}
            onChange={e => setSelectedSkill(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:border-blue-500 max-w-[120px]"
          >
            <option value="All">All Skills</option>
            {skillOptions.map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">{error}</div>
        )}

        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading files...</div>
        ) : filteredFiles.length === 0 ? (
          <div className="text-center py-10">
            <FolderOpen className="mx-auto text-gray-300 mb-3" size={48} />
            <p className="text-gray-500">No files found.</p>
            <p className="text-sm text-gray-400 mt-1">Tap the + button to upload.</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-3'}>
            {filteredFiles.map(file => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                key={file.id}
                className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${
                  viewMode === 'list' ? 'flex items-center p-3 gap-4' : 'flex flex-col'
                }`}
              >
                <div
                  onClick={() => openPreview(file)}
                  className={`${
                    viewMode === 'grid' ? 'h-32 w-full' : 'h-12 w-12 rounded-lg shrink-0'
                  } bg-gray-50 flex items-center justify-center cursor-pointer relative group overflow-hidden`}
                >
                  <FileThumbnail file={file} viewMode={viewMode} />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <Eye className="text-white opacity-0 group-hover:opacity-100" />
                  </div>
                </div>

                <div className={`p-3 flex-1 min-w-0 ${viewMode === 'grid' ? 'border-t border-gray-50' : ''}`}>
                  <h3 className="font-semibold text-gray-800 text-sm truncate" title={file.fileName}>
                    {file.fileName}
                  </h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] font-medium px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md truncate max-w-[80px]">
                      {file.tag || file.skillCategory}
                    </span>
                    <span className="text-[10px] text-gray-400 shrink-0 ml-2">{formatBytes(file.size)}</span>
                  </div>

                  <div className={`flex gap-2 mt-3 ${viewMode === 'list' ? 'hidden' : ''}`}>
                    <button
                      onClick={() => setFileToDelete(file)}
                      className="flex-1 py-1.5 bg-red-50 text-red-600 rounded-lg flex justify-center items-center hover:bg-red-100 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                    <button
                      onClick={() =>
                        setEditingMeta({ file, mode: 'rename', value: file.fileName })
                      }
                      className="flex-1 py-1.5 bg-blue-50 text-blue-600 rounded-lg flex justify-center items-center hover:bg-blue-100 transition-colors"
                      title="Rename"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() =>
                        setEditingMeta({ file, mode: 'description', value: file.description || '' })
                      }
                      className="flex-1 py-1.5 bg-yellow-50 text-yellow-600 rounded-lg flex justify-center items-center hover:bg-yellow-100 transition-colors"
                      title="Edit Description"
                    >
                      <FileText size={14} />
                    </button>
                    <button
                      onClick={() => {
                        const newType = activeTab === 'showcase' ? 'practice' : 'showcase';
                        moveFile(file.id, newType);
                      }}
                      className="flex-1 py-1.5 bg-green-50 text-green-600 rounded-lg flex justify-center items-center hover:bg-green-100 transition-colors"
                      title={`Move to ${activeTab === 'showcase' ? 'Practice Lab' : 'Client Showcase'}`}
                    >
                      <ArrowRightLeft size={14} />
                    </button>
                  </div>
                </div>

                {viewMode === 'list' && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => {
                        const newType = activeTab === 'showcase' ? 'practice' : 'showcase';
                        moveFile(file.id, newType);
                      }}
                      className="p-2 text-green-500 hover:bg-green-50 rounded-lg"
                      title={`Move to ${activeTab === 'showcase' ? 'Practice Lab' : 'Client Showcase'}`}
                    >
                      <ArrowRightLeft size={16} />
                    </button>
                    <button
                      onClick={() =>
                        setEditingMeta({ file, mode: 'rename', value: file.fileName })
                      }
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                      title="Rename"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() =>
                        setEditingMeta({ file, mode: 'description', value: file.description || '' })
                      }
                      className="p-2 text-yellow-500 hover:bg-yellow-50 rounded-lg"
                      title="Edit Description"
                    >
                      <FileText size={16} />
                    </button>
                    <button
                      onClick={() => setFileToDelete(file)}
                      className="p-2 text-red-400 hover:bg-red-50 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {isUploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white w-full max-w-md rounded-3xl p-6 space-y-4"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-gray-800">Upload File</h2>
                <button
                  onClick={() => setIsUploading(false)}
                  className="p-2 bg-gray-100 rounded-full text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skill Category</label>
                <select
                  value={uploadSkill}
                  onChange={e => setUploadSkill(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500"
                >
                  {skillOptions.map(s => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tag (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Logo, Reel, Client Work"
                  value={uploadTag}
                  onChange={e => setUploadTag(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              {selectedFile && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">File Name</label>
                    <input
                      type="text"
                      placeholder="Enter file name"
                      value={uploadName}
                      onChange={e => setUploadName(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                    <textarea
                      placeholder="Add a description..."
                      value={uploadDescription}
                      onChange={e => setUploadDescription(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500 min-h-[80px]"
                    />
                  </div>
                </>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.zip,.psd"
              />

              {!selectedFile ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      setSelectedFile(file);
                      setUploadName(file.name);
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-6 bg-blue-50 border-2 border-dashed border-blue-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-blue-900 hover:bg-blue-100/60 transition-colors cursor-pointer"
                >
                  <Upload size={28} className="text-blue-700" />
                  <span className="font-bold text-xs sm:text-sm">Click to Select or Drag & Drop File</span>
                  <span className="text-[11px] text-blue-500">Images, Videos, Audio, PDF, Docs, Archives</span>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setUploadName('');
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUploadSubmit}
                    className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                  >
                    Upload File
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Rename / Description Modal */}
      <AnimatePresence>
        {editingMeta && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white w-full max-w-sm rounded-3xl p-6 space-y-4"
            >
              <h3 className="text-lg font-bold text-gray-800">
                {editingMeta.mode === 'rename' ? 'Rename File' : 'Edit Description'}
              </h3>
              {editingMeta.mode === 'rename' ? (
                <input
                  type="text"
                  value={editingMeta.value}
                  onChange={e => setEditingMeta({ ...editingMeta, value: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500"
                />
              ) : (
                <textarea
                  rows={3}
                  value={editingMeta.value}
                  onChange={e => setEditingMeta({ ...editingMeta, value: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500"
                />
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingMeta(null)}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (editingMeta.mode === 'rename' && editingMeta.value.trim()) {
                      await renameFile(editingMeta.file.id, editingMeta.value.trim());
                    } else if (editingMeta.mode === 'description') {
                      await updateFileDetails(editingMeta.file.id, { description: editingMeta.value });
                    }
                    setEditingMeta(null);
                  }}
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-medium text-sm"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewFile && previewUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex flex-col"
          >
            <div className="flex justify-between items-center p-4 text-white">
              <div className="truncate pr-4">
                <h3 className="font-bold truncate">{previewFile.fileName}</h3>
                <p className="text-xs text-gray-400">
                  {formatBytes(previewFile.size)} &bull; {new Date(previewFile.uploadDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={previewUrl}
                  download={previewFile.fileName}
                  className="p-2 bg-white/10 rounded-full hover:bg-white/20 text-white"
                  title="Download File"
                >
                  <Download size={20} />
                </a>
                <button onClick={closePreview} className="p-2 bg-white/10 rounded-full hover:bg-white/20">
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
              {previewFile.fileType.startsWith('image/') ? (
                <img src={previewUrl} alt={previewFile.fileName} className="max-w-full max-h-full object-contain" />
              ) : previewFile.fileType.startsWith('video/') ? (
                <video src={previewUrl} controls className="max-w-full max-h-full" autoPlay />
              ) : previewFile.fileType.startsWith('audio/') ? (
                <div className="w-full max-w-md bg-white/10 p-6 rounded-2xl flex flex-col items-center gap-6">
                  <Music size={64} className="text-yellow-400" />
                  <audio src={previewUrl} controls className="w-full" autoPlay />
                </div>
              ) : previewFile.fileType === 'application/pdf' ? (
                <iframe src={previewUrl} className="w-full h-full rounded-lg bg-white" title={previewFile.fileName} />
              ) : (
                <div className="w-full max-w-md bg-white/10 p-8 rounded-2xl flex flex-col items-center gap-4 text-center">
                  <FileText size={64} className="text-gray-400" />
                  <p className="text-white">Preview not available for this file type.</p>
                  <a
                    href={previewUrl}
                    download={previewFile.fileName}
                    className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700"
                  >
                    Download File
                  </a>
                </div>
              )}
            </div>

            {previewFile.description && (
              <div className="bg-black/80 text-white p-4 text-sm">
                <p className="font-medium mb-1">Description:</p>
                <p className="text-gray-300">{previewFile.description}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={Boolean(fileToDelete)}
        title="Delete Portfolio File?"
        message={`Are you sure you want to delete "${fileToDelete?.fileName}" from your portfolio storage?`}
        confirmLabel="Delete File"
        onConfirm={() => {
          if (fileToDelete) {
            removeFile(fileToDelete.id);
          }
        }}
        onCancel={() => setFileToDelete(null)}
      />

      <button
        onClick={() => setIsUploading(true)}
        aria-label="Upload File"
        className="fixed bottom-20 right-6 w-14 h-14 bg-yellow-500 text-blue-900 rounded-full shadow-lg shadow-yellow-500/30 flex items-center justify-center active:scale-90 transition-transform z-40"
      >
        <Plus size={28} strokeWidth={2.5} />
      </button>
    </ScreenWrapper>
  );
}
