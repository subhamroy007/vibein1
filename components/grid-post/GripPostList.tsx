import {
  ListRenderItemInfo,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { useCallback } from "react";
import { GRID_SPACEx3, SIZE_120 } from "../../constants";
import { layoutStyle } from "../../styles";
import { GridPost } from "./GridPost";
import { GridPostListProps } from "../../types/component.types";
import GridPlaceHolder from "./GridPlaceHolder";
import Animated from "react-native-reanimated";
import { useLayout } from "@react-native-community/hooks";
import DefaultPlaceholder from "../utility-components/DefaultPlaceholder";
import { ItemKey } from "../../types/utility.types";

export default function GridPostList({
  data,
  hasEndReached,
  isError,
  isLoading,
  onEndReach,
  onRefresh,
  refreshing,
  nestedScrollingEnabled,
  style,
  onScroll,
  header,
  ...restProps
}: GridPostListProps) {
  const { height, onLayout } = useLayout();

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<ItemKey>) => {
      return <GridPost id={item.key} index={index} {...restProps} />;
    },
    [restProps]
  );

  const itemSeparator = useCallback(
    () => <View style={{ height: GRID_SPACEx3 }} />,
    []
  );

  const useEndReachCallback =
    !isLoading && data?.length && !refreshing && hasEndReached === false;

  return (
    <Animated.FlatList
      onScroll={onScroll}
      ListHeaderComponent={header}
      style={[style, layoutStyle.flex_1]}
      onLayout={onLayout}
      data={data}
      renderItem={renderItem}
      ItemSeparatorComponent={itemSeparator}
      columnWrapperStyle={layoutStyle.justify_content_space_between}
      numColumns={3}
      nestedScrollEnabled={nestedScrollingEnabled}
      ListEmptyComponent={
        data ? undefined : onEndReach ? (
          <GridPlaceHolder
            height={height}
            callback={onEndReach}
            isError={isError || false}
          />
        ) : undefined
      }
      ListFooterComponent={
        hasEndReached === false && onEndReach ? (
          <DefaultPlaceholder
            isLoading={isLoading || false}
            callback={onEndReach}
            isError={isError || false}
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
    />
  );
}

const styles = StyleSheet.create({
  footer: { height: SIZE_120 },
});
