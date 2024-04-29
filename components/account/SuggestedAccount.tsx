import { View } from "react-native";
import { SIZE_14, SIZE_20, SIZE_48, SIZE_70 } from "../../constants";
import { layoutStyle, marginStyle, paddingStyle } from "../../styles";
import Avatar from "../Avatar";
import Text from "../utility-components/text/Text";
import Button from "../utility-components/button/Button";
import { useAccountSelector } from "../../hooks/account.hooks";
import PressableIcon from "../utility-components/button/PressableIcon";
import { useCallback } from "react";

export default function SuggestedAccount({
  userId,
  onRemove,
}: {
  userId: string;
  onRemove: (userId: string) => void;
}) {
  const account = useAccountSelector(userId, [
    "fullname",
    "has-followed-client",
    "is-followed",
  ]);

  const onCrossPress = useCallback(() => {
    onRemove(userId);
  }, [onRemove, userId]);

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
        text={account.isFollowed ? "following" : "follow"}
        width={"25%"}
      />
      <PressableIcon
        size={SIZE_20}
        color="grey"
        name="close"
        style={marginStyle.margin_left_12}
        onPress={onCrossPress}
      />
    </View>
  );
}
