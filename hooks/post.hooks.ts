import { useCallback } from "react";
import { selectPostCommentSection } from "../store/post/post.selector";
import { useAppDispatch, useAppSelector } from "./storeHooks";
import { RootState } from "../store";
import { fetchComments } from "../store/post/post.thunk";

export default function useCommentSection(postId: string) {
  const dispatch = useAppDispatch();

  const commentSectionSelectorCallback = useCallback(
    (state: RootState) => selectPostCommentSection(state, postId),
    [postId]
  );

  const storeParams = useAppSelector(commentSectionSelectorCallback);

  const fetch = useCallback(() => {
    dispatch(fetchComments(postId));
  }, [postId]);

  return {
    storeParams,
    fetch,
  };
}
