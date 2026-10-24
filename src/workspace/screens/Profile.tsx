import React, { useState, useRef } from 'react';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useProfileViewModel } from '../store/useProfileViewModel';
import { useSkillsViewModel } from '../store/useSkillsViewModel';
import { useSafeBack } from '../lib/utils';
import { ArrowLeft, User, Phone, MapPin, Calendar, Camera, Save, CheckCircle2, Award } from 'lucide-react';
import { motion } from 'motion/react';

export function Profile() {
  const goBack = useSafeBack();
  const { profile, updateProfile } = useProfileViewModel();
  const { skills } = useSkillsViewModel();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState(profile);
  const [isSaved, setIsSaved] = useState(false);

  // Sync state when profile loads from localStorage
  React.useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({ ...prev, photoBase64: base64String }));
        updateProfile({ photoBase64: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <ScreenWrapper className="bg-gray-50 pb-24">
      <div className="bg-blue-900 text-white pt-12 pb-8 px-6 rounded-b-[2rem] shadow-md z-10 relative">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={goBack} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Student Profile</h1>
            <p className="text-blue-200 text-sm mt-1">Manage your personal details</p>
          </div>
        </div>

        {/* Profile Photo */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-white/10 border-4 border-white/20 overflow-hidden flex items-center justify-center shadow-lg">
              {formData.photoBase64 ? (
                <img src={formData.photoBase64} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={40} className="text-white/60" />
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-yellow-400 text-blue-900 p-2 rounded-full shadow-md hover:bg-yellow-300 transition-colors"
            >
              <Camera size={16} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
          <h2 className="mt-3 font-bold text-lg">{formData.fullName || 'Student Name'}</h2>
          <p className="text-xs text-blue-200">The Inspire Business Academy</p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Enter your full name"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
            <div className="relative">
              <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="0300-1234567"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Address</label>
            <div className="relative">
              <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                placeholder="Your city/address"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Admission Date</label>
            <div className="relative">
              <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={formData.admissionDate}
                onChange={e => setFormData({ ...formData, admissionDate: e.target.value })}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-200 transition-all flex items-center justify-center gap-2 mt-6"
          >
            {isSaved ? (
              <>
                <CheckCircle2 size={18} /> Saved Successfully!
              </>
            ) : (
              <>
                <Save size={18} /> Save Profile
              </>
            )}
          </button>
        </form>

        {/* Enrolled Skills */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Award size={16} className="text-blue-600" /> Enrolled Skills
          </h3>
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <motion.span
                  key={idx}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-lg text-xs font-semibold"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">No skills selected yet.</p>
          )}
        </div>
      </div>
    </ScreenWrapper>
  );
}
