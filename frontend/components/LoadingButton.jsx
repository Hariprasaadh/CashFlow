import React from 'react'
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../constants/colors'
import EnhancedSpinner from './EnhancedSpinner'

const LoadingButton = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  style = {},
  textStyle = {},
  loadingText = "Loading...",
  icon = null,
  variant = 'primary' // 'primary', 'secondary', 'outline'
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: COLORS.secondary,
          borderColor: COLORS.secondary,
        }
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: COLORS.primary,
          borderWidth: 1,
        }
      case 'primary':
      default:
        return {
          backgroundColor: COLORS.primary,
          borderColor: COLORS.primary,
        }
    }
  }

  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
        return { color: COLORS.primary }
      case 'secondary':
        return { color: COLORS.text }
      case 'primary':
      default:
        return { color: COLORS.white }
    }
  }

  const isDisabled = loading || disabled

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        isDisabled && styles.disabled,
        style
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        {loading ? (
          <>
            <EnhancedSpinner 
              size="small" 
              showMessage={false} 
              type="circular"
              color={getTextStyle().color}
            />
            <Text style={[styles.text, getTextStyle(), { marginLeft: 8 }, textStyle]}>
              {loadingText}
            </Text>
          </>
        ) : (
          <>
            {icon && (
              <Ionicons 
                name={icon} 
                size={18} 
                color={getTextStyle().color} 
                style={styles.icon} 
              />
            )}
            <Text style={[styles.text, getTextStyle(), textStyle]}>
              {title}
            </Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabled: {
    opacity: 0.6,
    shadowOpacity: 0,
    elevation: 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  icon: {
    marginRight: 8,
  },
})

export default LoadingButton
