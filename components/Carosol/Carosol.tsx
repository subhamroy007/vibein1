import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { layoutStyle } from "../../styles";
import { CarosolDot } from "./CarosolDot";

export type CarosolProps = {
  length: number;
  activeIndex: number;
  style?: StyleProp<ViewStyle>;
};

export default function Carosol({ length, activeIndex, style }: CarosolProps) {
  const dots = [];

  for (let i = 0; i < length; i++) {
    dots.push(i);
  }

  return (
    <View style={[style, styles.container]}>
      {dots.map((_, index) => (
        <CarosolDot activeIndex={activeIndex} index={index} key={index} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...layoutStyle.align_item_center,
    ...layoutStyle.justify_content_center,
    ...layoutStyle.flex_direction_row,
    ...layoutStyle.position_absolute,
  },
});
