'use client';

import { useState, useEffect } from 'react';
import { useAdminLanguage } from '@/contexts/AdminLanguageContext';
import { useUserProfile } from '@/contexts/PositionContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import toast from 'react-hot-toast';
import { rolesSettings } from '@/lib/profile';
import { WorkRole } from '@/lib/roadmap';

export default function SettingsPage() {
  const { t } = useAdminLanguage();
  const { profile, updateProfile } = useUserProfile();
  const [editName, setEditName] = useState(profile.name);
  const [editPosition, setEditPosition] = useState(profile.position);
  const [enabledRoles, setEnabledRoles] = useState<Record<WorkRole, boolean>>({
    COO: rolesSettings.COO.enabled,
    CPO: rolesSettings.CPO.enabled,
    CFO: rolesSettings.CFO.enabled,
    CLO: rolesSettings.CLO.enabled,
  });

  // Sync edit state with profile
  useEffect(() => {
    setEditName(profile.name);
    setEditPosition(profile.position);
  }, [profile.name, profile.position]);

  const handleSaveProfile = async () => {
    try {
      // Update localStorage first
      updateProfile({ name: editName, position: editPosition });

      // Then persist to file via API
      const response = await fetch('/api/admin/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, position: editPosition }),
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }

      const data = await response.json();
      toast.success('Profile updated successfully!');

      if (data.requiresRebuild) {
        toast.success('Changes saved! Site will rebuild automatically.', { duration: 5000 });
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast.error('Failed to save profile changes');
    }
  };

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t.settings.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t.settings.description}
        </p>
      </div>

      {/* Settings Sections */}
      <div className="max-w-4xl space-y-6">
        {/* Language Settings */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {t.settings.languageTitle}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {t.settings.languageDescription}
              </p>
              <LanguageSwitcher />
            </div>
            <div className="ml-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </div>
          </div>
        </div>

        {/* Profile Settings */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Profile Settings
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Update your name and position displayed throughout the site
              </p>

              <div className="space-y-4">
                {/* Name Input */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                  />
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Current: <span className="font-semibold text-purple-600 dark:text-purple-400">{profile.name}</span>
                  </p>
                </div>

                {/* Position Input */}
                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Position
                  </label>
                  <input
                    type="text"
                    id="position"
                    value={editPosition}
                    onChange={(e) => setEditPosition(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="e.g., COO, CEO, CTO, Developer"
                  />
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Current: <span className="font-semibold text-purple-600 dark:text-purple-400">{profile.position}</span>
                  </p>
                </div>

                {/* Quick Select Position Buttons */}
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Quick select position:</p>
                  <div className="flex flex-wrap gap-2">
                    {['COO', 'CEO', 'CTO', 'Developer', 'Designer', 'Manager'].map((pos) => (
                      <button
                        key={pos}
                        onClick={() => setEditPosition(pos)}
                        className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                          editPosition === pos
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500'
                        }`}
                      >
                        {pos}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Save Button */}
                <button
                  onClick={handleSaveProfile}
                  className="w-full px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Save Profile
                </button>
              </div>
            </div>
            <div className="ml-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Role Management */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Role Management
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Enable or disable work sections displayed in navigation (Note: Changes require code update to persist)
              </p>

              <div className="space-y-3">
                {(Object.entries(rolesSettings) as [WorkRole, typeof rolesSettings[WorkRole]][]).map(([role, config]) => (
                  <label
                    key={role}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={enabledRoles[role]}
                      onChange={(e) => setEnabledRoles(prev => ({ ...prev, [role]: e.target.checked }))}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{config.icon}</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {t.roles[role].label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {enabledRoles[role] ? 'Enabled - Visible in navigation' : 'Disabled - Hidden from navigation'}
                      </p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Note:</strong> Role settings are currently managed in code. Changes here will update the UI temporarily but won&apos;t persist after page reload. To make permanent changes, update <code className="px-1 py-0.5 bg-blue-100 dark:bg-blue-900 rounded">lib/profile.ts</code>
                </p>
              </div>
            </div>
            <div className="ml-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {t.settings.appearanceTitle}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t.settings.appearanceDescription}
              </p>
            </div>
            <div className="ml-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
