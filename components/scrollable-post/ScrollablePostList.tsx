import {
  ListRenderItemInfo,
  RefreshControl,
  ViewToken,
  ViewabilityConfig,
} from "react-native";
import { useCallback, useState } from "react";
import { useLayout } from "@react-native-community/hooks";
import { ScrollablePostListProps } from "../../types/component.types";
import Animated from "react-native-reanimated";
import { ItemKey } from "../../types/utility.types";
import ScrollablePost from "./ScrollablePost";
import DefaultPlaceholder from "../utility-components/DefaultPlaceholder";
import { LAYOUT_ANIMATION_400 } from "../../constants";

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
}: ScrollablePostListProps) => {
  const [focusedPostIndex, setFocusedPostIndex] = useState(0);

  const { height, onLayout } = useLayout();

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<ItemKey>) => {
      const preload = Math.abs(index - focusedPostIndex) <= 3;
      const focused = index === focusedPostIndex;
      return (
        <ScrollablePost
          id={item.key}
          focused={focused}
          preload={preload}
          onPress={onPress}
          index={index}
        />
      );
    },
    [focusedPostIndex, onPress]
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
      data={data}
      renderItem={renderItem}
      onLayout={onLayout}
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
    />
  );
};

export default ScrollablePostList;
