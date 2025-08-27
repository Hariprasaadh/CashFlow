import { useClerk } from '@clerk/clerk-expo'
import { TouchableOpacity } from 'react-native'
import { styles } from '../assets/styles/home.styles'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../constants/colors'
import { useGlobalNotification } from '../context/NotificationContext'

export const SignOutButton = () => {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk()
  const { showConfirm, showQuickSuccess, showError } = useGlobalNotification()

  const handleSignOut = async () => {
    console.log("SignOut button pressed") // Debug log
    showConfirm(
      "Logout", 
      "Are you sure you want to logout? You'll need to sign in again to access your transactions.",
      async () => {
        try {
          console.log("Attempting to sign out...") // Debug log
          await signOut()
          console.log("Sign out successful") // Debug log
          showQuickSuccess("Successfully logged out")
        } catch (error) {
          console.error("Logout error:", error)
          // Show error notification
          showError("Logout Failed", error.message || "Failed to logout. Please try again.")
        }
      },
      () => {
        console.log("Logout cancelled") // Debug log
      }
    )
  }
  
  return (
    <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
      <Ionicons name="log-out-outline" size={22} color={COLORS.text} />
    </TouchableOpacity>
  )
}