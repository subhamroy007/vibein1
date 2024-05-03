import { Layout } from "react-native-tab-view/lib/typescript/src/types";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import { useCallback, useEffect, useState } from "react";
import { selectAccountTaggedPosts } from "../../store/account-store/account.selectors";
import { fetchAccountTaggedPosts } from "../../store/account-store/account.thunks";
import GridPostList from "../grid-post/GripPostList";
import { useRouter } from "expo-router";
import { SharedValue } from "react-native-reanimated";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";

const AccountTaggedPostsTab = ({
  userId,
  layout,
  nestedScrollEnabled,
  onNestedScroll,
}: {
  userId: string;
  layout: Layout;
  nestedScrollEnabled: SharedValue<boolean>;
  onNestedScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}) => {
  const dispatch = useAppDispatch();

  const router = useRouter();

  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);

  const taggedPosts = useAppSelector((state) =>
    selectAccountTaggedPosts(state, userId)
  );

  const onEndReached = useCallback(async () => {
    setError(false);
    setLoading(true);
    dispatch(fetchAccountTaggedPosts({ userId }))
      .unwrap()
      .catch((error: any) => {
        console.log(
          "could not fetch tagged posts for ",
          userId,
          " something went wrong ",
          error
        );
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  const onGridPress = useCallback(
    (id: string, index: number) => {
      router.push({
        params: { userid: userId },
        pathname: "/profile/userid/tagged_post_scrollable_feed",
      });
    },
    [router, userId]
  );

  useEffect(() => {
    if (!taggedPosts) {
      onEndReached();
    }
  }, [taggedPosts, onEndReached]);

  return (
    <GridPostList
      data={taggedPosts?.items}
      onPress={onGridPress}
      hasEndReached={taggedPosts?.hasEndReached}
      isError={isError}
      isLoading={isLoading}
      onEndReach={onEndReached}
      style={{ width: layout.width }}
      nestedScrollingEnabled={nestedScrollEnabled}
      onScroll={onNestedScroll}
    />
  );
};

export default AccountTaggedPostsTab;
