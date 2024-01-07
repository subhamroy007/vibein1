import { nanoid } from "@reduxjs/toolkit";
import { useCallback, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "./storeHooks";
import { initRequest } from "../store/request/request.slice";
import { selectRequestInfo } from "../store/request/request.selector";
import { getHashtagPageThunk } from "../store/hashtag/hashtag.thunk";
import { selectHashtagPageInfo } from "../store/hashtag/hashtag.selector";

export default function useHashtag(hashtag: string) {
  const initRequestId = useRef(nanoid()).current;

  const requestInfo = useAppSelector((state) =>
    selectRequestInfo(state, initRequestId)
  );

  const hashtagPageInfo = useAppSelector((state) =>
    selectHashtagPageInfo(state, hashtag)
  );

  const fetch = useCallback(() => {
    dispatch(getHashtagPageThunk({ requestId: initRequestId, hashtag }));
  }, [hashtag]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initRequest({ id: initRequestId, method: "GET", url: "" }));
  }, []);

  return {
    fetch,
    hashtagPageInfo,
    requestInfo,
  };
}
