import { StyleSheet, View } from "react-native";
import { backgroundStyle, layoutStyle } from "../../styles";
import { POST_GRID_WIDTH } from "../../constants";

const GridPlaceHolder = () => {
  return (
    <View
      style={[
        backgroundStyle.background_color_1,
        layoutStyle.align_self_stretch,
      ]}
    >
      {["1", "2", "3", "4", "5", "6"].map((item) => (
        <View
          style={[
            layoutStyle.flex_direction_row,
            layoutStyle.justify_content_space_between,
            styles.group_container,
          ]}
          key={item}
        >
          {["1", "2", "3"].map((item) => (
            <View
              style={[
                backgroundStyle.background_color_7,
                styles.grid_placeholder,
              ]}
              key={item}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid_placeholder: {
    width: POST_GRID_WIDTH,
    aspectRatio: "1/1",
  },
  group_container: { marginBottom: 3 * StyleSheet.hairlineWidth },
});

export default GridPlaceHolder;
