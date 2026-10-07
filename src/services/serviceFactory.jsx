import USE_MOCK_API from "./apiConfig";

import {
  mockVehicleService,
  mockDriverService,
  mockShipmentService,
  mockNotificationService,
} from "./mockApi";

import {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "./vehicleService";

import {
  getDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
} from "./driverService";

import {
  getShipments,
  getShipmentById,
  createShipment,
  updateShipment,
  deleteShipment,
} from "./shipmentService";

import {
  getNotifications,
  getNotificationById,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearNotifications,
} from "./notificationService";

const apiVehicleService = {
  getAll: getVehicles,
  getById: getVehicleById,
  create: createVehicle,
  update: updateVehicle,
  remove: deleteVehicle,
};

const apiDriverService = {
  getAll: getDrivers,
  getById: getDriverById,
  create: createDriver,
  update: updateDriver,
  remove: deleteDriver,
};

const apiShipmentService = {
  getAll: getShipments,
  getById: getShipmentById,
  create: createShipment,
  update: updateShipment,
  remove: deleteShipment,
};

const apiNotificationService = {
  getAll: getNotifications,
  getById: getNotificationById,
  markAsRead: markNotificationAsRead,
  markAllAsRead: markAllNotificationsAsRead,
  remove: deleteNotification,
  clearAll: clearNotifications,
};

export const vehicleService = USE_MOCK_API
  ? mockVehicleService
  : apiVehicleService;

export const driverService = USE_MOCK_API
  ? mockDriverService
  : apiDriverService;

export const shipmentService = USE_MOCK_API
  ? mockShipmentService
  : apiShipmentService;

export const notificationService = USE_MOCK_API
  ? mockNotificationService
  : apiNotificationService;