import {
  FiBell,
  FiCheck,
  FiCheckCircle,
  FiTrash2,
  FiX,
} from "react-icons/fi";

import { useApp } from "../context/AppContext";

function Notifications() {
  const {
    notificationList,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    clearNotifications,
  } = useApp();

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">
            Fleet Alerts
          </p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
            Notifications
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Stay updated with important fleet and shipment activity.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {unreadNotificationCount > 0 && (
            <button
              type="button"
              onClick={markAllNotificationsAsRead}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
            >
              <FiCheck size={15} />
              Mark All Read
            </button>
          )}

          {notificationList.length > 0 && (
            <button
              type="button"
              onClick={clearNotifications}
              className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-100"
            >
              <FiTrash2 size={15} />
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <NotificationStat
          label="Total"
          value={notificationList.length}
          icon={FiBell}
          iconClass="bg-blue-50 text-blue-600"
        />

        <NotificationStat
          label="Unread"
          value={unreadNotificationCount}
          icon={FiCheckCircle}
          iconClass="bg-red-50 text-red-600"
        />

        <NotificationStat
          label="Read"
          value={
            notificationList.length -
            unreadNotificationCount
          }
          icon={FiCheck}
          iconClass="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* LIST */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {notificationList.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {notificationList.map(
              (notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onRead={() =>
                    markNotificationAsRead(
                      notification.id
                    )
                  }
                  onDelete={() =>
                    deleteNotification(
                      notification.id
                    )
                  }
                />
              )
            )}
          </div>
        ) : (
          <EmptyNotifications />
        )}
      </div>
    </div>
  );
}

/* =========================
   STAT
========================= */

function NotificationStat({
  label,
  value,
  icon: Icon,
  iconClass,
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={18} />
        </div>

        <div>
          <p className="text-xs text-gray-500">
            {label}
          </p>

          <p className="mt-1 text-xl font-bold text-gray-900">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================
   NOTIFICATION ITEM
========================= */

function NotificationItem({
  notification,
  onRead,
  onDelete,
}) {
  const typeStyle = getTypeStyle(
    notification.type
  );

  const priorityStyle =
    getPriorityStyle(
      notification.priority
    );

  return (
    <div
      className={`p-5 transition sm:p-6 ${
        notification.read
          ? "bg-white"
          : "bg-blue-50/30"
      }`}
    >
      <div className="flex items-start gap-4">
        {/* ICON */}
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${typeStyle.icon}`}
        >
          <FiBell size={19} />
        </div>

        {/* CONTENT */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3
                  className={`text-sm font-bold ${
                    notification.read
                      ? "text-gray-800"
                      : "text-gray-900"
                  }`}
                >
                  {notification.title}
                </h3>

                {!notification.read && (
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                )}
              </div>

              <div className="mt-2 flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${typeStyle.badge}`}
                >
                  {notification.type}
                </span>

                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${priorityStyle}`}
                >
                  {notification.priority} Priority
                </span>
              </div>
            </div>

            <span className="shrink-0 text-xs text-gray-400">
              {notification.time}
            </span>
          </div>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-500">
            {notification.message}
          </p>

          {/* ACTIONS */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {!notification.read && (
              <button
                type="button"
                onClick={onRead}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100"
              >
                <FiCheck size={14} />
                Mark as Read
              </button>
            )}

            <button
              type="button"
              onClick={onDelete}
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
            >
              <FiTrash2 size={14} />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================
   TYPE STYLE
========================= */

function getTypeStyle(type) {
  const styles = {
    Shipment: {
      icon: "bg-blue-50 text-blue-600",
      badge: "bg-blue-50 text-blue-600",
    },

    Vehicle: {
      icon: "bg-violet-50 text-violet-600",
      badge: "bg-violet-50 text-violet-600",
    },

    Driver: {
      icon: "bg-emerald-50 text-emerald-600",
      badge: "bg-emerald-50 text-emerald-600",
    },

    Maintenance: {
      icon: "bg-amber-50 text-amber-600",
      badge: "bg-amber-50 text-amber-600",
    },
  };

  return (
    styles[type] || {
      icon: "bg-gray-100 text-gray-600",
      badge: "bg-gray-100 text-gray-600",
    }
  );
}

/* =========================
   PRIORITY STYLE
========================= */

function getPriorityStyle(priority) {
  const styles = {
    High: "bg-red-50 text-red-600",
    Medium: "bg-amber-50 text-amber-600",
    Low: "bg-gray-100 text-gray-500",
  };

  return (
    styles[priority] ||
    "bg-gray-100 text-gray-500"
  );
}

/* =========================
   EMPTY
========================= */

function EmptyNotifications() {
  return (
    <div className="px-6 py-20 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
        <FiBell size={27} />
      </div>

      <h2 className="mt-5 text-lg font-bold text-gray-900">
        You're all caught up
      </h2>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
        There are no notifications or alerts at the moment.
      </p>
    </div>
  );
}

export default Notifications;