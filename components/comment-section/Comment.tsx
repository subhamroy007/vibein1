import { View } from "react-native";
import {
  backgroundStyle,
  layoutStyle,
  marginStyle,
  paddingStyle,
} from "../../styles";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import { selectCommentParams } from "../../store/post-store/post.selectors";
import Avatar from "../Avatar";
import {
  COLOR_6,
  COMMENT_REPORT_INFO,
  COMMENT_REPORT_REASONS,
  SIZE_12,
  SIZE_20,
  SIZE_24,
  SIZE_3,
  SIZE_30,
  SIZE_36,
} from "../../constants";
import MultilineText from "../utility-components/text/MultilineText";
import Text from "../utility-components/text/Text";
import { formatNumber, formatTimeDifference } from "../../utility";
import PressableIcon from "../utility-components/button/PressableIcon";
import { useCallback, useState } from "react";
import {
  deleteComment,
  setCommentLike,
  setCommentPin,
  swithReplyHiddenState,
} from "../../store/post-store/post.slice";
import AdvancedGesture from "../utility-components/AdvancedGesture";
import ActionsPortal from "../portals/ActionsPortal";
import { ActionParams } from "../portals/ActionsContainer";
import Dot from "../utility-components/Dot";
import AccountBlockPortal from "../portals/AccountBlockPortal";
import ReportPortal from "../portals/ReportPortal";
import { fetchReplies } from "../../store/post-store/post.thunks";

