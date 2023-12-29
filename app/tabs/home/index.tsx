import { Stack, useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { useCallback, useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useAppSelector } from "../../../hooks/storeHooks";
import { useHomeFeed } from "../../../hooks/client.hooks";
import AppScreen from "../../../components/AppScreen";
import ClassicPostList from "../../../components/ClassisPostList";
import {
  SIZE_24,
  SIZE_27,
  SIZE_30,
  SIZE_36,
  SIZE_60,
} from "../../../constants";
import { selectClientAccountParams } from "../../../store/client/client.selector";
import Avatar from "../../../components/Avatar";
import { Image } from "expo-image";
import Icon from "../../../components/Icon";
import { backgroundStyle, layoutStyle, paddingStyle } from "../../../styles";

export default function Home() {
  const clientAccount = useAppSelector(selectClientAccountParams);

  const { fetch, homeFeedParams } = useHomeFeed();

  const router = useRouter();

  const postTapCallback = useCallback(
    (id: string) => {
      router.push({ pathname: `/tabs/home/full_screen_feed/${id}` });
    },
    [router]
  );

  useEffect(() => {
    fetch();
  }, []);

  const clampedScrollOffset = useSharedValue(0);

  const headerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: -clampedScrollOffset.value }],
    };
  }, []);

  if (!clientAccount || !homeFeedParams) {
    return null;
  }

  return (
    <AppScreen>
      <Stack.Screen
        getId={() => "home-classic-feed" + Date.now()}
        key={"home-classic-feed"}
        options={{ statusBarStyle: "dark" }}
      />

      <ClassicPostList
        data={homeFeedParams.posts}
        state={homeFeedParams.thunkInfo.state}
        onPostTap={postTapCallback}
        onRetry={fetch}
        clampedScrollOffset={clampedScrollOffset}
      />
      <Animated.View style={[styles.header, headerStyle]}>
        <Pressable hitSlop={SIZE_24}>
          <Avatar url={clientAccount.profilePictureUrl} size={SIZE_30} />
        </Pressable>
        <Image
          source={require("../../../assets/logo.svg")}
          style={styles.logo}
        />
        <Pressable hitSlop={SIZE_24}>
          <Icon name="explore" size={SIZE_27} />
        </Pressable>
      </Animated.View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  logo: { width: SIZE_36, height: SIZE_36 },
  header: {
    height: SIZE_60,
    top: 0,
    ...layoutStyle.align_item_center,
    ...layoutStyle.justify_content_space_between,
    ...layoutStyle.flex_direction_row,
    ...paddingStyle.padding_horizontal_12,
    ...backgroundStyle.background_color_1,
    ...layoutStyle.position_absolute,
    ...layoutStyle.width_100_percent,
  },
});
