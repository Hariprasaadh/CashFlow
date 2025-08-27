import React, { useRef, useEffect } from 'react'
import { View, Animated, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../constants/colors'

const EnhancedSpinner = ({ 
  size = 'large', 
  message = 'Loading...', 
  showMessage = true,
  color = COLORS.primary,
  style = {},
  type = 'circular' // 'circular', 'pulse', 'coffee'
}) => {
  const spinAnim = useRef(new Animated.Value(0)).current
  const pulseAnim = useRef(new Animated.Value(1)).current
  const fadeAnim = useRef(new Animated.Value(0.3)).current

  useEffect(() => {
    if (type === 'circular') {
      // Circular spinning animation
      const spinAnimation = Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      )
      spinAnimation.start()
    } else if (type === 'pulse') {
      // Pulse animation
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      )
      pulseAnimation.start()
    } else if (type === 'coffee') {
      // Coffee cup animation with steam effect
      const coffeeAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0.3,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      )
      coffeeAnimation.start()
    }

    return () => {
      spinAnim.stopAnimation()
      pulseAnim.stopAnimation()
      fadeAnim.stopAnimation()
    }
  }, [type, spinAnim, pulseAnim, fadeAnim])

  const getSpinnerSize = () => {
    switch (size) {
      case 'small': return 24
      case 'medium': return 32
      case 'large': return 48
      case 'xlarge': return 64
      default: return 48
    }
  }

  const getTextSize = () => {
    switch (size) {
      case 'small': return 12
      case 'medium': return 14
      case 'large': return 16
      case 'xlarge': return 18
      default: return 16
    }
  }

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })

  const renderSpinner = () => {
    const iconSize = getSpinnerSize()

    if (type === 'circular') {
      return (
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Ionicons name="refresh" size={iconSize} color={color} />
        </Animated.View>
      )
    } else if (type === 'pulse') {
      return (
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <Ionicons name="ellipse" size={iconSize} color={color} />
        </Animated.View>
      )
    } else if (type === 'coffee') {
      return (
        <View style={styles.coffeeContainer}>
          <Ionicons name="cafe" size={iconSize} color={color} />
          <Animated.View style={[styles.steamContainer, { opacity: fadeAnim }]}>
            <Ionicons name="cloud" size={iconSize * 0.3} color={color} style={styles.steam1} />
            <Ionicons name="cloud" size={iconSize * 0.25} color={color} style={styles.steam2} />
            <Ionicons name="cloud" size={iconSize * 0.2} color={color} style={styles.steam3} />
          </Animated.View>
        </View>
      )
    }
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.spinnerContainer}>
        {renderSpinner()}
      </View>
      {showMessage && (
        <Text style={[styles.message, { fontSize: getTextSize(), color }]}>
          {message}
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  spinnerContainer: {
    marginBottom: 12,
  },
  message: {
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    marginTop: 8,
  },
  coffeeContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  steamContainer: {
    position: 'absolute',
    top: -8,
    alignItems: 'center',
  },
  steam1: {
    opacity: 0.8,
    marginBottom: -4,
  },
  steam2: {
    opacity: 0.6,
    marginBottom: -4,
    marginLeft: 6,
  },
  steam3: {
    opacity: 0.4,
    marginLeft: -6,
  },
})

export default EnhancedSpinner
