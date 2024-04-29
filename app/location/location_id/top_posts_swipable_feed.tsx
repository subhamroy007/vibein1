import Header from "../../../components/Header";
import { useGlobalSearchParams } from "expo-router";
import { useAppDispatch, useAppSelector } from "../../../hooks/storeHooks";
import { useCallback, useState } from "react";
import StackContainer from "../../../components/StackContainer";
import SwipablePostList from "../../../components/swipable-post/SwipablePostList";
import { selectLocationTopPosts } from "../../../store/location/location.selector";
import { fetchLocationTopPosts } from "../../../store/location/location.thunk";

export default function AllPostScrollableFeed() {
  const { location_id } = useGlobalSearchParams<{ location_id: string }>();

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
