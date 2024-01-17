import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useCallback, useEffect } from "react";
import { ThemeProvider, useTheme } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Portal, PortalProvider } from "@gorhom/portal";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import appDataStore from "../store";
import { addManyAccountToStore } from "../store/account/account.slice";
import {
  generateAccountObject,
  generateAccountObjects,
} from "../mocks/accounts";
import Toast from "../components/Toast";
import { backgroundStyle, layoutStyle } from "../styles";
import {
  initClientInfo,
  initHomeFeed,
  initInbox,
} from "../store/client/client.slice";
import { LogBox } from "react-native";
import { generatePostObjects } from "../mocks/posts";
import { addManyPostToStore } from "../store/post/post.slice";

LogBox.ignoreLogs(["The `redirect` prop"]);

SplashScreen.preventAutoHideAsync();

export default function AppLayout() {
  const theme = useTheme();

  const [fontsLoaded, fontError] = useFonts({
    regular: require("../assets/fonts/OpenSans_SemiCondensed-Regular.ttf"),
    medium: require("../assets/fonts/OpenSans_SemiCondensed-Medium.ttf"),
    bold: require("../assets/fonts/OpenSans_SemiCondensed-Bold.ttf"),
    light: require("../assets/fonts/OpenSans_SemiCondensed-Light.ttf"),
    semi_bold: require("../assets/fonts/OpenSans_SemiCondensed-SemiBold.ttf"),
    extra_bold: require("../assets/fonts/OpenSans_SemiCondensed-ExtraBold.ttf"),
    icon_font: require("../assets/fonts/icon_font.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    const oneToOneChatAccounts = generateAccountObjects(10);
    appDataStore.dispatch(addManyAccountToStore(oneToOneChatAccounts));
    appDataStore.dispatch(initClientInfo(generateAccountObject()));
    appDataStore.dispatch(initInbox(oneToOneChatAccounts));
  }, []);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <Provider store={appDataStore}>
      <PortalProvider>
        <GestureHandlerRootView
          style={layoutStyle.flex_1}
          onLayout={onLayoutRootView}
        >
          <SafeAreaProvider>
            <ThemeProvider value={theme}>
              <Stack
                screenOptions={{
                  animation: "slide_from_right",
                  animationDuration: 300,
                  headerShown: false,
                  statusBarTranslucent: true,
                  statusBarAnimation: "none",
                  statusBarHidden: false,
                  statusBarStyle: "auto",
                  contentStyle: backgroundStyle.background_color_1,
                }}
              />
            </ThemeProvider>
          </SafeAreaProvider>
          <Portal>
            <Toast />
          </Portal>
        </GestureHandlerRootView>
      </PortalProvider>
    </Provider>
  );
}
