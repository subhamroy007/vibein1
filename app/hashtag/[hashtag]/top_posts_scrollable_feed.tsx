import Header from "../../../components/Header";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { useAppDispatch, useAppSelector } from "../../../hooks/storeHooks";
import ScrollablePostList from "../../../components/scrollable-post/ScrollablePostList";
import { useCallback, useState } from "react";
import StackContainer from "../../../components/StackContainer";
import { selectHashtagTopPosts } from "../../../store/hashtag/hashtag.selector";
import { fetchHashtagTopPosts } from "../../../store/hashtag/hashtag.thunk";

export default function AllPostScrollableFeed() {
  const { hashtag } = useGlobalSearchParams<{ hashtag: string }>();

  const router = useRouter();

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

  const onPostPress = useCallback(
    (id: string, index: number) => {
      router.push({
        params: { hashtag },
        pathname: "/hashtag/hashtag/top_posts_swipable_feed",
      });
    },
    [hashtag]
  );

  return (
    <StackContainer>
      <Header title="Posts" />
      <ScrollablePostList
        data={data?.items}
        hasEndReached={data?.hasEndReached}
        onEndReach={onEndReached}
        isError={isError}
        isLoading={isLoading}
        onPress={onPostPress}
      />
    </StackContainer>
  );
}
