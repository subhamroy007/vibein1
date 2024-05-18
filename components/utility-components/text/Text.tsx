import { PureComponent } from "react";
import { StyleSheet, Text as Txt, StyleProp, TextStyle } from "react-native";
import { COLOR_4, SIZE_13 } from "../../../constants";
import Animated from "react-native-reanimated";
import { TextProps } from "../../../types/component.types";

export default class Text extends PureComponent<TextProps> {
  render() {
    const { size, color, weight, numberOfLines, scale, style, ...restProps } =
      this.props;

    const calculatedFontSize = size ? size : SIZE_13;

    const calculatedScale = scale
      ? scale
      : numberOfLines === undefined || numberOfLines === 1
      ? 1.2
      : 1.4;

    const calculatedLineHeight = calculatedFontSize * calculatedScale;

    const calculatedFontColor = color ? color : COLOR_4;

    const text_style: StyleProp<TextStyle> = [
      {
        fontSize: calculatedFontSize,
        lineHeight: calculatedLineHeight,
        color: calculatedFontColor,
      },
      style,
    ];

    switch (weight) {
      case "bold":
        text_style.push(styles.bold);
        break;
      case "regular":
        text_style.push(styles.regular);
        break;
      case "extra-bold":
        text_style.push(styles.extra_bold);
        break;
      case "semi-bold":
        text_style.push(styles.semi_bold);
        break;
      case "light":
        text_style.push(styles.light);
        break;
      case "light_medium":
        text_style.push(styles.light_medium);
        break;
      case "medium":
      default:
        text_style.push(styles.medium);
        break;
    }

    return (
      <Txt
        numberOfLines={
          numberOfLines ? numberOfLines : numberOfLines === 0 ? undefined : 1
        }
        style={text_style}
        {...restProps}
      />
    );
  }
}

const styles = StyleSheet.create({
  bold: {
    // fontFamily: "bold",
    fontWeight: "800",
  },
  light_medium: {
    fontWeight: "500",
  },
  medium: {
    // fontFamily: "medium",
    fontWeight: "600",
  },
  regular: {
    // fontFamily: "regular",
    fontWeight: "400",
  },
  extra_bold: {
    // fontFamily: "extra_bold",
    fontWeight: "900",
  },
  semi_bold: {
    // fontFamily: "semi_bold",
    fontWeight: "700",
  },
  light: {
    // fontFamily: "light",
    fontWeight: "300",
  },
});

export const AnimatedText = Animated.createAnimatedComponent(Text);
