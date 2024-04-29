import { FlatList } from "react-native";
import { AccountListProps } from "../../types/component.types";
import DefaultPlaceholder from "../utility-components/DefaultPlaceholder";

export default function AccountList({
  data,
  hasEndReached,
  isError,
  isLoading,
  onEndReach,
  onRefresh,
  refreshing,
  style,
  header,
  renderAccount,
}: AccountListProps) {
  const showFooter =
    data !== null &&
    data !== undefined &&
    data.length > 0 &&
    hasEndReached === false;

  const endReachEnabled =
    data !== null &&
    data !== undefined &&
    data.length > 0 &&
    hasEndReached === false &&
    !isLoading;

  return (
    <FlatList
      data={data}
      renderItem={renderAccount}
      style={style}
      overScrollMode="never"
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        onEndReach ? (
          <DefaultPlaceholder
            isError={isError || false}
            isLoading={isLoading || false}
            callback={onEndReach}
          />
        ) : undefined
      }
      ListFooterComponent={
        showFooter && onEndReach ? (
          <DefaultPlaceholder
            isError={isError || false}
            isLoading={isLoading || false}
            callback={onEndReach}
          />
        ) : undefined
      }
      onEndReachedThreshold={0.2}
      onEndReached={endReachEnabled && onEndReach ? onEndReach : undefined}
      ListHeaderComponent={header}
      keyboardShouldPersistTaps={"always"}
      keyboardDismissMode="none"
    />
  );
}
