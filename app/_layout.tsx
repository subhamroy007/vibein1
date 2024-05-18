import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useCallback, useEffect } from "react";
import { ThemeProvider, useTheme } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PortalProvider } from "@gorhom/portal";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Provider, shallowEqual } from "react-redux";
import appDataStore from "../store";
import {
  backgroundStyle,
  borderStyle,
  layoutStyle,
  paddingStyle,
  text_style,
} from "../styles";
import {
  initClientInfo,
  setNotificationText,
} from "../store/client/client.slice";
import { LogBox, StatusBar } from "react-native";
import { useDarkScreenFocused } from "../hooks/utility.hooks";
import { CLIENT_ACCOUNT, COLOR_1, SIZE_13, SIZE_14 } from "../constants";
import { selectPopupNotification } from "../store/client/client.selector";
import { useAppDispatch, useAppSelector } from "../hooks/storeHooks";
import Animated, {
  cancelAnimation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Text from "../components/utility-components/text/Text";

LogBox.ignoreLogs(["The `redirect` prop"]);

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const isDarkScreenFocused = useDarkScreenFocused();

  const notificationAnimationValue = useSharedValue(0);

  const { top } = useSafeAreaInsets();

  const notification = useAppSelector(selectPopupNotification, shallowEqual);

  const dispatch = useAppDispatch();

  const onFinishPopupAnimation = useCallback(() => {
    dispatch(setNotificationText({ message: null }));
  }, []);

  useEffect(() => {
    if (notification) {
      cancelAnimation(notificationAnimationValue);
      notificationAnimationValue.value = 0;
      notificationAnimationValue.value = withSequence(
        withTiming(1, { duration: 300 }),
        withDelay(
          1000,
          withTiming(0, { duration: 300 }, (finished) => {
            if (finished) {
              runOnJS(onFinishPopupAnimation)();
            }
          })
        )
      );
    }
  }, [notification]);

  const notificationBoxAnimatedStyle = useAnimatedStyle(() => {
    return {
      top,
      maxWidth: "100%",
      minWidth: "30%",
      opacity: notificationAnimationValue.value,
      transform: [
        {
          translateY: interpolate(
            notificationAnimationValue.value,
            [0, 1],
            [0, top]
          ),
        },
      ],
    };
  }, [top]);

  return (
    <>
      <Stack
        screenOptions={{
          animation: "slide_from_right",
          animationDuration: 300,
          headerShown: false,
          statusBarTranslucent: true,
          statusBarStyle: isDarkScreenFocused ? "light" : "dark",
          contentStyle: backgroundStyle.background_color_1,
        }}
      />
      {notification && (
        <Animated.View
          style={[
            backgroundStyle.background_color_9,
            layoutStyle.align_self_center,
            layoutStyle.position_absolute,
            notificationBoxAnimatedStyle,
            borderStyle.border_radius_6,
            paddingStyle.padding_vertical_9,
            paddingStyle.padding_horizontal_9,
            layoutStyle.align_item_center,
          ]}
        >
          <Text
            size={SIZE_13}
            color={COLOR_1}
            numberOfLines={0}
            style={text_style.text_align_center}
            weight="light_medium"
          >
            {notification.msg}
          </Text>
        </Animated.View>
      )}
    </>
  );
};

export default function AppInit() {
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
    appDataStore.dispatch(initClientInfo(CLIENT_ACCOUNT));
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
              <RootLayout />
            </ThemeProvider>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </PortalProvider>
    </Provider>
  );
}
