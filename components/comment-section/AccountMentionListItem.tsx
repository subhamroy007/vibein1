import { View } from "react-native";
import { SIZE_45 } from "../../constants";
import { layoutStyle, marginStyle, paddingStyle } from "../../styles";
import { AccountParams } from "../../types/utility.types";
import Avatar from "../Avatar";
import Pressable from "../utility-components/button/Pressable";
import Text from "../utility-components/text/Text";

export type AccountMentionListItemProps = {
  account: AccountParams;
  onSelect: (userId: string) => void;
};

export default function AccountMentionListItem({
  account,
  onSelect,
}: AccountMentionListItemProps) {
  return (
    <Pressable
      useUnderlay
      onPress={() => onSelect(account.userId)}
      style={[
        { height: SIZE_45 },
        layoutStyle.align_item_center,
        layoutStyle.flex_direction_row,
        paddingStyle.padding_horizontal_9,
      ]}
    >
      <Avatar url={account.profilePictureUri} />
      <View style={marginStyle.margin_left_9}>
        <Text weight="semi-bold">{account.userId}</Text>
        <Text weight="semi-bold" color="grey">
          {account.name}
        </Text>
      </View>
    </Pressable>
  );
}
