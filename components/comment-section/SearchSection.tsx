import { FlatList, ListRenderItemInfo } from "react-native";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchAccountMentions,
  fetchHashtags,
} from "../../store/client/client.thunk";
import DefaultPlaceHolder from "../utility-components/DefaultFallback";
import DefaultErrorFallback from "../utility-components/DefaultErrorFallback";
import { SearchParams } from "../../types/utility.types";
import { backgroundStyle, layoutStyle } from "../../styles";
import AccountMentionListItem from "./AccountMentionListItem";
import { selectAccountAndHashtagSearchSection } from "../../store/client/client.selector";
import HashtagListItem from "./HashtagListItem";
import { resetAccountAndHashtagSearchSection } from "../../store/client/client.slice";

export type SearchSectionProps = {
  searchPhase: string;
  onSelect: (text: string) => void;
};

export default function SearchSection({
  onSelect,
  searchPhase,
}: SearchSectionProps) {
  const [showSpinner, setShowSpinner] = useState(false);

  const dispatch = useAppDispatch();

  const fetchItems = useCallback(() => {
    setShowSpinner(true);
    if (searchPhase.startsWith("@")) {
      dispatch(fetchAccountMentions({ searchPhase }));
    } else {
      dispatch(fetchHashtags({ searchPhase }));
    }
  }, [searchPhase]);

  const timoutRef = useRef<NodeJS.Timeout>();

  const result = useAppSelector((state) =>
    selectAccountAndHashtagSearchSection(state, searchPhase)
  );

  useEffect(() => {
    if (!result.items) {
      setShowSpinner(true);
      timoutRef.current = setTimeout(fetchItems, 400);
    } else {
      setShowSpinner(false);
    }

    return () => {
      clearTimeout(timoutRef.current);
    };
  }, [fetchItems, result.items]);

  useEffect(() => {
    if (result.error) {
      setShowSpinner(false);
    }
  }, [result.error]);

  useEffect(() => {
    return () => {
      dispatch(resetAccountAndHashtagSearchSection());
    };
  }, []);

  const renderAccounts = useCallback(
    ({ item }: ListRenderItemInfo<SearchParams>) => {
      if (item.type === "account") {
        return <AccountMentionListItem account={item} onSelect={onSelect} />;
      } else if (item.type === "hashtag") {
        return <HashtagListItem onSelect={onSelect} hashtag={item} />;
      }
      return null;
    },
    [onSelect]
  );

  return (
    <FlatList
      data={result.items}
      renderItem={renderAccounts}
      showsVerticalScrollIndicator={false}
      overScrollMode="never"
      ListEmptyComponent={
        showSpinner ? (
          <DefaultPlaceHolder isLoading />
        ) : result.error ? (
          <DefaultErrorFallback retry={fetchItems} />
        ) : undefined
      }
      style={[layoutStyle.flex_fill, backgroundStyle.background_color_1]}
      keyboardShouldPersistTaps={"always"}
    />
  );
}
