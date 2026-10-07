import { FiTrendingUp } from "react-icons/fi";

const shipmentData = [
  { day: "Mon", delivered: 42, transit: 28 },
  { day: "Tue", delivered: 55, transit: 34 },
  { day: "Wed", delivered: 48, transit: 31 },
  { day: "Thu", delivered: 68, transit: 42 },
  { day: "Fri", delivered: 61, transit: 38 },
  { day: "Sat", delivered: 74, transit: 46 },
  { day: "Sun", delivered: 81, transit: 51 },
];

function ShipmentChart() {
  const maxValue = 90;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-gray-900">
            Shipment Performance
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Weekly shipment activity
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
            <span className="text-gray-500">
              Delivered
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-200" />
            <span className="text-gray-500">
              In Transit
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-6 flex h-64 gap-3">
        {/* Y Axis */}
        <div className="flex flex-col justify-between pb-6 text-[10px] text-gray-400">
          <span>90</span>
          <span>60</span>
          <span>30</span>
          <span>0</span>
        </div>

        {/* Chart Area */}
        <div className="relative flex flex-1 items-end justify-between gap-2 border-b border-l border-gray-100 px-2 pb-0">
          {/* Grid */}
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
            <div className="border-t border-dashed border-gray-100" />
            <div className="border-t border-dashed border-gray-100" />
            <div className="border-t border-dashed border-gray-100" />
            <div />
          </div>

          {shipmentData.map((item) => (
            <div
              key={item.day}
              className="relative z-10 flex h-full flex-1 items-end justify-center gap-1"
            >
              {/* Delivered */}
              <div
                className="w-3 rounded-t-md bg-blue-600 transition-all duration-300 hover:bg-blue-700 sm:w-5"
                style={{
                  height: `${(item.delivered / maxValue) * 100}%`,
                }}
                title={`${item.delivered} delivered`}
              />

              {/* Transit */}
              <div
                className="w-3 rounded-t-md bg-indigo-200 transition-all duration-300 hover:bg-indigo-300 sm:w-5"
                style={{
                  height: `${(item.transit / maxValue) * 100}%`,
                }}
                title={`${item.transit} in transit`}
              />

              {/* Day */}
              <span className="absolute -bottom-6 text-[10px] text-gray-400">
                {item.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Summary */}
      <div className="mt-10 flex items-center gap-2 border-t border-gray-100 pt-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <FiTrendingUp size={15} />
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-800">
            12.8% increase
          </p>

          <p className="text-[11px] text-gray-400">
            Compared with last week
          </p>
        </div>
      </div>
    </div>
  );
}

export default ShipmentChart;