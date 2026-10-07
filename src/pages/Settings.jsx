import { useState } from "react";

import {
  FiSettings,
  FiUser,
  FiMail,
  FiPhone,
  FiBell,
  FiTruck,
  FiPackage,
  FiTool,
  FiUsers,
  FiRefreshCw,
  FiSave,
  FiRotateCcw,
  FiCheck,
} from "react-icons/fi";

const initialSettings = {
  name: "Admin User",
  email: "admin@fleetflow.com",
  phone: "+91 98765 43210",
  role: "Fleet Manager",

  emailNotifications: true,
  shipmentAlerts: true,
  maintenanceAlerts: true,
  driverAlerts: true,
  autoRefresh: true,
};

function Settings() {
  const [settings, setSettings] =
    useState(initialSettings);

  const [saved, setSaved] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setSettings((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSaved(false);
  };

  const handleToggle = (name) => {
    setSettings((previous) => ({
      ...previous,
      [name]: !previous[name],
    }));

    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const handleReset = () => {
    setSettings(initialSettings);
    setSaved(false);
  };

  return (
    <div className="space-y-6">
      {/* =========================
          HEADER
      ========================= */}

      <div>
        <p className="text-sm font-medium text-blue-600">
          System Configuration
        </p>

        <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
          Settings
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your profile, notifications, and fleet preferences.
        </p>
      </div>

      {/* =========================
          SETTINGS LAYOUT
      ========================= */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[240px_minmax(0,1fr)]">
        {/* =========================
            SETTINGS SIDEBAR
        ========================= */}

        <div className="h-fit rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
          <div className="rounded-xl bg-blue-50 px-4 py-3">
            <div className="flex items-center gap-3">
              <FiUser
                size={18}
                className="text-blue-600"
              />

              <span className="text-sm font-semibold text-blue-700">
                Profile
              </span>
            </div>
          </div>

          <div className="mt-1 rounded-xl px-4 py-3">
            <div className="flex items-center gap-3 text-gray-500">
              <FiBell size={18} />

              <span className="text-sm font-medium">
                Notifications
              </span>
            </div>
          </div>

          <div className="mt-1 rounded-xl px-4 py-3">
            <div className="flex items-center gap-3 text-gray-500">
              <FiTruck size={18} />

              <span className="text-sm font-medium">
                Fleet Preferences
              </span>
            </div>
          </div>

          <div className="mt-1 rounded-xl px-4 py-3">
            <div className="flex items-center gap-3 text-gray-500">
              <FiSettings size={18} />

              <span className="text-sm font-medium">
                System
              </span>
            </div>
          </div>
        </div>

        {/* =========================
            SETTINGS CONTENT
        ========================= */}

        <div className="space-y-6">
          {/* =========================
              PROFILE
          ========================= */}

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FiUser size={19} />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">
                    Profile Information
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Manage your account information.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">
              {/* Name */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Full Name
                </label>

                <div className="relative">
                  <FiUser
                    size={17}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    name="name"
                    value={settings.name}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm text-gray-700 outline-none transition focus:border-blue-400 focus:bg-white"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email Address
                </label>

                <div className="relative">
                  <FiMail
                    size={17}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="email"
                    name="email"
                    value={settings.email}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm text-gray-700 outline-none transition focus:border-blue-400 focus:bg-white"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Phone Number
                </label>

                <div className="relative">
                  <FiPhone
                    size={17}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    name="phone"
                    value={settings.phone}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm text-gray-700 outline-none transition focus:border-blue-400 focus:bg-white"
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Role
                </label>

                <input
                  type="text"
                  name="role"
                  value={settings.role}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-400 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* =========================
              NOTIFICATIONS
          ========================= */}

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <FiBell size={19} />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">
                    Notification Preferences
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Choose which alerts you want to receive.
                  </p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {/* Email */}
              <SettingToggle
                icon={FiMail}
                iconClass="bg-blue-50 text-blue-600"
                title="Email Notifications"
                description="Receive important fleet updates through email."
                enabled={settings.emailNotifications}
                onClick={() =>
                  handleToggle("emailNotifications")
                }
              />

              {/* Shipment */}
              <SettingToggle
                icon={FiPackage}
                iconClass="bg-emerald-50 text-emerald-600"
                title="Shipment Alerts"
                description="Get notified about delayed and completed shipments."
                enabled={settings.shipmentAlerts}
                onClick={() =>
                  handleToggle("shipmentAlerts")
                }
              />

              {/* Maintenance */}
              <SettingToggle
                icon={FiTool}
                iconClass="bg-amber-50 text-amber-600"
                title="Maintenance Alerts"
                description="Receive reminders when vehicle maintenance is due."
                enabled={settings.maintenanceAlerts}
                onClick={() =>
                  handleToggle("maintenanceAlerts")
                }
              />

              {/* Driver */}
              <SettingToggle
                icon={FiUsers}
                iconClass="bg-purple-50 text-purple-600"
                title="Driver Alerts"
                description="Get notified when driver availability changes."
                enabled={settings.driverAlerts}
                onClick={() =>
                  handleToggle("driverAlerts")
                }
              />
            </div>
          </div>

          {/* =========================
              FLEET PREFERENCES
          ========================= */}

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <FiTruck size={19} />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">
                    Fleet Preferences
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Configure fleet monitoring behaviour.
                  </p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              <SettingToggle
                icon={FiRefreshCw}
                iconClass="bg-blue-50 text-blue-600"
                title="Automatic Refresh"
                description="Automatically refresh fleet information periodically."
                enabled={settings.autoRefresh}
                onClick={() =>
                  handleToggle("autoRefresh")
                }
              />
            </div>
          </div>

          {/* =========================
              SYSTEM INFORMATION
          ========================= */}

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                  <FiSettings size={19} />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">
                    System Information
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Current application information.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-3 sm:p-6">
              <InfoCard
                label="Application"
                value="FleetFlow"
              />

              <InfoCard
                label="Version"
                value="1.0.0"
              />

              <InfoCard
                label="Environment"
                value="Production Ready"
              />
            </div>
          </div>

          {/* =========================
              ACTIONS
          ========================= */}

          <div className="flex flex-col-reverse gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              <FiRotateCcw size={17} />
              Reset
            </button>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {saved && (
                <div className="flex items-center justify-center gap-2 text-sm font-medium text-emerald-600">
                  <FiCheck size={17} />
                  Changes saved
                </div>
              )}

              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                <FiSave size={17} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================
   TOGGLE COMPONENT
========================= */

function SettingToggle({
  icon: Icon,
  iconClass,
  title,
  description,
  enabled,
  onClick,
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-5 sm:p-6">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={18} />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-800">
            {title}
          </p>

          <p className="mt-1 text-xs leading-5 text-gray-500">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onClick}
        aria-label={`Toggle ${title}`}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled
            ? "bg-blue-600"
            : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            enabled
              ? "left-6"
              : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

/* =========================
   INFO CARD
========================= */

function InfoCard({ label, value }) {
  return (
    <div className="rounded-xl bg-gray-50 p-4">
      <p className="text-xs text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-gray-800">
        {value}
      </p>
    </div>
  );
}

export default Settings;