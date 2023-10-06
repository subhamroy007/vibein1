import {
  PixelRatio,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { SIZE_48 } from "../constants";
import { IconName } from "../types";
import Icon from "./Icon";
import { borderStyle, layoutStyle } from "../styles";

export type RoundIcon = {
  name: IconName;
  size?: number;
  style?: StyleProp<ViewStyle>;
  outlineColor?: string;
  iconColor?: string;
};

export default function RoundIcon({
  name,
  size,
  style,
  outlineColor,
  iconColor,
}: RoundIcon) {
  const containerSize = size ? size : SIZE_48;
  const iconSize = PixelRatio.roundToNearestPixel((containerSize * 2) / 3);
  const outlineWidth = Math.max(
    StyleSheet.hairlineWidth,
    PixelRatio.roundToNearestPixel(containerSize / 48)
  );

  const containerStyle: StyleProp<ViewStyle> = [
    style,
    {
      width: containerSize,
      height: containerSize,
      borderRadius: containerSize / 2,
      borderWidth: outlineWidth,
    },
    layoutStyle.align_item_center,
    layoutStyle.justify_content_center,
    borderStyle.border_width_1,
    outlineColor ? { borderColor: outlineColor } : borderStyle.border_color_2,
  ];

  return (
    <View style={containerStyle}>
      <Icon name={name} size={iconSize} color={iconColor} />
    </View>
  );
}
