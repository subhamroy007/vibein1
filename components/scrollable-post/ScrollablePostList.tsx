import {
  ListRenderItemInfo,
  RefreshControl,
  ViewToken,
  ViewabilityConfig,
} from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLayout } from "@react-native-community/hooks";
import { ScrollablePostListProps } from "../../types/component.types";
import Animated, { scrollTo, useAnimatedRef } from "react-native-reanimated";
import { ItemKey } from "../../types/utility.types";
import ScrollablePost from "./ScrollablePost";
import DefaultPlaceholder from "../utility-components/DefaultPlaceholder";
import { LAYOUT_ANIMATION_400, windowWidth } from "../../constants";

const viewabilityConfig: ViewabilityConfig = {
  minimumViewTime: 150,
  itemVisiblePercentThreshold: 60,
};

const ScrollablePostList = ({
  data,
  hasEndReached,
  isError,
  isLoading,
  onEndReach,
  onRefresh,
  refreshing,
  onPress,
  startIndex,
}: ScrollablePostListProps) => {
  const [focusedPostIndex, setFocusedPostIndex] = useState(0);

  const listRef = useAnimatedRef<Animated.FlatList<ItemKey>>();

  // useEffect(() => {
  //   const callback = () => {
  //     "worklet";
  //     if (startIndex) {
  //       // (listRef.current as any).scrollToOffset({
  //       //   offset: (startIndex * windowWidth * 19) / 9,
  //       //   animated: false,
  //       // });
  //       console.log((startIndex * windowWidth * 19) / 9);
  //       scrollTo(listRef, 0, (startIndex * windowWidth * 19) / 9, false);
  //     }
  //   };
  //   callback();
  // }, [startIndex, data]);

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<ItemKey>) => {
      const preload = Math.abs(index - focusedPostIndex) <= 3;
      const focused = index === focusedPostIndex;
      return (
        <ScrollablePost
          // changeListScrollPosition={changeListScrollPosition}
          id={item.key}
          focused={focused}
          preload={preload}
          onPress={onPress}
          index={index}
          shouldSetScrollPosition={false}
        />
      );
    },
    [focusedPostIndex, onPress, startIndex]
  );

  const viewableItemsChangedCallback = useCallback(
    ({
      viewableItems,
    }: {
      viewableItems: ViewToken[];
      changed: ViewToken[];
    }) => {
      if (viewableItems.length > 0) {
        setFocusedPostIndex(viewableItems[0].index!);
      }
    },
    []
  );

  const useEndReachCallback =
    !isLoading &&
    data !== null &&
    data !== undefined &&
    data.length > 0 &&
    !refreshing &&
    hasEndReached === false;

  const showFooter =
    data !== null &&
    data !== undefined &&
    data.length > 0 &&
    hasEndReached === false;

  return (
    <Animated.FlatList
      ref={listRef}
      decelerationRate={0.999}
      data={data}
      renderItem={renderItem}
      ListEmptyComponent={
        onEndReach ? (
          <DefaultPlaceholder
            isError={isError || false}
            isLoading={isLoading || false}
            callback={onEndReach}
          />
        ) : undefined
      }
      ListFooterComponent={
        showFooter && onEndReach ? (
          <DefaultPlaceholder
            isError={isError || false}
            isLoading={isLoading || false}
            callback={onEndReach}
          />
        ) : undefined
      }
      onEndReachedThreshold={0.2}
      onEndReached={useEndReachCallback && onEndReach ? onEndReach : undefined}
      refreshControl={
        refreshing !== undefined && onRefresh !== undefined ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        ) : undefined
      }
      showsVerticalScrollIndicator={false}
      overScrollMode={"never"}
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={viewableItemsChangedCallback}
      removeClippedSubviews={false}
      itemLayoutAnimation={LAYOUT_ANIMATION_400}
      contentOffset={
        startIndex
          ? { x: 0, y: (startIndex * windowWidth * 19) / 9 }
          : undefined
      }
    />
  );
};

export default ScrollablePostList;
