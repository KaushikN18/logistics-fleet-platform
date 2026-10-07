import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { drivers as initialDrivers } from "../data/driverData";
import { vehicles as initialVehicles } from "../data/vehicleData";
import { shipments as initialShipments } from "../data/shipmentData";
import {
  notifications as initialNotifications,
} from "../data/notificationData";

import {
  getVehicles,
  createVehicle,
  updateVehicle as updateVehicleApi,
  deleteVehicle as deleteVehicleApi,
} from "../services/vehicleService";

import {
  getDrivers,
  createDriver,
  updateDriver as updateDriverApi,
  deleteDriver as deleteDriverApi,
} from "../services/driverService";

import {
  getShipments,
  createShipment,
  updateShipment as updateShipmentApi,
  deleteShipment as deleteShipmentApi,
} from "../services/shipmentService";

const AppContext = createContext(null);

const USE_MOCK_API =
  import.meta.env.VITE_USE_MOCK_API !== "false";

/* =====================================================
   PROVIDER
===================================================== */

export function AppProvider({ children }) {
  const [vehicleList, setVehicleList] =
    useState(initialVehicles);

  const [driverList, setDriverList] =
    useState(initialDrivers);

  const [shipmentList, setShipmentList] =
    useState(initialShipments);

  const [notificationList, setNotificationList] =
    useState(initialNotifications);

  const [isLoading, setIsLoading] = useState(false);

  const [apiError, setApiError] = useState("");

  /* =====================================================
     LOAD DATA
  ===================================================== */

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    if (USE_MOCK_API) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setApiError("");

      const [
        vehicles,
        drivers,
        shipments,
      ] = await Promise.all([
        getVehicles(),
        getDrivers(),
        getShipments(),
      ]);

      setVehicleList(
        Array.isArray(vehicles)
          ? vehicles
          : vehicles?.data || []
      );

      setDriverList(
        Array.isArray(drivers)
          ? drivers
          : drivers?.data || []
      );

      setShipmentList(
        Array.isArray(shipments)
          ? shipments
          : shipments?.data || []
      );
    } catch (error) {
      console.error(
        "Failed to load API data:",
        error
      );

      setApiError(
        error?.message ||
          "Failed to load application data."
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* =====================================================
     VEHICLES
  ===================================================== */

  const addVehicle = async (vehicle) => {
    try {
      setApiError("");

      if (!USE_MOCK_API) {
        const response =
          await createVehicle(vehicle);

        const createdVehicle =
          response?.data || response;

        setVehicleList((prev) => [
          ...prev,
          createdVehicle,
        ]);

        return createdVehicle;
      }

      setVehicleList((prev) => [
        ...prev,
        vehicle,
      ]);

      return vehicle;
    } catch (error) {
      setApiError(
        error?.message ||
          "Failed to add vehicle."
      );

      throw error;
    }
  };

  const updateVehicle = async (
    vehicleId,
    vehicleData
  ) => {
    try {
      setApiError("");

      let updatedVehicle = vehicleData;

      if (!USE_MOCK_API) {
        const response =
          await updateVehicleApi(
            vehicleId,
            vehicleData
          );

        updatedVehicle =
          response?.data || response;
      }

      setVehicleList((prev) =>
        prev.map((vehicle) =>
          vehicle.id === vehicleId
            ? {
                ...vehicle,
                ...updatedVehicle,
              }
            : vehicle
        )
      );

      return updatedVehicle;
    } catch (error) {
      setApiError(
        error?.message ||
          "Failed to update vehicle."
      );

      throw error;
    }
  };

  const deleteVehicle = async (
    vehicleId
  ) => {
    try {
      setApiError("");

      if (!USE_MOCK_API) {
        await deleteVehicleApi(vehicleId);
      }

      const vehicle = vehicleList.find(
        (item) => item.id === vehicleId
      );

      setVehicleList((prev) =>
        prev.filter(
          (item) => item.id !== vehicleId
        )
      );

      /* Clear vehicle from assigned driver */

      if (vehicle?.driverId) {
        setDriverList((prev) =>
          prev.map((driver) =>
            driver.id === vehicle.driverId
              ? {
                  ...driver,
                  vehicleId: "",
                  vehicle: "",
                  assignedVehicle: "",
                  vehicleName: "",
                }
              : driver
          )
        );
      }

      /* Clear vehicle from shipments */

      setShipmentList((prev) =>
        prev.map((shipment) =>
          shipment.vehicleId === vehicleId ||
          shipment.vehicle === vehicleId
            ? {
                ...shipment,
                vehicleId: "",
                vehicle: "",
                vehicleName: "",
              }
            : shipment
        )
      );
    } catch (error) {
      setApiError(
        error?.message ||
          "Failed to delete vehicle."
      );

      throw error;
    }
  };

  /* =====================================================
     DRIVERS
  ===================================================== */

  const addDriver = async (driver) => {
    try {
      setApiError("");

      if (!USE_MOCK_API) {
        const response =
          await createDriver(driver);

        const createdDriver =
          response?.data || response;

        setDriverList((prev) => [
          ...prev,
          createdDriver,
        ]);

        return createdDriver;
      }

      setDriverList((prev) => [
        ...prev,
        driver,
      ]);

      return driver;
    } catch (error) {
      setApiError(
        error?.message ||
          "Failed to add driver."
      );

      throw error;
    }
  };

  const updateDriver = async (
    driverId,
    driverData
  ) => {
    try {
      setApiError("");

      const oldDriver = driverList.find(
        (driver) => driver.id === driverId
      );

      let updatedDriver = driverData;

      if (!USE_MOCK_API) {
        const response =
          await updateDriverApi(
            driverId,
            driverData
          );

        updatedDriver =
          response?.data || response;
      }

      setDriverList((prev) =>
        prev.map((driver) =>
          driver.id === driverId
            ? {
                ...driver,
                ...updatedDriver,
              }
            : driver
        )
      );

      /* Remove old vehicle assignment */

      if (
        oldDriver?.vehicleId &&
        oldDriver.vehicleId !==
          driverData.vehicleId
      ) {
        setVehicleList((prev) =>
          prev.map((vehicle) =>
            vehicle.id === oldDriver.vehicleId
              ? {
                  ...vehicle,
                  driverId: "",
                  driver: "",
                }
              : vehicle
          )
        );
      }

      /* Assign new vehicle */

      if (driverData.vehicleId) {
        setVehicleList((prev) =>
          prev.map((vehicle) => {
            if (
              vehicle.id ===
              driverData.vehicleId
            ) {
              return {
                ...vehicle,
                driverId: driverId,
                driver:
                  driverData.name || "",
              };
            }

            if (
              vehicle.driverId === driverId &&
              vehicle.id !==
                driverData.vehicleId
            ) {
              return {
                ...vehicle,
                driverId: "",
                driver: "",
              };
            }

            return vehicle;
          })
        );
      }

      /* Sync shipments */

      setShipmentList((prev) =>
        prev.map((shipment) =>
          shipment.driverId === driverId
            ? {
                ...shipment,
                driver:
                  driverData.name ||
                  shipment.driver,
                vehicleId:
                  driverData.vehicleId ||
                  shipment.vehicleId,
                vehicle:
                  driverData.assignedVehicle ||
                  shipment.vehicle,
              }
            : shipment
        )
      );

      return updatedDriver;
    } catch (error) {
      setApiError(
        error?.message ||
          "Failed to update driver."
      );

      throw error;
    }
  };

  const deleteDriver = async (
    driverId
  ) => {
    try {
      setApiError("");

      if (!USE_MOCK_API) {
        await deleteDriverApi(driverId);
      }

      const driver = driverList.find(
        (item) => item.id === driverId
      );

      setDriverList((prev) =>
        prev.filter(
          (item) => item.id !== driverId
        )
      );

      /* Clear vehicle assignment */

      if (driver?.vehicleId) {
        setVehicleList((prev) =>
          prev.map((vehicle) =>
            vehicle.id === driver.vehicleId
              ? {
                  ...vehicle,
                  driverId: "",
                  driver: "",
                }
              : vehicle
          )
        );
      }

      /* Clear driver from shipments */

      setShipmentList((prev) =>
        prev.map((shipment) =>
          shipment.driverId === driverId
            ? {
                ...shipment,
                driverId: "",
                driver: "",
              }
            : shipment
        )
      );
    } catch (error) {
      setApiError(
        error?.message ||
          "Failed to delete driver."
      );

      throw error;
    }
  };

  /* =====================================================
     SHIPMENTS
  ===================================================== */

  const addShipment = async (shipment) => {
    try {
      setApiError("");

      if (!USE_MOCK_API) {
        const response =
          await createShipment(shipment);

        const createdShipment =
          response?.data || response;

        setShipmentList((prev) => [
          ...prev,
          createdShipment,
        ]);

        return createdShipment;
      }

      setShipmentList((prev) => [
        ...prev,
        shipment,
      ]);

      return shipment;
    } catch (error) {
      setApiError(
        error?.message ||
          "Failed to add shipment."
      );

      throw error;
    }
  };

  const updateShipment = async (
    shipmentId,
    shipmentData
  ) => {
    try {
      setApiError("");

      let updatedShipment = shipmentData;

      if (!USE_MOCK_API) {
        const response =
          await updateShipmentApi(
            shipmentId,
            shipmentData
          );

        updatedShipment =
          response?.data || response;
      }

      setShipmentList((prev) =>
        prev.map((shipment) =>
          shipment.id === shipmentId
            ? {
                ...shipment,
                ...updatedShipment,
              }
            : shipment
        )
      );

      return updatedShipment;
    } catch (error) {
      setApiError(
        error?.message ||
          "Failed to update shipment."
      );

      throw error;
    }
  };

  const deleteShipment = async (
    shipmentId
  ) => {
    try {
      setApiError("");

      if (!USE_MOCK_API) {
        await deleteShipmentApi(shipmentId);
      }

      setShipmentList((prev) =>
        prev.filter(
          (shipment) =>
            shipment.id !== shipmentId
        )
      );
    } catch (error) {
      setApiError(
        error?.message ||
          "Failed to delete shipment."
      );

      throw error;
    }
  };

  /* =====================================================
     NOTIFICATIONS
  ===================================================== */

  const markNotificationRead = (
    notificationId
  ) => {
    setNotificationList((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? {
              ...notification,
              read: true,
            }
          : notification
      )
    );
  };

  const markAllNotificationsRead = () => {
    setNotificationList((prev) =>
      prev.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const deleteNotification = (
    notificationId
  ) => {
    setNotificationList((prev) =>
      prev.filter(
        (notification) =>
          notification.id !== notificationId
      )
    );
  };

  const clearNotifications = () => {
    setNotificationList([]);
  };

  /* =====================================================
     DASHBOARD SUMMARY
  ===================================================== */

  const dashboardSummary = useMemo(() => {
    const totalVehicles =
      vehicleList.length;

    const activeVehicles =
      vehicleList.filter(
        (vehicle) =>
          vehicle.status === "Active"
      ).length;

    const inTransitVehicles =
      vehicleList.filter(
        (vehicle) =>
          vehicle.status === "In Transit"
      ).length;

    const maintenanceVehicles =
      vehicleList.filter(
        (vehicle) =>
          vehicle.status === "Maintenance"
      ).length;

    const inactiveVehicles =
      vehicleList.filter(
        (vehicle) =>
          vehicle.status === "Inactive"
      ).length;

    const totalDrivers =
      driverList.length;

    const availableDrivers =
      driverList.filter(
        (driver) =>
          driver.status === "Available"
      ).length;

    const onDutyDrivers =
      driverList.filter(
        (driver) =>
          driver.status === "On Duty"
      ).length;

    const onLeaveDrivers =
      driverList.filter(
        (driver) =>
          driver.status === "On Leave"
      ).length;

    const offDutyDrivers =
      driverList.filter(
        (driver) =>
          driver.status === "Off Duty"
      ).length;

    const totalShipments =
      shipmentList.length;

    const activeShipments =
      shipmentList.filter(
        (shipment) =>
          shipment.status === "In Transit" ||
          shipment.status === "Out for Delivery"
      ).length;

    const deliveredShipments =
      shipmentList.filter(
        (shipment) =>
          shipment.status === "Delivered"
      ).length;

    const delayedShipments =
      shipmentList.filter(
        (shipment) =>
          shipment.status === "Delayed"
      ).length;

    const pendingShipments =
      shipmentList.filter(
        (shipment) =>
          shipment.status === "Pending"
      ).length;

    const unreadNotifications =
      notificationList.filter(
        (notification) =>
          !notification.read
      ).length;

    return {
      totalVehicles,
      activeVehicles,
      inTransitVehicles,
      maintenanceVehicles,
      inactiveVehicles,

      totalDrivers,
      availableDrivers,
      onDutyDrivers,
      onLeaveDrivers,
      offDutyDrivers,

      totalShipments,
      activeShipments,
      deliveredShipments,
      delayedShipments,
      pendingShipments,

      unreadNotifications,
    };
  }, [
    vehicleList,
    driverList,
    shipmentList,
    notificationList,
  ]);

  /* =====================================================
     CONTEXT VALUE
  ===================================================== */

  const value = {
    vehicleList,
    setVehicleList,
    addVehicle,
    updateVehicle,
    deleteVehicle,

    driverList,
    setDriverList,
    addDriver,
    updateDriver,
    deleteDriver,

    shipmentList,
    setShipmentList,
    addShipment,
    updateShipment,
    deleteShipment,

    notificationList,
    setNotificationList,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    clearNotifications,

    dashboardSummary,

    isLoading,
    apiError,

    useMockApi: USE_MOCK_API,

    reloadData: loadInitialData,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

/* =====================================================
   HOOK
===================================================== */

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      "useApp must be used inside AppProvider"
    );
  }

  return context;
}