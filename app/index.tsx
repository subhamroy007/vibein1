import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  backgroundStyle,
  layoutStyle,
  marginStyle,
  paddingStyle,
} from "../styles";
import { Tabs } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import {
  COLOR_1,
  SIZE_18,
  SIZE_20,
  SIZE_24,
  SIZE_27,
  SIZE_30,
  SIZE_36,
  SIZE_70,
} from "../constants";
import { useAppSelector } from "../hooks/storeHooks";
import { selectClientAccountParams } from "../store/client/client.selector";
import { useEffect } from "react";
import Animated from "react-native-reanimated";
import Avatar from "../components/Avatar";
import { Image } from "expo-image";
import Icon from "../components/Icon";
import ClassicPostList from "../components/ClassisPostList";
import FullScreenPostList from "../components/FullScreenPostList";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import { useHomeFeed } from "../hooks/client.hooks";

export default function Home() {
  const clientAccount = useAppSelector(selectClientAccountParams);

  const { fetch, homeFeedParams } = useHomeFeed();

  if (!clientAccount || !homeFeedParams) {
    return null;
  }
  const insets = useSafeAreaInsets();

  // useEffect(() => {
  //   fetch();
  // }, [fetch]);

  return (
    <SafeAreaView
      style={[
        layoutStyle.flex_1,
        layoutStyle.align_item_center,
        layoutStyle.justify_content_center,
      ]}
    >
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

      {/* <FullScreenPostList
        data={homeFeedParams.posts}
        state={homeFeedParams.thunkInfo.state}
        onRetry={fetch}
      /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logo: { width: SIZE_36, height: SIZE_36 },
  header: {
    height: SIZE_70,
  },
});
// header: () => {
//   return (
//     <View
//       style={[
//         layoutStyle.position_absolute,
//         layoutStyle.width_100_percent,
//         { height: SIZE_70 },
//         backgroundStyle.background_color_3,
//         layoutStyle.flex_direction_row,
//         layoutStyle.align_item_center,
//         paddingStyle.padding_horizontal_12,
//       ]}
//     >
//       <Icon name="arrow-left" color={COLOR_1} />
//       <AppText
//         color={COLOR_1}
//         weight="bold"
//         size={SIZE_18}
//         style={marginStyle.margin_left_12}
//       >
//         Posts
//       </AppText>
//     </View>
//   );
// },
// headerShown: false,
