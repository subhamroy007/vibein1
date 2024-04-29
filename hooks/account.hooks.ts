import { useCallback, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "./storeHooks";
import { RootState } from "../store";
import { AccountField } from "../types/utility.types";

import { nanoid } from "@reduxjs/toolkit";
import { AccountSelectorParams } from "../types/selector.types";
import { selectAccountParams } from "../store/account-store/account.selectors";
import { deepEqual } from "../utility";
import {
  setBlockStatus,
  setFollowRequestStatus,
  setFollowingStatus,
  setPendingRequestStatus,
} from "../store/account-store/account.slice";

export function useAccountSelector(
  userId: string,
  includeFields?: AccountField[]
): AccountSelectorParams | undefined {
  const accountSelectorCallback = useCallback(
    (state: RootState) => selectAccountParams(state, userId, includeFields),
    [userId, includeFields]
  );

  const account = useAppSelector(accountSelectorCallback, deepEqual);

  return account;
}

export function useAccountAction(account?: AccountSelectorParams) {
  const dispatch = useAppDispatch();

  const accpetFollowRequest = useCallback(() => {
    if (account?.username) {
      dispatch(
        setPendingRequestStatus({
          userId: account.username,
          value: true,
        })
      );
    }
  }, [account?.username]);

  const rejectFollowRequest = useCallback(() => {
    if (account?.username) {
      dispatch(
        setPendingRequestStatus({
          userId: account.username,
          value: false,
        })
      );
    }
  }, [account?.username]);

  const changeFollowRequestStatus = useCallback(() => {
    if (account?.username && account.isRequestedToFollow !== undefined) {
      dispatch(
        setFollowRequestStatus({
          userId: account.username,
          value: !account.isRequestedToFollow,
        })
      );
    }
  }, [account?.username, account?.isRequestedToFollow]);

  const changeFollowingStatus = useCallback(() => {
    if (account?.username && account.isFollowed !== undefined) {
      dispatch(
        setFollowingStatus({
          userId: account.username,
          value: !account.isFollowed,
        })
      );
    }
  }, [account?.username, account?.isFollowed]);

  const changeBlockStatus = useCallback(() => {
    if (account?.username && account.isFollowed !== undefined) {
      dispatch(
        setBlockStatus({
          userId: account.username,
          value: !account.isBlocked,
        })
      );
    }
  }, [account?.username, account?.isBlocked]);

  return {
    changeBlockStatus,
    changeFollowRequestStatus,
    changeFollowingStatus,
    accpetFollowRequest,
    rejectFollowRequest,
  };
}
