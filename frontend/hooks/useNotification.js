import { useState, useCallback } from 'react';

export const useNotification = () => {
  const [notification, setNotification] = useState({
    visible: false,
    type: 'info',
    title: '',
    message: '',
    actions: [],
    duration: 4000,
  });

  const [toast, setToast] = useState({
    visible: false,
    type: 'success',
    message: '',
    duration: 3000,
    position: 'bottom',
  });

  const showNotification = useCallback((config) => {
    setNotification({
      visible: true,
      type: config.type || 'info',
      title: config.title || '',
      message: config.message || '',
      actions: config.actions || [],
      duration: config.duration || 4000,
    });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(prev => ({
      ...prev,
      visible: false,
    }));
  }, []);

  const showSuccess = useCallback((title, message, options = {}) => {
    showNotification({
      type: 'success',
      title,
      message,
      ...options,
    });
  }, [showNotification]);

  const showError = useCallback((title, message, options = {}) => {
    showNotification({
      type: 'error',
      title,
      message,
      ...options,
    });
  }, [showNotification]);

  const showWarning = useCallback((title, message, options = {}) => {
    showNotification({
      type: 'warning',
      title,
      message,
      ...options,
    });
  }, [showNotification]);

  const showInfo = useCallback((title, message, options = {}) => {
    showNotification({
      type: 'info',
      title,
      message,
      ...options,
    });
  }, [showNotification]);

  const showConfirm = useCallback((title, message, onConfirm, onCancel) => {
    showNotification({
      type: 'warning',
      title,
      message,
      duration: 0, // Don't auto-hide confirmation dialogs
      actions: [
        {
          text: 'Cancel',
          onPress: onCancel,
        },
        {
          text: 'Confirm',
          style: 'destructive',
          onPress: onConfirm,
        },
      ],
    });
  }, [showNotification]);

  const hideToast = useCallback(() => {
    setToast(prev => ({
      ...prev,
      visible: false,
    }));
  }, []);

  const showToast = useCallback((type, message, options = {}) => {
    setToast({
      visible: true,
      type,
      message,
      duration: options.duration || 3000,
      position: options.position || 'bottom',
    });
  }, []);

  const showQuickSuccess = useCallback((message) => {
    showToast('success', message, { duration: 2000 });
  }, [showToast]);

  const showQuickError = useCallback((message) => {
    showToast('error', message, { duration: 3000 });
  }, [showToast]);

  return {
    notification,
    toast,
    showNotification,
    hideNotification,
    showToast,
    hideToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
    showQuickSuccess,
    showQuickError,
  };
};
