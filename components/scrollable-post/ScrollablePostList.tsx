import {
  ListRenderItemInfo,
  RefreshControl,
  ViewToken,
  ViewabilityConfig,
} from "react-native";
import { useCallback, useState } from "react";
import { PostItemIdentifier } from "../../types/store.types";
import PhotoPost from "./PhotoPost";
import MomentPost from "./MomentPost";
import { useLayout } from "@react-native-community/hooks";
import { ScrollablePostListProps } from "../../types/component.types";
import { useDataFetchHook } from "../../hooks/utility.hooks";
import Animated from "react-native-reanimated";
import DefaultErrorFallback from "../utility-components/DefaultErrorFallback";
import DefaultPlaceHolder from "../utility-components/DefaultPlaceHolder";

const viewabilityConfig: ViewabilityConfig = {
  minimumViewTime: 150,
  itemVisiblePercentThreshold: 60,
};

const ScrollablePostList = ({
  data,
  hasEndReached,
  isError,
  isLoading,
  onFetch,
  onRefresh,
}: ScrollablePostListProps) => {
  const [focusedPostIndex, setFocusedPostIndex] = useState(0);

  const { endReachedCallback, refreshCallback, refreshing } = useDataFetchHook(
    data,
    isLoading,
    onFetch,
    onRefresh
  );

  const { height, onLayout } = useLayout();

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<PostItemIdentifier>) => {
      const preload = Math.abs(index - focusedPostIndex) <= 3;
      if (item.type === "photo-post") {
        return <PhotoPost id={item.id} preload={preload} />;
      } else {
        return (
          <MomentPost
            id={item.id}
            focused={index === focusedPostIndex}
            preload={preload}
          />
        );
      }
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
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      onLayout={onLayout}
      showsVerticalScrollIndicator={false}
      overScrollMode={"never"}
      onEndReachedThreshold={0.2}
      onEndReached={hasEndReached !== false ? undefined : endReachedCallback}
      refreshControl={
        onRefresh && (
          <RefreshControl refreshing={refreshing} onRefresh={refreshCallback} />
        )
      }
      ListEmptyComponent={
        isError ? (
          onFetch && <DefaultErrorFallback retry={onFetch} height={height} />
        ) : (
          <DefaultPlaceHolder height={height} isLoading={isLoading || false} />
        )
      }
      ListFooterComponent={
        hasEndReached !== false ? undefined : isError ? (
          onFetch && <DefaultErrorFallback retry={onFetch} />
        ) : (
          <DefaultPlaceHolder isLoading={isLoading || false} />
        )
      }
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={viewableItemsChangedCallback}
    />
  );
};

export default ScrollablePostList;
