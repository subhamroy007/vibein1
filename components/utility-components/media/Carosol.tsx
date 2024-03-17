import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import {
  backgroundStyle,
  borderStyle,
  layoutStyle,
  marginStyle,
} from "../../../styles";
import { SIZE_4 } from "../../../constants";
import { memo } from "react";
import { shallowEqual } from "react-redux";

export type CarosolProps = {
  length: number;
  focusedIndex: number;
  style?: StyleProp<ViewStyle>;
};

const Carosol = ({ focusedIndex, length, style }: CarosolProps) => {
  const dots = [];
  for (let i = 0; i < length; i++) {
    dots.push(
      <View
        key={i}
        style={[
          dot_style,
          i === focusedIndex
            ? backgroundStyle.background_logo_blue
            : backgroundStyle.background_color_1,
        ]}
      />
    );
  }

  return <View style={[style, layoutStyle.flex_direction_row]}>{dots}</View>;
};

const styles = StyleSheet.create({
  dot: { width: SIZE_4, height: SIZE_4 },
});

const dot_style = [
  styles.dot,
  borderStyle.border_radius_6,
  marginStyle.margin_horizontal_3,
];

export default memo<CarosolProps>(Carosol, (prev, next) => {
  return shallowEqual(prev, next);
});
