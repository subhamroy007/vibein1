import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import {
  backgroundStyle,
  borderStyle,
  layoutStyle,
  marginStyle,
  paddingStyle,
} from "../../styles";
import AppText from "../AppText";
import { SIZE_24 } from "../../constants";

const reaction_emojis = ["😀", "🤯", "😍", "🥶", "🥵", "😭"];

const entering_animation = FadeInDown.duration(200);
const exiting_animation = FadeOutDown.duration(200);

const ReactionBox = ({
  onReact,
  position,
}: {
  onReact: (reactionEmoji: string) => void;
  position: number;
}) => {
  return (
    <Animated.View
      exiting={exiting_animation}
      style={[
        {
          top: position,
        },
        paddingStyle.padding_horizontal_6,
        paddingStyle.padding_vertical_9,
        borderStyle.border_radius_24,
        layoutStyle.flex_direction_row,
        layoutStyle.align_item_center,
        backgroundStyle.background_color_1,
      ]}
    >
      {reaction_emojis.map((reactionEmoji) => (
        <AppText
          size={SIZE_24}
          style={marginStyle.margin_horizontal_6}
          onPress={() => {
            onReact(reactionEmoji);
          }}
          key={reactionEmoji}
        >
          {reactionEmoji}
        </AppText>
      ))}
    </Animated.View>
  );
};

export default ReactionBox;
