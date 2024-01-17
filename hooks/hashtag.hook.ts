import { selectHashtagAdapterParams } from "./../store/hashtag/hashtag.selector";
import { useCallback, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "./storeHooks";
import { selectHashtagGeneralRoute } from "../store/hashtag/hashtag.selector";
import {
  getHashtagGeneralRouteThunk,
  getHashtagTopPostsRouteThunk,
} from "../store/hashtag/hashtag.thunk";
import {
  initHashtagGeneralRoute,
  removeHashtagGeneralRoute,
  toggleHashtagFollowState,
} from "../store/hashtag/hashtag.slice";
import { nanoid } from "@reduxjs/toolkit";

export function useHashtagGeneralRoute(routeId: string, hashtag: string) {
  const dispatch = useAppDispatch();

  const routeParams = useAppSelector((state) =>
    selectHashtagGeneralRoute(state, routeId)
  );

  const fetchGeneralInfo = useCallback(() => {
    dispatch(getHashtagGeneralRouteThunk({ routeId, hashtag }));
  }, [hashtag, routeId]);

  const fetchTopPosts = useCallback(() => {
    dispatch(getHashtagTopPostsRouteThunk({ routeId, hashtag }));
  }, [hashtag, routeId]);

  return {
    routeParams,
    fetchGeneralInfo,
    fetchTopPosts,
  };
}

export function useHashtagGeneralRouteInit(hashtag: string) {
  const routeId = useRef(nanoid()).current;

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initHashtagGeneralRoute({ hashtag, routeId }));

    return () => {
      dispatch(removeHashtagGeneralRoute({ routeId }));
    };
  }, [hashtag]);

  return routeId;
}

export function useHashtag(hashtag: string) {
  const hashtagParams = useAppSelector((state) =>
    selectHashtagAdapterParams(state, hashtag)
  );

  const dispatch = useAppDispatch();

  const toggleHashtagFollowCallback = useCallback(() => {
    dispatch(toggleHashtagFollowState({ hashtag }));
  }, [hashtag]);

  return {
    hashtagParams,
    toggleHashtagFollowCallback,
  };
}
