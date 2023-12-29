import {
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
} from "react-native";
import { useCallback, useState } from "react";
import Animated, {
  Layout,
  SharedValue,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import {
  PostFeedItemIdentfierParams,
  ThunkState,
} from "../../types/store.types";
import FullScreenPost from "./FullScreenPost";
import FullScreenPlaceHolder from "./FullScreenPlaceHolder";
import { backgroundStyle, layoutStyle } from "../../styles";
import { useLayout } from "@react-native-community/hooks";
import { SIZE_24, SIZE_60 } from "../../constants";
import CircleIcon from "../CircleIcon";

const min = 0;
const max = SIZE_60;

export type FullScreenPostListProps = {
  data: PostFeedItemIdentfierParams[];
  state: ThunkState;
  onRetry: () => void;
  clampedScrollOffset?: SharedValue<number>;
  tabFocused?: boolean;
};

/**
 * functional component that returns a list of post in classic view
 */
export default function FullScreenPostList({
  data,
  state,
  onRetry,
  clampedScrollOffset,
  tabFocused,
}: FullScreenPostListProps) {
  const [activePostIndex, setActivePostIndex] = useState(0);

  const { height: listHeight, onLayout, width: listWidth } = useLayout();

  const prevScrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll(event) {
      if (clampedScrollOffset) {
        const diff = event.contentOffset.y - prevScrollY.value;
        const clampedDiff = Math.min(Math.max(diff, min - max), max - min);
        clampedScrollOffset.value = Math.min(
          Math.max(clampedScrollOffset.value + clampedDiff, min),
          max
        );
        prevScrollY.value = event.contentOffset.y;
      }
    },
  });

  const renderItemCallback = useCallback(
    ({ item, index }: ListRenderItemInfo<PostFeedItemIdentfierParams>) => {
      if (!listHeight) {
        return null;
      }

      switch (item.type) {
        case "post":
          return (
            <FullScreenPost
              id={item.postId}
              postHeight={listHeight}
              focused={index === activePostIndex && tabFocused === true}
            />
          );
      }
    },
    [listHeight, activePostIndex, tabFocused]
  );

  const onMomentumScrollEndCallback = useCallback(
    ({
      nativeEvent: { contentOffset },
    }: NativeSyntheticEvent<NativeScrollEvent>) => {
      const absoluteResult = contentOffset.y / listHeight;

      const ceilValue = Math.ceil(absoluteResult);

      const floorValue = Math.floor(absoluteResult);

      if (absoluteResult - floorValue < 0.1) {
        setActivePostIndex(floorValue);
      } else if (ceilValue - absoluteResult < 0.1) {
        setActivePostIndex(ceilValue);
      }
    },
    [listHeight]
  );

  const getItemLayoutCallback = useCallback(
    (_: any, index: number) => {
      return {
        index,
        length: listHeight,
        offset: index * listHeight,
      };
    },
    [listHeight]
  );

  return (
    <Animated.FlatList
      onLayout={onLayout}
      nestedScrollEnabled
      data={data}
      renderItem={renderItemCallback}
      keyExtractor={(item) => item.postId}
      keyboardShouldPersistTaps="always"
      showsVerticalScrollIndicator={false}
      overScrollMode="never"
      itemLayoutAnimation={Layout.duration(300)}
      pagingEnabled
      getItemLayout={getItemLayoutCallback}
      ListFooterComponent={
        state === "success" || state === "idle" ? undefined : state ===
          "loading" ? (
          <FullScreenPlaceHolder />
        ) : (
          <Pressable onPress={onRetry} hitSlop={SIZE_24}>
            <CircleIcon name="retry" />
          </Pressable>
        )
      }
      onScroll={scrollHandler}
      onMomentumScrollEnd={onMomentumScrollEndCallback}
      ListFooterComponentStyle={[
        { height: listHeight, width: listWidth },
        layoutStyle.align_item_center,
        layoutStyle.justify_content_center,
      ]}
      style={backgroundStyle.background_color_4}
    />
  );
}
