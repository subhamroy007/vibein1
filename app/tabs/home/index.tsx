import { Stack } from "expo-router";
import { ListRenderItemInfo, Pressable, StyleSheet } from "react-native";
import { useCallback, useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useAppSelector } from "../../../hooks/storeHooks";
import { useHomeFeed } from "../../../hooks/client.hooks";
import AppScreen from "../../../components/AppScreen";
import {
  SIZE_24,
  SIZE_27,
  SIZE_30,
  SIZE_36,
  SIZE_54,
  SIZE_60,
} from "../../../constants";
import { selectClientAccountParams } from "../../../store/client/client.selector";
import { backgroundStyle, layoutStyle, paddingStyle } from "../../../styles";
import { PostFeedItemIdentfierParams } from "../../../types/store.types";
import ClassicPost from "../../../components/ClassicPost";
import ClassicPostList from "../../../components/ClassisPostList";
import Header from "../../../components/Header";
import Avatar from "../../../components/Avatar";
import { Image } from "expo-image";
import Icon from "../../../components/Icon";

export default function Home() {
  const clientAccount = useAppSelector(selectClientAccountParams);

  const { fetch, homeFeedParams } = useHomeFeed();

  const clampedScrollOffset = useSharedValue(0);

  const headerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: -clampedScrollOffset.value }],
    };
  }, []);

  if (!clientAccount) {
    return null;
  }

  return (
    <AppScreen>
      <Stack.Screen
        getId={() => "home-classic-feed" + Date.now()}
        key={"home-classic-feed"}
      />

      <ClassicPostList
        contentOffset={SIZE_54}
        clampedScrollOffset={clampedScrollOffset}
        data={homeFeedParams.data.feed}
        enableReresh
        initRequest={fetch}
        state={homeFeedParams.state}
      />
      <Header
        floating
        floatOffset={clampedScrollOffset}
        ItemLeft={
          <Pressable hitSlop={SIZE_24}>
            <Avatar url={clientAccount.profilePictureUrl} size={SIZE_30} />
          </Pressable>
        }
        ItemMiddle={
          <Image
            source={require("../../../assets/logo.svg")}
            style={styles.logo}
          />
        }
        ItemRight={
          <Pressable hitSlop={SIZE_24}>
            <Icon name="explore" size={SIZE_27} />
          </Pressable>
        }
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  logo: { width: SIZE_36, height: SIZE_36 },
});
