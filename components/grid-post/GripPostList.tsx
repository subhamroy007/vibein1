import {
  FlatListProps,
  ListRenderItemInfo,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { GridPostGroupParams } from "../../types/selector.types";
import { GridPostGroup } from "./GridPostGroup";
import { useCallback, useEffect, useMemo, useState } from "react";
import Animated, {
  Layout,
  SharedValue,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { ThunkState } from "../../types/store.types";
import AnimatedLaodingIndicator from "../AnimatedLaodingIndicator";
import { SIZE_120, SIZE_24, SIZE_60 } from "../../constants";
import CircleIcon from "../CircleIcon";
import { layoutStyle } from "../../styles";
import GridPlaceHolder from "./GridPlaceHolder";
import { useLayout } from "@react-native-community/hooks";
import { Href } from "expo-router/build/link/href";

export type GridPostListProps = {
  data?: string[];
  portrait?: boolean;
  showViews?: boolean;
  showPin?: boolean;
  scrollOffset?: SharedValue<number>;
  contentOffset?: number;
  header?: FlatListProps<any>["ListHeaderComponent"];
  state?: ThunkState;
  showPlaceHolder?: boolean;
  clampedScrollOffset?: SharedValue<number>;
  gridPressRoute?: Href;
  previewPressRoute?: Href;
  initRequest?: () => void;
  paginationRequest?: () => void;
  enableReresh?: boolean;
  enablePagination?: boolean;
};

export default function GridPostList({
  data,
  scrollOffset,
  contentOffset,
  header,
  state,
  showPlaceHolder,
  clampedScrollOffset,
  enableReresh,
  enablePagination,
  initRequest,
  paginationRequest,
  ...restProps
}: GridPostListProps) {
  const { onLayout, height: listHeight } = useLayout();

  const [refreshing, setRefreshing] = useState(false);
  const prevScrollY = useSharedValue(0);

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

  const postGroups = [];

  if (data) {
    for (let i = 0; i < data.length; i += 3) {
      const postId1 = data[i];
      const postId2 = data[i + 1] ? data[i + 1] : "";
      const postId3 = data[i + 2] ? data[i + 2] : "";
      const groupId = postId1 + postId2 + postId3;

      postGroups.push({ groupId, posts: data.slice(i, i + 3) });
    }
  }

  const renderItem = useCallback(
    ({ item: { posts } }: ListRenderItemInfo<GridPostGroupParams>) => {
      return <GridPostGroup posts={posts} {...restProps} />;
    },
    [restProps]
  );

  const itemSeparator = useCallback(
    () => <View style={{ height: 3 * StyleSheet.hairlineWidth }} />,
    []
  );

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
  }, [listHeight, state, data, paginationRequest, refreshing]);

  const calculatedPlaceHolder = useMemo(() => {
    let placeHolder = undefined;
    if (listHeight) {
      if (state === "failed") {
        placeHolder = (
          <View
            style={[
              { height: listHeight },
              layoutStyle.align_item_center,
              layoutStyle.justify_content_center,
            ]}
          >
            <Pressable onPress={initRequest} hitSlop={SIZE_24}>
              <CircleIcon name="retry" />
            </Pressable>
          </View>
        );
      } else if (state === "loading") {
        placeHolder = showPlaceHolder ? (
          <GridPlaceHolder />
        ) : (
          <View
            style={[
              { height: listHeight },
              layoutStyle.align_item_center,
              layoutStyle.justify_content_center,
            ]}
          >
            <AnimatedLaodingIndicator size={SIZE_60} />
          </View>
        );
      }
    }
    return placeHolder;
  }, [listHeight, state, initRequest, showPlaceHolder]);

  useEffect(() => {
    if (initRequest) {
      initRequest();
    }
  }, [initRequest]);

  return (
    <Animated.FlatList
      itemLayoutAnimation={Layout.duration(300)}
      refreshControl={
        enableReresh && initRequest ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        ) : undefined
      }
      onLayout={onLayout}
      data={postGroups}
      keyExtractor={(item) => item.groupId}
      showsVerticalScrollIndicator={false}
      overScrollMode="never"
      renderItem={renderItem}
      ItemSeparatorComponent={itemSeparator}
      extraData={restProps}
      onScroll={scrollHandler}
      contentContainerStyle={{
        paddingTop: contentOffset,
      }}
      nestedScrollEnabled
      ListHeaderComponent={header}
      ListFooterComponent={enablePagination ? calculatedFooter : undefined}
      ListEmptyComponent={calculatedPlaceHolder}
      onEndReached={
        enablePagination && paginationRequest ? endReachedCallback : undefined
      }
      onEndReachedThreshold={0.3}
    />
  );
}
