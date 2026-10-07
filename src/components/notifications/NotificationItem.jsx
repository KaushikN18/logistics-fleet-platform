import {
  FiTruck,
  FiPackage,
  FiUser,
  FiTool,
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiTrash2,
  FiCheck,
} from "react-icons/fi";

const iconMap = {
  Shipment: FiPackage,
  Vehicle: FiTruck,
  Driver: FiUser,
  Maintenance: FiTool,
};

const iconStyles = {
  Shipment: "bg-blue-50 text-blue-600",
  Vehicle: "bg-amber-50 text-amber-600",
  Driver: "bg-purple-50 text-purple-600",
  Maintenance: "bg-emerald-50 text-emerald-600",
};

const priorityStyles = {
  High: "bg-red-50 text-red-600",
  Medium: "bg-amber-50 text-amber-600",
  Low: "bg-gray-100 text-gray-500",
};

function NotificationItem({
  notification,
  onMarkRead,
  onDelete,
}) {
  const Icon = iconMap[notification.type] || FiAlertTriangle;

  return (
    <div
      className={`group relative border-b border-gray-100 p-5 transition hover:bg-gray-50 ${
        !notification.read ? "bg-blue-50/30" : "bg-white"
      }`}
    >
      <div className="flex gap-4">
        {/* Icon */}
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
            iconStyles[notification.type] ||
            "bg-gray-100 text-gray-500"
          }`}
        >
          <Icon size={20} />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3
                  className={`text-sm ${
                    notification.read
                      ? "font-medium text-gray-700"
                      : "font-bold text-gray-900"
                  }`}
                >
                  {notification.title}
                </h3>

                {!notification.read && (
                  <span className="h-2 w-2 rounded-full bg-blue-600" />
                )}
              </div>

              <p className="mt-1 text-sm leading-6 text-gray-500">
                {notification.message}
              </p>
            </div>

            <span
              className={`w-fit rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                priorityStyles[notification.priority]
              }`}
            >
              {notification.priority}
            </span>
          </div>

          {/* Footer */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <FiClock size={13} />
                {notification.time}
              </span>

              <span>{notification.type}</span>
            </div>

            <div className="flex items-center gap-1">
              {!notification.read && (
                <button
                  type="button"
                  onClick={() =>
                    onMarkRead(notification.id)
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-50"
                >
                  <FiCheck size={13} />
                  Mark as read
                </button>
              )}

              <button
                type="button"
                onClick={() =>
                  onDelete(notification.id)
                }
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-400 transition hover:bg-red-50 hover:text-red-600"
              >
                <FiTrash2 size={13} />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationItem;