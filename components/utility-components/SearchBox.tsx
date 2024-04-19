import { StyleSheet, View } from "react-native";
import { SIZE_15, SIZE_20, SIZE_42 } from "../../constants";
import {
  backgroundStyle,
  borderStyle,
  layoutStyle,
  marginStyle,
  paddingStyle,
} from "../../styles";
import { TextInput } from "react-native-gesture-handler";
import PressableIcon from "./button/PressableIcon";
import Icon from "./icon/Icon";
import { useCallback } from "react";

export type SearchBoxProps = {
  text: string;
  setText: (value: string) => void;
};

export default function SearchBox({ setText, text }: SearchBoxProps) {
  const resetText = useCallback(() => setText(""), []);

  return (
    <View style={search_box_style}>
      <TextInput
        style={input_style}
        placeholder={"search accounts..."}
        placeholderTextColor={"grey"}
        value={text}
        onChangeText={setText}
      />

      {text === "" ? (
        <Icon
          size={SIZE_20}
          color="grey"
          name="search"
          style={marginStyle.margin_left_6}
        />
      ) : (
        <PressableIcon
          size={SIZE_20}
          color="grey"
          name="close"
          style={marginStyle.margin_left_6}
          onPress={resetText}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  search_box: { width: "85%", height: SIZE_42 },
  input: { fontSize: SIZE_15 },
});

const search_box_style = [
  styles.search_box,
  layoutStyle.flex_direction_row,
  layoutStyle.align_item_center,
  paddingStyle.padding_horizontal_18,
  backgroundStyle.background_dove_grey,
  borderStyle.border_radius_6,
];

const input_style = [styles.input, layoutStyle.flex_1];
