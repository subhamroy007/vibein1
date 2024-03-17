import { StyleSheet, View } from "react-native";
import Icon from "./Icon";
import { IconProps } from "../types/component.types";
import { COLOR_1, COLOR_2, OCEAN_BLUE, COLOR_8, SIZE_48 } from "../constants";
import { layoutStyle } from "../styles";

export type CircleIconProps = IconProps & {
  hasOutline?: boolean;
  hasBackground?: boolean;
  outlineColor?: string;
  backgroundColor?: string;
};

export default function CircleIcon({
  style,
  name,
  color,
  size,
  backgroundColor,
  hasBackground,
  hasOutline,
  outlineColor,
}: CircleIconProps) {
  const iconColor = color ? color : hasBackground ? COLOR_1 : COLOR_2;

  const containerSize = size ? size : SIZE_48;

  const containerBackgroundColor = hasBackground
    ? backgroundColor
      ? backgroundColor
      : OCEAN_BLUE
    : COLOR_8;

  const containerBorderColor = outlineColor ? outlineColor : COLOR_2;

  const defaultOutlineWidth = 4 * StyleSheet.hairlineWidth;

  const containerBorderWidth = hasBackground
    ? hasOutline
      ? defaultOutlineWidth
      : 0
    : defaultOutlineWidth;

  return (
    <View
      style={[
        style,
        layoutStyle.align_item_center,
        layoutStyle.justify_content_center,
        {
          width: containerSize,
          height: containerSize,
          borderRadius: containerSize * 0.5,
          backgroundColor: containerBackgroundColor,
          borderColor: containerBorderColor,
          borderWidth: containerBorderWidth,
        },
      ]}
    >
      <Icon name={name} color={iconColor} size={containerSize * 0.6} />
    </View>
  );
}
