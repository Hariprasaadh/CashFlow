import { StatusBar } from "expo-status-bar";
import { Platform, View } from "react-native";

const AppStatusBar = ({ style = "dark", backgroundColor = "#ffffff" }) => {
  return (
    <>
      <StatusBar 
        style={style} 
        backgroundColor={backgroundColor}
        translucent={Platform.OS === 'android'}
      />
      {Platform.OS === 'android' && (
        <View 
          style={{ 
            height: 0, // This helps with edge-to-edge layout
            backgroundColor: backgroundColor 
          }} 
        />
      )}
    </>
  );
};

export default AppStatusBar;
