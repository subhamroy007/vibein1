import { View } from "react-native";
import Comment, { CommentProps } from "./Comment";
import { useAppSelector } from "../hooks/storeHooks";
import { selectReplSectionParams } from "../store/comment/comment.selectors";
import { layoutStyle, marginStyle } from "../styles";
import AppText from "./AppText";
import { SIZE_11 } from "../constants";
import { useCallback, useState } from "react";
import Reply from "./Reply";

export default function CommentListItem(props: CommentProps) {
  const replySectionParams = useAppSelector((state) =>
    selectReplSectionParams(state, props.id)
  );

  const toggleReplySectionState = useCallback(
    () => setReplySectionHiddenState((prevState) => !prevState),
    []
  );

  const [isReplySectionHidden, setReplySectionHiddenState] = useState(true);

  if (!replySectionParams) {
    return null;
  }
  const { noOfReplies, replies, replySectionThunkInfo } = replySectionParams;

  const noOfUnLoadedReplies = noOfReplies - replies.length;

  return (
    <View>
      <Comment {...props} />
      {noOfReplies > 0 && isReplySectionHidden && (
        <AppText
          color="grey"
          size={SIZE_11}
          style={[
            { lineHeight: SIZE_11 },
            layoutStyle.align_self_center,
            marginStyle.margin_bottom_12,
          ]}
          onPress={toggleReplySectionState}
        >
          Show {noOfReplies} Replies
        </AppText>
      )}
      {!isReplySectionHidden && (
        <View>
          {replies.map((reply) => (
            <Reply id={reply} onReply={() => {}} key={reply} />
          ))}
        </View>
      )}
      {noOfReplies > 0 && !isReplySectionHidden && (
        <View
          style={[
            layoutStyle.align_self_center,
            marginStyle.margin_bottom_12,
            layoutStyle.flex_direction_row,
          ]}
        >
          {noOfUnLoadedReplies > 0 && (
            <AppText
              color="grey"
              size={SIZE_11}
              style={[{ lineHeight: SIZE_11 }, marginStyle.margin_right_12]}
            >
              Show {noOfUnLoadedReplies} Replies
            </AppText>
          )}
          <AppText
            color="grey"
            size={SIZE_11}
            style={[{ lineHeight: SIZE_11 }]}
            onPress={toggleReplySectionState}
          >
            Hide
          </AppText>
        </View>
      )}
    </View>
  );
}
