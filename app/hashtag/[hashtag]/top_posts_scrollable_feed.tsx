import { useLocalSearchParams } from "expo-router";
import AppScreen from "../../../components/AppScreen";
import Header from "../../../components/Header";
import ClassicPostList from "../../../components/ClassisPostList";
import { useHashtagGeneralRoute } from "../../../hooks/hashtag.hook";

const TopPostsScrollableFeed = () => {
  const { routeId, hashtag } = useLocalSearchParams<{
    routeId: string;
    hashtag: string;
  }>();

  const { fetchTopPosts, routeParams } = useHashtagGeneralRoute(
    routeId!,
    hashtag!
  );

  return (
    <AppScreen>
      <Header title="Posts" />
      {routeParams && (
        <ClassicPostList
          data={routeParams.data?.posts}
          enablePagination={!routeParams.data?.hasEndReached}
          paginationRequest={fetchTopPosts}
          state={routeParams.state}
          postPressRoute={{
            pathname: "/hashtag/[hashtag]/top_posts_swipable_feed",
            params: { routeId, hashtag },
          }}
        />
      )}
    </AppScreen>
  );
};

export default TopPostsScrollableFeed;
