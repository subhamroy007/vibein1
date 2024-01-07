import { ListRenderItemInfo, StyleSheet, View } from "react-native";
import { GridPostGroupParams } from "../../types/selector.types";
import { GridPostGroup } from "./GridPostGroup";
import { useCallback } from "react";
import Animated, {
  SharedValue,
  useAnimatedScrollHandler,
} from "react-native-reanimated";

export type GridPostListProps = {
  data: string[];
  portrait?: boolean;
  showViews?: boolean;
  showPin?: boolean;
  onPress: (id: string) => void;
  onPreviewPress: (id: string) => void;
  scrollOffset?: SharedValue<number>;
  contentOffset?: number;
};

export default function GridPostList({
  data,
  scrollOffset,
  contentOffset,
  ...restProps
}: GridPostListProps) {
  const postGroups = [];

  for (let i = 0; i < data.length; i += 3) {
    const postId1 = data[i];
    const postId2 = data[i + 1] ? data[i + 1] : "";
    const postId3 = data[i + 2] ? data[i + 2] : "";
    const groupId = postId1 + postId2 + postId3;

    postGroups.push({ groupId, posts: data.slice(i, i + 3) });
  }

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

  const scrollHandler = useAnimatedScrollHandler({
    onScroll(event) {
      if (scrollOffset) {
        scrollOffset.value = event.contentOffset.y;
      }
    },
  });

  return (
    <Animated.FlatList
      data={postGroups}
      keyExtractor={(item) => item.groupId}
      showsVerticalScrollIndicator={false}
      overScrollMode="never"
      renderItem={renderItem}
      ItemSeparatorComponent={itemSeparator}
      extraData={restProps}
      onScroll={scrollHandler}
      contentContainerStyle={{ paddingTop: contentOffset ? contentOffset : 0 }}
    />
  );
}
