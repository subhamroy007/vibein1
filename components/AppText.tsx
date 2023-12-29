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
  weight?: "bold" | "medium" | "regular";
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
      textStyle.push(styles.bold_roboto);
      break;
    case "regular":
      textStyle.push(styles.regular_roboto);
      break;
    case "medium":
    default:
      textStyle.push(styles.medium_roboto);
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
  bold_roboto: {
    fontFamily: "roboto_bold",
  },
  medium_roboto: {
    fontFamily: "roboto_medium",
  },
  regular_roboto: {
    fontFamily: "roboto_regular",
  },
});
