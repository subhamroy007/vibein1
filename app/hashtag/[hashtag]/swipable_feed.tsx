import { useLocalSearchParams } from "expo-router";
import AppScreen from "../../../components/AppScreen";
import Header from "../../../components/Header";
import { usePostScreen } from "../../../hooks/utility.hooks";
import FullScreenPostList from "../../../components/fullscreen-post/FullScreenPostList";

const SwipableFeed = () => {
  const { hashtag, stringifiedPostList } = useLocalSearchParams<{
    hashtag: string;
    stringifiedPostList: string;
  }>();

  const initPosts = JSON.parse(stringifiedPostList!) as string[];

  const { fetch, screenInfo } = usePostScreen("/" + hashtag, initPosts);

  if (!screenInfo) {
    return null;
  }

  return (
    <AppScreen dark>
      <FullScreenPostList
        data={screenInfo.posts}
        state={screenInfo?.state}
        onRetry={fetch}
        tabFocused
      />
      <Header title="Posts" transparent floating />
    </AppScreen>
  );
};

export default SwipableFeed;
