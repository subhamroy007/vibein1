import { View } from "react-native";
import {
  SIZE_14,
  SIZE_15,
  SIZE_48,
  SIZE_54,
  SIZE_60,
  SIZE_70,
} from "../../constants";
import { layoutStyle, marginStyle, paddingStyle } from "../../styles";
import Avatar from "../Avatar";
import Text from "../utility-components/text/Text";
import { useAppSelector } from "../../hooks/storeHooks";
import { selectAccountParams } from "../../store/account-store/account.selectors";
import Button from "../utility-components/button/Button";

export default function AccountListItem({ id }: { id: string }) {
  const account = useAppSelector((state) =>
    selectAccountParams(state, id, [
      "fullname",
      "has-followed-client",
      "is-followed",
    ])
  );

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
        <Text weight="semi-bold" size={SIZE_14}>
          {account.username}
        </Text>
        <Text weight="semi-bold" color="grey" size={SIZE_14}>
          {account.fullname}
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
