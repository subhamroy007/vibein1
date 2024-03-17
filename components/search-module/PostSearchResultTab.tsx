import { useCallback } from "react";
import { usePostSearchResult } from "../../hooks/client.hooks";
import GridPostList from "../grid-post/GripPostList";
import { PostItemIdentifier } from "../../types/store.types";

export default function PostSearchResultTab({ focused }: { focused: boolean }) {
  const { fetchPosts, searchedPostResult } = usePostSearchResult(focused);

  const onGridPress = useCallback(
    (item: PostItemIdentifier, index: number) => {},
    []
  );

  if (!searchedPostResult) return null;

  return (
    <GridPostList
      data={searchedPostResult.data?.items}
      hasEndReached={searchedPostResult.data?.hasEndReached}
      isError={searchedPostResult.error ? true : false}
      isLoading={searchedPostResult.isLoading}
      onFetch={fetchPosts}
      onPress={onGridPress}
    />
  );
}
