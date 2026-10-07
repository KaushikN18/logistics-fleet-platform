import { vehicles } from "../data/vehicleData";
import { drivers } from "../data/driverData";
import { shipments } from "../data/shipmentData";
import { notifications } from "../data/notificationData";

const delay = (ms = 400) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const cloneData = (data) => JSON.parse(JSON.stringify(data));

export const mockVehicleService = {
  getAll: async () => {
    await delay();
    return cloneData(vehicles);
  },

  getById: async (vehicleId) => {
    await delay();

    const vehicle = vehicles.find(
      (item) => item.id === vehicleId
    );

    return vehicle ? cloneData(vehicle) : null;
  },

  create: async (vehicleData) => {
    await delay();

    return {
      id: `VH-${Date.now().toString().slice(-3)}`,
      ...cloneData(vehicleData),
    };
  },

  update: async (vehicleId, vehicleData) => {
    await delay();

    return {
      id: vehicleId,
      ...cloneData(vehicleData),
    };
  },

  remove: async (vehicleId) => {
    await delay();

    return {
      success: true,
      id: vehicleId,
    };
  },
};

export const mockDriverService = {
  getAll: async () => {
    await delay();
    return cloneData(drivers);
  },

  getById: async (driverId) => {
    await delay();

    const driver = drivers.find(
      (item) => item.id === driverId
    );

    return driver ? cloneData(driver) : null;
  },

  create: async (driverData) => {
    await delay();

    return {
      id: `DR-${Date.now().toString().slice(-3)}`,
      ...cloneData(driverData),
    };
  },

  update: async (driverId, driverData) => {
    await delay();

    return {
      id: driverId,
      ...cloneData(driverData),
    };
  },

  remove: async (driverId) => {
    await delay();

    return {
      success: true,
      id: driverId,
    };
  },
};

export const mockShipmentService = {
  getAll: async () => {
    await delay();
    return cloneData(shipments);
  },

  getById: async (shipmentId) => {
    await delay();

    const shipment = shipments.find(
      (item) => item.id === shipmentId
    );

    return shipment ? cloneData(shipment) : null;
  },

  create: async (shipmentData) => {
    await delay();

    return {
      id: `SHP-${Date.now().toString().slice(-4)}`,
      ...cloneData(shipmentData),
    };
  },

  update: async (shipmentId, shipmentData) => {
    await delay();

    return {
      id: shipmentId,
      ...cloneData(shipmentData),
    };
  },

  remove: async (shipmentId) => {
    await delay();

    return {
      success: true,
      id: shipmentId,
    };
  },
};

export const mockNotificationService = {
  getAll: async () => {
    await delay();
    return cloneData(notifications);
  },

  markAsRead: async (notificationId) => {
    await delay();

    return {
      success: true,
      id: notificationId,
    };
  },

  markAllAsRead: async () => {
    await delay();

    return {
      success: true,
    };
  },

  remove: async (notificationId) => {
    await delay();

    return {
      success: true,
      id: notificationId,
    };
  },

  clearAll: async () => {
    await delay();

    return {
      success: true,
    };
  },
};