import Header from "../../../components/Header";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { useAppDispatch, useAppSelector } from "../../../hooks/storeHooks";
import ScrollablePostList from "../../../components/scrollable-post/ScrollablePostList";
import { useCallback, useState } from "react";
import StackContainer from "../../../components/StackContainer";
import { selectLocationTopPosts } from "../../../store/location/location.selector";
import { fetchLocationTopPosts } from "../../../store/location/location.thunk";

export default function AllPostScrollableFeed() {
  const { location_id } = useGlobalSearchParams<{ location_id: string }>();

  const router = useRouter();

  const dispatch = useAppDispatch();

  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);

  const data = useAppSelector((state) =>
    selectLocationTopPosts(state, location_id!)
  );

  const onEndReached = useCallback(async () => {
    setError(false);
    setLoading(true);
    dispatch(fetchLocationTopPosts({ location_id: location_id! }))
      .unwrap()
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [location_id]);

  const onPostPress = useCallback(
    (id: string, index: number) => {
      router.push({
        params: { location_id },
        pathname: "/location/location_id/top_posts_swipable_feed",
      });
    },
    [location_id]
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
