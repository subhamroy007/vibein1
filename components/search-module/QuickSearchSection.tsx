import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import { selectQuickSearchResult } from "../../store/client/client.selector";
import { fetchQuickSearchResult } from "../../store/client/client.thunk";
import HashTagSearchItem from "./HashtagSearhItem";
import AccountSearchItem from "./AccountSearchItem";
import TextSearchItem from "./TextSearchItem";
import { layoutStyle, marginStyle } from "../../styles";
import Spinner from "../utility-components/Spinner";
import { SIZE_18 } from "../../constants";
import Text from "../utility-components/text/Text";

export default function QuickSearchSection({ text }: { text: string }) {
  const trimmedText = text.trim();

  const [showSpinner, setShowSpinner] = useState(false);

  const timerRef = useRef<NodeJS.Timeout>();

  const dispatch = useAppDispatch();

  const { isError, isLoading, results, searchHistory } = useAppSelector(
    (state) => selectQuickSearchResult(state, text.trim())
  );

  useEffect(() => {
    if (trimmedText.length > 0 && !results) {
      setShowSpinner(true);
      timerRef.current = setTimeout(() => {
        dispatch(fetchQuickSearchResult({ searchPhase: trimmedText }));
      }, 400);
    }

    return () => {
      clearTimeout(timerRef.current);
    };
  }, [results, trimmedText]);

  useEffect(() => {
    if (!isLoading) {
      setShowSpinner(false);
    }
  }, [isLoading]);

  return (
    <ScrollView>
      {trimmedText.length === 0
        ? searchHistory.map((item, index) => {
            if (item.type === "hashtag") {
              return <HashTagSearchItem {...item} key={index} />;
            } else if (item.type === "account") {
              return <AccountSearchItem {...item} key={index} />;
            }
            return <TextSearchItem {...item} key={index} />;
          })
        : results &&
          results.map((item, index) => {
            if (item.type === "hashtag") {
              return <HashTagSearchItem {...item} key={index} />;
            } else if (item.type === "account") {
              return <AccountSearchItem {...item} key={index} />;
            }
            return <TextSearchItem {...item} key={index} />;
          })}
      {showSpinner && (
        <View
          style={[
            layoutStyle.flex_direction_row,
            layoutStyle.align_item_center,
            layoutStyle.align_self_center,
            marginStyle.margin_top_24,
            { maxWidth: "80%" },
          ]}
        >
          <Spinner size={SIZE_18} />
          <Text
            style={marginStyle.margin_left_6}
            weight="semi-bold"
            color="grey"
          >{`searching for '${trimmedText}'`}</Text>
        </View>
      )}
    </ScrollView>
  );
}
