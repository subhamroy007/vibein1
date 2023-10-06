import { View } from "react-native";
import { useCallback, useState } from "react";
import Reply from "./Comment";
import AppText from "./AppText";
import { layoutStyle, marginStyle } from "../styles";
import { SIZE_11, SIZE_12 } from "../constants";
import CommentPlaceHolder from "./CommentPlaceHolder";

type CommentProps = {
  id: string;
  onReply: (replyTo: string, commentId: string) => void;
};

export default function Comment({ id, onReply }: CommentProps) {
  const [isReplyHidden, setReplyHiddenState] = useState(true);

  const toggleReplyHiddenState = useCallback(() => {
    setReplyHiddenState((prevState) => !prevState);
  }, []);

  const noOfUnloadedReplies = noOfReplies - relpies.length;

  return (
    <View>
      <Reply id={id} onReply={onReply} />
      {!isReplyHidden && (
        <>
          {relpies.map((reply) =>
            reply.type === "reply" ? (
              <Reply
                id={reply.replyId}
                onReply={onReply}
                rootCommentId={id}
                key={reply.replyId}
              />
            ) : (
              <CommentPlaceHolder
                text={reply.text}
                key={reply.requestId}
                type="reply"
              />
            )
          )}
          <View
            style={[
              layoutStyle.flex_direction_row,
              layoutStyle.align_item_center,
              layoutStyle.align_self_center,
              marginStyle.margin_bottom_12,
            ]}
          >
            <AppText
              color="grey"
              size={SIZE_11}
              onPress={toggleReplyHiddenState}
            >
              Hide
            </AppText>
            {noOfUnloadedReplies !== 0 && (
              <AppText
                color="grey"
                style={[marginStyle.margin_left_24]}
                size={SIZE_11}
              >
                load {noOfUnloadedReplies} replies
              </AppText>
            )}
          </View>
        </>
      )}
      {isReplyHidden && noOfReplies !== 0 && (
        <AppText
          color="grey"
          onPress={toggleReplyHiddenState}
          style={[layoutStyle.align_self_center, marginStyle.margin_bottom_12]}
          size={SIZE_11}
        >
          show {noOfReplies} replies
        </AppText>
      )}
      {isReplyHidden}
    </View>
  );
}
