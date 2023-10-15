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
  SIZE_30,
} from "../constants";
import AppPressable from "./AppPressable";
import { useCallback, useState } from "react";
import { formatTimeDifference } from "../utility";
import Avatar from "./Avatar";
import SwipeUpPortal from "./SwipeUpPortal";
import Option from "./Option";
import useReply from "../hooks/replyHook";

export type ReplyProps = {
  id: string;
  onReply: (commentId: string, replyTo: string) => void;
};

export default function Reply({ id, onReply }: ReplyProps) {
  const { replyParams, toggleReplyLikeStateCallback } = useReply(id);

  const [isMoreOptionPortalOpen, setMoreOptionPortalState] = useState(false);

  const toggleMoreOptionPortal = useCallback(
    () => setMoreOptionPortalState((prevState) => !prevState),
    [setMoreOptionPortalState]
  );

  const replyPressCallback = useCallback(() => {
    if (replyParams?.createdBy) {
      onReply(id, replyParams.createdBy.username);
    }
  }, [replyParams?.createdBy, onReply]);

  const reportPressCallback = useCallback(() => {}, []);
  const deletePressCallback = useCallback(() => {}, []);
  const blockPressCallback = useCallback(() => {}, []);

  if (!replyParams) {
    return null;
  }

  const { content, createdAt, createdBy, isLiked, noOfLikes } = replyParams;

  return (
    <Pressable
      style={[
        layoutStyle.flex_direction_row,
        layoutStyle.align_item_flex_start,
        paddingStyle.padding_12,
      ]}
      onLongPress={toggleMoreOptionPortal}
    >
      <Avatar
        url={createdBy.profilePictureUrl}
        style={{ marginLeft: 36 }}
        size={SIZE_30}
      />
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
          onPress={toggleReplyLikeStateCallback}
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
