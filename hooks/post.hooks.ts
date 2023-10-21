import { useCallback } from "react";
import {
  selectGridPostParams,
  selectPostCommentSection,
} from "../store/post/post.selector";
import { useAppDispatch, useAppSelector } from "./storeHooks";
import { RootState } from "../store";
import { fetchComments } from "../store/post/post.thunk";

export function useCommentSection(postId: string) {
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

export function useGridPost(id: string) {
  const postSelectotCallback = useCallback(
    (state: RootState) => selectGridPostParams(state, id),
    [id]
  );

  const postParams = useAppSelector(postSelectotCallback);

  return {
    postParams,
  };
}
