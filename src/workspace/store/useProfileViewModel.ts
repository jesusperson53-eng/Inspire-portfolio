import { useState, useEffect } from 'react';
import { UserProfile } from '../types';

const defaultProfile: UserProfile = {
  fullName: '',
  phoneNumber: '',
  address: '',
  admissionDate: '',
  photoBase64: ''
};

export function useProfileViewModel() {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);

  useEffect(() => {
    const stored = localStorage.getItem('inspire_profile');
    if (stored) {
      try {
        setProfile(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse profile', e);
      }
    }
  }, []);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('inspire_profile', JSON.stringify(updated));
      return updated;
    });
  };

  return {
    profile,
    updateProfile
  };
}
