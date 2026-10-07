import { useEffect, useRef, useState } from "react";
import {
  FiBell,
  FiChevronDown,
  FiMenu,
  FiSearch,
  FiTruck,
  FiUser,
  FiPackage,
  FiUsers,
  FiX,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

function Navbar({ setIsOpen }) {
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const {
    vehicleList,
    driverList,
    shipmentList,
    unreadNotificationCount,
  } = useApp();

  const [search, setSearch] = useState("");
  const [showResults, setShowResults] =
    useState(false);

  const searchValue = search.trim().toLowerCase();

  const vehicleResults = vehicleList
    .filter((vehicle) => {
      if (!searchValue) {
        return false;
      }

      return (
        String(vehicle.id || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(vehicle.vehicleName || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(vehicle.registrationNumber || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(vehicle.location || "")
          .toLowerCase()
          .includes(searchValue)
      );
    })
    .slice(0, 4);

  const driverResults = driverList
    .filter((driver) => {
      if (!searchValue) {
        return false;
      }

      return (
        String(driver.id || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(driver.name || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(driver.phone || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(driver.email || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(driver.vehicle || "")
          .toLowerCase()
          .includes(searchValue)
      );
    })
    .slice(0, 4);

  const shipmentResults = shipmentList
    .filter((shipment) => {
      if (!searchValue) {
        return false;
      }

      return (
        String(shipment.id || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(shipment.customer || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(shipment.driver || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(shipment.vehicle || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(shipment.pickupLocation || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(shipment.deliveryLocation || "")
          .toLowerCase()
          .includes(searchValue)
      );
    })
    .slice(0, 4);

  const totalResults =
    vehicleResults.length +
    driverResults.length +
    shipmentResults.length;

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  const handleSearchChange = (event) => {
    const value = event.target.value;

    setSearch(value);
    setShowResults(Boolean(value.trim()));
  };

  const clearSearch = () => {
    setSearch("");
    setShowResults(false);
  };

  const handleVehicleClick = (vehicle) => {
    clearSearch();
    navigate(`/vehicles/${vehicle.id}`);
  };

  const handleDriverClick = (driver) => {
    clearSearch();
    navigate(`/drivers/${driver.id}`);
  };

  const handleShipmentClick = (shipment) => {
    clearSearch();
    navigate(`/shipments/${shipment.id}`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        {/* MOBILE MENU */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
        >
          <FiMenu size={21} />
        </button>

        {/* SEARCH */}
        <div
          ref={searchRef}
          className="relative max-w-xl flex-1"
        >
          <FiSearch
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            onFocus={() =>
              setShowResults(Boolean(search.trim()))
            }
            placeholder="Search vehicles, drivers, shipments..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-10 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:bg-white"
          />

          {search && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <FiX size={16} />
            </button>
          )}

          {/* SEARCH RESULTS */}
          {showResults && (
            <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
              {totalResults > 0 ? (
                <div className="max-h-[420px] overflow-y-auto">
                  {/* VEHICLES */}
                  {vehicleResults.length > 0 && (
                    <SearchGroup title="Vehicles">
                      {vehicleResults.map(
                        (vehicle) => (
                          <SearchResult
                            key={vehicle.id}
                            icon={FiTruck}
                            title={
                              vehicle.vehicleName
                            }
                            subtitle={`${vehicle.registrationNumber} • ${
                              vehicle.location ||
                              "Unknown"
                            }`}
                            onClick={() =>
                              handleVehicleClick(
                                vehicle
                              )
                            }
                          />
                        )
                      )}
                    </SearchGroup>
                  )}

                  {/* DRIVERS */}
                  {driverResults.length > 0 && (
                    <SearchGroup title="Drivers">
                      {driverResults.map(
                        (driver) => (
                          <SearchResult
                            key={driver.id}
                            icon={FiUsers}
                            title={driver.name}
                            subtitle={`${driver.id} • ${
                              driver.vehicle ||
                              "Unassigned"
                            }`}
                            onClick={() =>
                              handleDriverClick(
                                driver
                              )
                            }
                          />
                        )
                      )}
                    </SearchGroup>
                  )}

                  {/* SHIPMENTS */}
                  {shipmentResults.length > 0 && (
                    <SearchGroup title="Shipments">
                      {shipmentResults.map(
                        (shipment) => (
                          <SearchResult
                            key={shipment.id}
                            icon={FiPackage}
                            title={shipment.id}
                            subtitle={`${
                              shipment.customer ||
                              "No customer"
                            } • ${
                              shipment.status ||
                              "Unknown"
                            }`}
                            onClick={() =>
                              handleShipmentClick(
                                shipment
                              )
                            }
                          />
                        )
                      )}
                    </SearchGroup>
                  )}
                </div>
              ) : (
                <div className="px-5 py-8 text-center">
                  <FiSearch
                    size={24}
                    className="mx-auto text-gray-300"
                  />

                  <p className="mt-3 text-sm font-semibold text-gray-700">
                    No results found
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Try another vehicle, driver, or shipment.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-1">
          {/* NOTIFICATIONS */}
          <button
            type="button"
            onClick={() =>
              navigate("/notifications")
            }
            className="relative rounded-xl p-2.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
            title="Notifications"
          >
            <FiBell size={20} />

            {unreadNotificationCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white ring-2 ring-white">
                {unreadNotificationCount > 9
                  ? "9+"
                  : unreadNotificationCount}
              </span>
            )}
          </button>

          {/* USER */}
          <div className="hidden items-center gap-3 border-l border-gray-200 pl-3 sm:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <FiUser size={17} />
            </div>

            <div className="hidden lg:block">
              <p className="text-xs font-semibold text-gray-800">
                Admin User
              </p>

              <p className="text-[11px] text-gray-400">
                Fleet Manager
              </p>
            </div>

            <FiChevronDown
              size={15}
              className="text-gray-400"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

/* =========================
   SEARCH GROUP
========================= */

function SearchGroup({
  title,
  children,
}) {
  return (
    <div className="border-b border-gray-100 last:border-0">
      <div className="bg-gray-50 px-4 py-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          {title}
        </p>
      </div>

      {children}
    </div>
  );
}

/* =========================
   SEARCH RESULT
========================= */

function SearchResult({
  icon: Icon,
  title,
  subtitle,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-blue-50"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
        <Icon size={16} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-gray-800">
          {title}
        </p>

        <p className="mt-0.5 truncate text-xs text-gray-400">
          {subtitle}
        </p>
      </div>
    </button>
  );
}

export default Navbar;