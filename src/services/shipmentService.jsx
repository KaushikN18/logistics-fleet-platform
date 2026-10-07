import apiClient from "./apiClient";

export const getShipments = async () => {
  const response = await apiClient.get("/shipments");
  return response.data;
};

export const getShipmentById = async (shipmentId) => {
  const response = await apiClient.get(
    `/shipments/${shipmentId}`
  );

  return response.data;
};

export const createShipment = async (shipmentData) => {
  const response = await apiClient.post(
    "/shipments",
    shipmentData
  );

  return response.data;
};

export const updateShipment = async (
  shipmentId,
  shipmentData
) => {
  const response = await apiClient.put(
    `/shipments/${shipmentId}`,
    shipmentData
  );

  return response.data;
};

export const deleteShipment = async (shipmentId) => {
  const response = await apiClient.delete(
    `/shipments/${shipmentId}`
  );

  return response.data;
};