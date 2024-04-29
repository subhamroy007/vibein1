import { StyleSheet, View } from "react-native";
import { backgroundStyle, layoutStyle } from "../../styles";
import { GRID_SPACEx3, GRID_WIDTHx3 } from "../../constants";

const gridItems = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
];

const GridSkeliton = () => {
  return (
    <View style={root_container_style}>
      {gridItems.map((item) => (
        <View style={grid_placeholder_style} key={item} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid_placeholder: {
    width: GRID_WIDTHx3,
    aspectRatio: "1/1",
    marginBottom: GRID_SPACEx3,
  },
});

const grid_placeholder_style = [
  styles.grid_placeholder,
  backgroundStyle.background_dove_grey,
];

const root_container_style = [
  layoutStyle.flex_direction_row,
  layoutStyle.justify_content_space_between,
  layoutStyle.flex_wrap,
  layoutStyle.align_item_center,
];

export default GridSkeliton;
