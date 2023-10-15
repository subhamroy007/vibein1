import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { borderStyle, layoutStyle, paddingStyle } from "../styles";
import { Tabs } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import {
  COLOR_2,
  HEIGHT_SCALE_3,
  SIZE_24,
  SIZE_27,
  SIZE_30,
  SIZE_36,
  SIZE_60,
  SIZE_70,
} from "../constants";
import { useAppSelector } from "../hooks/storeHooks";
import { selectClientAccountParams } from "../store/client/client.selector";
import useHomeFeed from "../hooks/homeFeedHook";
import { useEffect } from "react";
import Animated from "react-native-reanimated";
import Avatar from "../components/Avatar";
import { Image } from "expo-image";
import Icon from "../components/Icon";
import ClassicPostList from "../components/ClassisPostList";
import AnimatedLaodingIndicator from "../components/AnimatedLaodingIndicator";
import CircleIcon from "../components/CircleIcon";

export default function Home() {
  const clientAccount = useAppSelector(selectClientAccountParams);

  const { fetch, homeFeedParams } = useHomeFeed();

  if (!clientAccount || !homeFeedParams) {
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
        layoutStyle.justify_content_center,
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

      <ClassicPostList
        data={homeFeedParams.posts}
        state={homeFeedParams.thunkInfo.state}
        onRetry={fetch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  logo: { width: SIZE_36, height: SIZE_36 },
  header: {
    height: SIZE_70,
  },
});
