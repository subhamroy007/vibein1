import {
  ListRenderItemInfo,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { BlurView } from "expo-blur";
import PostPreview from "./PostPreview";
import Animated, {
  ZoomIn,
  ZoomOut,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { useBackHandler } from "@react-native-community/hooks";
import { useCallback, useEffect, useRef } from "react";

export type PreviewPostListProps = {
  posts: string[];
  onDismiss: () => void;
  selectedPostId: string;
};

export default function PreviewPostList({
  posts,
  onDismiss,
  selectedPostId,
}: PreviewPostListProps) {
  const scrollOffset = useSharedValue(0);

  const { width: screenWidth } = useWindowDimensions();

  const listRef = useRef<Animated.FlatList<string>>(null);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll(event, _) {
      scrollOffset.value = event.contentOffset.x;
    },
  });

  const getItemLayoutCallback = useCallback(
    (_: ArrayLike<string> | null | undefined, index: number) => {
      return {
        index,
        length: screenWidth,
        offset: index * screenWidth,
      };
    },
    []
  );

  const renderItemCallback = useCallback(
    ({ item, index }: ListRenderItemInfo<string>) => {
      return (
        <PostPreview
          id={item}
          index={index}
          scrollOffset={scrollOffset}
          length={posts.length}
          onDismiss={onDismiss}
        />
      );
    },
    []
  );

  useBackHandler(() => {
    onDismiss();
    return true;
  });

  useEffect(() => {
    if (listRef.current) {
      (listRef.current as any).scrollToItem({
        animated: false,
        item: selectedPostId,
      });
    }
  }, [selectedPostId]);

  return (
    <View style={[StyleSheet.absoluteFill]}>
      <BlurView style={StyleSheet.absoluteFill} intensity={18} tint="light" />
      <Animated.FlatList
        ref={listRef}
        entering={ZoomIn.duration(400)}
        exiting={ZoomOut.duration(400)}
        data={posts}
        keyExtractor={(item) => item}
        renderItem={renderItemCallback}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        overScrollMode="never"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        getItemLayout={getItemLayoutCallback}
      />
    </View>
  );
}
