import { useLocalSearchParams } from "expo-router";
import { useAccountHomeRoute } from "../../../hooks/account.hooks";
import ClassicPostList from "../../../components/ClassisPostList";
import AppScreen from "../../../components/AppScreen";
import Header from "../../../components/Header";

const AccountAllPostsScrollableFeed = () => {
  const { routeId, selectedPostId, username } = useLocalSearchParams<{
    routeId: string;
    username: string;
    selectedPostId: string;
  }>();

  const { fetchPosts, routeParams } = useAccountHomeRoute(username!, routeId!);

  if (!routeParams) {
    return null;
  }

  return (
    <AppScreen>
      <Header title="Posts" />
      <ClassicPostList
        data={routeParams.data?.allPosts.posts}
        fetch={fetchPosts}
        state={routeParams.state}
        pagination={!routeParams.data?.allPosts.hasEndReached}
        postPressRoute={{
          params: { routeId, username },
          pathname: "/account/[username]/all_post_swipable_feed",
        }}
      />
    </AppScreen>
  );
};

export default AccountAllPostsScrollableFeed;
