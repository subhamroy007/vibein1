import { useCallback } from "react";
import Pressable from "../utility-components/button/Pressable";
import { layoutStyle, marginStyle, paddingStyle } from "../../styles";
import {
  COLOR_2,
  LOGO_BLUE,
  SIZE_24,
  SIZE_30,
  SIZE_48,
  SIZE_70,
} from "../../constants";
import Avatar from "../Avatar";
import { View } from "react-native";
import Text from "../utility-components/text/Text";
import Icon from "../utility-components/icon/Icon";
import { ChatItemSelectorParams } from "../../types/selector.types";

export type SendListItemProps = {
  selected: boolean;
  searched: boolean;
  onPress: (
    item: ChatItemSelectorParams,
    select: boolean,
    searched: boolean
  ) => void;
  item: ChatItemSelectorParams;
};

export default function SendListItem({
  onPress,
  item,
  searched,
  selected,
}: SendListItemProps) {
  const pressCallback = useCallback(() => {
    onPress(item, !selected, searched);
  }, [item, onPress, selected, searched]);

  let avatarItem = null;
  let secondaryText = null;
  if (item.type === "one-to-one") {
    avatarItem = <Avatar size={SIZE_48} url={item.profilePictureUri} />;
    secondaryText = item.userId;
  } else {
    avatarItem = (
      <View style={{ width: SIZE_48, aspectRatio: 1 }}>
        <Avatar
          size={SIZE_30}
          url={item.members[0].profilePictureUri}
          style={[layoutStyle.position_absolute, { top: 3, right: 3 }]}
        />
        <Avatar
          size={SIZE_30}
          url={item.members[1].profilePictureUri}
          style={[layoutStyle.position_absolute, { bottom: 3, left: 3 }]}
        />
      </View>
    );
    secondaryText = item.members.length + " members";
  }

  return (
    <Pressable
      useUnderlay
      onPress={pressCallback}
      style={[
        layoutStyle.flex_direction_row,
        layoutStyle.align_item_center,
        paddingStyle.padding_horizontal_12,
        { height: SIZE_70 },
      ]}
    >
      {avatarItem}
      <View style={[layoutStyle.flex_1, marginStyle.margin_horizontal_12]}>
        <Text>{item.name}</Text>
        <Text color="grey">{secondaryText}</Text>
      </View>
      <Icon
        size={SIZE_24}
        name={selected ? "check-circle-solid" : "circle-outline"}
        color={selected ? LOGO_BLUE : COLOR_2}
      />
    </Pressable>
  );
}
