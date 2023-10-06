import { Pressable, View } from "react-native";
import useComment from "../hooks/commentHook";
import { layoutStyle, marginStyle, paddingStyle } from "../styles";
import AppText from "./AppText";
import HighlightedText from "./HighlightedText";
import Icon from "./Icon";
import {
  COLOR_10,
  COLOR_6,
  SIZE_11,
  SIZE_12,
  SIZE_20,
  SIZE_24,
} from "../constants";
import AppPressable from "./AppPressable";
import { useCallback, useState } from "react";
import { formatTimeDifference } from "../utility";
import Avatar from "./Avatar";
import SwipeUpPortal from "./SwipeUpPortal";
import Option from "./Option";

export type CommentProps = {
  id: string;
  onReply: (commentId: string, replyTo: string) => void;
};

export default function Comment({ id, onReply }: CommentProps) {
  const {
    commentParams,
    toggleCommentLikeStateCallback,
    toggleCommentPinStateCallback,
  } = useComment(id);

  const [isMoreOptionPortalOpen, setMoreOptionPortalState] = useState(false);

  const toggleMoreOptionPortal = useCallback(
    () => setMoreOptionPortalState((prevState) => !prevState),
    [setMoreOptionPortalState]
  );

  const replyPressCallback = useCallback(() => {
    if (commentParams?.createdBy) {
      onReply(commentParams.createdBy.username, id);
    }
  }, [commentParams?.createdBy, onReply]);

  const reportPressCallback = useCallback(() => {}, []);
  const deletePressCallback = useCallback(() => {}, []);
  const pinPressCallback = useCallback(() => {}, []);
  const blockPressCallback = useCallback(() => {}, []);

  if (!commentParams) {
    return null;
  }

  const { content, createdAt, createdBy, isLiked, noOfLikes, isPinned } =
    commentParams;

  return (
    <Pressable
      style={[
        layoutStyle.flex_direction_row,
        layoutStyle.align_item_flex_start,
        paddingStyle.padding_12,
      ]}
      onLongPress={toggleMoreOptionPortal}
    >
      <Avatar url={createdBy.profilePictureUrl} />
      <View style={[layoutStyle.flex_1, marginStyle.margin_horizontal_6]}>
        <AppText>{createdBy.username}</AppText>
        <HighlightedText>{content}</HighlightedText>
        <View
          style={[
            layoutStyle.flex_direction_row,
            layoutStyle.align_item_center,
            marginStyle.margin_top_6,
            layoutStyle.align_self_start,
          ]}
        >
          <AppText color={"grey"} onPress={replyPressCallback} size={SIZE_11}>
            Reply
          </AppText>
          <AppText
            style={[marginStyle.margin_left_12]}
            color="grey"
            size={SIZE_11}
          >
            {formatTimeDifference(createdAt)}
          </AppText>
          {isPinned && (
            <Icon
              color="grey"
              name="pin-solid"
              style={[marginStyle.margin_left_12]}
              size={SIZE_12}
            />
          )}
        </View>
      </View>
      <View
        style={[
          layoutStyle.align_self_start,
          layoutStyle.align_item_center,
          marginStyle.margin_top_6,
        ]}
      >
        <AppPressable
          onPress={toggleCommentLikeStateCallback}
          hitSlop={SIZE_24}
          pressRetentionOffset={SIZE_24}
        >
          <Icon
            name={isLiked ? "heart-solid" : "heart-outline"}
            color={isLiked ? COLOR_6 : "grey"}
            size={SIZE_20}
          />
        </AppPressable>
        {noOfLikes !== 0 && (
          <AppText
            color="grey"
            weight="regular"
            size={SIZE_11}
            style={marginStyle.margin_top_3}
          >
            {noOfLikes}
          </AppText>
        )}
      </View>
      {isMoreOptionPortalOpen && (
        <SwipeUpPortal onDismiss={toggleMoreOptionPortal} title="Options">
          <View>
            <Option
              icon={isPinned ? "pin-solid" : "pin-outline"}
              text={isPinned ? "Unpin Comment" : "Pin Comment"}
              onPress={pinPressCallback}
            />
            <Option
              icon="explore"
              text="Block Account"
              onPress={blockPressCallback}
            />
            <Option
              icon="delete"
              text="Delete"
              color={COLOR_10}
              onPress={deletePressCallback}
            />
            <Option
              icon="report"
              text="Report"
              color={COLOR_10}
              onPress={reportPressCallback}
            />
          </View>
        </SwipeUpPortal>
      )}
    </Pressable>
  );
}
