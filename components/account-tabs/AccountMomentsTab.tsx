import { Layout } from "react-native-tab-view/lib/typescript/src/types";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import { useCallback, useEffect, useState } from "react";
import { selectAccountMomentPosts } from "../../store/account-store/account.selectors";
import {
  fetchAccountMomentPosts,
  fetchAccountTaggedPosts,
} from "../../store/account-store/account.thunks";
import GridPostList from "../grid-post/GripPostList";
import { useRouter } from "expo-router";

const AccountMomentPostsTab = ({
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

  const momentPosts = useAppSelector((state) =>
    selectAccountMomentPosts(state, userId)
  );

  const onEndReached = useCallback(async () => {
    setError(false);
    setLoading(true);
    dispatch(fetchAccountMomentPosts({ userId }))
      .unwrap()
      .catch((error: any) => {
        console.log(
          "could not fetch moments for ",
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
        pathname: "/profile/userid/moments_swipable_feed",
      });
    },
    [router, userId]
  );

  useEffect(() => {
    if (!momentPosts) {
      onEndReached();
    }
  }, [momentPosts, onEndReached]);

  return (
    <GridPostList
      data={momentPosts?.items}
      onPress={onGridPress}
      hasEndReached={momentPosts?.hasEndReached}
      isError={isError}
      isLoading={isLoading}
      onEndReach={onEndReached}
      showViews
      portrait
      nestedScrollingEnabled={nestedScrollingEnabled}
      style={{ width: layout.width }}
    />
  );
};

export default AccountMomentPostsTab;
