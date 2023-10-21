import { Pressable, StyleSheet, View } from "react-native";
import { CommentProps } from "./Comment";
import { layoutStyle, marginStyle, paddingStyle } from "../styles";
import AppText from "./AppText";
import {
  COLOR_10,
  COLOR_6,
  SIZE_11,
  SIZE_18,
  SIZE_20,
  SIZE_24,
} from "../constants";
import { useCallback, useEffect, useState } from "react";
import useComment from "../hooks/commentHook";
import Avatar from "./Avatar";
import HighlightedText from "./HighlightedText";
import { formatTimeDifference } from "../utility";
import Icon from "./Icon";
import AppPressable from "./AppPressable";
import SwipeUpPortal from "./SwipeUpPortal";
import Option from "./Option";
import Reply from "./Reply";

export default function CommentListItem({ id, onReply }: CommentProps) {
  const {
    commentParams,
    toggleCommentLikeStateCallback,
    toggleCommentPinStateCallback,
    getReplies,
  } = useComment(id);

  const [isReplySectionHidden, setReplySectionHiddenState] = useState(true);

  const toggleReplySectionHiddenState = useCallback(
    () => setReplySectionHiddenState((prevState) => !prevState),
    []
  );

  const [isMoreOptionPortalOpen, setMoreOptionPortalState] = useState(false);

  const toggleMoreOptionPortal = useCallback(
    () => setMoreOptionPortalState((prevState) => !prevState),
    [setMoreOptionPortalState]
  );

  const replyPressCallback = useCallback(() => {
    if (commentParams?.createdBy) {
      onReply(id, commentParams.createdBy.username);
    }
  }, [commentParams?.createdBy, onReply]);

  useEffect(() => {
    if (commentParams && commentParams.replies.length > 0) {
      setReplySectionHiddenState(false);
    }
  }, [commentParams]);

  const reportPressCallback = useCallback(() => {}, []);
  const deletePressCallback = useCallback(() => {}, []);
  const pinPressCallback = useCallback(() => {}, []);
  const blockPressCallback = useCallback(() => {}, []);

  const showRepliesPressCallback = useCallback(() => {
    if (commentParams) {
      if (commentParams.replies.length === 0) {
        getReplies();
      } else {
        toggleReplySectionHiddenState();
      }
    }
  }, [commentParams, getReplies]);

  if (!commentParams) {
    return null;
  }

  const {
    content,
    createdAt,
    createdBy,
    isClientAuthorOfComment,
    isLiked,
    isPinned,
    noOfLikes,
    noOfReplies,
    replies,
  } = commentParams;

  const noOfUnLoadedReplies = noOfReplies - replies.length;

  return (
    <View>
      <View style={styles.root_container}>
        <Avatar url={createdBy.profilePictureUrl} />
        <View style={styles.content_container}>
          <AppText style={marginStyle.margin_top_3}>
            {createdBy.username}
          </AppText>
          <HighlightedText>{content}</HighlightedText>
          <View style={styles.info_container}>
            <Pressable hitSlop={SIZE_18} onPress={replyPressCallback}>
              <AppText color={"grey"} size={SIZE_11}>
                Reply
              </AppText>
            </Pressable>
            <AppText
              style={marginStyle.margin_left_12}
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

              {isClientAuthorOfComment ? (
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

      {!isReplySectionHidden && (
        <View>
          {replies.map((reply) => (
            <Reply id={reply} onReply={() => {}} key={reply} />
          ))}
        </View>
      )}
      {noOfReplies > 0 &&
        (isReplySectionHidden ? (
          <Pressable
            style={[layoutStyle.align_self_center]}
            onPress={showRepliesPressCallback}
            hitSlop={SIZE_18}
          >
            <AppText color="grey" size={SIZE_11}>
              Show {noOfReplies} Replies
            </AppText>
          </Pressable>
        ) : (
          <View
            style={[
              layoutStyle.align_self_center,
              layoutStyle.flex_direction_row,
            ]}
          >
            {noOfUnLoadedReplies > 0 && (
              <Pressable
                hitSlop={SIZE_18}
                style={[marginStyle.margin_right_12]}
                onPress={getReplies}
              >
                <AppText color="grey" size={SIZE_11}>
                  Show {noOfUnLoadedReplies} Replies
                </AppText>
              </Pressable>
            )}
            <Pressable
              hitSlop={SIZE_18}
              onPress={toggleReplySectionHiddenState}
            >
              <AppText color="grey" size={SIZE_11}>
                Hide
              </AppText>
            </Pressable>
          </View>
        ))}
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
