import { View } from "react-native";
import { Layout } from "react-native-tab-view/lib/typescript/src/types";
import { backgroundStyle, layoutStyle, marginStyle } from "../../../styles";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/storeHooks";
import { selectAccountFollowers } from "../../../store/account-store/account.selectors";
import {
  fetchAccountFollowers,
  fetchAccountSearchedFollowers,
} from "../../../store/account-store/account.thunks";
import SearchBox from "../../utility-components/SearchBox";
import DefaultPlaceholder from "../../utility-components/DefaultPlaceholder";
import GeneralAccountList from "../GeneralAccountList";
import { SIZE_120, SIZE_15, SIZE_90 } from "../../../constants";
import Text from "../../utility-components/text/Text";

const FollowersTab = ({
  layout,
  userId,
}: {
  userId: string;
  layout: Layout;
}) => {
  const [searchPhase, setSearchPhase] = useState("");

  const lastSearchedText = useRef<string | null>(null);
  const lastAbortCallback = useRef<(() => void) | null>(null);

  const [isLoading, setLoading] = useState(false);

  const [isError, setError] = useState(false);

  const shouldSendSearchRequest = useRef(false);

  const dispatch = useAppDispatch();

  const trimmedText = searchPhase.trim();

  const data = useAppSelector((state) =>
    selectAccountFollowers(
      state,
      userId,
      trimmedText !== "" ? trimmedText : null
    )
  );

  shouldSendSearchRequest.current =
    data !== null && data.searchedAccounts === undefined;

  const onFetch = useCallback(() => {
    setLoading(true);
    setError(false);
    dispatch(fetchAccountFollowers({ userId }))
      .catch(() => {
        if (!lastSearchedText.current) {
          setError(true);
        }
      })
      .finally(() => {
        if (!lastSearchedText.current) {
          setLoading(false);
        }
      });
  }, [userId]);

  const onSearch = useCallback(() => {
    setLoading(true);
    setError(false);
    const request = dispatch(
      fetchAccountSearchedFollowers({
        searchedPhase: trimmedText,
        userId: userId,
      })
    );
    lastAbortCallback.current = request.abort;
    request
      .unwrap()
      .catch(() => {
        if (lastSearchedText.current === trimmedText) {
          console.log(
            "failed to complete the previous request for ",
            trimmedText
          );
          setError(true);
        }
      })
      .finally(() => {
        if (lastSearchedText.current === trimmedText) {
          setLoading(false);
        }
        lastAbortCallback.current = null;
      });
  }, [userId, trimmedText]);

  useEffect(() => {
    if (shouldSendSearchRequest.current) {
      lastSearchedText.current = trimmedText;
      onSearch();
    }

    return () => {
      lastSearchedText.current = null;
      if (lastAbortCallback.current) {
        console.log("canceling the previous request for ", trimmedText);
        lastAbortCallback.current();
        lastAbortCallback.current = null;
      }
    };
  }, [trimmedText, onSearch]);

  useEffect(() => {
    if (!data) {
      onFetch();
    }
  }, [data, onFetch]);

  return (
    <View style={[layoutStyle.flex_1, { width: layout.width }]}>
      <GeneralAccountList
        data={
          trimmedText !== "" ? data?.searchedAccounts : data?.allAccounts.items
        }
        hasEndReached={
          trimmedText !== "" ? true : data?.allAccounts.hasEndReached
        }
        isError={isError}
        isLoading={isLoading}
        onEndReach={trimmedText !== "" ? onSearch : onFetch}
        header={
          data && data.noOfFollowers > 0 ? (
            <View style={[layoutStyle.content_center, { height: SIZE_120 }]}>
              <SearchBox setText={setSearchPhase} text={searchPhase} />
              <Text
                weight="semi-bold"
                size={SIZE_15}
                color="grey"
                style={marginStyle.margin_top_18}
              >
                {data?.noOfFollowers} followers
              </Text>
            </View>
          ) : undefined
        }
      />
    </View>
  );
};

export default FollowersTab;
