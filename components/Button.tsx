import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";
import AppText from "./AppText";
import { COLOR_1, COLOR_14, COLOR_5, SIZE_15 } from "../constants";
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
}: ButtonProps) => {
  const calculatedTitleColor = titleColor
    ? titleColor
    : hideBackground
    ? COLOR_14
    : COLOR_1;

  const calculatedTitleSize = size ? size : SIZE_15;

  const calculatedHeight = Math.abs(calculatedTitleSize * 2.3);

  return (
    <Pressable
      style={[
        style,
        {
          width: width ? `${width}%` : "40%",
          height: calculatedHeight,
          backgroundColor: hideBackground
            ? undefined
            : backgroundColor
            ? backgroundColor
            : COLOR_5,
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
      <AppText color={calculatedTitleColor} size={SIZE_15}>
        {title}
      </AppText>
    </Pressable>
  );
};

export default Button;
