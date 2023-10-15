import { View } from "react-native";
import Icon from "./Icon";
import { IconName } from "../types/component.types";
import { COLOR_1, COLOR_4, COLOR_5, SIZE_36 } from "../constants";
import { layoutStyle } from "../styles";

type CircleSolidIconProps = {
  size?: number;
  iconScale?: number;
  color?: string;
  iconName: IconName;
  iconStyle?: "light" | "dark";
};

export default function CircleSolidIcon({
  color,
  iconScale,
  size,
  iconName,
  iconStyle,
}: CircleSolidIconProps) {
  const containerSize = size ? size : SIZE_36;

  const iconSize = iconScale ? containerSize * iconScale : containerSize * 0.6;

  const containerColor = color ? color : COLOR_5;

  return (
    <View
      style={[
        layoutStyle.align_item_center,
        layoutStyle.justify_content_center,
        {
          width: containerSize,
          height: containerSize,
          borderRadius: containerSize * 0.5,
          backgroundColor: containerColor,
        },
      ]}
    >
      <Icon
        name={iconName}
        size={iconSize}
        color={iconStyle === "dark" ? COLOR_4 : COLOR_1}
      />
    </View>
  );
}
