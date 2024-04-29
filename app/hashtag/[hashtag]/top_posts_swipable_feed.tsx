import Header from "../../../components/Header";
import { useGlobalSearchParams } from "expo-router";
import { useAppDispatch, useAppSelector } from "../../../hooks/storeHooks";
import { useCallback, useState } from "react";
import StackContainer from "../../../components/StackContainer";
import { selectHashtagTopPosts } from "../../../store/hashtag/hashtag.selector";
import { fetchHashtagTopPosts } from "../../../store/hashtag/hashtag.thunk";
import SwipablePostList from "../../../components/swipable-post/SwipablePostList";

export default function AllPostScrollableFeed() {
  const { hashtag } = useGlobalSearchParams<{ hashtag: string }>();

  const dispatch = useAppDispatch();

  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);

  const data = useAppSelector((state) =>
    selectHashtagTopPosts(state, hashtag!)
  );

  const onEndReached = useCallback(async () => {
    setError(false);
    setLoading(true);
    dispatch(fetchHashtagTopPosts({ name: hashtag! }))
      .unwrap()
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [hashtag]);

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
