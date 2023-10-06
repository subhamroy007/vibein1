import { StyleSheet, Text, TextProps } from "react-native";
import { SIZE_13 } from "../constants";

export type AppTextProps = {
  size?: number;
  color?: string;
  weight?: "bold" | "medium" | "regular";
} & TextProps;

export default function AppText({
  size,
  color,
  weight,
  style,
  ...restProps
}: AppTextProps) {
  const textStyle = [style];

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

  textStyle.push({ fontSize: size ? size : SIZE_13 });

  textStyle.push({ color: color ? color : "black" });

  return <Text style={textStyle} {...restProps} ellipsizeMode="tail"></Text>;
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
