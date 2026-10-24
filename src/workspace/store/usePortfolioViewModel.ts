import { useState, useEffect, useCallback } from 'react';
import { PortfolioEntity } from '../types';
import { savePortfolioFile, getPortfolioFiles, deletePortfolioFile, updatePortfolioFile } from '../lib/db';

export function usePortfolioViewModel() {
  const [files, setFiles] = useState<PortfolioEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFiles = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPortfolioFiles();
      setFiles(data.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()));
      setError(null);
    } catch (err) {
      console.error('Failed to load portfolio files:', err);
      setError('Failed to load files from storage. They might be corrupted or deleted.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const uploadFile = async (
    file: File,
    skillCategory: string,
    tag: string,
    portfolioType: 'showcase' | 'practice' = 'practice',
    customName?: string,
    description?: string
  ) => {
    try {
      const id =
        typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : `pf-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      const newEntity: PortfolioEntity = {
        id,
        fileName: customName || file.name,
        fileType: file.type,
        fileData: file,
        skillCategory,
        tag,
        description,
        uploadDate: new Date().toISOString(),
        size: file.size,
        portfolioType
      };
      await savePortfolioFile(newEntity);
      await loadFiles();
      return true;
    } catch (err) {
      console.error('Failed to upload file:', err);
      setError('Failed to save file to storage.');
      return false;
    }
  };

  const removeFile = async (id: string) => {
    try {
      await deletePortfolioFile(id);
      await loadFiles();
      return true;
    } catch (err) {
      console.error('Failed to delete file:', err);
      setError('Failed to delete file from storage.');
      return false;
    }
  };

  const updateFileDetails = async (id: string, updates: Partial<PortfolioEntity>) => {
    try {
      await updatePortfolioFile(id, updates);
      await loadFiles();
      return true;
    } catch (err) {
      console.error('Failed to update file:', err);
      setError('Failed to update file details.');
      return false;
    }
  };

  const renameFile = async (id: string, newName: string) => {
    try {
      await updatePortfolioFile(id, { fileName: newName });
      await loadFiles();
      return true;
    } catch (err) {
      console.error('Failed to rename file:', err);
      setError('Failed to rename file.');
      return false;
    }
  };

  const moveFile = async (id: string, newType: 'showcase' | 'practice') => {
    try {
      await updatePortfolioFile(id, { portfolioType: newType });
      await loadFiles();
      return true;
    } catch (err) {
      console.error('Failed to move file:', err);
      setError('Failed to move file.');
      return false;
    }
  };

  const getTotalStorageUsed = () => {
    return files.reduce((total, file) => total + file.size, 0);
  };

  const getFileCountBySkill = (skill: string) => {
    return files.filter(f => f.skillCategory === skill).length;
  };

  return {
    files,
    loading,
    error,
    uploadFile,
    removeFile,
    renameFile,
    updateFileDetails,
    moveFile,
    getTotalStorageUsed,
    getFileCountBySkill,
    refresh: loadFiles
  };
}
