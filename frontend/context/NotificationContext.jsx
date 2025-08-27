import React, { createContext, useContext } from 'react';
import { useNotification } from '../hooks/useNotification';
import CustomNotification from '../components/CustomNotification';
import ToastNotification from '../components/ToastNotification';

const NotificationContext = createContext();

export const useGlobalNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useGlobalNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const notificationMethods = useNotification();

  return (
    <NotificationContext.Provider value={notificationMethods}>
      {children}
      <CustomNotification
        visible={notificationMethods.notification.visible}
        type={notificationMethods.notification.type}
        title={notificationMethods.notification.title}
        message={notificationMethods.notification.message}
        actions={notificationMethods.notification.actions}
        duration={notificationMethods.notification.duration}
        onHide={notificationMethods.hideNotification}
      />
      <ToastNotification
        visible={notificationMethods.toast.visible}
        type={notificationMethods.toast.type}
        message={notificationMethods.toast.message}
        duration={notificationMethods.toast.duration}
        position={notificationMethods.toast.position}
        onHide={notificationMethods.hideToast}
      />
    </NotificationContext.Provider>
  );
};
