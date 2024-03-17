import { PureComponent } from "react";
import {
  COLOR_1,
  COLOR_4,
  LINE_WIDTH,
  LOGO_BLUE,
  SIZE_48,
} from "../../../constants";
import Animated from "react-native-reanimated";
import { layoutStyle } from "../../../styles";
import { IconCircleProps } from "../../../types/component.types";
import { StyleProp, TextStyle } from "react-native";
import Icon from "./Icon";

export default class IconCircle extends PureComponent<IconCircleProps> {
  render() {
    const {
      size,
      color,
      name,
      solid,
      scale,
      backgroundColor,
      keepOutlineWithBackground,
      outlineColor,
      outlineWidth,
      style,
      ...restProps
    } = this.props;

    const calculatedCircleSize = size ? size : SIZE_48;

    const calculatedScale = scale ? scale : 0.6;

    const calculatedIconSize = calculatedCircleSize * calculatedScale;

    const calculatedIconColor = color ? color : solid ? COLOR_1 : COLOR_4;

    const calculatedOutlineColor =
      solid && !keepOutlineWithBackground
        ? undefined
        : outlineColor
        ? outlineColor
        : calculatedIconColor;

    const calculatedOutlineWidth =
      solid && !keepOutlineWithBackground
        ? undefined
        : outlineWidth
        ? outlineWidth * LINE_WIDTH
        : LINE_WIDTH * 4;

    const calculatedBackgroundColor = solid
      ? backgroundColor
        ? backgroundColor
        : LOGO_BLUE
      : undefined;

    const circle_style: StyleProp<TextStyle> = [
      layoutStyle.content_center,
      {
        width: calculatedCircleSize,
        height: calculatedCircleSize,
        borderRadius: calculatedCircleSize,
        backgroundColor: calculatedBackgroundColor,
        borderWidth: calculatedOutlineWidth,
        borderColor: calculatedOutlineColor,
        textAlignVertical: "center",
        textAlign: "center",
      },
      style,
    ];

    return (
      <Icon
        name={name}
        size={calculatedIconSize}
        color={calculatedIconColor}
        style={circle_style}
        {...restProps}
      />
    );
  }
}

export const AnimatedIconCircle = Animated.createAnimatedComponent(IconCircle);
