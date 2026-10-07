import {
  FiGrid,
  FiTruck,
  FiUsers,
  FiPackage,
  FiMap,
  FiBell,
  FiSettings,
  FiX,
} from "react-icons/fi";

import { NavLink } from "react-router-dom";

const navigationItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: FiGrid,
  },
  {
    name: "Vehicles",
    path: "/vehicles",
    icon: FiTruck,
  },
  {
    name: "Drivers",
    path: "/drivers",
    icon: FiUsers,
  },
  {
    name: "Shipments",
    path: "/shipments",
    icon: FiPackage,
  },
  {
    name: "Tracking",
    path: "/tracking",
    icon: FiMap,
  },
  {
    name: "Notifications",
    path: "/notifications",
    icon: FiBell,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: FiSettings,
  },
];

function Sidebar({ isOpen, setIsOpen }) {
  return (
    <>
      {/* =================================================
          MOBILE OVERLAY
      ================================================= */}

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-64 flex-col
          border-r border-gray-200 bg-white
          transition-transform duration-300
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-full min-h-0 flex-col">
          {/* =================================================
              LOGO
          ================================================= */}

          <div className="flex h-20 shrink-0 items-center justify-between border-b border-gray-100 px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                <FiTruck size={21} />
              </div>

              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  FleetFlow
                </h1>

                <p className="text-xs text-gray-500">
                  Logistics Platform
                </p>
              </div>
            </div>

            {/* Mobile Close */}

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
              aria-label="Close sidebar"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* =================================================
              NAVIGATION
              ONLY THIS SECTION CAN SCROLL
          ================================================= */}

          <nav className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-4 py-6">
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Main Menu
            </p>

            <div className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`
                    }
                  >
                    <Icon size={19} />

                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          </nav>

          {/* =================================================
              BOTTOM PROFILE
              ALWAYS STAYS AT BOTTOM
          ================================================= */}

          <div className="shrink-0 border-t border-gray-100 bg-white p-4">
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">
                A
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">
                  Admin User
                </p>

                <p className="truncate text-xs text-gray-500">
                  Fleet Manager
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;