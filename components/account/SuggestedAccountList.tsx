import { ListRenderItemInfo } from "react-native";
import { SuggestedAccountListProps } from "../../types/component.types";
import { useCallback } from "react";
import { ItemKey } from "../../types/utility.types";
import AccountList from "./AccountList";
import SuggestedAccount from "./SuggestedAccount";

export default function SuggestedAccountList({
  onRemove,
  ...restProps
}: SuggestedAccountListProps) {
  const renderAccounts = useCallback(
    ({ item }: ListRenderItemInfo<ItemKey>) => {
      return <SuggestedAccount userId={item.key} onRemove={onRemove} />;
    },
    [onRemove]
  );

  return <AccountList renderAccount={renderAccounts} {...restProps} />;
}
