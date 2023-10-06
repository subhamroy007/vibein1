import { useCallback, useState } from "react";
import { ACCOUNTS } from "../mocks/accounts";
import { ScrollView, TouchableHighlight, View } from "react-native";
import { COLOR_7, SIZE_11, SIZE_12, SIZE_36 } from "../constants";
import { layoutStyle, marginStyle, paddingStyle } from "../styles";
import Avatar from "./Avatar";
import AppText from "./AppText";

export type AccountListProps = {
  searchPhase: string;
  onAccountSelect: (name: string) => void;
};

export type AccountListItemParams = {
  _id: string;
  username: string;
  fullname: string;
  profilePictureUrl: string;
};

export type AccountListStateParams = {
  accounts: AccountListItemParams[];
};

export type AccountListItemProps = {
  onAccountSelect: (name: string) => void;
} & AccountListItemParams;

export function AccountListItem({
  onAccountSelect,
  ...accountParams
}: AccountListItemProps) {
  const accountSelectCallback = useCallback(
    () => onAccountSelect("@" + accountParams.username),
    [accountParams.username, onAccountSelect]
  );

  return (
    <TouchableHighlight onPress={accountSelectCallback} underlayColor={COLOR_7}>
      <View
        style={[
          layoutStyle.flex_direction_row,
          layoutStyle.align_item_center,
          paddingStyle.padding_horizontal_12,
          paddingStyle.padding_vertical_6,
        ]}
      >
        <Avatar url={accountParams.profilePictureUrl} size={SIZE_36} />
        <View style={marginStyle.margin_left_6}>
          <AppText size={SIZE_11}>{accountParams.username}</AppText>
          <AppText size={SIZE_11} color="grey">
            {accountParams.fullname}
          </AppText>
        </View>
      </View>
    </TouchableHighlight>
  );
}

export default function AccountList({
  onAccountSelect,
  searchPhase,
}: AccountListProps) {
  const [state, setState] = useState<AccountListStateParams>({
    accounts: [...ACCOUNTS] as AccountListItemParams[],
  });

  return (
    <ScrollView keyboardShouldPersistTaps="always">
      {state.accounts.map((account) => (
        <AccountListItem
          {...account}
          key={account._id}
          onAccountSelect={onAccountSelect}
        />
      ))}
    </ScrollView>
  );
}
