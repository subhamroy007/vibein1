import { FlatList, ListRenderItemInfo, StyleSheet, View } from "react-native";
import { GridPostGroupParams } from "../../types/selector.types";
import { GridPostGroup } from "./GridPostGroup";
import { useCallback } from "react";

export type GridPostListProps = {
  postGroups: GridPostGroupParams[];
  portrait?: boolean;
  showViews?: boolean;
  showPin?: boolean;
};

export default function GridPostList({
  postGroups,
  ...restProps
}: GridPostListProps) {
  const renderItem = useCallback(
    ({ item: { posts } }: ListRenderItemInfo<GridPostGroupParams>) => {
      return <GridPostGroup posts={posts} {...restProps} />;
    },
    []
  );

  const itemSeparator = useCallback(
    () => <View style={{ height: 3 * StyleSheet.hairlineWidth }} />,
    []
  );

  return (
    <FlatList
      data={postGroups}
      keyExtractor={(item) => item.groupId}
      showsVerticalScrollIndicator={false}
      overScrollMode="never"
      renderItem={renderItem}
      ItemSeparatorComponent={itemSeparator}
      extraData={restProps}
    />
  );
}
