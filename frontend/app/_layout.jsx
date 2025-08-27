import { Slot} from "expo-router";
import AppStatusBar from "@/components/AppStatusBar";
import SafeScreen from "@/components/SafeScreen"
import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'

export default function RootLayout() {
  return(
    <ClerkProvider tokenCache={tokenCache}>
      <AppStatusBar style="dark" backgroundColor="#ffffff" />
      <SafeScreen>
        <Slot />
      </SafeScreen>
    </ClerkProvider>
  )
}
