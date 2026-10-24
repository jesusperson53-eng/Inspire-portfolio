import { useState, useEffect } from 'react';
import { getPortfolioFiles, savePortfolioFile } from '../lib/db';
import JSZip from 'jszip';

export function useBackupViewModel() {
  const [lastBackup, setLastBackup] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isExportingPortfolio, setIsExportingPortfolio] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('inspire_last_backup');
    if (stored) setLastBackup(stored);

    // Auto backup check
    const today = new Date().toISOString().split('T')[0];
    const lastAutoBackup = localStorage.getItem('inspire_last_auto_backup_date');
    if (lastAutoBackup !== today) {
      performAutoBackup(today);
    }
  }, []);

  const performAutoBackup = async (dateStr: string) => {
    try {
      const backupData = await generateBackupData();
      localStorage.setItem('inspire_auto_backup_data', JSON.stringify(backupData));
      localStorage.setItem('inspire_last_auto_backup_date', dateStr);
      console.log('Auto backup completed for', dateStr);
    } catch (err) {
      console.error('Auto backup failed', err);
    }
  };

  const generateBackupData = async () => {
    // Gather all local storage data
    const keysToBackup = [
      'inspire_skills',
      'inspire_tasks',
      'inspire_daily_reports',
      'inspire_weekly_reports',
      'inspire_monthly_reports',
      'inspire_streak',
      'inspire_targets',
      'inspire_learning_progress',
      'inspire_course_progress',
      'inspire_game_progress',
      'inspire_profile'
    ];

    const localStorageData: Record<string, string | null> = {};
    keysToBackup.forEach(key => {
      localStorageData[key] = localStorage.getItem(key);
    });

    // Gather portfolio metadata (excluding the actual Blob data to keep JSON size manageable)
    const portfolioFiles = await getPortfolioFiles();
    const portfolioMetadata = portfolioFiles.map(file => ({
      id: file.id,
      fileName: file.fileName,
      fileType: file.fileType,
      skillCategory: file.skillCategory,
      tag: file.tag,
      description: file.description,
      portfolioType: file.portfolioType,
      uploadDate: file.uploadDate,
      size: file.size
    }));

    return {
      appName: 'InspireBusinessAcademy',
      version: 1,
      timestamp: new Date().toISOString(),
      localStorage: localStorageData,
      portfolioMetadata
    };
  };

  const manualBackup = async () => {
    try {
      const data = await generateBackupData();
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `Inspire_Backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      const now = new Date().toLocaleString();
      setLastBackup(now);
      localStorage.setItem('inspire_last_backup', now);

      setMessage({ text: 'Backup generated successfully!', type: 'success' });
      return data;
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to generate backup.', type: 'error' });
      return null;
    }
  };

  const shareBackup = async () => {
    try {
      const data = await generateBackupData();
      const jsonString = JSON.stringify(data, null, 2);
      const file = new File([jsonString], `Inspire_Backup_${new Date().toISOString().split('T')[0]}.json`, {
        type: 'application/json'
      });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Inspire Academy Backup',
          text: 'Here is my backup file for Inspire Business Academy app.'
        });
        setMessage({ text: 'Backup shared successfully!', type: 'success' });
      } else {
        manualBackup();
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to share backup.', type: 'error' });
    }
  };

  const restoreBackup = async (file: File): Promise<boolean> => {
    setIsRestoring(true);
    setMessage(null);

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!data || typeof data !== 'object' || data.appName !== 'InspireBusinessAcademy') {
        throw new Error('Invalid backup file format.');
      }

      // Restore local storage
      if (data.localStorage && typeof data.localStorage === 'object') {
        Object.entries(data.localStorage).forEach(([key, value]) => {
          if (value !== null && typeof value === 'string') {
            localStorage.setItem(key, value);
          } else if (value === null) {
            localStorage.removeItem(key);
          }
        });
      }

      // Restore portfolio metadata
      if (data.portfolioMetadata && Array.isArray(data.portfolioMetadata)) {
        for (const meta of data.portfolioMetadata) {
          try {
            const dummyBlob = new Blob(['File content not backed up'], {
              type: meta.fileType || 'text/plain'
            });
            await savePortfolioFile({
              ...meta,
              fileData: dummyBlob
            });
          } catch (e) {
            console.error('Failed to restore portfolio item', e);
          }
        }
      }

      setMessage({ text: 'Data restored successfully! Reloading workspace...', type: 'success' });
      setTimeout(() => {
        window.location.hash = '#/workspace/home';
        window.location.reload();
      }, 1500);
      return true;
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to restore backup. Invalid file.', type: 'error' });
      return false;
    } finally {
      setIsRestoring(false);
    }
  };

  const exportPortfolio = async () => {
    setIsExportingPortfolio(true);
    setMessage(null);

    try {
      const files = await getPortfolioFiles();
      if (files.length === 0) {
        setMessage({ text: 'No portfolio files to export.', type: 'error' });
        setIsExportingPortfolio(false);
        return;
      }

      const zip = new JSZip();

      files.forEach(file => {
        const folder = zip.folder(file.skillCategory || 'Uncategorized');
        if (folder) {
          folder.file(file.fileName, file.fileData);
        }
      });

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);

      const a = document.createElement('a');
      a.href = url;
      a.download = `Inspire_Portfolio_${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setMessage({ text: 'Portfolio exported successfully!', type: 'success' });
    } catch (err) {
      console.error('Failed to export portfolio', err);
      setMessage({ text: 'Failed to export portfolio files.', type: 'error' });
    } finally {
      setIsExportingPortfolio(false);
    }
  };

  return {
    lastBackup,
    isRestoring,
    isExportingPortfolio,
    message,
    setMessage,
    manualBackup,
    shareBackup,
    restoreBackup,
    exportPortfolio
  };
}
