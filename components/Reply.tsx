import { Pressable, StyleSheet, View } from "react-native";
import { layoutStyle, marginStyle, paddingStyle } from "../styles";
import AppText from "./AppText";
import HighlightedText from "./HighlightedText";
import Icon from "./Icon";
import {
  COLOR_10,
  COLOR_6,
  SIZE_11,
  SIZE_18,
  SIZE_20,
  SIZE_24,
  SIZE_30,
  SIZE_36,
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

  const {
    content,
    createdAt,
    createdBy,
    isLiked,
    noOfLikes,
    isClientAuthorOfReply,
  } = replyParams;

  return (
    <View style={styles.root_container}>
      <Avatar
        url={createdBy.profilePictureUri}
        style={styles.avatar}
        size={SIZE_30}
      />
      <View style={styles.content_container}>
        <AppText style={marginStyle.margin_top_3}>{createdBy.username}</AppText>
        <HighlightedText>{content}</HighlightedText>
        <View style={styles.info_container}>
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
          <Pressable
            hitSlop={SIZE_18}
            style={marginStyle.margin_left_24}
            onPress={toggleMoreOptionPortal}
          >
            <Icon color={"grey"} name="more-horiz" size={SIZE_18} />
          </Pressable>
        </View>
      </View>
      <View style={styles.like_container}>
        <AppPressable onPress={toggleReplyLikeStateCallback} hitSlop={SIZE_24}>
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
            {isClientAuthorOfReply ? (
              <Option
                icon="delete"
                text="Delete"
                color={COLOR_10}
                onPress={deletePressCallback}
              />
            ) : (
              <>
                <Option
                  icon="explore"
                  text="Block Account"
                  onPress={blockPressCallback}
                />

                <Option
                  icon="report"
                  text="Report"
                  color={COLOR_10}
                  onPress={reportPressCallback}
                />
              </>
            )}
          </View>
        </SwipeUpPortal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root_container: {
    ...layoutStyle.flex_direction_row,
    ...layoutStyle.align_item_flex_start,
    ...paddingStyle.padding_12,
  },
  like_container: {
    ...layoutStyle.align_item_center,
    ...marginStyle.margin_top_6,
  },
  avatar: {
    marginLeft: SIZE_36,
  },
  content_container: {
    ...layoutStyle.flex_1,
    ...marginStyle.margin_horizontal_6,
  },
  info_container: {
    ...layoutStyle.flex_direction_row,
    ...layoutStyle.align_item_center,
    ...marginStyle.margin_top_6,
  },
});
