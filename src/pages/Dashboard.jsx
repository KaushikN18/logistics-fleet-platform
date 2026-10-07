import {
  FiTruck,
  FiUsers,
  FiPackage,
  FiCheckCircle,
  FiClock,
  FiAlertTriangle,
  FiActivity,
  FiArrowRight,
  FiMapPin,
  FiBell,
  FiPlus,
  FiNavigation,
  FiUserPlus,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

import { useApp } from "../context/AppContext";

import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";

function Dashboard() {
  const navigate = useNavigate();

  const {
    vehicleList,
    driverList,
    shipmentList,
    notificationList,
    dashboardSummary,
    isLoading,
    apiError,
  } = useApp();

  // --------------------------------------------------
  // DERIVED DATA
  // --------------------------------------------------

  const recentShipments = useMemo(() => {
    return shipmentList.slice(0, 5);
  }, [shipmentList]);

  const recentNotifications = useMemo(() => {
    return notificationList.slice(0, 5);
  }, [notificationList]);

  const topDrivers = useMemo(() => {
    return [...driverList]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 5);
  }, [driverList]);

  // --------------------------------------------------
  // SHIPMENT PERFORMANCE
  // --------------------------------------------------

  const shipmentPerformance = useMemo(() => {
    const total = shipmentList.length || 1;

    const delivered = shipmentList.filter(
      (shipment) => shipment.status === "Delivered"
    ).length;

    const inTransit = shipmentList.filter(
      (shipment) => shipment.status === "In Transit"
    ).length;

    const pending = shipmentList.filter(
      (shipment) =>
        shipment.status === "Pending" ||
        shipment.status === "Out for Delivery"
    ).length;

    const delayed = shipmentList.filter(
      (shipment) => shipment.status === "Delayed"
    ).length;

    return [
      {
        label: "Delivered",
        value: delivered,
        percentage: Math.round((delivered / total) * 100),
        icon: FiCheckCircle,
        className: "bg-emerald-500",
      },
      {
        label: "In Transit",
        value: inTransit,
        percentage: Math.round((inTransit / total) * 100),
        icon: FiNavigation,
        className: "bg-blue-500",
      },
      {
        label: "Pending",
        value: pending,
        percentage: Math.round((pending / total) * 100),
        icon: FiClock,
        className: "bg-amber-500",
      },
      {
        label: "Delayed",
        value: delayed,
        percentage: Math.round((delayed / total) * 100),
        icon: FiAlertTriangle,
        className: "bg-red-500",
      },
    ];
  }, [shipmentList]);

  // --------------------------------------------------
  // FLEET PERFORMANCE
  // --------------------------------------------------

  const fleetPerformance = useMemo(() => {
    const total = vehicleList.length || 1;

    const active = vehicleList.filter(
      (vehicle) => vehicle.status === "Active"
    ).length;

    const inTransit = vehicleList.filter(
      (vehicle) => vehicle.status === "In Transit"
    ).length;

    const maintenance = vehicleList.filter(
      (vehicle) => vehicle.status === "Maintenance"
    ).length;

    const inactive = vehicleList.filter(
      (vehicle) => vehicle.status === "Inactive"
    ).length;

    return [
      {
        label: "Active",
        value: active,
        percentage: Math.round((active / total) * 100),
        className: "bg-emerald-500",
      },
      {
        label: "In Transit",
        value: inTransit,
        percentage: Math.round((inTransit / total) * 100),
        className: "bg-blue-500",
      },
      {
        label: "Maintenance",
        value: maintenance,
        percentage: Math.round((maintenance / total) * 100),
        className: "bg-amber-500",
      },
      {
        label: "Inactive",
        value: inactive,
        percentage: Math.round((inactive / total) * 100),
        className: "bg-gray-400",
      },
    ];
  }, [vehicleList]);

  // --------------------------------------------------
  // HELPERS
  // --------------------------------------------------

  const getStatusClass = (status) => {
    const styles = {
      Delivered: "bg-emerald-50 text-emerald-700",
      "In Transit": "bg-blue-50 text-blue-700",
      "Out for Delivery": "bg-indigo-50 text-indigo-700",
      Pending: "bg-amber-50 text-amber-700",
      Delayed: "bg-red-50 text-red-700",
      Active: "bg-emerald-50 text-emerald-700",
      Maintenance: "bg-amber-50 text-amber-700",
      Inactive: "bg-gray-100 text-gray-600",
    };

    return styles[status] || "bg-gray-100 text-gray-600";
  };

  const getNotificationClass = (priority) => {
    const styles = {
      High: "bg-red-50 text-red-600",
      Medium: "bg-amber-50 text-amber-600",
      Low: "bg-blue-50 text-blue-600",
    };

    return styles[priority] || "bg-gray-100 text-gray-600";
  };

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  // --------------------------------------------------
  // STAT CARDS
  // --------------------------------------------------

  const stats = [
    {
      title: "Total Vehicles",
      value: dashboardSummary.totalVehicles,
      subtitle: `${dashboardSummary.activeVehicles} active`,
      icon: FiTruck,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      path: "/vehicles",
    },
    {
      title: "Total Drivers",
      value: dashboardSummary.totalDrivers,
      subtitle: `${dashboardSummary.availableDrivers} available`,
      icon: FiUsers,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      path: "/drivers",
    },
    {
      title: "Active Shipments",
      value: dashboardSummary.activeShipments,
      subtitle: `${dashboardSummary.inTransitVehicles} vehicles in transit`,
      icon: FiPackage,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      path: "/shipments",
    },
    {
      title: "Delayed Shipments",
      value: dashboardSummary.delayedShipments,
      subtitle: "Needs attention",
      icon: FiAlertTriangle,
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
      path: "/shipments",
    },
  ];

  // --------------------------------------------------
  // LOADING STATE
  // IMPORTANT:
  // This comes AFTER all hooks.
  // --------------------------------------------------

  if (isLoading) {
    return <Loading message="Loading dashboard..." />;
  }

  // --------------------------------------------------
  // ERROR STATE
  // --------------------------------------------------

  if (apiError) {
    return (
      <ErrorMessage
        message={apiError}
        onRetry={() => window.location.reload()}
      />
    );
  }

  // --------------------------------------------------
  // DASHBOARD UI
  // --------------------------------------------------

  return (
    <div className="space-y-6">
      {/* ==================== Header ==================== */}

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Monitor your fleet, drivers and shipments from one place.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate("/shipments")}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <FiPlus size={17} />
            New Shipment
          </button>

          <button
            onClick={() => navigate("/tracking")}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            <FiNavigation size={17} />
            Live Tracking
          </button>
        </div>
      </div>

      {/* ==================== Stats ==================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <button
              key={stat.title}
              onClick={() => navigate(stat.path)}
              className="group rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconBg}`}
                >
                  <Icon size={23} className={stat.iconColor} />
                </div>

                <FiArrowRight
                  size={18}
                  className="text-gray-300 transition group-hover:translate-x-1 group-hover:text-gray-500"
                />
              </div>

              <p className="mt-4 text-sm font-medium text-gray-500">
                {stat.title}
              </p>

              <div className="mt-1 flex items-end gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </span>
              </div>

              <p className="mt-1 text-xs text-gray-400">
                {stat.subtitle}
              </p>
            </button>
          );
        })}
      </div>

      {/* ==================== Performance ==================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Shipment Performance */}

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Shipment Performance
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Current shipment status overview
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FiPackage size={20} />
            </div>
          </div>

          <div className="mt-6 space-y-5">
            {shipmentPerformance.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon size={16} className="text-gray-500" />

                      <span className="text-sm font-medium text-gray-700">
                        {item.label}
                      </span>
                    </div>

                    <span className="text-sm font-semibold text-gray-900">
                      {item.value}{" "}
                      <span className="font-normal text-gray-400">
                        ({item.percentage}%)
                      </span>
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full ${item.className} transition-all duration-500`}
                      style={{
                        width: `${Math.min(item.percentage, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fleet Performance */}

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Fleet Performance
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Current vehicle availability
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <FiActivity size={20} />
            </div>
          </div>

          <div className="mt-6 space-y-5">
            {fleetPerformance.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {item.label}
                  </span>

                  <span className="text-sm font-semibold text-gray-900">
                    {item.value}{" "}
                    <span className="font-normal text-gray-400">
                      ({item.percentage}%)
                    </span>
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full ${item.className} transition-all duration-500`}
                    style={{
                      width: `${Math.min(item.percentage, 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate("/vehicles")}
            className="mt-6 flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            View all vehicles
            <FiArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* ==================== Recent Shipments + Alerts ==================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Recent Shipments */}

        <div className="xl:col-span-2 rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 p-5 sm:p-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Recent Shipments
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Latest shipment activity
              </p>
            </div>

            <button
              onClick={() => navigate("/shipments")}
              className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View all
              <FiArrowRight size={15} />
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {recentShipments.length > 0 ? (
              recentShipments.map((shipment) => (
                <button
                  key={shipment.id}
                  onClick={() =>
                    navigate(`/shipments/${shipment.id}`)
                  }
                  className="flex w-full items-center justify-between gap-4 p-4 text-left transition hover:bg-gray-50 sm:p-5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <FiPackage size={18} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {shipment.id}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-gray-500">
                        {shipment.customer || "Customer"} •{" "}
                        {shipment.deliveryLocation ||
                          shipment.destination ||
                          "Destination"}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                        shipment.status
                      )}`}
                    >
                      {shipment.status}
                    </span>

                    <p className="mt-1 text-xs text-gray-400">
                      {shipment.date ||
                        shipment.deliveryDate ||
                        "Today"}
                    </p>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-8 text-center text-sm text-gray-500">
                No shipments available.
              </div>
            )}
          </div>
        </div>

        {/* Alerts */}

        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 p-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Alerts
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Recent notifications
              </p>
            </div>

            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <FiBell size={19} />

              {dashboardSummary.unreadNotifications > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {dashboardSummary.unreadNotifications > 9
                    ? "9+"
                    : dashboardSummary.unreadNotifications}
                </span>
              )}
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {recentNotifications.length > 0 ? (
              recentNotifications.slice(0, 4).map(
                (notification) => (
                  <button
                    key={notification.id}
                    onClick={() =>
                      navigate("/notifications")
                    }
                    className="flex w-full gap-3 p-4 text-left transition hover:bg-gray-50"
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${getNotificationClass(
                        notification.priority
                      )}`}
                    >
                      <FiAlertTriangle size={16} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`truncate text-sm ${
                            notification.read
                              ? "font-medium text-gray-700"
                              : "font-bold text-gray-900"
                          }`}
                        >
                          {notification.title}
                        </p>

                        {!notification.read && (
                          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                        )}
                      </div>

                      <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                        {notification.message}
                      </p>

                      <p className="mt-1.5 text-[11px] text-gray-400">
                        {notification.time}
                      </p>
                    </div>
                  </button>
                )
              )
            ) : (
              <div className="p-8 text-center text-sm text-gray-500">
                No alerts available.
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 p-4">
            <button
              onClick={() => navigate("/notifications")}
              className="w-full rounded-xl bg-gray-50 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
            >
              View all notifications
            </button>
          </div>
        </div>
      </div>

      {/* ==================== Driver Performance ==================== */}

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 p-5 sm:p-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Top Drivers
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Driver performance overview
            </p>
          </div>

          <button
            onClick={() => navigate("/drivers")}
            className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            View all
            <FiArrowRight size={15} />
          </button>
        </div>

        <div className="grid grid-cols-1 divide-y divide-gray-100 md:grid-cols-2 md:divide-x md:divide-y-0 xl:grid-cols-5">
          {topDrivers.map((driver) => {
            const completionRate =
              driver.deliveries > 0
                ? Math.round(
                    (driver.completedDeliveries /
                      driver.deliveries) *
                      100
                  )
                : 0;

            return (
              <button
                key={driver.id}
                onClick={() =>
                  navigate(`/drivers/${driver.id}`)
                }
                className="flex items-center gap-3 p-4 text-left transition hover:bg-gray-50 xl:block"
              >
                <div className="flex items-center gap-3 xl:flex-col xl:items-start">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                    {getInitials(driver.name)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {driver.name}
                    </p>

                    <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                      <FiMapPin size={12} />
                      {driver.location}
                    </div>
                  </div>
                </div>

                <div className="ml-auto text-right xl:mt-4 xl:text-left">
                  <div className="flex items-center justify-end gap-1 xl:justify-start">
                    <span className="text-sm font-bold text-gray-900">
                      {driver.rating}
                    </span>

                    <span className="text-amber-500">
                      ★
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-gray-400">
                    {completionRate}% completed
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ==================== Quick Actions ==================== */}

      <div>
        <h2 className="mb-4 text-lg font-bold text-gray-900">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <QuickAction
            icon={FiPackage}
            title="Create Shipment"
            description="Add a new shipment"
            onClick={() => navigate("/shipments")}
          />

          <QuickAction
            icon={FiTruck}
            title="Manage Vehicles"
            description="View fleet vehicles"
            onClick={() => navigate("/vehicles")}
          />

          <QuickAction
            icon={FiUserPlus}
            title="Manage Drivers"
            description="View driver profiles"
            onClick={() => navigate("/drivers")}
          />

          <QuickAction
            icon={FiNavigation}
            title="Track Fleet"
            description="View live tracking"
            onClick={() => navigate("/tracking")}
          />
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------
// QUICK ACTION COMPONENT
// --------------------------------------------------

function QuickAction({
  icon: Icon,
  title,
  description,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-md"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
        <Icon size={20} />
      </div>

      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-900">
          {title}
        </p>

        <p className="mt-0.5 text-xs text-gray-500">
          {description}
        </p>
      </div>

      <FiArrowRight
        size={17}
        className="ml-auto text-gray-300 transition group-hover:translate-x-1 group-hover:text-gray-500"
      />
    </button>
  );
}

export default Dashboard;