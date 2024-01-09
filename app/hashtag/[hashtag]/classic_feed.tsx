import { useLocalSearchParams } from "expo-router";
import AppScreen from "../../../components/AppScreen";
import Header from "../../../components/Header";
import ClassicPostList from "../../../components/ClassisPostList";
import { usePostScreen } from "../../../hooks/utility.hooks";

const ClassicFeed = () => {
  const { hashtag, stringifiedPostList } = useLocalSearchParams<{
    hashtag: string;
    stringifiedPostList: string;
  }>();

  const initPosts = JSON.parse(stringifiedPostList!) as string[];

  const { fetch, screenInfo } = usePostScreen("/" + hashtag, initPosts);

  return (
    <AppScreen>
      <Header title="Posts" />
      {screenInfo && (
        <ClassicPostList
          data={screenInfo.posts}
          onPostTap={() => {}}
          onRetry={fetch}
          state={screenInfo?.state}
        />
      )}
    </AppScreen>
  );
};

export default ClassicFeed;