import { View } from "react-native";
import { Layout } from "react-native-tab-view/lib/typescript/src/types";
import { layoutStyle } from "../../../styles";
import { useAppDispatch, useAppSelector } from "../../../hooks/storeHooks";
import { selectAccountSuggestions } from "../../../store/account-store/account.selectors";
import { useCallback, useEffect, useState } from "react";
import { fetchAccountSuggestions } from "../../../store/account-store/account.thunks";
import SuggestedAccountList from "../SuggestedAccountList";

const SuggestedTab = ({
  layout,
  userId,
}: {
  userId: string;
  layout: Layout;
}) => {
  const [isLoading, setLoading] = useState(false);

  const [isError, setError] = useState(false);

  const dispatch = useAppDispatch();

  const data = useAppSelector((state) =>
    selectAccountSuggestions(state, userId)
  );

  const onAccountRemove = useCallback(() => {}, []);

  const onFetch = useCallback(() => {
    setLoading(true);
    setError(false);
    dispatch(fetchAccountSuggestions({ userId }))
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  useEffect(() => {
    if (!data) {
      onFetch();
    }
  }, [data, onFetch]);

  return (
    <View style={[layoutStyle.flex_1, { width: layout.width }]}>
      <SuggestedAccountList
        onRemove={onAccountRemove}
        data={data?.items}
        hasEndReached={data?.hasEndReached}
        isError={isError}
        isLoading={isLoading}
        onEndReach={onFetch}
      />
    </View>
  );
};

export default SuggestedTab;
