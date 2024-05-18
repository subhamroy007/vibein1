import { PureComponent, ReactNode } from "react";
import Text from "./Text";
import { LINE_WIDTH, LOGO_BLUE, SIZE_30, SIZE_6 } from "../../../constants";
import { LabelProps } from "../../../types/component.types";
import Animated from "react-native-reanimated";
import { StyleProp, TextStyle } from "react-native";

export default class Label extends PureComponent<LabelProps> {
  render(): ReactNode {
    const {
      text,
      size,
      scale,
      style,
      backgroundColor,
      outlineColor,
      outlined,
      outlineWidth,
      keepBackgroundWithOutline,
      width,
      stretch,
      ...restProps
    } = this.props;

    const calculatedSize = size ? size : SIZE_30;

    const calculatedTextColor = outlined ? "black" : "white";

    const calculatedOutlineColor = outlined
      ? outlineColor
        ? outlineColor
        : calculatedTextColor
      : undefined;
    const calculatedOutlineWidth = outlined
      ? outlineWidth
        ? LINE_WIDTH * outlineWidth
        : LINE_WIDTH * 3
      : undefined;

    const calculatedBackgroundColor = backgroundColor
      ? backgroundColor
      : !outlined || keepBackgroundWithOutline
      ? LOGO_BLUE
      : undefined;

    const calculatedTextSize = scale
      ? scale * calculatedSize
      : 0.45 * calculatedSize;

    const label_style: StyleProp<TextStyle> = [
      {
        height: calculatedSize,
        width: width && !stretch ? width : "auto",
        flex: stretch ? stretch : undefined,
        backgroundColor: calculatedBackgroundColor,
        textAlign: "center",
        textAlignVertical: "center",
        borderRadius: SIZE_6,
        borderWidth: calculatedOutlineWidth,
        borderColor: calculatedOutlineColor,
        paddingHorizontal: calculatedSize / 2,
      },
      style,
    ];

    return (
      <Text
        style={label_style}
        color={calculatedTextColor}
        size={calculatedTextSize}
        {...restProps}
      >
        {text}
      </Text>
    );
  }
}

export const AnimatedLabel = Animated.createAnimatedComponent(Label);
