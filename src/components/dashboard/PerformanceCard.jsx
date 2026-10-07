import {
  FiTrendingUp,
  FiTrendingDown,
} from "react-icons/fi";

function PerformanceCard({
  title,
  percentage,
  description,
  positive = true,
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800">
          {title}
        </h3>

        <div
          className={`flex items-center gap-1 text-xs font-semibold ${
            positive ? "text-emerald-600" : "text-red-600"
          }`}
        >
          {positive ? (
            <FiTrendingUp size={14} />
          ) : (
            <FiTrendingDown size={14} />
          )}

          {percentage}
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-end justify-between">
          <span className="text-3xl font-bold text-gray-900">
            {percentage}
          </span>

          <span className="text-xs text-gray-400">
            {description}
          </span>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
          <div
            className={`h-full rounded-full ${
              positive ? "bg-blue-600" : "bg-red-500"
            }`}
            style={{
              width: positive ? "82%" : "38%",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default PerformanceCard;