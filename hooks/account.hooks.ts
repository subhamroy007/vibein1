import { useCallback } from "react";
import { selectAccountParams } from "../store/account/account.selectors";
import { useAppSelector } from "./storeHooks";
import { RootState } from "../store";
import { AccountField } from "../types/utility.types";

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
