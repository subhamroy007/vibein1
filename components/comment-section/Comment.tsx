import { View } from "react-native";
import {
  backgroundStyle,
  layoutStyle,
  marginStyle,
  paddingStyle,
} from "../../styles";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import Avatar from "../Avatar";
import {
  COLOR_6,
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
} from "../../store/post-store/post.slice";
import AdvancedGesture from "../utility-components/AdvancedGesture";
import Dot from "../utility-components/Dot";
import { fetchReplies } from "../../store/post-store/post.thunks";
import { selectComment } from "../../store/post-store/post.selectors";
import { usePopupNotification } from "../../hooks/utility.hooks";
import { AccountShortInfo } from "../../types/utility.types";

export default function Comment({
  id,
  isFirstLoadedReply,
  isLastReplyItem,
  isReplyHidden,
  changeReplyHideState,
  onReply,
}: {
  id: string;
  isFirstLoadedReply: boolean;
  isLastReplyItem: boolean;
  isReplyHidden: boolean;
  changeReplyHideState: (id: string, hide: boolean) => void;
  onReply: (commentId: string, account: AccountShortInfo) => void;
}) {
  const showPopup = usePopupNotification();

  const comment = useAppSelector((state) => selectComment(state, id));

  const [isReplyLoading, setReplyLoading] = useState(false);

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

  const onHideReply = useCallback(() => {
    changeReplyHideState(comment?.repliedTo ? comment.repliedTo : id, true);
  }, [comment?.repliedTo]);

  const loadReplies = useCallback(() => {
    if (comment?.hasLoadedReply) {
      changeReplyHideState(comment?.repliedTo ? comment.repliedTo : id, false);
    } else {
      setReplyLoading(true);
      dispatch(
        fetchReplies({
          commentId: comment?.repliedTo ? comment.repliedTo : id,
        })
      )
        .unwrap()
        .then(() => {
          changeReplyHideState(
            comment?.repliedTo ? comment.repliedTo : id,
            false
          );
        })
        .catch(() => {
          showPopup("failed to fetch replies");
        })
        .finally(() => {
          setReplyLoading(false);
        });
    }
  }, [id, comment?.repliedTo, comment?.hasLoadedReply]);

  const replyCallback = useCallback(() => {
    onReply(comment?.repliedTo ? comment.repliedTo : id, comment!.author);
  }, [comment?.repliedTo, comment?.author, onReply]);

  if (!comment) return null;

  const {
    author,
    createdAt,
    isLiked,
    noOfLikes,
    pinned,
    text,
    repliedTo,
    noOfHiddenReplies,
  } = comment;

  let textElement = null;
  if (!repliedTo && noOfHiddenReplies && isReplyHidden) {
    textElement = isReplyLoading ? (
      <Text style={marginStyle.margin_top_6} color="grey">
        loading...
      </Text>
    ) : (
      <Text color="grey" onPress={loadReplies} style={marginStyle.margin_top_6}>
        show {noOfHiddenReplies} replies
      </Text>
    );
  } else if (isLastReplyItem) {
    textElement = (
      <View style={[layoutStyle.flex_direction_row, marginStyle.margin_top_6]}>
        {isReplyLoading ? (
          <Text color="grey">loading...</Text>
        ) : (
          <Text onPress={loadReplies} color="grey">
            load {noOfHiddenReplies} more replies
          </Text>
        )}
        <Text
          color="grey"
          style={marginStyle.margin_left_12}
          onPress={onHideReply}
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
          <Text>{author.userId}</Text>
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
          <Text color="grey" size={SIZE_12}>
            {formatTimeDifference(createdAt)}
          </Text>
          <Text
            color="grey"
            size={SIZE_12}
            style={marginStyle.margin_left_12}
            onPress={replyCallback}
          >
            Reply
          </Text>
          {noOfLikes > 0 ? (
            <Text
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
    </AdvancedGesture>
  );
}
