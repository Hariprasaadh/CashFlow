import { View, Platform, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { COLORS } from "../constants/colors";

const SafeScreen = ({ children }) => {
  const insets = useSafeAreaInsets(); // Get the safe area insets
  
  // Calculate proper top padding for Android with edge-to-edge
  const topPadding = Platform.OS === 'android' 
    ? Math.max(insets.top, StatusBar.currentHeight || 0)
    : insets.top;

  return (
    <View style={{ 
      paddingTop: topPadding, 
      flex: 1, 
      backgroundColor: COLORS.background 
    }}>
      {children}
    </View>
  );
};

export default SafeScreen;