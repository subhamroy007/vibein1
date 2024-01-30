import {
  selectForYouMomentsFeedParams,
  selectForYouPhotosFeedParams,
  selectHomeFeedParams,
  selectInboxParams,
} from "../store/client/client.selector";
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "./storeHooks";
import {
  getHomeFeedThunk,
  getForYouMomentFeedThunk,
  getForYouPhotosFeedThunk,
  getInboxChatsThunk,
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

  const fetch = useCallback((refresh: boolean = false) => {
    dispatch(getForYouMomentFeedThunk({ refresh }));
  }, []);

  return {
    forYouMomentsFeedParams,
    fetch,
  };
}

export function useForYouPhotosFeed() {
  const forYouPhotosFeedParams = useAppSelector(selectForYouPhotosFeedParams);

  const dispatch = useAppDispatch();

  const fetch = useCallback((refresh: boolean = false) => {
    dispatch(getForYouPhotosFeedThunk({ refresh }));
  }, []);

  return {
    forYouPhotosFeedParams,
    fetch,
  };
}

export function useInbox() {
  const inboxParams = useAppSelector(selectInboxParams);

  const dispatch = useAppDispatch();

  const fetch = useCallback((refresh: boolean = false) => {
    dispatch(getInboxChatsThunk({ refresh }));
  }, []);

  return {
    inboxParams,
    fetch,
  };
}
