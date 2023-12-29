import { Pressable, StyleSheet, View } from "react-native";
import { BottomTabBarProps } from "../types/component.types";
import { layoutStyle, borderStyle, backgroundStyle } from "../styles";
import {
  BOTTOM_TAB_HEIGHT,
  COLOR_1,
  COLOR_4,
  SIZE_24,
  SIZE_27,
} from "../constants";
import { useCallback } from "react";
import Icon from "./Icon";
import { useAppSelector } from "../hooks/storeHooks";
import { getFullScreenActiveState } from "../store/client/client.selector";

export default function BottomTabBar({ navigation, state }: BottomTabBarProps) {
  const currentTabIndex = state.index;
  const currentTabName = state.routeNames[currentTabIndex];

  const isFullScreenActive = useAppSelector(getFullScreenActiveState);

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

  return (
    <View
      style={[
        styles.root_container,
        isFullScreenActive
          ? backgroundStyle.background_color_4
          : backgroundStyle.background_color_1,
        isFullScreenActive
          ? borderStyle.border_color_14
          : borderStyle.border_color_2,
      ]}
    >
      <Pressable hitSlop={SIZE_24} onPress={homePressCallback}>
        <Icon
          name={currentTabName === "home" ? "home-solid" : "home-outline"}
          color={isFullScreenActive ? COLOR_1 : COLOR_4}
        />
      </Pressable>
      <Pressable hitSlop={SIZE_24} onPress={foryouPressCallback}>
        <Icon
          name={currentTabName === "foryou" ? "heart-solid" : "heart-outline"}
          color={isFullScreenActive ? COLOR_1 : COLOR_4}
        />
      </Pressable>
      <Pressable hitSlop={SIZE_24}>
        <Icon
          name="add-circle-outline"
          color={isFullScreenActive ? COLOR_1 : COLOR_4}
        />
      </Pressable>
      <Pressable hitSlop={SIZE_24} onPress={discoverPressCallback}>
        <Icon
          name={
            currentTabName === "discover" ? "search-bold" : "search-regular"
          }
          color={isFullScreenActive ? COLOR_1 : COLOR_4}
        />
      </Pressable>
      <Pressable hitSlop={SIZE_24} onPress={inboxPressCallback}>
        <Icon
          name={currentTabName === "inbox" ? "send-solid" : "send-outline"}
          color={isFullScreenActive ? COLOR_1 : COLOR_4}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root_container: {
    ...layoutStyle.align_item_center,
    ...layoutStyle.justify_content_space_around,
    ...layoutStyle.flex_direction_row,
    ...borderStyle.border_top_width_hairline,
    height: BOTTOM_TAB_HEIGHT,
  },
});
