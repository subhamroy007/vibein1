import { useLocalSearchParams } from "expo-router";
import AppScreen from "../../../components/AppScreen";
import Header from "../../../components/Header";
import ClassicPostList from "../../../components/ClassisPostList";
import { PostFeedItemIdentfierParams } from "../../../types/store.types";

const ClassicFeed = () => {
  const { hashtag, posts } = useLocalSearchParams<{
    hashtag: string;
    posts: string;
  }>();

  const parsedJson = JSON.parse(posts!) as string[];

  const data = parsedJson.map<PostFeedItemIdentfierParams>((postId) => ({
    postId,
    type: "post",
  }));

  return (
    <AppScreen>
      <Header title="Posts" />
      <ClassicPostList
        data={data}
        onPostTap={() => {}}
        onRetry={() => {}}
        state={"idle"}
      />
    </AppScreen>
  );
};

export default ClassicFeed;
