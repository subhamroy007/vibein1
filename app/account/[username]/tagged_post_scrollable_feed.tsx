import { useLocalSearchParams } from "expo-router";
import { useAccountTagsRoute } from "../../../hooks/account.hooks";
import ClassicPostList from "../../../components/ClassisPostList";
import AppScreen from "../../../components/AppScreen";
import Header from "../../../components/Header";

const AccountAllPostsScrollableFeed = () => {
  const { routeId, selectedPostId, username } = useLocalSearchParams<{
    routeId: string;
    username: string;
    selectedPostId: string;
  }>();

  const { fetch, routeParams } = useAccountTagsRoute(username!, routeId!);

  if (!routeParams) {
    return null;
  }

  return (
    <AppScreen>
      <Header title="Posts" />
      <ClassicPostList
        data={routeParams.data?.posts}
        fetch={fetch}
        state={routeParams.state}
        pagination={!routeParams.data?.hasEndReached}
        postPressRoute={{
          params: { routeId, username },
          pathname: "/account/[username]/tagged_post_swipable_feed",
        }}
      />
    </AppScreen>
  );
};

export default AccountAllPostsScrollableFeed;
