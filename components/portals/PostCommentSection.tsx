import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import { selectCommentSection } from "../../store/post-store/post.selectors";
import { fetchComments } from "../../store/post-store/post.thunks";
import SwipeUpPortal from "./SwipeUpPortal";
import {
  HASTAG_AND_MENTION_IDENTIFIER_EXPRESSION,
  windowHeight,
} from "../../constants";
import {
  FlatList,
  NativeSyntheticEvent,
  TextInputSelectionChangeEventData,
  useWindowDimensions,
} from "react-native";
import Comment from "../comment-section/Comment";
import Animated, {
  interpolate,
  useAnimatedKeyboard,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { backgroundStyle, borderStyle, layoutStyle } from "../../styles";
import CommentUploader from "../comment-section/CommentUploader";
import ReactionBox from "../comment-section/ReactionBox";
import CommentBox from "../comment-section/CommentBox";
import { AccountShortInfo } from "../../types/utility.types";

export default function PostCommentSecion({
  onClose,
  postId,
}: {
  postId: string;
  onClose: () => void;
}) {
  const { height: window_height } = useWindowDimensions();

  const [text, setText] = useState("");

  const [replyTo, setReplyTo] = useState<{
    commentId: string;
    account: AccountShortInfo;
  } | null>(null);

  const portalPosition = useSharedValue(0);

  const { height: keyboardHeight, state: keyboardState } = useAnimatedKeyboard({
    isStatusBarTranslucentAndroid: true,
  });

  const [isLoading, setLoading] = useState(false);

  const [isError, setError] = useState(false);

  const [unHiddenReplyComments, setUnHiddenReplyComments] = useState<string[]>(
    []
  );

  const dispatch = useAppDispatch();

  const data = useAppSelector((state) =>
    selectCommentSection(state, postId, unHiddenReplyComments)
  );

  const changeReplyHideState = useCallback(
    (commentId: string, hide: boolean) => {
      if (hide) {
        setUnHiddenReplyComments((value) =>
          value.filter((item) => item !== commentId)
        );
      } else {
        setUnHiddenReplyComments((value) => [...value, commentId]);
      }
    },
    []
  );

  useEffect(() => {
    if (!data) {
      setLoading(true);
      setError(true);
      dispatch(fetchComments({ postId }))
        .unwrap()
        .catch(() => {
          setError(true);
        })
        .finally(() => {
          setLoading(true);
        });
    }
  }, [data, postId]);

  const portalFooterAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY:
            interpolate(portalPosition.value, [0, 1], [-window_height, 0]) -
            keyboardHeight.value,
        },
      ],
    };
  }, [window_height]);

  const onCommentSubmit = useCallback((commentText: string) => {
    console.log(commentText);
  }, []);

  const onReply = useCallback(
    (commentId: string, account: AccountShortInfo) => {
      setReplyTo({ commentId, account });
      setText("@" + account.userId + " ");
    },
    []
  );

  const onReplyToReset = useCallback(() => {
    setReplyTo(null);
  }, []);

  return (
    <SwipeUpPortal
      contentHeight={windowHeight}
      onClose={onClose}
      title="comments"
      position={portalPosition}
    >
      <FlatList
        data={data?.items}
        renderItem={({ item }) => {
          if (!item.isPlaceHolder)
            return (
              <Comment
                id={item.key}
                isFirstLoadedReply={item.isFirstLoadedReply}
                isLastReplyItem={item.isLastReplyItem}
                isReplyHidden={!unHiddenReplyComments.includes(item.key)}
                changeReplyHideState={changeReplyHideState}
                onReply={onReply}
              />
            );

          return null;
        }}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        keyboardDismissMode="none"
        keyboardShouldPersistTaps="always"
      />
      <CommentUploader
        onSubmit={onCommentSubmit}
        setText={setText}
        text={text}
        style={portalFooterAnimatedStyle}
        replyTo={replyTo ? replyTo.account : undefined}
        resetReplyTo={onReplyToReset}
      />
    </SwipeUpPortal>
  );
}
