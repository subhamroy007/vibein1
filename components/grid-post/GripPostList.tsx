import { FlatList, ListRenderItemInfo, StyleSheet, View } from "react-native";
import { GridPostGroupParams } from "../../types/selector.types";
import { GridPostGroup } from "./GridPostGroup";
import { useCallback, useState } from "react";
import { Portal } from "@gorhom/portal";
import PreviewPostList from "../preview-post/PreviewPostList";

export type GridPostListProps = {
  postGroups: GridPostGroupParams[];
  portrait?: boolean;
  showViews?: boolean;
  showPin?: boolean;
  onPress: (id: string) => void;
};

export default function GridPostList({
  postGroups,
  ...restProps
}: GridPostListProps) {
  const [isPreviewVisible, setPreviewVisibleState] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const togglePreviewVisibleState = useCallback(
    () => setPreviewVisibleState((prevState) => !prevState),
    []
  );

  const gridLongPressCallback = useCallback((id: string) => {
    togglePreviewVisibleState();
    setSelectedPostId(id);
  }, []);

  const previewDismissCallback = useCallback(() => {
    togglePreviewVisibleState();
    setSelectedPostId(null);
  }, []);

  const renderItem = useCallback(
    ({ item: { posts } }: ListRenderItemInfo<GridPostGroupParams>) => {
      return (
        <GridPostGroup
          posts={posts}
          {...restProps}
          onLongPress={gridLongPressCallback}
        />
      );
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
      {isPreviewVisible && selectedPostId && (
        <Portal>
          <PreviewPostList
            posts={postList}
            onDismiss={previewDismissCallback}
            selectedPostId={selectedPostId}
          />
        </Portal>
      )}
    </>
  );
}
