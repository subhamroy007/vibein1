import EntitySearchList from "./EntitySearchList";
import { useHashtagSearchResult } from "../../hooks/client.hooks";

export default function HashtagSearchResultTab({
  focused,
}: {
  focused: boolean;
}) {
  const { hashtagSearchResult, fetchHashtags } =
    useHashtagSearchResult(focused);

  if (!hashtagSearchResult) return null;

  return (
    <EntitySearchList
      data={hashtagSearchResult.data}
      isError={hashtagSearchResult.error || false}
      isLoading={hashtagSearchResult.isLoading}
      onFetch={fetchHashtags}
    />
  );
}
