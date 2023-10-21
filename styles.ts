import { StyleSheet } from "react-native";
import {
  COLOR_1,
  COLOR_13,
  COLOR_2,
  COLOR_3,
  COLOR_4,
  COLOR_5,
  COLOR_6,
  COLOR_7,
  COLOR_9,
  SIZE_1,
  SIZE_12,
  SIZE_15,
  SIZE_16,
  SIZE_18,
  SIZE_20,
  SIZE_24,
  SIZE_3,
  SIZE_36,
  SIZE_4,
  SIZE_42,
  SIZE_48,
  SIZE_6,
  SIZE_8,
  SIZE_9,
  SIZE_90,
} from "./constants";

export const layoutStyle = StyleSheet.create({
  flex_1: {
    flex: 1,
  },
  flex_2: {
    flex: 2,
  },
  align_item_center: {
    alignItems: "center",
  },
  align_item_stretch: {
    alignItems: "stretch",
  },
  align_item_flex_start: {
    alignItems: "flex-start",
  },
  align_item_flex_end: {
    alignItems: "flex-end",
  },
  justify_content_center: {
    justifyContent: "center",
  },
  justify_content_flex_start: {
    justifyContent: "flex-start",
  },
  justify_content_flex_end: {
    justifyContent: "flex-end",
  },
  justify_content_space_between: {
    justifyContent: "space-between",
  },
  justify_content_space_around: {
    justifyContent: "space-around",
  },
  justify_content_space_evenly: {
    justifyContent: "space-evenly",
  },
  flex_direction_row: {
    flexDirection: "row",
  },
  align_self_center: {
    alignSelf: "center",
  },
  align_self_start: {
    alignSelf: "flex-start",
  },
  align_self_stretch: {
    alignSelf: "stretch",
  },
  position_absolute: {
    position: "absolute",
  },
  width_100_percent: {
    width: "100%",
  },
  height_100_percent: {
    height: "100%",
  },
});

export const borderStyle = StyleSheet.create({
  border_bottom_width_1: {
    borderBottomWidth: SIZE_1,
  },
  border_width_1: {
    borderWidth: SIZE_1,
  },
  border_width_hairline: {
    borderWidth: StyleSheet.hairlineWidth,
  },
  border_top_width_hairline: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  border_bottom_width_hairline: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  border_top_radius_12: {
    borderTopLeftRadius: SIZE_12,
    borderTopRightRadius: SIZE_12,
    borderTopEndRadius: SIZE_12,
    borderTopStartRadius: SIZE_12,
  },
  border_bottom_color_2: {
    borderBottomColor: COLOR_2,
  },
  border_color_1: {
    borderColor: COLOR_1,
  },
  border_color_2: {
    borderColor: COLOR_2,
  },
  border_radius_18: {
    borderRadius: SIZE_18,
  },
  border_radius_12: {
    borderRadius: SIZE_12,
  },
  border_radius_9: {
    borderRadius: SIZE_9,
  },
  border_radius_6: {
    borderRadius: SIZE_6,
  },
});

export const backgroundStyle = StyleSheet.create({
  background_color_1: {
    backgroundColor: COLOR_1,
  },
  background_color_2: {
    backgroundColor: COLOR_2,
  },
  background_color_3: {
    backgroundColor: COLOR_3,
  },
  background_color_4: {
    backgroundColor: COLOR_4,
  },
  background_color_5: {
    backgroundColor: COLOR_5,
  },
  background_color_6: {
    backgroundColor: COLOR_6,
  },
  background_color_7: {
    backgroundColor: COLOR_7,
  },
  background_color_9: {
    backgroundColor: COLOR_9,
  },
  background_color_13: {
    backgroundColor: COLOR_13,
  },
});

export const paddingStyle = StyleSheet.create({
  padding_12: {
    padding: SIZE_12,
  },
  padding_horizontal_18: {
    paddingHorizontal: SIZE_18,
  },
  padding_horizontal_16: {
    paddingHorizontal: SIZE_16,
  },
  padding_horizontal_12: {
    paddingHorizontal: SIZE_12,
  },
  padding_horizontal_9: {
    paddingHorizontal: SIZE_9,
  },
  padding_horizontal_6: {
    paddingHorizontal: SIZE_6,
  },
  padding_vertical_18: {
    paddingVertical: SIZE_18,
  },
  padding_vertical_15: {
    paddingVertical: SIZE_15,
  },
  padding_vertical_12: {
    paddingVertical: SIZE_12,
  },
  padding_vertical_9: {
    paddingVertical: SIZE_9,
  },
  padding_vertical_8: {
    paddingVertical: SIZE_8,
  },
  padding_vertical_6: {
    paddingVertical: SIZE_6,
  },
  padding_vertical_3: {
    paddingVertical: SIZE_3,
  },
  padding_bottom_90: {
    paddingBottom: SIZE_90,
  },
  padding_bottom_24: {
    paddingBottom: SIZE_24,
  },
  padding_bottom_18: {
    paddingBottom: SIZE_18,
  },
  padding_bottom_12: {
    paddingBottom: SIZE_12,
  },
  padding_bottom_9: {
    paddingBottom: SIZE_9,
  },
  padding_bottom_6: {
    paddingBottom: SIZE_6,
  },
  padding_top_12: {
    paddingTop: SIZE_12,
  },
  padding_top_9: {
    paddingTop: SIZE_9,
  },
  padding_top_6: {
    paddingTop: SIZE_6,
  },
});

export const marginStyle = StyleSheet.create({
  margin_left_auto: {
    marginLeft: "auto",
  },
  margin_left_48: {
    marginLeft: SIZE_48,
  },
  margin_left_42: {
    marginLeft: SIZE_42,
  },
  margin_left_36: {
    marginLeft: SIZE_36,
  },
  margin_left_24: {
    marginLeft: SIZE_24,
  },
  margin_left_18: {
    marginLeft: SIZE_18,
  },
  margin_left_12: {
    marginLeft: SIZE_12,
  },
  margin_left_9: {
    marginLeft: SIZE_9,
  },
  margin_left_6: {
    marginLeft: SIZE_6,
  },
  margin_right_6: {
    marginRight: SIZE_6,
  },
  margin_right_9: {
    marginRight: SIZE_9,
  },
  margin_right_12: {
    marginRight: SIZE_12,
  },
  margin_right_18: {
    marginRight: SIZE_18,
  },
  margin_horizontal_3: {
    marginHorizontal: SIZE_3,
  },
  margin_right_24: {
    marginRight: SIZE_24,
  },
  margin_horizontal_6: {
    marginHorizontal: SIZE_6,
  },
  margin_horizontal_9: {
    marginHorizontal: SIZE_9,
  },
  margin_horizontal_12: {
    marginHorizontal: SIZE_12,
  },
  margin_top_24: {
    marginTop: SIZE_24,
  },
  margin_top_20: {
    marginTop: SIZE_20,
  },
  margin_top_18: {
    marginTop: SIZE_18,
  },
  margin_top_12: {
    marginTop: SIZE_12,
  },
  margin_top_9: {
    marginTop: SIZE_9,
  },
  margin_top_6: {
    marginTop: SIZE_6,
  },
  margin_top_4: {
    marginTop: SIZE_4,
  },
  margin_top_3: {
    marginTop: SIZE_3,
  },
  margin_bottom_12: {
    marginBottom: SIZE_12,
  },
  margin_bottom_9: {
    marginBottom: SIZE_9,
  },
  margin_bottom_6: {
    marginBottom: SIZE_6,
  },
  margin_bottom_3: {
    marginBottom: SIZE_3,
  },
});
