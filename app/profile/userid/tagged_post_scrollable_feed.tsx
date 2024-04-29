import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../components/Header";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAppDispatch, useAppSelector } from "../../../hooks/storeHooks";
import { selectAccountTaggedPosts } from "../../../store/account-store/account.selectors";
import ScrollablePostList from "../../../components/scrollable-post/ScrollablePostList";
import { useCallback, useState } from "react";
import { fetchAccountTaggedPosts } from "../../../store/account-store/account.thunks";
import { layoutStyle } from "../../../styles";
import StackContainer from "../../../components/StackContainer";

export default function TaggedPostScrollableFeed() {
  const { userid } = useLocalSearchParams<{ userid: string }>();

  const router = useRouter();

  const dispatch = useAppDispatch();

  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);

  const data = useAppSelector((state) =>
    selectAccountTaggedPosts(state, userid!)
  );

  const onEndReached = useCallback(async () => {
    setError(false);
    setLoading(true);
    dispatch(fetchAccountTaggedPosts({ userId: userid! }))
      .unwrap()
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userid]);

  const onPostPress = useCallback(
    (id: string, index: number) => {
      router.push({
        params: { userid },
        pathname: "/profile/userid/tagged_post_swipable_feed",
      });
    },
    [userid]
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
