"use client";

import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Bell,
  Shield,
} from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    email: "user@example.com",
    phone: "+880 1234 567890",
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
  });

  return (
    <div>
      <h2 className="text-2xl font-bold text-brand-neutral-900 mb-6">
        Account Settings
      </h2>

      <div className="space-y-6">
        {/* Personal Information */}
        <div className="border border-brand-neutral-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-brand-neutral-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-brand-primary-600" />
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-brand-neutral-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                defaultValue="John"
                className="w-full px-3 py-2 border border-brand-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-neutral-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                defaultValue="Doe"
                className="w-full px-3 py-2 border border-brand-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-neutral-700 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) =>
                  setSettings({ ...settings, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-brand-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-neutral-700 mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) =>
                  setSettings({ ...settings, phone: e.target.value })
                }
                className="w-full px-3 py-2 border border-brand-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-300"
              />
            </div>
          </div>

          <button className="mt-4 px-6 py-2 bg-brand-primary-600 text-white rounded-lg hover:bg-brand-primary-700 transition-colors">
            Save Changes
          </button>
        </div>

        {/* Notification Preferences */}
        <div className="border border-brand-neutral-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-brand-neutral-900 mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-brand-primary-600" />
            Notification Preferences
          </h3>

          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    emailNotifications: e.target.checked,
                  })
                }
                className="rounded border-brand-neutral-300 text-brand-primary-600 focus:ring-brand-primary-500"
              />
              <span className="text-brand-neutral-700">
                Email Notifications
              </span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    smsNotifications: e.target.checked,
                  })
                }
                className="rounded border-brand-neutral-300 text-brand-primary-600 focus:ring-brand-primary-500"
              />
              <span className="text-brand-neutral-700">SMS Notifications</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.marketingEmails}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    marketingEmails: e.target.checked,
                  })
                }
                className="rounded border-brand-neutral-300 text-brand-primary-600 focus:ring-brand-primary-500"
              />
              <span className="text-brand-neutral-700">Marketing Emails</span>
            </label>
          </div>

          <button className="mt-4 px-6 py-2 bg-brand-primary-600 text-white rounded-lg hover:bg-brand-primary-700 transition-colors">
            Save Preferences
          </button>
        </div>

        {/* Security */}
        <div className="border border-brand-neutral-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-brand-neutral-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-brand-primary-600" />
            Security
          </h3>

          <button className="px-6 py-2 border border-brand-neutral-300 rounded-lg text-brand-neutral-700 hover:bg-brand-neutral-50 transition-colors">
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}
