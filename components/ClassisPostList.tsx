import {
  FlatListProps,
  ListRenderItemInfo,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
  ViewToken,
  ViewabilityConfig,
} from "react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import { SIZE_120, SIZE_24, SIZE_60 } from "../constants";
import CircleIcon from "./CircleIcon";
import { useLayout } from "@react-native-community/hooks";
import { Href } from "expo-router/build/link/href";

const viewabilityConfig: ViewabilityConfig = {
  minimumViewTime: 150,
  itemVisiblePercentThreshold: 60,
};

export type ClassicPostListProps = {
  data?: string[] | PostFeedItemIdentfierParams[];
  scrollOffset?: SharedValue<number>;
  contentOffset?: number;
  header?: FlatListProps<any>["ListHeaderComponent"];
  state?: ThunkState;
  clampedScrollOffset?: SharedValue<number>;
  postPressRoute?: Href;
  initRequest?: () => void;
  paginationRequest?: () => void;
  enableReresh?: boolean;
  enablePagination?: boolean;
};

/**
 * functional component that returns a list of post in classic view
 */
export default function ClassicPostList({
  data,
  state,
  clampedScrollOffset,
  contentOffset,
  header,
  scrollOffset,
  postPressRoute,
  enablePagination,
  enableReresh,
  initRequest,
  paginationRequest,
}: ClassicPostListProps) {
  const { onLayout, height: listHeight } = useLayout();
  const [refreshing, setRefreshing] = useState(false);
  const [activePostIndex, setActivePostIndex] = useState(0);

  const prevScrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll(event) {
      if (scrollOffset) {
        scrollOffset.value = event.contentOffset.y;
      }
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
    ({ item, index }: ListRenderItemInfo<PostFeedItemIdentfierParams>) => {
      if (item.type === "post") {
        return (
          <ClassicPost
            id={item.postId}
            index={index}
            focused={index === activePostIndex}
            pressRoute={postPressRoute}
          />
        );
      }
      return null;
    },
    [activePostIndex, postPressRoute]
  );

  const items = useMemo<PostFeedItemIdentfierParams[]>(() => {
    if (!data) {
      return [];
    } else if (typeof data[0] === "string") {
      return (data as string[]).map((postId) => ({ postId, type: "post" }));
    }
    return data as PostFeedItemIdentfierParams[];
  }, [data]);

  const onRefresh = useCallback(() => {
    if (initRequest) {
      initRequest();
      setRefreshing(true);
    }
  }, [initRequest]);

  useEffect(() => {
    if (state !== "loading") {
      setRefreshing(false);
    }
  }, [state]);
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

  const calculatedFooter = useMemo(() => {
    let Footer = undefined;

    if (listHeight && data?.length && paginationRequest && !refreshing) {
      Footer = (
        <View
          style={[
            { height: SIZE_120 },
            layoutStyle.align_item_center,
            layoutStyle.justify_content_center,
            layoutStyle.align_self_stretch,
          ]}
        >
          {state === "failed" ? (
            <Pressable onPress={paginationRequest} hitSlop={SIZE_24}>
              <CircleIcon name="retry" />
            </Pressable>
          ) : (
            <AnimatedLaodingIndicator size={SIZE_60} />
          )}
        </View>
      );
    }

    return Footer;
  }, [listHeight, state, fetch, data, paginationRequest]);

  const calculatedPlaceHolder = useMemo(() => {
    let placeHolder = undefined;
    if (listHeight) {
      placeHolder = (
        <View
          style={[
            { height: listHeight },
            layoutStyle.align_item_center,
            layoutStyle.justify_content_center,
          ]}
        >
          {state === "failed" && (
            <Pressable onPress={initRequest} hitSlop={SIZE_24}>
              <CircleIcon name="retry" />
            </Pressable>
          )}
          {state === "loading" && <AnimatedLaodingIndicator size={SIZE_60} />}
        </View>
      );
    }
    return placeHolder;
  }, [listHeight, state, initRequest]);

  const endReachedCallback = useCallback(() => {
    if (
      state !== "loading" &&
      state !== "idle" &&
      paginationRequest &&
      data?.length
    ) {
      paginationRequest();
    }
  }, [state, paginationRequest, data]);

  useEffect(() => {
    if (initRequest) {
      initRequest();
    }
  }, [initRequest]);

  return (
    <Animated.FlatList
      onLayout={onLayout}
      data={items}
      renderItem={renderItemCallback}
      keyExtractor={(item) => item.postId}
      keyboardShouldPersistTaps="always"
      showsVerticalScrollIndicator={false}
      overScrollMode="never"
      itemLayoutAnimation={Layout.duration(300)}
      nestedScrollEnabled
      onScroll={scrollHandler}
      contentContainerStyle={{ paddingTop: contentOffset }}
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={viewableItemsChangedCallback}
      ListHeaderComponent={header}
      ListFooterComponent={enablePagination ? calculatedFooter : undefined}
      ListEmptyComponent={calculatedPlaceHolder}
      onEndReached={
        enablePagination && paginationRequest ? endReachedCallback : undefined
      }
      onEndReachedThreshold={0.3}
      refreshControl={
        enableReresh && initRequest && data?.length ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            progressViewOffset={contentOffset}
          />
        ) : undefined
      }
    />
  );
}

const styles = StyleSheet.create({
  footer_component: {
    ...layoutStyle.align_item_center,
    ...layoutStyle.justify_content_center,
  },
});
