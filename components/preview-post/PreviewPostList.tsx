import { StyleSheet, View } from "react-native";
import { layoutStyle } from "../../styles";
import { BlurView } from "expo-blur";
import PostPreview from "./PostPreview";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

export type PreviewPostListProps = {
  posts: string[];
};

export default function PreviewPostList({ posts }: PreviewPostListProps) {
  const scrollOffset = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll(event, _) {
      scrollOffset.value = event.contentOffset.x;
    },
  });

  return (
    <View style={[StyleSheet.absoluteFill]}>
      <BlurView style={StyleSheet.absoluteFill} intensity={18} tint="light" />
      <Animated.FlatList
        data={posts}
        keyExtractor={(item) => item}
        renderItem={({ item, index }) => {
          return (
            <PostPreview
              id={item}
              index={index}
              scrollOffset={scrollOffset}
              length={posts.length}
            />
          );
        }}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        overScrollMode="never"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      />
    </View>
  );
}
