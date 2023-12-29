import { Stack, useLocalSearchParams, useNavigation } from "expo-router";
import { useHomeFeed } from "../../../../hooks/client.hooks";
import AppScreen from "../../../../components/AppScreen";
import FullScreenPostList from "../../../../components/fullscreen-post/FullScreenPostList";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { COLOR_1, SIZE_20, SIZE_24, SIZE_60 } from "../../../../constants";
import { Pressable } from "react-native";
import Icon from "../../../../components/Icon";
import { layoutStyle, marginStyle, paddingStyle } from "../../../../styles";
import AppText from "../../../../components/AppText";
import { useCallback } from "react";

export default function FullScreenFeed() {
  const { post } = useLocalSearchParams<{ post: string }>();

  const navigation = useNavigation();

  const clampedScrollOffset = useSharedValue(0);

  const { fetch, homeFeedParams } = useHomeFeed();

  const headerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: -clampedScrollOffset.value }],
    };
  }, []);

  const backPressCallback = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);

  if (!post || !homeFeedParams) {
    return null;
  }

  return (
    <AppScreen dark>
      <Stack.Screen
        options={{
          headerShown: false,
          statusBarStyle: "light",
        }}
        getId={({ params }) =>
          "home-fullscreen-feed" + (params ? params["post"] : "") + Date.now()
        }
        key={"home-fullscreen-feed"}
      />
      <FullScreenPostList
        data={homeFeedParams.posts}
        onRetry={fetch}
        state={homeFeedParams.thunkInfo.state}
        clampedScrollOffset={clampedScrollOffset}
        tabFocused
      />
      <Animated.View
        style={[
          { height: SIZE_60, top: 0 },
          headerStyle,
          layoutStyle.align_item_center,
          layoutStyle.flex_direction_row,
          paddingStyle.padding_horizontal_12,
          layoutStyle.position_absolute,
          layoutStyle.width_100_percent,
        ]}
      >
        <Pressable hitSlop={SIZE_24} onPress={backPressCallback}>
          <Icon name="arrow-left" color={COLOR_1} />
        </Pressable>
        <AppText
          isMultiline
          style={marginStyle.margin_left_12}
          color={COLOR_1}
          weight="bold"
          size={SIZE_20}
        >
          Posts
        </AppText>
      </Animated.View>
    </AppScreen>
  );
}
