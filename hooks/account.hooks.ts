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
    if (account?.userId) {
      dispatch(
        setPendingRequestStatus({
          userId: account.userId,
          value: true,
        })
      );
    }
  }, [account?.userId]);

  const rejectFollowRequest = useCallback(() => {
    if (account?.userId) {
      dispatch(
        setPendingRequestStatus({
          userId: account.userId,
          value: false,
        })
      );
    }
  }, [account?.userId]);

  const changeFollowRequestStatus = useCallback(() => {
    if (account?.userId && account.isRequestedToFollow !== undefined) {
      dispatch(
        setFollowRequestStatus({
          userId: account.userId,
          value: !account.isRequestedToFollow,
        })
      );
    }
  }, [account?.userId, account?.isRequestedToFollow]);

  const changeFollowingStatus = useCallback(() => {
    if (account?.userId && account.isFollowed !== undefined) {
      dispatch(
        setFollowingStatus({
          userId: account.userId,
          value: !account.isFollowed,
        })
      );
    }
  }, [account?.userId, account?.isFollowed]);

  const changeBlockStatus = useCallback(() => {
    if (account?.userId && account.isFollowed !== undefined) {
      dispatch(
        setBlockStatus({
          userId: account.userId,
          value: !account.isBlocked,
        })
      );
    }
  }, [account?.userId, account?.isBlocked]);

  return {
    changeBlockStatus,
    changeFollowRequestStatus,
    changeFollowingStatus,
    accpetFollowRequest,
    rejectFollowRequest,
  };
}
