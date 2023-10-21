import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { layoutStyle, marginStyle, paddingStyle } from "../styles";
import useCommentSection from "../hooks/post.hooks";
import CommentListItem from "./CommentListItem";
import CommentBox from "./CommentBox";
import AnimatedLaodingIndicator from "./AnimatedLaodingIndicator";
import CircleIcon from "./CircleIcon";
import {
  SIZE_24,
  SIZE_36,
  SIZE_42,
  SIZE_48,
  SIZE_54,
  SIZE_60,
} from "../constants";
import Animated from "react-native-reanimated";
import { Portal } from "@gorhom/portal";

export default function CommentSection({ id }: { id: string }) {
  const { storeParams, fetch } = useCommentSection(id);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const [replyParams, setReplyParams] = useState<{
    replyTo: string;
    commentId: string;
  } | null>(null);

  const replyCallback = useCallback(
    (commentId: string, replyTo: string) =>
      setReplyParams({ commentId, replyTo }),
    [setReplyParams]
  );

  const replyResetCallback = useCallback(
    () => setReplyParams(null),
    [setReplyParams]
  );

  const [comment, setComment] = useState("");

  const sendCallback = useCallback(() => {
    setReplyParams(null);
    setComment("");
  }, [comment]);

  if (!storeParams) {
    return null;
  }

  const { isClientAuthorOfPost, author, commentSectionThunkInfo, comments } =
    storeParams;

  return (
    <View style={[layoutStyle.flex_1]}>
      <Animated.FlatList
        data={commentSectionThunkInfo.state === "loading" ? [] : comments}
        renderItem={({ item }) => {
          return <CommentListItem id={item} onReply={replyCallback} />;
        }}
        keyboardShouldPersistTaps="always"
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item}
        ListEmptyComponent={
          <View style={styles.empty_component}>
            {commentSectionThunkInfo.state === "loading" ? (
              <AnimatedLaodingIndicator />
            ) : (
              <Pressable onPress={fetch} hitSlop={SIZE_24}>
                <CircleIcon name="retry" />
              </Pressable>
            )}
          </View>
        }
        contentContainerStyle={[styles.content_container]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content_container: {
    paddingBottom: 2 * SIZE_54,
    ...paddingStyle.padding_top_12,
  },
  empty_component: {
    ...layoutStyle.align_self_center,
    marginTop: SIZE_36,
  },
});
