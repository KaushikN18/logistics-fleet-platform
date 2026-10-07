function ShipmentStatus({ status }) {
  const statusStyles = {
    Pending: "bg-gray-100 text-gray-700",
    "In Transit": "bg-blue-50 text-blue-700",
    Delivered: "bg-emerald-50 text-emerald-700",
    Delayed: "bg-red-50 text-red-700",
    Cancelled: "bg-gray-100 text-gray-500",
  };

  const dotStyles = {
    Pending: "bg-gray-400",
    "In Transit": "bg-blue-500",
    Delivered: "bg-emerald-500",
    Delayed: "bg-red-500",
    Cancelled: "bg-gray-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
        statusStyles[status] ||
        "bg-gray-100 text-gray-600"
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

export default ShipmentStatus;