import { FlatList, StyleSheet, View } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { layoutStyle } from "../styles";
import useCommentSection from "../hooks/post.hooks";
import CommentListItem from "./CommentListItem";
import CommentBox from "./CommentBox";

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
      <FlatList
        data={comments}
        renderItem={({ item }) => {
          return <CommentListItem id={item} onReply={replyCallback} />;
        }}
        keyboardShouldPersistTaps="always"
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.content_container}
      />
      <CommentBox
        onSend={sendCallback}
        comment={comment}
        setComment={setComment}
        replyTo={replyParams?.replyTo}
        resetReplyTo={replyResetCallback}
        postAuthor={author}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content_container: {
    paddingBottom: 120,
  },
});
