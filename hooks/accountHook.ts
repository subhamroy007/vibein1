import { useCallback } from "react";
import { selectAccountParams } from "../store/account/account.selectors";
import { useAppDispatch, useAppSelector } from "./storeHooks";
import { RootState } from "../store";
import {
  toggleAccountFollowRequestState,
  toggleAccountFollowingState,
} from "../store/account/account.slice";
import { AccountField } from "../types/utility.types";

export default function useAccountParams(
  username: string,
  includeFields?: AccountField[]
) {
  const accountSelectotCallback = useCallback(
    (state: RootState) => selectAccountParams(state, username, includeFields),
    [username, includeFields]
  );

  const storeDispatch = useAppDispatch();

  const accountParams = useAppSelector(accountSelectotCallback);

  const toggleAccountFollowingStateCallback = useCallback(() => {
    if (accountParams?.isPrivate) {
      storeDispatch(toggleAccountFollowRequestState(username));
    } else {
      storeDispatch(toggleAccountFollowingState(username));
    }
  }, [username, storeDispatch, accountParams?.isPrivate]);

  return { accountParams, toggleAccountFollowingStateCallback };
}
