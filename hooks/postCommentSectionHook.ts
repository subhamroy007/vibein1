import { useCallback, useEffect } from "react";
import { selectPostCommentSection } from "../store/post/post.selector";
import { useAppDispatch, useAppSelector } from "./storeHooks";
import { RootState } from "../store";
import { initCommentSection } from "../store/post/post.slice";
import { fetchComments } from "../store/post/post.thunk";

export default function useCommentSection(postId: string) {
  const dispatch = useAppDispatch();

  const commentSectionSelectorCallback = useCallback(
    (state: RootState) => selectPostCommentSection(state, postId),
    [postId]
  );

  const commentSectionParams = useAppSelector(commentSectionSelectorCallback);

  useEffect(() => {
    dispatch(initCommentSection(postId));
  }, [postId]);

  const fetch = useCallback(() => {
    dispatch(fetchComments(postId));
  }, [postId]);

  return {
    commentSectionParams,
    fetch,
  };
}
