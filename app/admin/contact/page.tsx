'use client';

import { useState, useEffect } from 'react';
import { useAdminLanguage } from '@/contexts/AdminLanguageContext';
import { useUserProfile } from '@/contexts/PositionContext';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const { t } = useAdminLanguage();
  const { profile, updateProfile } = useUserProfile();

  const [phone, setPhone] = useState(profile.phone);
  const [email, setEmail] = useState(profile.email);
  const [linkedin, setLinkedin] = useState(profile.linkedin);

  // Sync edit state with profile
  useEffect(() => {
    setPhone(profile.phone);
    setEmail(profile.email);
    setLinkedin(profile.linkedin);
  }, [profile.phone, profile.email, profile.linkedin]);

  const handleSave = () => {
    updateProfile({ phone, email, linkedin });
    toast.success(t.contact.saveSuccess);
  };

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t.contact.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t.contact.description}
        </p>
      </div>

      {/* Contact Information Form */}
      <div className="max-w-4xl">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {t.contact.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t.contact.description}
              </p>
            </div>
            <div className="ml-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Phone Number */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t.contact.phone}
              </label>
              <input
                type="text"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder={t.contact.phonePlaceholder}
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Current: <span className="font-semibold text-purple-600 dark:text-purple-400">{profile.phone}</span>
              </p>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t.contact.email}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder={t.contact.emailPlaceholder}
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Current: <span className="font-semibold text-purple-600 dark:text-purple-400">{profile.email}</span>
              </p>
            </div>

            {/* LinkedIn */}
            <div>
              <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t.contact.linkedin}
              </label>
              <input
                type="url"
                id="linkedin"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder={t.contact.linkedinPlaceholder}
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Current: <span className="font-semibold text-purple-600 dark:text-purple-400">{profile.linkedin}</span>
              </p>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="w-full px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
            >
              {t.common.save}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
