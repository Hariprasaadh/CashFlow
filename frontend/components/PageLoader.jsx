import React from "react"
import { View, StyleSheet } from "react-native"
import { COLORS } from "../constants/colors"
import EnhancedSpinner from "./EnhancedSpinner"

const PageLoader = ({ 
  message = "Loading your transactions...", 
  type = "coffee" 
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.loaderCard}>
        <EnhancedSpinner 
          size="xlarge"
          message={message}
          type={type}
          color={COLORS.primary}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 20,
  },
  loaderCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 200,
  },
})

export default PageLoader