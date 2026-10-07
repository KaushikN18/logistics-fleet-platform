import apiClient from "./apiClient";

export const getNotifications = async () => {
  const response = await apiClient.get("/notifications");
  return response.data;
};

export const getNotificationById = async (notificationId) => {
  const response = await apiClient.get(
    `/notifications/${notificationId}`
  );

  return response.data;
};

export const markNotificationAsRead = async (notificationId) => {
  const response = await apiClient.patch(
    `/notifications/${notificationId}/read`
  );

  return response.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await apiClient.patch(
    "/notifications/read-all"
  );

  return response.data;
};

export const deleteNotification = async (notificationId) => {
  const response = await apiClient.delete(
    `/notifications/${notificationId}`
  );

  return response.data;
};

export const clearNotifications = async () => {
  const response = await apiClient.delete(
    "/notifications"
  );

  return response.data;
};