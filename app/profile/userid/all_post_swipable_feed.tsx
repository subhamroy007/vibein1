import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../components/Header";
import { useLocalSearchParams } from "expo-router";
import { useAppDispatch, useAppSelector } from "../../../hooks/storeHooks";
import { selectAccountAllPosts } from "../../../store/account-store/account.selectors";
import { useCallback, useState } from "react";
import { fetchAccountAllPosts } from "../../../store/account-store/account.thunks";
import { layoutStyle } from "../../../styles";
import SwipablePostList from "../../../components/swipable-post/SwipablePostList";
import { View } from "react-native";
import StackContainer from "../../../components/StackContainer";

export default function AllPostSwipableFeed() {
  const { userid } = useLocalSearchParams<{ userid: string }>();

  const dispatch = useAppDispatch();

  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);

  const data = useAppSelector((state) => selectAccountAllPosts(state, userid!));

  const onEndReached = useCallback(async () => {
    setError(false);
    setLoading(true);
    dispatch(fetchAccountAllPosts({ userId: userid! }))
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
