import { View } from "react-native";
import { SIZE_14, SIZE_48, SIZE_70 } from "../../constants";
import { layoutStyle, marginStyle, paddingStyle } from "../../styles";
import Avatar from "../Avatar";
import Text from "../utility-components/text/Text";
import Button from "../utility-components/button/Button";
import { useAccountSelector } from "../../hooks/account.hooks";

export default function GeneralAccount({ id }: { id: string }) {
  const account = useAccountSelector(id, [
    "name",
    "has-followed-client",
    "is-followed",
  ]);

  if (!account) return null;

  return (
    <View
      style={[
        { height: SIZE_70 },
        layoutStyle.align_item_center,
        layoutStyle.flex_direction_row,
        paddingStyle.padding_horizontal_12,
      ]}
    >
      <Avatar size={SIZE_48} url={account.profilePictureUri} />
      <View style={[marginStyle.margin_horizontal_12, layoutStyle.flex_1]}>
        <Text size={SIZE_14}>{account.userId}</Text>
        <Text color="grey" weight="light_medium">
          {account.name}
        </Text>
      </View>
      <Button
        text={
          account.isFollowed
            ? "following"
            : account.hasFollowedClient
            ? "follow back"
            : "follow"
        }
        width={"30%"}
      />
    </View>
  );
}
