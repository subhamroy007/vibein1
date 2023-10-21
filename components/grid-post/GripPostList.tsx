import { FlatList, ListRenderItemInfo, StyleSheet, View } from "react-native";
import { GridPostGroupParams } from "../../types/selector.types";
import { GridPostGroup } from "./GridPostGroup";
import { useCallback } from "react";
import { Portal } from "@gorhom/portal";
import PreviewPostList from "../preview-post/PreviewPostList";

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

  const postList = postGroups.flatMap((item) => item.posts);

  return (
    <>
      <FlatList
        data={postGroups}
        keyExtractor={(item) => item.groupId}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        renderItem={renderItem}
        ItemSeparatorComponent={itemSeparator}
        extraData={restProps}
      />
      <Portal>
        <PreviewPostList posts={postList} />
      </Portal>
    </>
  );
}
