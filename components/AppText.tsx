import {
  PixelRatio,
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
} from "react-native";
import { COLOR_4, SIZE_13 } from "../constants";

export type AppTextProps = {
  size?: number;
  color?: string;
  weight?: "bold" | "medium" | "regular" | "semi-bold" | "extra-bold" | "light";
  isMultiline?: boolean;
} & TextProps;

export default function AppText({
  size,
  color,
  weight,
  isMultiline,
  style,
  ...restProps
}: AppTextProps) {
  const textStyle: StyleProp<TextStyle> = [];

  switch (weight) {
    case "bold":
      textStyle.push(styles.bold);
      break;
    case "regular":
      textStyle.push(styles.regular);
      break;
    case "extra-bold":
      textStyle.push(styles.extra_bold);
      break;
    case "semi-bold":
      textStyle.push(styles.semi_bold);
      break;
    case "light":
      textStyle.push(styles.light);
      break;
    case "medium":
    default:
      textStyle.push(styles.medium);
      break;
  }

  const textSize = size ? size : SIZE_13;

  const textHeight = isMultiline
    ? PixelRatio.roundToNearestPixel(1.5 * textSize)
    : textSize;

  textStyle.push({
    fontSize: textSize,
    lineHeight: textHeight,
    color: color ? color : COLOR_4,
  });

  textStyle.push(style);

  return (
    <Text
      ellipsizeMode="tail"
      numberOfLines={isMultiline ? undefined : 1}
      style={textStyle}
      {...restProps}
    />
  );
}

const styles = StyleSheet.create({
  bold: {
    fontFamily: "bold",
  },
  medium: {
    fontFamily: "medium",
  },
  regular: {
    fontFamily: "regular",
  },
  extra_bold: {
    fontFamily: "extra_bold",
  },
  semi_bold: {
    fontFamily: "semi_bold",
  },
  light: {
    fontFamily: "light",
  },
});
