import EntitySearchList from "./EntitySearchList";
import { useAccountSearchResult } from "../../hooks/client.hooks";

export default function AccountSearchResultTab({
  focused,
}: {
  focused: boolean;
}) {
  const { accountSearchResult, fetchAccounts } =
    useAccountSearchResult(focused);

  if (!accountSearchResult) return null;

  return (
    <EntitySearchList
      data={accountSearchResult.data}
      isError={accountSearchResult.error || false}
      isLoading={accountSearchResult.isLoading}
      onFetch={fetchAccounts}
    />
  );
}
