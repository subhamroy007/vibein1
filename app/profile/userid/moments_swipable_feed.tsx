import Header from "../../../components/Header";
import { useLocalSearchParams } from "expo-router";
import { useAppDispatch, useAppSelector } from "../../../hooks/storeHooks";
import { selectAccountMomentPosts } from "../../../store/account-store/account.selectors";
import { useCallback, useState } from "react";
import { fetchAccountMomentPosts } from "../../../store/account-store/account.thunks";
import SwipablePostList from "../../../components/swipable-post/SwipablePostList";
import StackContainer from "../../../components/StackContainer";

export default function MomentsSwipableFeed() {
  const { userid } = useLocalSearchParams<{ userid: string }>();

  const dispatch = useAppDispatch();

  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);

  const data = useAppSelector((state) =>
    selectAccountMomentPosts(state, userid!)
  );

  const onEndReached = useCallback(async () => {
    setError(false);
    setLoading(true);
    dispatch(fetchAccountMomentPosts({ userId: userid! }))
      .unwrap()
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userid]);

  return (
    <StackContainer dark>
      <SwipablePostList
        data={data?.items}
        hasEndReached={data?.hasEndReached}
        onEndReach={onEndReached}
        isError={isError}
        isLoading={isLoading}
        focused
      />
      <Header title="Posts" floating transparent />
    </StackContainer>
  );
}
