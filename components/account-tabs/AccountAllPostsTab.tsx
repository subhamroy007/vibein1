import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import { selectAccountAllPosts } from "../../store/account-store/account.selectors";
import GridPostList from "../grid-post/GripPostList";
import { useCallback, useEffect, useState } from "react";
import { Layout } from "react-native-tab-view/lib/typescript/src/types";
import { fetchAccountAllPosts } from "../../store/account-store/account.thunks";
import { useRouter } from "expo-router";

const AccountAllPostsTab = ({
  userId,
  layout,
  nestedScrollingEnabled,
}: {
  userId: string;
  layout: Layout;
  nestedScrollingEnabled: boolean;
}) => {
  const dispatch = useAppDispatch();

  const router = useRouter();

  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);

  const allPosts = useAppSelector((state) =>
    selectAccountAllPosts(state, userId)
  );

  const onEndReached = useCallback(async () => {
    setError(false);
    setLoading(true);
    dispatch(fetchAccountAllPosts({ userId }))
      .unwrap()
      .catch(() => {
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
        pathname: "/profile/userid/all_post_scrollable_feed",
      });
    },
    [router, userId]
  );

  useEffect(() => {
    if (!allPosts) {
      onEndReached();
    }
  }, [allPosts, onEndReached]);

  return (
    <GridPostList
      data={allPosts?.items}
      onPress={onGridPress}
      hasEndReached={allPosts?.hasEndReached}
      isError={isError}
      isLoading={isLoading}
      onEndReach={onEndReached}
      showPin
      style={{ width: layout.width }}
      nestedScrollingEnabled={nestedScrollingEnabled}
    />
  );
};

export default AccountAllPostsTab;
