import { useLocalSearchParams } from "expo-router";
import StackContainer from "../../../components/StackContainer";
import { usePostSuggestionsRoute } from "../../../hooks/client.hooks";
import { PostItemIdentifier } from "../../../types/store.types";

import ScrollablePostList from "../../../components/scrollable-post/ScrollablePostList";
import Header from "../../../components/Header";

export default function PostSuggestions() {
  const seed = useLocalSearchParams<PostItemIdentifier>();

  const { fetchPosts, postSuggestionRoute } = usePostSuggestionsRoute({
    id: seed.id!,
    type: seed.type!,
  });

  return (
    <StackContainer>
      <Header title="posts" />
      {postSuggestionRoute && (
        <ScrollablePostList
          data={postSuggestionRoute.data.items}
          isLoading={postSuggestionRoute.isLoading}
          isError={
            postSuggestionRoute.error
              ? !postSuggestionRoute.failedToRefresh
                ? true
                : postSuggestionRoute.data.items.length === 0
              : false
          }
          onFetch={fetchPosts}
          hasEndReached={postSuggestionRoute.data.hasEndReached}
        />
      )}
    </StackContainer>
  );
}
