import { Pressable, PressableProps, StyleSheet } from "react-native";
import AppText from "./AppText";
import { COLOR_1, COLOR_4, COLOR_5, SIZE_13 } from "../constants";
import { layoutStyle } from "../styles";

export type AppButtonProps = {
  text: string;
  size?: number;
  capsuled?: boolean;
  backgroundColor?: string;
  outlineColor?: string;
  hasOutline?: boolean;
  hideBackground?: boolean;
  outlineWidth?: number;
  gap?: number;
} & PressableProps;

export default function AppButton({
  text,
  size,
  capsuled,
  backgroundColor,
  outlineColor,
  hasOutline,
  hideBackground,
  outlineWidth,
  gap,
  style,
  ...restProps
}: AppButtonProps) {
  const calculatedGapScale = gap ? gap : 0.8;

  const gapSize = (size ? size : SIZE_13) * calculatedGapScale;

  const cornerRadius = gapSize * (capsuled ? 3 : 0.5);

  const calculatedBackgroundColor = backgroundColor ? backgroundColor : COLOR_5;

  const calculatedOutlineColor = outlineColor ? outlineColor : COLOR_4;

  const calculatedOutlineWidth =
    (outlineWidth ? outlineWidth : 4) * StyleSheet.hairlineWidth;

  const textColor = hideBackground
    ? outlineColor
      ? outlineColor
      : COLOR_4
    : COLOR_1;

  const calculatedStyleProp = typeof style === "object" ? style : {};

  return (
    <Pressable
      {...restProps}
      style={[
        calculatedStyleProp,
        {
          paddingVertical: gapSize,
          paddingHorizontal: gapSize * 1.5,
          borderRadius: cornerRadius,
          backgroundColor: hideBackground
            ? undefined
            : calculatedBackgroundColor,
          borderColor: calculatedOutlineColor,
          borderWidth: hasOutline ? calculatedOutlineWidth : undefined,
        },
        layoutStyle.align_item_center,
        layoutStyle.justify_content_center,
      ]}
    >
      <AppText size={size} color={textColor}>
        {text}
      </AppText>
    </Pressable>
  );
}
