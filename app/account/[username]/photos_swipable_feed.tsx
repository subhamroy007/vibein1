import { useLocalSearchParams } from "expo-router";
import { useAccountPhotosRoute } from "../../../hooks/account.hooks";
import AppScreen from "../../../components/AppScreen";
import Header from "../../../components/Header";
import FullScreenPostList from "../../../components/fullscreen-post/FullScreenPostList";

const AccountPhotosSwipableFeed = () => {
  const { routeId, selectedPostIndex, username } = useLocalSearchParams<{
    routeId: string;
    username: string;
    selectedPostIndex: string;
  }>();

  const { fetch, routeParams } = useAccountPhotosRoute(username!, routeId!);

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
      <Header title="Photos" floating transparent />
    </AppScreen>
  );
};

export default AccountPhotosSwipableFeed;
