import {
  ListRenderItemInfo,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { useCallback } from "react";
import { PostItemIdentifier } from "../../types/store.types";
import { GRID_SPACEx3, SIZE_120 } from "../../constants";
import { layoutStyle } from "../../styles";
import { GridPost } from "./GridPost";
import { GridPostListProps } from "../../types/component.types";
import GridPlaceHolder from "../utility-components/GridPlaceHolder";
import DefaultPlaceHolder from "../utility-components/DefaultPlaceHolder";
import Animated from "react-native-reanimated";
import DefaultErrorFallback from "../utility-components/DefaultErrorFallback";
import { useLayout } from "@react-native-community/hooks";
import { useDataFetchHook } from "../../hooks/utility.hooks";

export default function GridPostList({
  data,
  hasEndReached,
  isError,
  isLoading,
  onFetch,
  onRefresh,
  ...restProps
}: GridPostListProps) {
  const { height, onLayout } = useLayout();

  const { endReachedCallback, refreshCallback, refreshing } = useDataFetchHook(
    data,
    isLoading,
    onFetch,
    onRefresh
  );

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<PostItemIdentifier>) => {
      return <GridPost index={index} item={item} {...restProps} />;
    },
    [restProps]
  );

  const itemSeparator = useCallback(
    () => <View style={{ height: GRID_SPACEx3 }} />,
    []
  );

  return (
    <Animated.FlatList
      onLayout={onLayout}
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ItemSeparatorComponent={itemSeparator}
      columnWrapperStyle={layoutStyle.justify_content_space_between}
      numColumns={3}
      ListEmptyComponent={
        isError ? (
          onFetch && <DefaultErrorFallback retry={onFetch} height={height} />
        ) : (
          <GridPlaceHolder />
        )
      }
      ListFooterComponent={
        hasEndReached !== false ? undefined : isError ? (
          onFetch && <DefaultErrorFallback retry={onFetch} />
        ) : (
          <DefaultPlaceHolder isLoading={isLoading || false} />
        )
      }
      onEndReachedThreshold={0.2}
      onEndReached={hasEndReached !== false ? undefined : endReachedCallback}
      refreshControl={
        onRefresh && (
          <RefreshControl refreshing={refreshing} onRefresh={refreshCallback} />
        )
      }
      showsVerticalScrollIndicator={false}
      overScrollMode={"never"}
    />
  );
}

const styles = StyleSheet.create({
  footer: { height: SIZE_120 },
});
