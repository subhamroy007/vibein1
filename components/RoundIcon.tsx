import {
  PixelRatio,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { COLOR_1, COLOR_2, COLOR_5, SIZE_48 } from "../constants";
import { IconName } from "../types/component.types";
import Icon from "./Icon";
import { backgroundStyle, borderStyle, layoutStyle } from "../styles";
import Animated from "react-native-reanimated";

export type RoundIcon = {
  name: IconName;
  size?: number;
  style?: StyleProp<Animated.AnimateStyle<StyleProp<ViewStyle>>>;
  outlineColor?: string;
  iconColor?: string;
  backgroundColor?: string;
  hideOutline?: boolean;
};

export default function RoundIcon({
  name,
  size,
  style,
  outlineColor,
  iconColor,
  backgroundColor,
  hideOutline,
}: RoundIcon) {
  const containerSize = size ? size : SIZE_48;
  const iconSize = PixelRatio.roundToNearestPixel((containerSize * 2) / 3);
  const calculatedIconColor = iconColor
    ? iconColor
    : hideOutline
    ? COLOR_1
    : COLOR_2;
  const outlineWidth = hideOutline
    ? 0
    : Math.max(
        4 * StyleSheet.hairlineWidth,
        PixelRatio.roundToNearestPixel(containerSize / 48)
      );

  const containerStyle: StyleProp<Animated.AnimateStyle<StyleProp<ViewStyle>>> =
    [
      style,
      {
        width: containerSize,
        height: containerSize,
        borderRadius: containerSize / 2,
        borderWidth: hideOutline ? 0 : outlineWidth,
        backgroundColor: backgroundColor
          ? backgroundColor
          : hideOutline
          ? COLOR_5
          : undefined,
        borderColor: hideOutline
          ? undefined
          : outlineColor
          ? outlineColor
          : calculatedIconColor,
      },
      layoutStyle.align_item_center,
      layoutStyle.justify_content_center,
    ];

  return (
    <Animated.View style={containerStyle}>
      <Icon name={name} size={iconSize} color={calculatedIconColor} />
    </Animated.View>
  );
}
