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
import { SendSectionItemSelectorParams } from "../../types/selector.types";
import { SendSectionItemIdentifier } from "../../types/utility.types";

export type SendListItemProps = {
  selected: boolean;
  onPress: (item: SendSectionItemIdentifier, select: boolean) => void;
} & SendSectionItemSelectorParams;

export default function SendListItem({
  onPress,
  pictureUri,
  secondaryText,
  selected,
  ...item
}: SendListItemProps) {
  const pressCallback = useCallback(() => {
    onPress(item, !selected);
  }, [item, onPress, selected]);

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
      {typeof pictureUri === "string" ? (
        <Avatar size={SIZE_48} url={pictureUri} />
      ) : (
        <View style={{ width: SIZE_48, aspectRatio: 1 }}>
          <Avatar
            size={SIZE_30}
            url={pictureUri[0]}
            style={[layoutStyle.position_absolute, { top: 3, right: 3 }]}
          />
          <Avatar
            size={SIZE_30}
            url={pictureUri[1]}
            style={[layoutStyle.position_absolute, { bottom: 3, left: 3 }]}
          />
        </View>
      )}
      <View style={[layoutStyle.flex_1, marginStyle.margin_horizontal_12]}>
        <Text weight="semi-bold">{item.name}</Text>
        <Text weight="semi-bold" color="grey">
          {secondaryText}
        </Text>
      </View>
      <Icon
        size={SIZE_24}
        name={selected ? "check-circle-solid" : "circle-outline"}
        color={selected ? LOGO_BLUE : COLOR_2}
      />
    </Pressable>
  );
}
