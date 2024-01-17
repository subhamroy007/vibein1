import { useLocalSearchParams } from "expo-router";
import { useAccountMomentsRoute } from "../../../hooks/account.hooks";
import AppScreen from "../../../components/AppScreen";
import Header from "../../../components/Header";
import FullScreenPostList from "../../../components/fullscreen-post/FullScreenPostList";

const AccountMomentsSwipableFeed = () => {
  const { routeId, selectedPostIndex, username } = useLocalSearchParams<{
    routeId: string;
    username: string;
    selectedPostIndex: string;
  }>();

  const { fetch, routeParams } = useAccountMomentsRoute(username!, routeId!);

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
      <Header title="Moments" floating transparent />
    </AppScreen>
  );
};

export default AccountMomentsSwipableFeed;
