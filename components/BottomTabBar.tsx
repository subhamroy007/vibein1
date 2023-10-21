import { Pressable, StyleSheet, View } from "react-native";
import { BottomTabBarProps } from "../types/component.types";
import { layoutStyle, borderStyle } from "../styles";
import { BOTTOM_TAB_HEIGHT, SIZE_24, SIZE_27 } from "../constants";
import { useCallback } from "react";
import Icon from "./Icon";

export default function BottomTabBar({ navigation, state }: BottomTabBarProps) {
  const currentTabIndex = state.index;
  const currentTabName = state.routeNames[currentTabIndex];

  const homePressCallback = useCallback(
    () => navigation.navigate("index"),
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
    <View style={styles.root_container}>
      <Pressable hitSlop={SIZE_24} onPress={homePressCallback}>
        <Icon
          name={currentTabName === "index" ? "home-solid" : "home-outline"}
        />
      </Pressable>
      <Pressable hitSlop={SIZE_24} onPress={foryouPressCallback}>
        <Icon
          name={currentTabName === "foryou" ? "heart-solid" : "heart-outline"}
        />
      </Pressable>
      <Pressable hitSlop={SIZE_24}>
        <Icon name="add-circle-outline" />
      </Pressable>
      <Pressable hitSlop={SIZE_24} onPress={discoverPressCallback}>
        <Icon
          name={
            currentTabName === "discover" ? "search-bold" : "search-regular"
          }
        />
      </Pressable>
      <Pressable hitSlop={SIZE_24} onPress={inboxPressCallback}>
        <Icon
          name={currentTabName === "inbox" ? "send-solid" : "send-outline"}
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
    ...borderStyle.border_color_2,
    height: BOTTOM_TAB_HEIGHT,
  },
});
