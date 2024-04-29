import { FlatList, ListRenderItemInfo, View } from "react-native";
import { Layout } from "react-native-tab-view/lib/typescript/src/types";
import { layoutStyle } from "../../../styles";
import { useAppDispatch, useAppSelector } from "../../../hooks/storeHooks";
import { selectAccountFollowings } from "../../../store/account-store/account.selectors";
import { useCallback, useEffect, useState } from "react";
import { ItemKey } from "../../../types/utility.types";
import GeneralAccount from "../GeneralAccount";
import DefaultPlaceholder from "../../utility-components/DefaultPlaceholder";
import { fetchAccountFollowings } from "../../../store/account-store/account.thunks";
import GeneralAccountList from "../GeneralAccountList";

const FollowingsTab = ({
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
    selectAccountFollowings(state, userId)
  );

  const onFetch = useCallback(() => {
    setLoading(true);
    setError(false);
    dispatch(fetchAccountFollowings({ userId }))
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
      <GeneralAccountList
        data={data?.items}
        hasEndReached={data?.hasEndReached}
        isError={isError}
        isLoading={isLoading}
        onEndReach={onFetch}
      />
    </View>
  );
};

export default FollowingsTab;
