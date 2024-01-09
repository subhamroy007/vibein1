import {
  ListRenderItemInfo,
  Pressable,
  StyleSheet,
  ViewToken,
  ViewabilityConfig,
} from "react-native";
import { useCallback, useState } from "react";
import ClassicPost from "./ClassicPost";
import Animated, {
  Layout,
  SharedValue,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { layoutStyle } from "../styles";
import { PostFeedItemIdentfierParams, ThunkState } from "../types/store.types";
import AnimatedLaodingIndicator from "./AnimatedLaodingIndicator";
import { SIZE_24, SIZE_60 } from "../constants";
import CircleIcon from "./CircleIcon";
import { useDeviceLayout } from "../hooks/utility.hooks";

const viewabilityConfig: ViewabilityConfig = {
  minimumViewTime: 150,
  itemVisiblePercentThreshold: 60,
};

export type ClassicPostListProps = {
  data: string[];
  state: ThunkState;
  onRetry: () => void;
  onPostTap: (id: string) => void;
  clampedScrollOffset?: SharedValue<number>;
  contentOffset?: number;
};

/**
 * functional component that returns a list of post in classic view
 */
export default function ClassicPostList({
  data,
  state,
  onRetry,
  onPostTap,
  clampedScrollOffset,
  contentOffset,
}: ClassicPostListProps) {
  const { width, height } = useDeviceLayout();

  const [activePostIndex, setActivePostIndex] = useState(0);

  const prevScrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll(event) {
      if (clampedScrollOffset && contentOffset) {
        const diff = event.contentOffset.y - prevScrollY.value;
        const clampedDiff = Math.min(
          Math.max(diff, -contentOffset),
          contentOffset
        );
        clampedScrollOffset.value = Math.min(
          Math.max(clampedScrollOffset.value + clampedDiff, 0),
          contentOffset
        );
        prevScrollY.value = event.contentOffset.y;
      }
    },
  });

  const renderItemCallback = useCallback(
    ({ item, index }: ListRenderItemInfo<string>) => {
      return (
        <ClassicPost
          id={item}
          onPress={onPostTap}
          focused={index === activePostIndex}
        />
      );
    },
    [activePostIndex]
  );

  const viewableItemsChangedCallback = useCallback(
    ({
      viewableItems,
    }: {
      viewableItems: ViewToken[];
      changed: ViewToken[];
    }) => {
      if (viewableItems.length > 0) {
        setActivePostIndex(viewableItems[0].index!);
      }
    },
    []
  );

  return (
    <Animated.FlatList
      data={data}
      renderItem={renderItemCallback}
      keyExtractor={(item) => item}
      keyboardShouldPersistTaps="always"
      showsVerticalScrollIndicator={false}
      overScrollMode="never"
      itemLayoutAnimation={Layout.duration(300)}
      nestedScrollEnabled
      ListFooterComponent={
        state === "loading" ? (
          <AnimatedLaodingIndicator size={SIZE_60} />
        ) : state === "failed" ? (
          <Pressable onPress={onRetry} hitSlop={SIZE_24}>
            <CircleIcon name="retry" />
          </Pressable>
        ) : undefined
      }
      ListFooterComponentStyle={[
        { width, height: 0.2 * height },
        styles.footer_component,
      ]}
      onScroll={scrollHandler}
      contentContainerStyle={{ paddingTop: contentOffset }}
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={viewableItemsChangedCallback}
    />
  );
}

const styles = StyleSheet.create({
  footer_component: {
    ...layoutStyle.align_item_center,
    ...layoutStyle.justify_content_center,
  },
});
