import { Layout } from "react-native-tab-view/lib/typescript/src/types";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import { useCallback, useEffect, useState } from "react";
import { selectAccountPhotoPosts } from "../../store/account-store/account.selectors";
import {
  fetchAccountPhotoPosts,
  fetchAccountTaggedPosts,
} from "../../store/account-store/account.thunks";
import GridPostList from "../grid-post/GripPostList";
import { useRouter } from "expo-router";
import { SharedValue } from "react-native-reanimated";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";

const AccountPhotoPostsTab = ({
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

  const photoPosts = useAppSelector((state) =>
    selectAccountPhotoPosts(state, userId)
  );

  const onEndReached = useCallback(async () => {
    setError(false);
    setLoading(true);
    dispatch(fetchAccountPhotoPosts({ userId }))
      .unwrap()
      .catch((error: any) => {
        console.log(
          "could not fetch photos for ",
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
        pathname: "/profile/userid/photos_swipable_feed",
      });
    },
    [router, userId]
  );
  useEffect(() => {
    if (!photoPosts) {
      onEndReached();
    }
  }, [photoPosts, onEndReached]);

  return (
    <GridPostList
      data={photoPosts?.items}
      onPress={onGridPress}
      hasEndReached={photoPosts?.hasEndReached}
      isError={isError}
      isLoading={isLoading}
      onEndReach={onEndReached}
      portrait
      showViews
      style={{ width: layout.width }}
      nestedScrollingEnabled={nestedScrollEnabled}
      onScroll={onNestedScroll}
    />
  );
};

export default AccountPhotoPostsTab;
