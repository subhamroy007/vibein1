import { Pressable, StyleSheet, View } from "react-native";
import { backgroundStyle, borderStyle, layoutStyle } from "../styles";
import { SIZE_20, SIZE_24, SIZE_48 } from "../constants";
import Text from "./utility-components/text/Text";

const emojis = ["❤️", "🔥", "😍", "👌", "😘", "😚"];

export type ReactionBoxProps = {
  onSelect: (emoji: string) => void;
};

export default function ReactionBox({ onSelect }: ReactionBoxProps) {
  return (
    <View style={styles.container}>
      {emojis.map((emoji) => (
        <Pressable
          hitSlop={SIZE_24}
          onPress={() => onSelect(emoji)}
          key={emoji}
        >
          <Text size={SIZE_20}>{emoji}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...layoutStyle.align_item_center,
    ...layoutStyle.flex_direction_row,
    ...layoutStyle.justify_content_space_around,
    ...borderStyle.border_color_2,
    ...borderStyle.border_top_width_hairline,
    ...backgroundStyle.background_color_1,
    height: SIZE_48,
    zIndex: 3,
  },
});
