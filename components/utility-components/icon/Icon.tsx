import { PureComponent } from "react";
import { COLOR_4, SIZE_27 } from "../../../constants";
import { IconProps } from "../../../types/component.types";
import Animated from "react-native-reanimated";
import { createIconSetFromIcoMoon } from "@expo/vector-icons";
import { StyleProp, TextStyle } from "react-native";

const RawIcon = createIconSetFromIcoMoon(
  require("../../../assets/fonts/selection.json"),
  "icon_font",
  "icon_font.ttf"
);

export default class Icon extends PureComponent<IconProps> {
  render() {
    const { color, size, ...restprops } = this.props;

    const calculatedColor = color ? color : COLOR_4;

    const calculatedSize = size ? size : SIZE_27;

    return (
      <RawIcon color={calculatedColor} size={calculatedSize} {...restprops} />
    );
  }
}

export const AnimatedIcon = Animated.createAnimatedComponent(Icon);
