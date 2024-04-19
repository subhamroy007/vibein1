import { useCallback, useEffect, useRef } from "react";
import {
  selectAccountHomeRouteParams,
  selectAccountMomentRouteParams,
  selectAccountPhotosRouteParams,
  selectAccountTagsRouteParams,
} from "../store/account/account.selectors";
import { useAppDispatch, useAppSelector } from "./storeHooks";
import { RootState } from "../store";
import { AccountField } from "../types/utility.types";
import {
  getAccountAllPostThunk,
  getAccountHomeRouteThunk,
  getAccountMomentsThunk,
  getAccountPhotosThunk,
  getAccountTaggedPostThunk,
} from "../store/account/account.thunk";
import { nanoid } from "@reduxjs/toolkit";
import {
  initAccountProfileRoute,
  removeAccountProfileRoute,
} from "../store/account/account.slice";
import { AccountSelectorParams } from "../types/selector.types";
import { selectAccountParams } from "../store/account-store/account.selectors";
import { deepEqual } from "../utility";

export function useAccountHomeRoute(username: string, routeId: string) {
  const dispatch = useAppDispatch();

  const routeParams = useAppSelector((state) =>
    selectAccountHomeRouteParams(state, routeId)
  );

  const fetch = useCallback(() => {
    dispatch(getAccountHomeRouteThunk({ routeId, username }));
  }, []);

  const fetchPosts = useCallback(() => {
    dispatch(getAccountAllPostThunk({ routeId, username }));
  }, []);

  return {
    fetch,
    fetchPosts,
    routeParams,
  };
}

export function useAccountPhotosRoute(username: string, routeId: string) {
  const dispatch = useAppDispatch();

  const routeParams = useAppSelector((state) =>
    selectAccountPhotosRouteParams(state, routeId)
  );

  const fetch = useCallback((refresh: boolean = false) => {
    dispatch(getAccountPhotosThunk({ routeId, username, refresh }));
  }, []);

  return {
    fetch,
    routeParams,
  };
}

export function useAccountMomentsRoute(username: string, routeId: string) {
  const dispatch = useAppDispatch();

  const routeParams = useAppSelector((state) =>
    selectAccountMomentRouteParams(state, routeId)
  );

  const fetch = useCallback((refresh: boolean = false) => {
    dispatch(getAccountMomentsThunk({ routeId, username, refresh }));
  }, []);

  return {
    fetch,
    routeParams,
  };
}

export function useAccountTagsRoute(username: string, routeId: string) {
  const dispatch = useAppDispatch();

  const routeParams = useAppSelector((state) =>
    selectAccountTagsRouteParams(state, routeId)
  );

  const fetch = useCallback((refresh: boolean = false) => {
    dispatch(getAccountTaggedPostThunk({ routeId, username, refresh }));
  }, []);

  return {
    fetch,
    routeParams,
  };
}

export function useAccountProfileRouteInit(username: string) {
  const routeId = useRef(nanoid()).current;

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initAccountProfileRoute({ routeId, username }));

    return () => {
      dispatch(removeAccountProfileRoute({ routeId }));
    };
  }, [username]);

  return routeId;
}

export function useAccountSelector(
  userId: string,
  includeFields: AccountField[]
): AccountSelectorParams | undefined {
  const accountSelectorCallback = useCallback(
    (state: RootState) => selectAccountParams(state, userId, includeFields),
    [userId, includeFields]
  );

  const account = useAppSelector(accountSelectorCallback, deepEqual);

  return account;
}
