import {
  ListRenderItemInfo,
  Pressable,
  View,
  useWindowDimensions,
} from "react-native";
import { useCallback, useRef } from "react";
import Animated, {
  Extrapolate,
  Layout,
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { PostFeedItemIdentfierParams, ThunkState } from "../types/store.types";
import AnimatedLaodingIndicator from "./AnimatedLaodingIndicator";
import {
  COLOR_1,
  SIZE_18,
  SIZE_24,
  SIZE_48,
  SIZE_60,
  SIZE_70,
} from "../constants";
import CircleIcon from "./CircleIcon";
import FullScreenPost from "./FullScreenPost";
import {
  backgroundStyle,
  layoutStyle,
  marginStyle,
  paddingStyle,
} from "../styles";
import Icon from "./Icon";
import AppText from "./AppText";

export type FullScreenPostListProps = {
  data: PostFeedItemIdentfierParams[];
  state: ThunkState;
  onRetry: () => void;
};

/**
 * functional component that returns a list of post in classic view
 */
export default function FullScreenPostList({
  data,
  state,
  onRetry,
}: FullScreenPostListProps) {
  const { height: screenHeight } = useWindowDimensions();

  const remainderOffset = useSharedValue(0);
  const startOffset = useSharedValue(0);
  const temp1 = useRef(0);
  const temp2 = useRef(0);

  const renderItemCallback = useCallback(
    ({ item }: ListRenderItemInfo<PostFeedItemIdentfierParams>) => {
      switch (item.type) {
        case "post":
          return <FullScreenPost id={item.postId} />;
      }
    },
    []
  );

  const animatedHeaderStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            remainderOffset.value,
            [-SIZE_70, 0, SIZE_70],
            [-SIZE_70, 0, -SIZE_70],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  return (
    <>
      <Animated.FlatList
        nestedScrollEnabled
        data={data}
        renderItem={renderItemCallback}
        keyExtractor={(item) => item.postId}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        itemLayoutAnimation={Layout.duration(300)}
        pagingEnabled
        onScrollBeginDrag={({ nativeEvent: { contentOffset } }) => {
          startOffset.value = contentOffset.y;
          temp1.current = contentOffset.y;
          console.log("temp1 is = ", temp1.current);
        }}
        onScroll={({ nativeEvent: { contentOffset } }) => {
          remainderOffset.value = Math.max(
            0,
            Math.min(contentOffset.y - startOffset.value, SIZE_70)
          );
          temp2.current = Math.max(
            -SIZE_70,
            Math.min(contentOffset.y - temp1.current, SIZE_70)
          );
          console.log("temp2 is = ", temp2.current);
        }}
        scrollEventThrottle={16}
        ListEmptyComponent={
          state === "loading" ? (
            <AnimatedLaodingIndicator
              size={SIZE_60}
              style={{
                marginTop: (screenHeight - SIZE_60) / 2 - SIZE_70,
              }}
            />
          ) : state === "failed" ? (
            <Pressable
              style={{
                marginTop: (screenHeight - SIZE_48) / 2 - SIZE_70,
              }}
              hitSlop={SIZE_24}
              onPress={onRetry}
            >
              <CircleIcon name="retry" />
            </Pressable>
          ) : undefined
        }
      />
      <Animated.View
        style={[
          layoutStyle.position_absolute,
          layoutStyle.width_100_percent,
          { height: SIZE_70, left: 0, top: 0 },
          backgroundStyle.background_color_3,
          layoutStyle.flex_direction_row,
          layoutStyle.align_item_center,
          paddingStyle.padding_horizontal_12,
          animatedHeaderStyle,
        ]}
      >
        <Icon name="arrow-left" color={COLOR_1} />
        <AppText
          color={COLOR_1}
          weight="bold"
          size={SIZE_18}
          style={marginStyle.margin_left_12}
        >
          Posts
        </AppText>
      </Animated.View>
    </>
  );
}
