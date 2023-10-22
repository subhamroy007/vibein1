import { useCallback } from "react";
import {
  selectGridPostParams,
  selectPostCommentSection,
  selectPostPreviewParams,
  selectSimilarPostSection,
} from "../store/post/post.selector";
import { useAppDispatch, useAppSelector } from "./storeHooks";
import { RootState } from "../store";
import { fetchComments, fetchSimilarPosts } from "../store/post/post.thunk";
import { togglePostLikeState } from "../store/post/post.slice";

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

export function usePostPreview(id: string) {
  const postSelectotCallback = useCallback(
    (state: RootState) => selectPostPreviewParams(state, id),
    [id]
  );

  const storeDispatch = useAppDispatch();
  const postParams = useAppSelector(postSelectotCallback);

  const togglePostLikeStateCallback = useCallback(() => {
    storeDispatch(togglePostLikeState(id));
  }, [id]);

  return {
    postParams,
    togglePostLikeStateCallback,
  };
}

export function useSimilarPostsSection(postId?: string) {
  const dispatch = useAppDispatch();

  const similarPostsSectionSelectorCallback = useCallback(
    (state: RootState) => selectSimilarPostSection(state, postId ? postId : ""),
    [postId]
  );

  const storeParams = useAppSelector(similarPostsSectionSelectorCallback);

  const fetch = useCallback(() => {
    if (
      postId &&
      postId !== "" &&
      storeParams?.similarPostSectionThunkInfo.state === "idle"
    ) {
      dispatch(fetchSimilarPosts(postId));
    }
  }, [postId]);

  return {
    storeParams,
    fetch,
  };
}
