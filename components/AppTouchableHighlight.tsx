import { TouchableHighlight, TouchableHighlightProps } from "react-native";
import { COLOR_7 } from "../constants";

export default function AppTouchableHighlight(props: TouchableHighlightProps) {
  return (
    <TouchableHighlight {...props} underlayColor={COLOR_7} activeOpacity={1.0}>
      <>{props.children}</>
    </TouchableHighlight>
  );
}
