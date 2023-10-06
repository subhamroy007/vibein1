import { Pressable, View } from "react-native";
import { Slot, Stack, Tabs } from "expo-router";
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
import { generateAccountObject } from "../mocks/accounts";
import Toast from "../components/Toast";
import { SIZE_20, SIZE_24, SIZE_27, SIZE_30, SIZE_48 } from "../constants";
import {
  backgroundStyle,
  borderStyle,
  layoutStyle,
  paddingStyle,
} from "../styles";
import Icon from "../components/Icon";

SplashScreen.preventAutoHideAsync();

export default function AppLayout() {
  const theme = useTheme();

  const [fontsLoaded, fontError] = useFonts({
    mooli: require("../assets/fonts/Mooli-Regular.ttf"),
    ubuntu_regular: require("../assets/fonts/Ubuntu-Regular.ttf"),
    ubuntu_italic: require("../assets/fonts/Ubuntu-Italic.ttf"),
    ubuntu_light: require("../assets/fonts/Ubuntu-Light.ttf"),
    ubuntu_light_italic: require("../assets/fonts/Ubuntu-LightItalic.ttf"),
    ubuntu_medium: require("../assets/fonts/Ubuntu-Medium.ttf"),
    ubuntu_medium_italic: require("../assets/fonts/Ubuntu-MediumItalic.ttf"),
    ubuntu_bold: require("../assets/fonts/Ubuntu-Bold.ttf"),
    ubuntu_bold_italic: require("../assets/fonts/Ubuntu-BoldItalic.ttf"),
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
    appDataStore.dispatch(
      addManyAccountToStore([{ ...generateAccountObject(), _id: "1" }])
    );
  }, []);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <Provider store={appDataStore}>
      <PortalProvider>
        <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
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
                tabBar={({ navigation, state }) => {
                  const currentTabIndex = state.index;
                  const currentTabName = state.routeNames[currentTabIndex];

                  return (
                    <View
                      style={[
                        { height: SIZE_48 },
                        layoutStyle.align_item_center,
                        layoutStyle.justify_content_space_around,
                        layoutStyle.flex_direction_row,
                        borderStyle.border_top_width_hairline,
                        borderStyle.border_color_2,
                      ]}
                    >
                      <Pressable
                        hitSlop={SIZE_24}
                        onPress={() => navigation.navigate("index")}
                      >
                        <Icon
                          name={
                            currentTabName === "index"
                              ? "home-solid"
                              : "home-outline"
                          }
                          size={SIZE_27}
                        />
                      </Pressable>
                      <Pressable
                        hitSlop={SIZE_24}
                        onPress={() => navigation.navigate("foryou")}
                      >
                        <Icon
                          name={
                            currentTabName === "foryou"
                              ? "heart-solid"
                              : "heart-outline"
                          }
                          size={SIZE_27}
                        />
                      </Pressable>
                      <Pressable hitSlop={SIZE_24}>
                        <Icon name="add-circle-outline" size={SIZE_27} />
                      </Pressable>
                      <Pressable
                        hitSlop={SIZE_24}
                        onPress={() => navigation.navigate("discover")}
                      >
                        <Icon
                          name={
                            currentTabName === "discover"
                              ? "search-bold"
                              : "search-regular"
                          }
                          size={SIZE_27}
                        />
                      </Pressable>
                      <Pressable
                        hitSlop={SIZE_24}
                        onPress={() => navigation.navigate("inbox")}
                      >
                        <Icon
                          name={
                            currentTabName === "inbox"
                              ? "send-solid"
                              : "send-outline"
                          }
                          size={SIZE_27}
                        />
                      </Pressable>
                    </View>
                  );
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
