import { useCallback, useEffect, useRef } from "react";
import {
  selectAccountHomeRouteParams,
  selectAccountMomentRouteParams,
  selectAccountParams,
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

export function useAccountAdapterParams(
  username?: string,
  includeFields?: AccountField[]
) {
  const accountSelectotCallback = useCallback(
    (state: RootState) =>
      selectAccountParams(state, username ? username : "", includeFields),
    [username, includeFields]
  );

  const accountParams = useAppSelector(accountSelectotCallback);

  return accountParams;
}

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
