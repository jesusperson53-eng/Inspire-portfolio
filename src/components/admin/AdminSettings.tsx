import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  CheckCircle2,
  Shield,
  Phone,
  Mail,
  MapPin,
  Globe,
  Share2,
  AlertTriangle,
  X,
  FileText,
  Power,
  Loader2,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { AcademySettings } from '../../types/academy';

export const AdminSettings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [academyName, setAcademyName] = useState('Inspire Business Academy');
  const [logoUrl, setLogoUrl] = useState('');
  const [whatsapp, setWhatsapp] = useState('+92 321 0000000');
  const [phone, setPhone] = useState('+92 300 0000000');
  const [email, setEmail] = useState('theinspirebusinessacademy@gmail.com');
  const [address, setAddress] = useState('Karachi, Sindh, Pakistan');
  const [footerText, setFooterText] = useState(
    'Inspire Business Academy is a specialized institute for next-generation technology, digital commerce, and industry-accredited practical education.'
  );
  const [facebook, setFacebook] = useState('');
  const [youtube, setYoutube] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [maintenance, setMaintenance] = useState(false);
  const [maxMarks, setMaxMarks] = useState(100);

  // Live validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    adminService.getSettings().then((s) => {
      setAcademyName(s.academy_name || 'Inspire Business Academy');
      setLogoUrl(s.logo_url || '');
      setWhatsapp(s.whatsapp_number || '+92 321 0000000');
      setPhone(s.official_phone || '+92 300 0000000');
      setEmail(s.contact_email || 'theinspirebusinessacademy@gmail.com');
      setAddress(s.address || 'Karachi, Sindh, Pakistan');
      setFooterText(s.footer_text || '');
      setFacebook(s.social_links?.facebook || '');
      setYoutube(s.social_links?.youtube || '');
      setInstagram(s.social_links?.instagram || '');
      setLinkedin(s.social_links?.linkedin || '');
      setMaintenance(Boolean(s.maintenance_flag));
      setMaxMarks(s.default_max_marks || 100);
      setLoading(false);
    }).catch((err) => {
      console.error('Error loading settings from Supabase:', err);
      setLoading(false);
    });
  }, []);

  // Validate fields live
  const validate = () => {
    const errs: { [key: string]: string } = {};

    // Academy name
    if (!academyName.trim()) {
      errs.academyName = 'Academy name cannot be empty.';
    }

    // Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      errs.email = 'Please provide a valid contact email address.';
    }

    // WhatsApp format (+ followed by 10-15 digits, spaces/dashes allowed)
    const cleanWa = whatsapp.replace(/[\s-]/g, '');
    const waRegex = /^\+?[0-9]{10,15}$/;
    if (!waRegex.test(cleanWa)) {
      errs.whatsapp = 'Invalid WhatsApp format. Must include country code, e.g. +92 321 0000000.';
    }

    // URLs validation
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;
    if (logoUrl.trim() && !urlRegex.test(logoUrl.trim())) {
      errs.logoUrl = 'Logo URL must be a valid web URL.';
    }
    if (facebook.trim() && !urlRegex.test(facebook.trim())) {
      errs.facebook = 'Facebook link must be a valid URL.';
    }
    if (youtube.trim() && !urlRegex.test(youtube.trim())) {
      errs.youtube = 'YouTube link must be a valid URL.';
    }
    if (instagram.trim() && !urlRegex.test(instagram.trim())) {
      errs.instagram = 'Instagram link must be a valid URL.';
    }
    if (linkedin.trim() && !urlRegex.test(linkedin.trim())) {
      errs.linkedin = 'LinkedIn link must be a valid URL.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  useEffect(() => {
    validate();
  }, [academyName, email, whatsapp, logoUrl, facebook, youtube, instagram, linkedin]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSaveError(null);

    const socialLinks = {
      facebook: facebook.trim(),
      youtube: youtube.trim(),
      instagram: instagram.trim(),
      linkedin: linkedin.trim(),
    };

    // Save individual keys via adminService.updateSetting RPC
    const results = await Promise.all([
      adminService.updateSetting('academy_name', academyName.trim()),
      adminService.updateSetting('whatsapp_number', whatsapp.trim()),
      adminService.updateSetting('contact_email', email.trim()),
      adminService.updateSetting('address', address.trim()),
      adminService.updateSetting('footer_text', footerText.trim()),
      adminService.updateSetting('logo_url', logoUrl.trim()),
      adminService.updateSetting('social_links', socialLinks),
      adminService.updateSetting('maintenance_flag', maintenance),
    ]);

    const firstError = results.find((r) => !r.success);
    if (firstError) {
      setSaveError(firstError.error || 'Failed to update site settings in database.');
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-900" />
          <span>Institutional Site & Campus Configuration</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Campus communications, official WhatsApp hotline, public footer texts, and global maintenance controls.
        </p>
      </div>

      {saveError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-semibold">{saveError}</span>
          </div>
          <button onClick={() => setSaveError(null)} className="text-rose-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">
              Site settings successfully saved and synced across all public portal components!
            </span>
          </div>
          <button onClick={() => setSaved(false)} className="text-emerald-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
        {/* Section 1: Academy Core Identity */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Globe className="w-4 h-4 text-blue-900" />
            <span>Institutional Identity & Branding</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Official Academy Name *
              </label>
              <input
                type="text"
                required
                value={academyName}
                onChange={(e) => setAcademyName(e.target.value)}
                className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none ${
                  errors.academyName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                }`}
              />
              {errors.academyName && <p className="text-[10px] text-rose-600 mt-1">{errors.academyName}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Academy Logo URL (Optional)
              </label>
              <input
                type="text"
                placeholder="https://example.com/logo.png"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none ${
                  errors.logoUrl ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                }`}
              />
              {errors.logoUrl && <p className="text-[10px] text-rose-600 mt-1">{errors.logoUrl}</p>}
            </div>
          </div>
        </div>

        {/* Section 2: Contact & Liaison Hotline */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Phone className="w-4 h-4 text-blue-900" />
            <span>Campus Liaison & Communications</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Official WhatsApp Number * (Live format checked)
              </label>
              <input
                type="text"
                required
                placeholder="+92 321 0000000"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none ${
                  errors.whatsapp ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                }`}
              />
              {errors.whatsapp ? (
                <p className="text-[10px] text-rose-600 mt-1">{errors.whatsapp}</p>
              ) : (
                <span className="text-[10px] text-emerald-600 mt-1 block">
                  Valid WhatsApp number with country code format
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Campus Phone / Landline
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Official Institutional Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none ${
                  errors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                }`}
              />
              {errors.email && <p className="text-[10px] text-rose-600 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Campus Physical Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Social Media Links */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Share2 className="w-4 h-4 text-blue-900" />
            <span>Social Media Presence</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Facebook Page URL</label>
              <input
                type="text"
                placeholder="https://facebook.com/..."
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
              {errors.facebook && <p className="text-[10px] text-rose-600 mt-1">{errors.facebook}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">YouTube Channel URL</label>
              <input
                type="text"
                placeholder="https://youtube.com/@..."
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
              {errors.youtube && <p className="text-[10px] text-rose-600 mt-1">{errors.youtube}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Instagram URL</label>
              <input
                type="text"
                placeholder="https://instagram.com/..."
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
              {errors.instagram && <p className="text-[10px] text-rose-600 mt-1">{errors.instagram}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">LinkedIn URL</label>
              <input
                type="text"
                placeholder="https://linkedin.com/company/..."
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
              {errors.linkedin && <p className="text-[10px] text-rose-600 mt-1">{errors.linkedin}</p>}
            </div>
          </div>
        </div>

        {/* Section 4: Public Footer Text & Maintenance */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
            <FileText className="w-4 h-4 text-blue-900" />
            <span>Public Footer & Controls</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Public Footer Mission / Description
            </label>
            <textarea
              rows={3}
              value={footerText}
              onChange={(e) => setFooterText(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <div className="text-xs font-bold text-slate-800">System Maintenance Mode Flag</div>
              <div className="text-[11px] text-slate-500">
                When active, displays a non-blocking maintenance notice to public visitors while preserving admin operations.
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={maintenance}
                onChange={(e) => setMaintenance(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex items-center justify-end">
          <button
            type="submit"
            disabled={submitting || Object.keys(errors).length > 0}
            className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{submitting ? 'Persisting Changes...' : 'Update Institutional Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
