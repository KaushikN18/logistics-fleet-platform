export const notifications = [
  {
    id: 1,
    title: "Shipment Delayed",
    message:
      "SHP-1018 is running 45 minutes behind the scheduled delivery time.",
    type: "Shipment",
    priority: "High",
    time: "10 minutes ago",
    read: false,
  },
  {
    id: 2,
    title: "Vehicle Maintenance Due",
    message:
      "VH-021 is due for scheduled maintenance. Please assign it to the service team.",
    type: "Vehicle",
    priority: "Medium",
    time: "25 minutes ago",
    read: false,
  },
  {
    id: 3,
    title: "Driver Unavailable",
    message:
      "Driver Arun Kumar has marked himself unavailable for today's shift.",
    type: "Driver",
    priority: "Medium",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 4,
    title: "Shipment Delivered",
    message:
      "SHP-1024 has been successfully delivered to the customer.",
    type: "Shipment",
    priority: "Low",
    time: "2 hours ago",
    read: true,
  },
  {
    id: 5,
    title: "Vehicle Fuel Low",
    message:
      "VH-006 fuel level has dropped below 20%. Refueling is recommended.",
    type: "Vehicle",
    priority: "High",
    time: "3 hours ago",
    read: true,
  },
  {
    id: 6,
    title: "New Driver Added",
    message:
      "Karthik Raj has been added to the fleet driver list.",
    type: "Driver",
    priority: "Low",
    time: "5 hours ago",
    read: true,
  },
  {
    id: 7,
    title: "Maintenance Completed",
    message:
      "Scheduled maintenance for VH-014 has been completed successfully.",
    type: "Maintenance",
    priority: "Low",
    time: "Yesterday",
    read: true,
  },
  {
    id: 8,
    title: "Delivery Route Updated",
    message:
      "The delivery route for SHP-1030 has been updated by Operations.",
    type: "Shipment",
    priority: "Medium",
    time: "Yesterday",
    read: true,
  },
];