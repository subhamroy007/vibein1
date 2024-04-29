import {
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
} from "react-native";
import { useCallback, useState } from "react";
import { useLayout } from "@react-native-community/hooks";
import { SwipablePostListProps } from "../../types/component.types";
import Animated from "react-native-reanimated";
import SwipablePost from "./SwipablePost";
import DefaultPlaceholder from "../utility-components/DefaultPlaceholder";
import { ItemKey } from "../../types/utility.types";
import SwipablePostPlaceHolder from "../utility-components/SwipablePostPlaceHolder";
import { layoutStyle } from "../../styles";

const SwipablePostList = ({
  data,
  focused,
  hasEndReached,
  isError,
  isLoading,
  onRefresh,
  onEndReach,
  refreshing,
  style,
}: SwipablePostListProps) => {
  const [focusedPostIndex, setFocusedPostIndex] = useState(0);

  const { height, onLayout } = useLayout();

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<ItemKey>) => {
      const preload = Math.abs(index - focusedPostIndex) <= 3 && focused;
      if (!height) return null;
      return (
        <SwipablePost
          id={item.key}
          height={height}
          focused={focused && index === focusedPostIndex}
          preload={preload}
        />
      );
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
      onMomentumScrollEnd={onMomentumScrollEnd}
      getItemLayout={getItemLayoutCallback}
      pagingEnabled
      ListEmptyComponent={
        onEndReach && height ? (
          <SwipablePostPlaceHolder
            isLoading={isLoading || false}
            height={height}
          />
        ) : undefined
      }
      ListFooterComponent={
        showFooter && height && onEndReach ? (
          <SwipablePostPlaceHolder
            isLoading={isLoading || false}
            height={height}
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
      style={layoutStyle.flex_1}
    />
  );
};

export default SwipablePostList;
