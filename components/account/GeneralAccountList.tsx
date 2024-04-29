import { ListRenderItemInfo } from "react-native";
import { ItemKeyListProps } from "../../types/component.types";
import { useCallback } from "react";
import { ItemKey } from "../../types/utility.types";
import GeneralAccount from "./GeneralAccount";
import AccountList from "./AccountList";

export default function GeneralAccountList(props: ItemKeyListProps) {
  const renderAccounts = useCallback(
    ({ item }: ListRenderItemInfo<ItemKey>) => {
      return <GeneralAccount id={item.key} />;
    },
    []
  );

  return <AccountList renderAccount={renderAccounts} {...props} />;
}
