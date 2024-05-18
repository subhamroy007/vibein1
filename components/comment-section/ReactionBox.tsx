import { StyleSheet, View } from "react-native";
import { backgroundStyle, borderStyle, layoutStyle } from "../../styles";
import { SIZE_20, SIZE_45 } from "../../constants";
import Text from "../utility-components/text/Text";

const reactions = ["😍", "😀", "🤩", "🥳", "😂", "😎"];

export type ReactionBoxProps = {
  onReactionPress: (reaction: string) => void;
};

export default function ReactionBox({ onReactionPress }: ReactionBoxProps) {
  return (
    <View style={container_style}>
      {reactions.map((reaction) => (
        <Text
          size={SIZE_20}
          onPress={() => onReactionPress(reaction)}
          key={reaction}
        >
          {reaction}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: SIZE_45,
  },
});

const container_style = [
  styles.container,
  layoutStyle.flex_direction_row,
  layoutStyle.align_item_center,
  layoutStyle.justify_content_space_around,
  borderStyle.border_top_width_hairline,
  borderStyle.border_color_2,
  backgroundStyle.background_color_1,
];
