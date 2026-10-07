import apiClient from "./apiClient";

export const getVehicles = async () => {
  const response = await apiClient.get("/vehicles");
  return response.data;
};

export const getVehicleById = async (vehicleId) => {
  const response = await apiClient.get(`/vehicles/${vehicleId}`);
  return response.data;
};

export const createVehicle = async (vehicleData) => {
  const response = await apiClient.post(
    "/vehicles",
    vehicleData
  );

  return response.data;
};

export const updateVehicle = async (
  vehicleId,
  vehicleData
) => {
  const response = await apiClient.put(
    `/vehicles/${vehicleId}`,
    vehicleData
  );

  return response.data;
};

export const deleteVehicle = async (vehicleId) => {
  const response = await apiClient.delete(
    `/vehicles/${vehicleId}`
  );

  return response.data;
};