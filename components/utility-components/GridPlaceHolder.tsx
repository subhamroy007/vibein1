import { StyleSheet, View } from "react-native";
import { backgroundStyle, layoutStyle } from "../../styles";
import { GRID_SPACEx3, GRID_WIDTHx3 } from "../../constants";

const GridPlaceHolder = () => {
  return (
    <View
      style={[
        layoutStyle.flex_direction_row,
        layoutStyle.justify_content_space_between,
        layoutStyle.flex_wrap,
        layoutStyle.align_item_center,
      ]}
    >
      {[
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
      ].map((item) => (
        <View
          style={[
            backgroundStyle.background_dove_grey,
            styles.grid_placeholder,
          ]}
          key={item}
        />
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

export default GridPlaceHolder;
