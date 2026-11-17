import React, { createContext, useState, useContext } from 'react';
import { toast } from 'react-toastify';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    );
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showSuccess = (message) => {
    toast.success(message);
    addNotification('success', message);
  };

  const showError = (message) => {
    toast.error(message);
    addNotification('error', message);
  };

  const showWarning = (message) => {
    toast.warning(message);
    addNotification('warning', message);
  };

  const showInfo = (message) => {
    toast.info(message);
    addNotification('info', message);
  };

  const addNotification = (type, message) => {
    const newNotification = {
      id: Date.now(),
      type,
      message,
      read: false,
      timestamp: new Date(),
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const value = {
    notifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    unreadCount: notifications.filter((n) => !n.read).length,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};