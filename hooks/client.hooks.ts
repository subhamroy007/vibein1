import {
  selectDiscoverFeedParams,
  selectHomeFeedParams,
} from "../store/client/client.selector";
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "./storeHooks";
import { getHomeFeedData } from "../store/client/client.thunk";

export function useHomeFeed() {
  const homeFeedParams = useAppSelector(selectHomeFeedParams);

  const dispatch = useAppDispatch();

  const fetch = useCallback(() => {
    dispatch(getHomeFeedData());
  }, []);

  return {
    homeFeedParams,
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
