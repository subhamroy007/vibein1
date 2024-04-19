import {
  selectAccountSearchResult,
  selectExploreFeed,
  selectForYouMomentsFeedParams,
  selectForYouPhotosFeedParams,
  selectHashtagSearchResult,
  selectHomeFeedParams,
  selectInboxParams,
  selectMediaMutedState,
  selectPostSearchResult,
  selectPostSuggestionsRoute,
} from "../store/client/client.selector";
import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./storeHooks";
import {
  getInboxChatsThunk,
  fetchExploreFeed,
  fetchMomentsFeed,
  fetchPhotosFeed,
  fetchPostSuggestions,
  fetchSearchedPosts,
  fetchSearchedAccounts,
  fetchSearchedHashtags,
  fetchHomeFeedPosts,
  fetchHomeFeedMemoryAccounts,
} from "../store/client/client.thunk";
import {
  initPostSuggestionRoute,
  setMediaMuted,
  toggleMediaMuted,
} from "../store/client/client.slice";
import { PostItemIdentifier } from "../types/store.types";
import { useAutoFetch } from "./utility.hooks";

export function useHomeFeed() {
  const homeFeed = useAppSelector(selectHomeFeedParams);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchHomeFeedMemoryAccounts({ refresh: true }));
  }, []);

  const fetchPosts = useCallback((refresh: boolean = false) => {
    dispatch(
      fetchHomeFeedPosts({
        refresh: typeof refresh === "boolean" ? refresh : false,
      })
    );
  }, []);

  const refresh = useCallback(() => fetchPosts(true), [fetchPosts]);

  return {
    homeFeed,
    fetchPosts,
    refresh,
  };
}

export function useMomentsFeed(focused: boolean) {
  const momentsFeed = useAppSelector(selectForYouMomentsFeedParams);

  const dispatch = useAppDispatch();

  const fetchPosts = useCallback((refresh: boolean = false) => {
    dispatch(
      fetchMomentsFeed({
        refresh: typeof refresh === "boolean" ? refresh : false,
      })
    );
  }, []);

  const refresh = useCallback(() => fetchPosts(true), [fetchPosts]);

  useAutoFetch(fetchPosts, momentsFeed.data, focused);

  return {
    momentsFeed,
    fetchPosts,
    refresh,
  };
}

export function usePhotosFeed(focused: boolean) {
  const photosFeed = useAppSelector(selectForYouPhotosFeedParams);

  const dispatch = useAppDispatch();

  const fetchPosts = useCallback((refresh: boolean = false) => {
    dispatch(
      fetchPhotosFeed({
        refresh: typeof refresh === "boolean" ? refresh : false,
      })
    );
  }, []);

  const refresh = useCallback(() => fetchPosts(true), [fetchPosts]);

  useAutoFetch(fetchPosts, photosFeed.data, focused);

  return {
    photosFeed,
    fetchPosts,
    refresh,
  };
}

export function useExploreFeed() {
  const exploreFeed = useAppSelector(selectExploreFeed);

  const dispatch = useAppDispatch();

  const fetchPosts = useCallback((refresh: boolean = false) => {
    dispatch(
      fetchExploreFeed({
        refresh: typeof refresh === "boolean" ? refresh : false,
      })
    );
  }, []);

  const refresh = useCallback(() => fetchPosts(true), [fetchPosts]);

  useAutoFetch(fetchPosts, exploreFeed.data);

  return {
    exploreFeed,
    fetchPosts,
    refresh,
  };
}

export function usePostSuggestionsRoute(seed: PostItemIdentifier) {
  const postSuggestionRoute = useAppSelector((state) =>
    selectPostSuggestionsRoute(state, seed.id)
  );

  const dispatch = useAppDispatch();

  const fetchPosts = useCallback(() => {
    dispatch(fetchPostSuggestions({ postId: seed.id }));
  }, [seed]);

  useEffect(() => {
    if (!postSuggestionRoute) {
      dispatch(initPostSuggestionRoute(seed));
    }
  }, [postSuggestionRoute, seed]);

  return {
    postSuggestionRoute,
    fetchPosts,
  };
}

export function usePostSearchResult(focused: boolean) {
  const searchedPostResult = useAppSelector(selectPostSearchResult);

  const dispatch = useAppDispatch();

  const fetchPosts = useCallback(() => {
    dispatch(fetchSearchedPosts());
  }, []);

  useAutoFetch(fetchPosts, searchedPostResult?.data, focused);

  return {
    searchedPostResult,
    fetchPosts,
  };
}

export function useAccountSearchResult(focused: boolean) {
  const accountSearchResult = useAppSelector(selectAccountSearchResult);

  const dispatch = useAppDispatch();

  const fetchAccounts = useCallback(() => {
    dispatch(fetchSearchedAccounts());
  }, []);

  useAutoFetch(fetchAccounts, accountSearchResult?.data, focused);

  return {
    accountSearchResult,
    fetchAccounts,
  };
}

export function useHashtagSearchResult(focused: boolean) {
  const hashtagSearchResult = useAppSelector(selectHashtagSearchResult);

  const dispatch = useAppDispatch();

  const fetchHashtags = useCallback(() => {
    dispatch(fetchSearchedHashtags());
  }, []);

  useAutoFetch(fetchHashtags, hashtagSearchResult?.data, focused);

  return {
    hashtagSearchResult,
    fetchHashtags,
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

export function useMediaMutedState(): [
  boolean,
  (value: boolean) => void,
  () => void
] {
  const dispatch = useAppDispatch();

  const state = useAppSelector((state) => selectMediaMutedState(state));

  const setState = useCallback((value: boolean) => {
    dispatch(setMediaMuted(value));
  }, []);

  const toggleState = useCallback(() => {
    dispatch(toggleMediaMuted());
  }, []);

  return [state, setState, toggleState];
}
