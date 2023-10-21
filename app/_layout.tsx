import { Tabs } from "expo-router";
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
import {
  backgroundStyle,
  borderStyle,
  layoutStyle,
  paddingStyle,
} from "../styles";
import {
  initClientInfo,
  initDiscoverFeed,
  initHomeFeed,
  initInbox,
} from "../store/client/client.slice";
import { View } from "react-native";
import BottomTabBar from "../components/BottomTabBar";
import { generatePostObjects } from "../mocks/posts";
import { addManyPostToStore } from "../store/post/post.slice";

SplashScreen.preventAutoHideAsync();

export default function AppLayout() {
  const theme = useTheme();

  const [fontsLoaded, fontError] = useFonts({
    // mooli: require("../assets/fonts/Mooli-Regular.ttf"),
    // ubuntu_regular: require("../assets/fonts/Ubuntu-Regular.ttf"),
    // ubuntu_italic: require("../assets/fonts/Ubuntu-Italic.ttf"),
    // ubuntu_light: require("../assets/fonts/Ubuntu-Light.ttf"),
    // ubuntu_light_italic: require("../assets/fonts/Ubuntu-LightItalic.ttf"),
    // ubuntu_medium: require("../assets/fonts/Ubuntu-Medium.ttf"),
    // ubuntu_medium_italic: require("../assets/fonts/Ubuntu-MediumItalic.ttf"),
    // ubuntu_bold: require("../assets/fonts/Ubuntu-Bold.ttf"),
    // ubuntu_bold_italic: require("../assets/fonts/Ubuntu-BoldItalic.ttf"),
    roboto_regular: require("../assets/fonts/Roboto-Regular.ttf"),
    roboto_medium: require("../assets/fonts/Roboto-Medium.ttf"),
    roboto_bold: require("../assets/fonts/Roboto-Bold.ttf"),
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
    appDataStore.dispatch(initHomeFeed({ posts: [] }));
    appDataStore.dispatch(initInbox(oneToOneChatAccounts));

    const discoverFeedPosts = generatePostObjects(23);

    appDataStore.dispatch(addManyPostToStore(discoverFeedPosts));

    appDataStore.dispatch(initDiscoverFeed({ posts: discoverFeedPosts }));
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
              <Tabs
                sceneContainerStyle={backgroundStyle.background_color_1}
                screenOptions={{
                  headerLeftContainerStyle: paddingStyle.padding_horizontal_12,
                  headerRightContainerStyle: paddingStyle.padding_horizontal_12,
                  headerShadowVisible: false,
                  headerBackgroundContainerStyle: [
                    borderStyle.border_bottom_color_2,
                    borderStyle.border_bottom_width_hairline,
                  ],
                  headerTitleAlign: "center",
                }}
                tabBar={(props) => <BottomTabBar {...props} />}
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
