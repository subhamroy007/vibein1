import { useCallback } from "react";
import { selectCommentParams } from "../store/comment/comment.selectors";
import { RootState } from "../store";
import { useAppDispatch, useAppSelector } from "./storeHooks";
import {
  toggleCommentLikeState,
  toggleCommentPinkState,
} from "../store/comment/comment.slice";
import { fetchReplies } from "../store/comment/comment.thunks";

export default function useComment(id: string) {
  const commentSelectotCallback = useCallback(
    (state: RootState) => selectCommentParams(state, id),
    [id]
  );

  const storeDispatch = useAppDispatch();

  const commentParams = useAppSelector(commentSelectotCallback);

  const toggleCommentLikeStateCallback = useCallback(() => {
    storeDispatch(toggleCommentLikeState(id));
  }, [id]);

  const toggleCommentPinStateCallback = useCallback(() => {
    storeDispatch(toggleCommentPinkState(id));
  }, [id]);

  const getReplies = useCallback(() => {
    storeDispatch(fetchReplies(id));
  }, [id]);

  return {
    commentParams,
    toggleCommentLikeStateCallback,
    toggleCommentPinStateCallback,
    getReplies,
  };
}
