function VehicleStatus({ status }) {
  const statusStyles = {
    Active: "bg-emerald-50 text-emerald-700",
    "In Transit": "bg-blue-50 text-blue-700",
    Maintenance: "bg-amber-50 text-amber-700",
    Inactive: "bg-gray-100 text-gray-600",
  };

  const dotStyles = {
    Active: "bg-emerald-500",
    "In Transit": "bg-blue-500",
    Maintenance: "bg-amber-500",
    Inactive: "bg-gray-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
        statusStyles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          dotStyles[status] || "bg-gray-400"
        }`}
      />

      {status}
    </span>
  );
}

export default VehicleStatus;