export default function Comment({
  id,
  isLastReply,
}: {
  id: string;
  isLastReply: boolean;
}) {
  const comment = useAppSelector((state) => selectCommentParams(state, id));

  const [showActionsPortal, setActionsPortal] = useState(false);

  const [showAccountBlockPortal, setAccountBlockPortal] = useState(false);

  const [showReportPortal, setReportPortal] = useState(false);

  const switchReportPortalState = useCallback(() => {
    setActionsPortal(false);
    setReportPortal((value) => !value);
  }, []);

  const switchAccountBlockPortalState = useCallback(() => {
    setActionsPortal(false);
    setAccountBlockPortal((value) => !value);
  }, []);

  const switchActionsPortalState = useCallback(() => {
    setActionsPortal((value) => !value);
  }, []);
  const dispatch = useAppDispatch();

  const onLikePress = useCallback(() => {
    dispatch(setCommentLike(id, !comment?.isLiked));
  }, [id, comment?.isLiked]);

  const onPin = useCallback(() => {
    setActionsPortal(false);
    dispatch(setCommentPin(id, !comment?.pinned));
  }, [id, comment?.pinned]);

  const onDelete = useCallback(() => {
    setActionsPortal(false);
    dispatch(deleteComment(id));
  }, [id]);

  const onReport = useCallback((reason: string, description?: string) => {},
  []);

  const onHide = useCallback(() => {
    dispatch(
      swithReplyHiddenState(comment?.repliedTo ? comment.repliedTo : id)
    );
  }, [id, comment?.repliedTo]);

  const loadReplies = useCallback(() => {
    dispatch(
      fetchReplies({
        commentId: comment?.repliedTo ? comment.repliedTo : id,
      })
    );
  }, [id, comment?.postId, comment?.repliedTo]);

  const onReplyPress = useCallback(() => {
    if (!comment?.hasLoadedReply && !comment?.isReplyLoading) {
      loadReplies();
    } else {
      onHide();
    }
  }, [comment?.isReplyLoading, comment?.hasLoadedReply, onHide, loadReplies]);

  if (!comment) return null;

  const {
    author,
    createdAt,
    isLiked,
    noOfLikes,
    pinned,
    text,
    isReplyHidden,
    isReplyLoading,
    repliedTo,
    hasLoadedReply,
    isAuthor,
    isPostAuthor,
    noOfUnloadedReplies,
  } = comment;

  const actions: ActionParams[] = [];

  if (isAuthor || isPostAuthor) {
    actions.push({ text: "delete", color: "red", callback: onDelete });
  }
  if (isPostAuthor) {
    actions.push({ text: pinned ? "unpin" : "pin", callback: onPin });
  }
  if (isAuthor) {
    actions.push({ text: "edit", callback() {} });
  } else {
    actions.push({
      text: "report",
      color: "red",
      callback: switchReportPortalState,
    });
    actions.push({
      text: "block account",
      color: "red",
      callback: switchAccountBlockPortalState,
    });
  }
  let textElement = null;
  if (!repliedTo && noOfUnloadedReplies && isReplyHidden) {
    textElement = (
      <Text
        onPress={onReplyPress}
        style={marginStyle.margin_top_3}
        weight="semi-bold"
        color="grey"
      >
        {isReplyLoading ? "loading..." : `show ${noOfUnloadedReplies} replies`}
      </Text>
    );
  } else if (isLastReply) {
    textElement = (
      <View style={[layoutStyle.flex_direction_row, marginStyle.margin_top_3]}>
        <Text weight="semi-bold" color="grey" onPress={loadReplies}>
          {isReplyLoading
            ? "loading..."
            : `show ${noOfUnloadedReplies} more replies`}
        </Text>
        <Text
          weight="semi-bold"
          color="grey"
          style={marginStyle.margin_left_12}
          onPress={onHide}
        >
          hide
        </Text>
      </View>
    );
  }

  return (
    <AdvancedGesture
      style={[
        backgroundStyle.background_color_1,
        paddingStyle.padding_12,
        layoutStyle.flex_direction_row,
        layoutStyle.align_item_flex_start,
        repliedTo ? marginStyle.margin_left_24 : undefined,
      ]}
    >
      <Avatar
        url={author.profilePictureUri}
        size={repliedTo ? SIZE_30 : SIZE_36}
      />
      <View style={[layoutStyle.flex_1, marginStyle.margin_horizontal_12]}>
        <View
          style={[
            layoutStyle.flex_direction_row,
            layoutStyle.align_item_center,
          ]}
        >
          <Text weight="bold">{author.username}</Text>
          {pinned ? (
            <>
              <Dot
                size={SIZE_3}
                style={marginStyle.margin_horizontal_6}
                color="grey"
              />
              <Text weight="medium" color="grey">
                pinned
              </Text>
            </>
          ) : undefined}
        </View>
        <MultilineText text={text} style={marginStyle.margin_top_3} />
        <View
          style={[
            layoutStyle.flex_direction_row,
            layoutStyle.align_item_center,
            marginStyle.margin_top_6,
          ]}
        >
          <Text weight="semi-bold" color="grey" size={SIZE_12}>
            {formatTimeDifference(createdAt)}
          </Text>
          <Text
            weight="semi-bold"
            color="grey"
            size={SIZE_12}
            style={marginStyle.margin_left_12}
          >
            Reply
          </Text>
          {noOfLikes > 0 ? (
            <Text
              weight="semi-bold"
              color="grey"
              size={SIZE_12}
              style={marginStyle.margin_left_12}
            >
              {formatNumber(noOfLikes)} likes
            </Text>
          ) : undefined}
        </View>
        {textElement}
      </View>
      <PressableIcon
        size={SIZE_20}
        name={isLiked ? "heart-solid" : "heart-outline"}
        color={isLiked ? COLOR_6 : "grey"}
        animateOnPress
        hitSlop={SIZE_24}
        onPress={onLikePress}
      />
      {showActionsPortal && (
        <ActionsPortal onClose={switchActionsPortalState} actions={actions} />
      )}
      {showAccountBlockPortal && (
        <AccountBlockPortal
          onDismiss={switchAccountBlockPortalState}
          username={author.username}
        />
      )}
      {showReportPortal && (
        <ReportPortal
          info={COMMENT_REPORT_INFO}
          reasons={COMMENT_REPORT_REASONS}
          onSubmit={onReport}
          onDismiss={switchReportPortalState}
        />
      )}
    </AdvancedGesture>
  );
}
