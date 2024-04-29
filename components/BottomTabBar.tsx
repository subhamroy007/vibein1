import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { BottomTabBarProps } from "../types/component.types";
import { layoutStyle, borderStyle, backgroundStyle } from "../styles";
import { BOTTOM_TAB_HEIGHT, COLOR_1, COLOR_4, SIZE_24 } from "../constants";
import { useCallback, useMemo } from "react";
import { useAppSelector } from "../hooks/storeHooks";
import { useDarkScreenFocused } from "../hooks/utility.hooks";
import Icon from "./utility-components/icon/Icon";

export default function BottomTabBar({ navigation, state }: BottomTabBarProps) {
  const currentTabIndex = state.index;
  const currentTabName = state.routeNames[currentTabIndex];

  const isDarkScreenFocused = useDarkScreenFocused();

  const homePressCallback = useCallback(
    () => navigation.navigate("home"),
    [navigation]
  );

  const foryouPressCallback = useCallback(
    () => navigation.navigate("foryou"),
    [navigation]
  );

  const discoverPressCallback = useCallback(
    () => navigation.navigate("discover"),
    [navigation]
  );

  const inboxPressCallback = useCallback(
    () => navigation.navigate("inbox"),
    [navigation]
  );

  const notificationPressCallback = useCallback(
    () => navigation.navigate("notification"),
    [navigation]
  );

  const root_container_cached_style = useMemo<StyleProp<ViewStyle>>(
    () => [
      styles.root_container,
      layoutStyle.align_item_center,
      layoutStyle.justify_content_space_around,
      layoutStyle.flex_direction_row,
      borderStyle.border_top_width_hairline,
      isDarkScreenFocused
        ? backgroundStyle.background_color_4
        : backgroundStyle.background_color_1,
      isDarkScreenFocused
        ? borderStyle.border_color_14
        : borderStyle.border_color_2,
    ],
    [isDarkScreenFocused]
  );

  return (
    <View style={root_container_cached_style}>
      <Pressable hitSlop={SIZE_24} onPress={homePressCallback}>
        <Icon
          name={currentTabName === "home" ? "home-solid" : "home-outline"}
          color={isDarkScreenFocused ? COLOR_1 : COLOR_4}
        />
      </Pressable>
      <Pressable hitSlop={SIZE_24} onPress={foryouPressCallback}>
        <Icon
          name={currentTabName === "foryou" ? "heart-solid" : "heart-outline"}
          color={isDarkScreenFocused ? COLOR_1 : COLOR_4}
        />
      </Pressable>
      <Pressable hitSlop={SIZE_24} onPress={discoverPressCallback}>
        <Icon
          name={currentTabName === "discover" ? "search-bold" : "search"}
          color={isDarkScreenFocused ? COLOR_1 : COLOR_4}
        />
      </Pressable>
      <Pressable hitSlop={SIZE_24} onPress={notificationPressCallback}>
        <Icon
          name={
            currentTabName === "notification"
              ? "notification-solid"
              : "notification-outline"
          }
          color={isDarkScreenFocused ? COLOR_1 : COLOR_4}
        />
      </Pressable>
      <Pressable hitSlop={SIZE_24} onPress={inboxPressCallback}>
        <Icon
          name={
            currentTabName === "inbox" ? "comment-solid" : "comment-outline"
          }
          color={isDarkScreenFocused ? COLOR_1 : COLOR_4}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root_container: {
    height: BOTTOM_TAB_HEIGHT,
  },
});
