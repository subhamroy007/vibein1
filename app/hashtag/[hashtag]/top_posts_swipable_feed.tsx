import { useLocalSearchParams } from "expo-router";
import AppScreen from "../../../components/AppScreen";
import Header from "../../../components/Header";
import FullScreenPostList from "../../../components/fullscreen-post/FullScreenPostList";
import { useHashtagGeneralRoute } from "../../../hooks/hashtag.hook";

const TopPostsSwipableFeed = () => {
  const { routeId, hashtag } = useLocalSearchParams<{
    routeId: string;
    hashtag: string;
  }>();

  const { fetchTopPosts, routeParams } = useHashtagGeneralRoute(
    routeId!,
    hashtag!
  );

  return (
    <AppScreen dark>
      {routeParams && (
        <FullScreenPostList
          data={routeParams.data?.posts}
          enablePagination={!routeParams.data?.hasEndReached}
          paginationRequest={fetchTopPosts}
          state={routeParams.state}
          tabFocused
        />
      )}
      <Header title="Posts" floating transparent />
    </AppScreen>
  );
};

export default TopPostsSwipableFeed;
