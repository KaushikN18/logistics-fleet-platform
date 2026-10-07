export const dashboardStats = [
  {
    title: "Total Vehicles",
    value: "124",
    change: "+8.2%",
    description: "from last month",
    type: "vehicles",
    positive: true,
  },
  {
    title: "Total Drivers",
    value: "86",
    change: "+4.5%",
    description: "from last month",
    type: "drivers",
    positive: true,
  },
  {
    title: "Active Shipments",
    value: "42",
    change: "+12.4%",
    description: "from yesterday",
    type: "shipments",
    positive: true,
  },
  {
    title: "Delayed Shipments",
    value: "7",
    change: "-18.3%",
    description: "from yesterday",
    type: "delayed",
    positive: true,
  },
];

export const recentActivities = [
  {
    id: 1,
    title: "Shipment delivered",
    description: "SHP-1024 was delivered successfully",
    time: "10 minutes ago",
    type: "success",
  },
  {
    id: 2,
    title: "Driver assigned",
    description: "Arun Kumar assigned to VH-008",
    time: "25 minutes ago",
    type: "info",
  },
  {
    id: 3,
    title: "Vehicle maintenance",
    description: "VH-014 scheduled for maintenance",
    time: "1 hour ago",
    type: "warning",
  },
  {
    id: 4,
    title: "New shipment created",
    description: "SHP-1029 created by Operations",
    time: "2 hours ago",
    type: "info",
  },
];

export const alerts = [
  {
    id: 1,
    title: "Delayed shipment",
    description: "SHP-1018 is 45 minutes behind schedule",
    type: "danger",
  },
  {
    id: 2,
    title: "Maintenance due",
    description: "VH-021 requires maintenance",
    type: "warning",
  },
  {
    id: 3,
    title: "Driver status",
    description: "3 drivers are currently unavailable",
    type: "warning",
  },
];