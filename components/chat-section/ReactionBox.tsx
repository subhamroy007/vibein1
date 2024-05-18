import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";
import { SIZE_24, SIZE_48, SIZE_54 } from "../../constants";
import { backgroundStyle, layoutStyle } from "../../styles";
import { Pressable } from "react-native";
import Text from "../utility-components/text/Text";

const reactions = ["😍", "😀", "🤩", "🥳", "😂", "😎"];

type ReactionBoxProps = {
  onPress: (emoji: string) => void;
};

export default function ReactionBox({ onPress }: ReactionBoxProps) {
  return (
    <Animated.View
      style={[
        { height: SIZE_48, width: "85%", borderRadius: SIZE_54 },
        layoutStyle.flex_direction_row,
        layoutStyle.align_item_center,
        layoutStyle.justify_content_space_evenly,
        backgroundStyle.background_color_1,
      ]}
      entering={ZoomIn.duration(300)}
      exiting={ZoomOut.duration(300)}
    >
      {reactions.map((emoji) => (
        <Pressable onPress={() => onPress(emoji)} key={emoji}>
          <Text size={SIZE_24}>{emoji}</Text>
        </Pressable>
      ))}
    </Animated.View>
  );
}
