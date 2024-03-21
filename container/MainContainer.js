import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { FONTS } from "../constants/fonts";
import { useCallback } from "react";
import { Provider } from "react-redux";
import { store } from "../store/store";

import  {Dashboard}  from "../screens/Dashboard";
import { MainPage } from "../screens/MainPage";
import { test } from "../screens/Reminder";
import { test2 } from "../screens/Settings";

const Stack = createNativeStackNavigator();

export default function App() {
    const [fontsLoaded] = useFonts(FONTS);
  
    const onLayoutRootView = useCallback(async () => {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    }, [fontsLoaded]);
  
    if (!fontsLoaded) {
      return null;
    }
  
    return (
      <Provider store={store}>
        <SafeAreaProvider onLayout={onLayoutRootView}>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{ headerShown: false }}
              initialRouteName="MainPage"
            >
              <Stack.Screen name="MainPage" component={MainPage} />
              <Stack.Screen name="Dashboard" component={Dashboard} />
              <Stack.Screen name="test" component={test} />
              <Stack.Screen name="test2" component={test2} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </Provider>
    );
  }