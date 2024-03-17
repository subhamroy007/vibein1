import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";
import AppText from "./AppText";
import {
  COLOR_1,
  COLOR_14,
  COLOR_16,
  COLOR_17,
  OCEAN_BLUE,
  SIZE_15,
} from "../constants";
import { borderStyle, layoutStyle } from "../styles";

export type ButtonProps = {
  title: string;
  width?: number;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  hideBackground?: boolean;
  titleColor?: string;
  outlineColor?: string;
  size?: number;
  onPress?: () => void;
};

const Button = ({
  title,
  width,
  style,
  backgroundColor,
  hideBackground,
  titleColor,
  outlineColor,
  size,
  onPress,
}: ButtonProps) => {
  const calculatedTitleColor = titleColor
    ? titleColor
    : hideBackground
    ? COLOR_17
    : COLOR_1;

  const calculatedTitleSize = size ? size : SIZE_15;

  const calculatedHeight = Math.abs(calculatedTitleSize * 2.2);

  return (
    <Pressable
      onPress={onPress}
      style={[
        style,
        {
          width: width ? `${width}%` : "40%",
          height: calculatedHeight,
          backgroundColor: hideBackground
            ? undefined
            : backgroundColor
            ? backgroundColor
            : OCEAN_BLUE,
          borderColor: outlineColor
            ? outlineColor
            : hideBackground
            ? calculatedTitleColor
            : undefined,
          borderWidth: hideBackground
            ? 4 * StyleSheet.hairlineWidth
            : undefined,
        },
        layoutStyle.align_item_center,
        layoutStyle.justify_content_center,
        borderStyle.border_radius_6,
      ]}
    >
      <AppText color={calculatedTitleColor} size={SIZE_15} weight="semi-bold">
        {title}
      </AppText>
    </Pressable>
  );
};

export default Button;
