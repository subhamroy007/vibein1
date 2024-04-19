import {
  ListRenderItemInfo,
  RefreshControl,
  ViewToken,
  ViewabilityConfig,
} from "react-native";
import { useCallback, useState } from "react";
import { useLayout } from "@react-native-community/hooks";
import { ScrollablePostListProps } from "../../types/component.types";
import { useDataFetchHook } from "../../hooks/utility.hooks";
import Animated from "react-native-reanimated";
import { ItemKey } from "../../types/utility.types";
import ScrollablePost from "./ScrollablePost";
import DefaultPlaceholder from "../utility-components/DefaultPlaceholder";

const viewabilityConfig: ViewabilityConfig = {
  minimumViewTime: 150,
  itemVisiblePercentThreshold: 60,
};

const ScrollablePostList = ({
  data,
  hasEndReached,
  isError,
  isLoading,
  isPageLoading,
  refreshable,
  onEndReach,
  onInit,
}: ScrollablePostListProps) => {
  const [focusedPostIndex, setFocusedPostIndex] = useState(0);

  const { endReachedCallback, refreshCallback, refreshing } = useDataFetchHook(
    data,
    isLoading,
    isPageLoading,
    onEndReach,
    onInit
  );

  const { height, onLayout } = useLayout();

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<ItemKey>) => {
      const preload = Math.abs(index - focusedPostIndex) <= 3;
      const focused = index === focusedPostIndex;
      return (
        <ScrollablePost id={item.key} focused={focused} preload={preload} />
      );
    },
    [focusedPostIndex]
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

  return (
    <Animated.FlatList
      data={data}
      renderItem={renderItem}
      onLayout={onLayout}
      showsVerticalScrollIndicator={false}
      overScrollMode={"never"}
      onEndReachedThreshold={0.2}
      onEndReached={hasEndReached !== false ? undefined : endReachedCallback}
      refreshControl={
        onInit && refreshable ? (
          <RefreshControl refreshing={refreshing} onRefresh={refreshCallback} />
        ) : undefined
      }
      ListEmptyComponent={
        onInit && (
          <DefaultPlaceholder
            isLoading={isLoading || false}
            callback={onInit}
            isError={isError || false}
            height={height}
          />
        )
      }
      ListFooterComponent={
        hasEndReached === false ? (
          <DefaultPlaceholder
            isLoading={isLoading || false}
            callback={endReachedCallback}
            isError={isError || false}
          />
        ) : undefined
      }
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={viewableItemsChangedCallback}
    />
  );
};

export default ScrollablePostList;
