import { useSelector } from "react-redux";
import { selectHomeFeedParams } from "../store/client/client.selector";
import { useCallback } from "react";
import { useAppDispatch } from "./storeHooks";
import { getHomeFeedData } from "../store/client/client.thunk";

export default function useHomeFeed() {
  const homeFeedParams = useSelector(selectHomeFeedParams);

  const dispatch = useAppDispatch();

  const fetch = useCallback(() => {
    if (homeFeedParams.state === "idle") {
      dispatch(getHomeFeedData());
    }
  }, [homeFeedParams.state]);

  return {
    homeFeedParams,
    fetch,
  };
}
