import { useLocalSearchParams } from "expo-router";
import {
  useAccountHomeRoute,
  useAccountTagsRoute,
} from "../../../hooks/account.hooks";
import AppScreen from "../../../components/AppScreen";
import Header from "../../../components/Header";
import FullScreenPostList from "../../../components/fullscreen-post/FullScreenPostList";

const AccountAllPostsSwipableFeed = () => {
  const { routeId, selectedPostIndex, username } = useLocalSearchParams<{
    routeId: string;
    username: string;
    selectedPostIndex: string;
  }>();

  const { fetch, routeParams } = useAccountTagsRoute(username!, routeId!);

  if (!routeParams) {
    return null;
  }

  return (
    <AppScreen dark>
      <FullScreenPostList
        data={routeParams.data?.posts}
        fetch={fetch}
        state={routeParams.state}
        pagination={!routeParams.data?.hasEndReached}
      />
      <Header title="Posts" floating transparent />
    </AppScreen>
  );
};

export default AccountAllPostsSwipableFeed;
