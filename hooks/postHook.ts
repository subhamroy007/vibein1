import { useCallback } from "react";
import { selectPostParams } from "../store/post/post.selector";
import { useAppDispatch, useAppSelector } from "./storeHooks";
import { RootState } from "../store";
import {
  togglePostLikeState,
  togglePostSaveState,
} from "../store/post/post.slice";

export default function usePost(id: string) {
  const postSelectotCallback = useCallback(
    (state: RootState) => selectPostParams(state, id),
    [id]
  );

  const storeDispatch = useAppDispatch();

  const postParams = useAppSelector(postSelectotCallback);

  const togglePostLikeStateCallback = useCallback(() => {
    storeDispatch(togglePostLikeState(id));
  }, [id]);

  const togglePostSaveStateCallback = useCallback(() => {
    storeDispatch(togglePostSaveState(id));
  }, [id]);

  return {
    postParams,
    togglePostLikeStateCallback,
    togglePostSaveStateCallback,
  };
}
