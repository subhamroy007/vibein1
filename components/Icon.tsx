import { createIconSetFromIcoMoon } from "@expo/vector-icons";
import { COLOR_4, SIZE_27 } from "../constants";
import Animated from "react-native-reanimated";
import { Component, ReactNode } from "react";
import { IconProps } from "../types/component.types";

const RawIcon = createIconSetFromIcoMoon(
  require("../assets/fonts/selection.json"),
  "icon_font",
  "icon_font.ttf"
);

export default class Icon extends Component<IconProps> {
  render(): ReactNode {
    const { name, color, size, style } = this.props;

    const iconColor = color ? color : COLOR_4;

    const iconSize = size ? size : SIZE_27;

    return (
      <RawIcon name={name} color={iconColor} size={iconSize} style={style} />
    );
  }
}

export const AnimatedIcon = Animated.createAnimatedComponent(Icon);
