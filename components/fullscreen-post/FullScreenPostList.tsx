import {
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  RefreshControl,
  View,
} from "react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import { SIZE_24 } from "../../constants";
import CircleIcon from "../CircleIcon";

export type FullScreenPostListProps = {
  data?: string[] | PostFeedItemIdentfierParams[];
  scrollOffset?: SharedValue<number>;
  contentOffset?: number;
  state?: ThunkState;
  clampedScrollOffset?: SharedValue<number>;
  tabFocused?: boolean;
  initRequest?: () => void;
  paginationRequest?: () => void;
  enableReresh?: boolean;
  enablePagination?: boolean;
};

/**
 * functional component that returns a list of post in classic view
 */
export default function FullScreenPostList({
  data,
  state,
  clampedScrollOffset,
  contentOffset,
  scrollOffset,
  tabFocused,
  enablePagination,
  enableReresh,
  initRequest,
  paginationRequest,
}: FullScreenPostListProps) {
  const [activePostIndex, setActivePostIndex] = useState(0);

  const { height: listHeight, onLayout, width: listWidth } = useLayout();

  const [refreshing, setRefreshing] = useState(false);
  const prevScrollY = useSharedValue(0);

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
      if (!listHeight) {
        return null;
      }

      if (item.type === "post") {
        return (
          <FullScreenPost
            id={item.postId}
            postHeight={listHeight}
            focused={index === activePostIndex && tabFocused === true}
          />
        );
      }

      return null;
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
          {state === "loading" && <FullScreenPlaceHolder />}
        </View>
      );
    }
    return placeHolder;
  }, [state, , listHeight, initRequest]);

  const calculatedFooter = useMemo(() => {
    let Footer = undefined;

    if (listHeight && data?.length && paginationRequest && !refreshing) {
      Footer = (
        <View
          style={[
            { height: listHeight },
            layoutStyle.align_item_center,
            layoutStyle.justify_content_center,
          ]}
        >
          {state === "failed" && (
            <Pressable onPress={paginationRequest} hitSlop={SIZE_24}>
              <CircleIcon name="retry" />
            </Pressable>
          )}
          {state === "loading" && <FullScreenPlaceHolder />}
        </View>
      );
    }

    return Footer;
  }, [listHeight, state, data, paginationRequest, refreshing]);

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
      refreshControl={
        enableReresh && initRequest && data?.length ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        ) : undefined
      }
      onLayout={onLayout}
      nestedScrollEnabled
      data={items}
      renderItem={renderItemCallback}
      keyExtractor={(item) => item.postId}
      keyboardShouldPersistTaps="always"
      showsVerticalScrollIndicator={false}
      overScrollMode="never"
      itemLayoutAnimation={Layout.duration(300)}
      pagingEnabled
      getItemLayout={getItemLayoutCallback}
      ListEmptyComponent={listHeight ? calculatedPlaceHolder : undefined}
      ListFooterComponent={enablePagination ? calculatedFooter : undefined}
      onScroll={scrollHandler}
      onMomentumScrollEnd={onMomentumScrollEndCallback}
      style={backgroundStyle.background_color_4}
      onEndReached={
        enablePagination && paginationRequest ? endReachedCallback : undefined
      }
      onEndReachedThreshold={0.3}
    />
  );
}
