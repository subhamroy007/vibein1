import { FlatList, View } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { layoutStyle } from "../styles";
import useCommentSection from "../hooks/postCommentSectionHook";
import CommentListItem from "./CommentListItem";

export default function CommentSection({ id }: { id: string }) {
  const { commentSectionParams, fetch } = useCommentSection(id);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const [replyParams, setReplyParams] = useState<{
    replyTo: string;
    commentId: string;
  } | null>(null);

  const onReplyCallback = useCallback(
    (replyTo: string, commentId: string) =>
      setReplyParams({ commentId, replyTo }),
    [setReplyParams]
  );

  const replyResetCallback = useCallback(
    () => setReplyParams(null),
    [setReplyParams]
  );

  const sendCallback = useCallback(() => {}, []);

  if (!commentSectionParams) {
    return null;
  }

  return (
    <View style={[layoutStyle.flex_1]}>
      <FlatList
        data={commentSectionParams.data.comments}
        renderItem={({ item }) => {
          return <CommentListItem id={item} onReply={onReplyCallback} />;
        }}
        keyboardShouldPersistTaps="always"
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item}
      />
    </View>
  );
}
