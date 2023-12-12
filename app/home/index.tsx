import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { layoutStyle, paddingStyle } from "../../styles";
import { Stack, Tabs, useRouter } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import { SIZE_24, SIZE_27, SIZE_30, SIZE_36, SIZE_60 } from "../../constants";
import { useAppSelector } from "../../hooks/storeHooks";
import { selectClientAccountParams } from "../../store/client/client.selector";
import { useCallback, useEffect } from "react";
import Animated from "react-native-reanimated";
import Avatar from "../../components/Avatar";
import { Image } from "expo-image";
import Icon from "../../components/Icon";
import ClassicPostList from "../../components/ClassisPostList";
import { useHomeFeed } from "../../hooks/client.hooks";

export default function Home() {
  const clientAccount = useAppSelector(selectClientAccountParams);

  const { fetch, homeFeedParams } = useHomeFeed();

  const router = useRouter();

  const postTapCallback = useCallback(
    (id: string) => {
      router.push({ pathname: `/home/full_screen_feed/${id}` });
    },
    [router]
  );

  const insets = useSafeAreaInsets();

  useEffect(() => {
    fetch();
  }, [fetch]);

  if (!clientAccount || !homeFeedParams) {
    return null;
  }
  return (
    <SafeAreaView style={[layoutStyle.flex_1]}>
      <Stack.Screen
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
                source={require("../../assets/logo.svg")}
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
        onPostTap={postTapCallback}
        onPageRetry={() => {}}
        onRetry={fetch}
        pageState="idle"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logo: { width: SIZE_36, height: SIZE_36 },
  header: {
    height: SIZE_60,
  },
});
