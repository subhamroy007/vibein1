import { IconName } from "../types/component.types";
import { layoutStyle, marginStyle, paddingStyle } from "../styles";
import Icon from "./Icon";
import AppText from "./AppText";
import { SIZE_14, SIZE_16, SIZE_20, SIZE_24 } from "../constants";
import AppTouchableHighlight from "./AppTouchableHighlight";

type OptionProps = {
  text: string;
  icon: IconName;
  color?: string;
  onPress: () => void;
};

export default function Option({ icon, text, onPress, color }: OptionProps) {
  return (
    <AppTouchableHighlight
      onPress={onPress}
      style={[
        layoutStyle.align_item_center,
        layoutStyle.flex_direction_row,
        paddingStyle.padding_vertical_15,
        paddingStyle.padding_horizontal_12,
      ]}
    >
      <Icon name={icon} size={SIZE_24} color={color} />
      <AppText
        size={SIZE_16}
        style={marginStyle.margin_left_12}
        weight="regular"
        color={color}
      >
        {text}
      </AppText>
    </AppTouchableHighlight>
  );
}
