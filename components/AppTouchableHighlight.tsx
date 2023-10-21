import { ReactNode } from "react";
// import { TouchableHighlight } from "react-native-gesture-handler";
import {
  StyleProp,
  TouchableHighlight,
  TouchableHighlightProps,
  ViewStyle,
} from "react-native";
import { COLOR_7 } from "../constants";

export default function AppTouchableHighlight({
  onPress,
  children,
  style,
}: TouchableHighlightProps) {
  return (
    <TouchableHighlight
      underlayColor={COLOR_7}
      activeOpacity={1.0}
      onPress={onPress}
      style={style}
    >
      <>{children}</>
    </TouchableHighlight>
  );
}
