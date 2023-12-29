import {
  selectDiscoverFeedParams,
  selectForYouMomentsFeedParams,
  selectForYouPhotosFeedParams,
  selectHomeFeedParams,
} from "../store/client/client.selector";
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "./storeHooks";
import {
  getHomeFeedThunk,
  getForYouMomentFeedThunk,
  getForYouPhotosFeedThunk,
} from "../store/client/client.thunk";

export function useHomeFeed() {
  const homeFeedParams = useAppSelector(selectHomeFeedParams);

  const dispatch = useAppDispatch();

  const fetch = useCallback(() => {
    dispatch(getHomeFeedThunk());
  }, []);

  return {
    homeFeedParams,
    fetch,
  };
}

export function useForYouMomentsFeed() {
  const forYouMomentsFeedParams = useAppSelector(selectForYouMomentsFeedParams);

  const dispatch = useAppDispatch();

  const fetch = useCallback(() => {
    dispatch(getForYouMomentFeedThunk());
  }, []);

  return {
    forYouMomentsFeedParams,
    fetch,
  };
}

export function useForYouPhotosFeed() {
  const forYouPhotosFeedParams = useAppSelector(selectForYouPhotosFeedParams);

  const dispatch = useAppDispatch();

  const fetch = useCallback(() => {
    dispatch(getForYouPhotosFeedThunk());
  }, []);

  return {
    forYouPhotosFeedParams,
    fetch,
  };
}

export function useDiscoverFeed() {
  const discoverFeedParams = useAppSelector(selectDiscoverFeedParams);

  const dispatch = useAppDispatch();

  const fetch = useCallback(() => {}, []);

  return {
    discoverFeedParams,
  };
}
