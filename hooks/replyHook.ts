import { useCallback } from "react";
import { RootState } from "../store";
import { useAppDispatch, useAppSelector } from "./storeHooks";
import { selectReplyParams } from "../store/reply/reply.selectors";
import { toggleReplyLikeState } from "../store/reply/reply.slice";

export default function useReply(id: string) {
  const replySelectotCallback = useCallback(
    (state: RootState) => selectReplyParams(state, id),
    [id]
  );

  const storeDispatch = useAppDispatch();

  const replyParams = useAppSelector(replySelectotCallback);

  const toggleReplyLikeStateCallback = useCallback(() => {
    storeDispatch(toggleReplyLikeState(id));
  }, [id]);

  return {
    replyParams,
    toggleReplyLikeStateCallback,
  };
}
