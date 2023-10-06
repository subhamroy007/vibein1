import { StyleProp, TextStyle } from "react-native";

import { createIconSetFromIcoMoon } from "@expo/vector-icons";
import { COLOR_4, SIZE_30 } from "../constants";
import Animated from "react-native-reanimated";
import { Component, ReactNode } from "react";
import { IconName } from "../types";

const RawIcon = createIconSetFromIcoMoon(
  require("../assets/fonts/selection.json"),
  "icon_font",
  "icon_font.ttf"
);

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
};

export default class Icon extends Component<IconProps> {
  render(): ReactNode {
    const { name, color, size, style } = this.props;

    const iconColor = color ? color : COLOR_4;

    const iconSize = size ? size : SIZE_30;

    return (
      <RawIcon name={name} color={iconColor} size={iconSize} style={style} />
    );
  }
}

export const AnimatedIcon = Animated.createAnimatedComponent(Icon);

// export default function Icon({ name, color, size, style }: IconProps) {
//   const iconColor = color ? color : COLOR_4;

//   const iconSize = size ? size : SIZE_30;

//   return (
//     <RawIcon name={name} color={iconColor} size={iconSize} style={style} />
//   );
// }
