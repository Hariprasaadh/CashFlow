import React, { useEffect, useRef, useCallback } from 'react';
import {
  Text,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

const ToastNotification = ({ 
  visible, 
  type = 'success', 
  message, 
  duration = 3000,
  onHide,
  position = 'bottom' // 'top' or 'bottom'
}) => {
  const translateAnim = useRef(new Animated.Value(position === 'bottom' ? 200 : -200)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: '#6B4423', // Darker coffee shade for success
          icon: 'checkmark-circle',
          iconColor: '#FFFFFF',
        };
      case 'error':
        return {
          backgroundColor: '#8B3A3A', // Coffee-toned red for errors
          icon: 'close-circle',
          iconColor: '#FFFFFF',
        };
      case 'warning':
        return {
          backgroundColor: '#A67C52', // Medium coffee shade for warnings
          icon: 'warning',
          iconColor: '#FFFFFF',
        };
      case 'info':
      default:
        return {
          backgroundColor: COLORS.primary,
          icon: 'information-circle',
          iconColor: '#FFFFFF',
        };
    }
  };

  const config = getToastConfig();

  const hideToast = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateAnim, {
        toValue: position === 'bottom' ? 200 : -200,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide && onHide();
    });
  }, [translateAnim, opacityAnim, position, onHide]);

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.timing(translateAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, hideToast, translateAnim, opacityAnim]);

  if (!visible) return null;

  const positionStyle = position === 'bottom' 
    ? { bottom: Platform.OS === 'ios' ? 100 : 80 }
    : { top: Platform.OS === 'ios' ? 60 : 40 };

  return (
    <Animated.View
      style={[
        styles.container,
        positionStyle,
        {
          backgroundColor: config.backgroundColor,
          transform: [{ 
            translateY: position === 'bottom' ? translateAnim : translateAnim 
          }],
          opacity: opacityAnim,
        },
      ]}
    >
      <Ionicons
        name={config.icon}
        size={20}
        color={config.iconColor}
        style={styles.icon}
      />
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = {
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 9999,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  icon: {
    marginRight: 8,
  },
  message: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
};

export default ToastNotification;
