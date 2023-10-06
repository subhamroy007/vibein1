import { useCallback } from "react";
import { useAppDispatch } from "./storeHooks";
import { updateToasterMsg } from "../store/client/client.slice";

export default function useToaster() {
  const dispatch = useAppDispatch();

  const showToaster = useCallback(
    (msg: string) => {
      dispatch(updateToasterMsg(msg));
    },
    [dispatch]
  );

  return showToaster;
}
