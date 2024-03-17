import {
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
} from "react-native";
import { useCallback, useState } from "react";
import { PostItemIdentifier } from "../../types/store.types";
import PhotoPost from "./PhotoPost";
import MomentPost from "./MomentPost";
import { useLayout } from "@react-native-community/hooks";
import { SwipablePostListProps } from "../../types/component.types";
import { useDataFetchHook } from "../../hooks/utility.hooks";
import Animated from "react-native-reanimated";
import DefaultErrorFallback from "../utility-components/DefaultErrorFallback";
import SwipablePostPlaceHolder from "../utility-components/SwipablePostPlaceHolder";

const SwipablePostList = ({
  data,
  focused,
  hasEndReached,
  isError,
  isLoading,
  onFetch,
  onRefresh,
}: SwipablePostListProps) => {
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
      const preload = Math.abs(index - focusedPostIndex) <= 3 && focused;
      if (!height) return null;
      if (item.type === "photo-post") {
        return <PhotoPost id={item.id} height={height} preload={preload} />;
      } else {
        return (
          <MomentPost
            id={item.id}
            height={height}
            focused={focused && index === focusedPostIndex}
            preload={preload}
          />
        );
      }
    },
    [focusedPostIndex, height, focused]
  );

  const onMomentumScrollEnd = useCallback(
    ({
      nativeEvent: { contentOffset },
    }: NativeSyntheticEvent<NativeScrollEvent>) => {
      const absoluteResult = contentOffset.y / height;

      const ceilValue = Math.ceil(absoluteResult);

      const floorValue = Math.floor(absoluteResult);

      if (absoluteResult - floorValue < 0.1) {
        setFocusedPostIndex(floorValue);
      } else if (ceilValue - absoluteResult < 0.1) {
        setFocusedPostIndex(ceilValue);
      }
    },
    [height]
  );

  const getItemLayoutCallback = useCallback(
    (_: any, index: number) => {
      return {
        index,
        length: height,
        offset: index * height,
      };
    },
    [height]
  );

  return (
    <Animated.FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      onLayout={onLayout}
      onMomentumScrollEnd={onMomentumScrollEnd}
      getItemLayout={getItemLayoutCallback}
      pagingEnabled
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
          <SwipablePostPlaceHolder
            height={height}
            isLoading={isLoading || false}
          />
        )
      }
      ListFooterComponent={
        hasEndReached !== false ? undefined : isError ? (
          onFetch && <DefaultErrorFallback retry={onFetch} />
        ) : (
          <SwipablePostPlaceHolder
            height={height}
            isLoading={isLoading || false}
          />
        )
      }
    />
  );
};

export default SwipablePostList;
