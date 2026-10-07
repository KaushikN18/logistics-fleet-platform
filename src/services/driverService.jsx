import apiClient from "./apiClient";

export const getDrivers = async () => {
  const response = await apiClient.get("/drivers");
  return response.data;
};

export const getDriverById = async (driverId) => {
  const response = await apiClient.get(
    `/drivers/${driverId}`
  );

  return response.data;
};

export const createDriver = async (driverData) => {
  const response = await apiClient.post(
    "/drivers",
    driverData
  );

  return response.data;
};

export const updateDriver = async (
  driverId,
  driverData
) => {
  const response = await apiClient.put(
    `/drivers/${driverId}`,
    driverData
  );

  return response.data;
};

export const deleteDriver = async (driverId) => {
  const response = await apiClient.delete(
    `/drivers/${driverId}`
  );

  return response.data;
};