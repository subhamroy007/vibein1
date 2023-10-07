import { ListRenderItemInfo } from "react-native";
import { useCallback } from "react";
import ClassicPost from "./ClassicPost";
import Animated, { Layout } from "react-native-reanimated";
import { FeedItemParams } from "../types";
import { paddingStyle } from "../styles";

export type ClassicPostListProps = {
  data: FeedItemParams[];
};

/**
 * functional component that returns a list of post in classic view
 */
export default function ClassicPostList({ data }: ClassicPostListProps) {
  const renderItemCallback = useCallback(
    ({ item }: ListRenderItemInfo<FeedItemParams>) => {
      switch (item.type) {
        case "post":
          return <ClassicPost id={item.postId} />;
      }
    },
    []
  );

  return (
    <Animated.FlatList
      data={data}
      renderItem={renderItemCallback}
      keyExtractor={(item) => item.postId}
      keyboardShouldPersistTaps="always"
      showsVerticalScrollIndicator={false}
      overScrollMode="never"
      itemLayoutAnimation={Layout.duration(300)}
      contentContainerStyle={paddingStyle.padding_vertical_12}
    />
  );
}
