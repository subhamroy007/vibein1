import StackContainer from "../../../components/StackContainer";
import { Stack, useRouter } from "expo-router";
import { useExploreFeed } from "../../../hooks/client.hooks";
import { useCallback } from "react";
import GridPostList from "../../../components/grid-post/GripPostList";
import { PostItemIdentifier } from "../../../types/store.types";
import Header from "../../../components/Header";
import SearchBar from "../../../components/SearchBar";

export default function Discover() {
  const { exploreFeed, fetchPosts, refresh } = useExploreFeed();

  const router = useRouter();

  const onPress = useCallback(
    (item: PostItemIdentifier, index: number) => {
      router.push({
        params: item,
        pathname: "/tabs/discover/post_suggestions",
      });
    },
    [router]
  );

  const onSearchBarPress = useCallback(() => {
    router.push({
      pathname: "/tabs/discover/search_view",
    });
  }, [router]);

  return (
    <StackContainer>
      <Stack.Screen options={{ headerShown: false }} />
      <Header hideBack ItemMiddle={<SearchBar onPress={onSearchBarPress} />} />
      <GridPostList
        data={exploreFeed.data?.items}
        onPress={onPress}
        isLoading={exploreFeed.isLoading}
        isError={
          exploreFeed.error
            ? !exploreFeed.failedToRefresh
              ? true
              : exploreFeed.data === null
            : false
        }
        onFetch={fetchPosts}
        onRefresh={refresh}
        hasEndReached={exploreFeed.data?.hasEndReached}
      />
    </StackContainer>
  );
}
