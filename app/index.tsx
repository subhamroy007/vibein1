import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { borderStyle, layoutStyle, paddingStyle } from "../styles";
import { Tabs } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import {
  HEIGHT_SCALE_3,
  SIZE_24,
  SIZE_27,
  SIZE_30,
  SIZE_36,
} from "../constants";
import Icon from "../components/Icon";
import Avatar from "../components/Avatar";
import { useAppSelector } from "../hooks/storeHooks";
import { selectClientAccountParams } from "../store/client/client.selector";
import Animated from "react-native-reanimated";
import { Image } from "expo-image";
import useHomeFeed from "../hooks/homeFeedHook";
import ClassicPostList from "../components/ClassisPostList";
import { useEffect } from "react";

export default function Home() {
  const clientAccount = useAppSelector(selectClientAccountParams);

  const { fetch, homeFeedParams } = useHomeFeed();

  if (!clientAccount) {
    return null;
  }
  const insets = useSafeAreaInsets();

  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <View
      style={[
        layoutStyle.flex_1,
        layoutStyle.align_item_center,
        layoutStyle.justify_content_space_around,
      ]}
    >
      <StatusBar translucent={true} hidden={false} />
      <Tabs.Screen
        options={{
          header: () => (
            <Animated.View
              style={[
                layoutStyle.align_item_center,
                layoutStyle.justify_content_space_between,
                layoutStyle.flex_direction_row,
                borderStyle.border_bottom_width_hairline,
                borderStyle.border_bottom_color_2,
                paddingStyle.padding_horizontal_12,
                { paddingTop: insets.top },
                styles.header,
              ]}
            >
              <Pressable hitSlop={SIZE_24}>
                <Avatar url={clientAccount.profilePictureUrl} size={SIZE_30} />
              </Pressable>
              <Image
                source={require("../assets/logo.svg")}
                style={styles.logo}
              />
              <Pressable hitSlop={SIZE_24}>
                <Icon name="explore" size={SIZE_27} />
              </Pressable>
            </Animated.View>
          ),
        }}
      />
      <ClassicPostList data={homeFeedParams.data.feed} />
    </View>
  );
}

const styles = StyleSheet.create({
  logo: { width: SIZE_36, height: SIZE_36 },
  header: {
    height: HEIGHT_SCALE_3,
  },
});
