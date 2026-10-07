import {
  FiTruck,
  FiUsers,
  FiPackage,
  FiAlertTriangle,
} from "react-icons/fi";

const iconMap = {
  vehicles: FiTruck,
  drivers: FiUsers,
  shipments: FiPackage,
  delayed: FiAlertTriangle,
};

function StatCard({
  title,
  value,
  change,
  description,
  type,
  positive = true,
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-bold text-gray-900">
            {value}
          </h3>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon size={21} />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span
          className={`text-xs font-semibold ${
            positive ? "text-emerald-600" : "text-red-600"
          }`}
        >
          {change}
        </span>

        <span className="text-xs text-gray-400">
          {description}
        </span>
      </div>
    </div>
  );
}

export default StatCard;