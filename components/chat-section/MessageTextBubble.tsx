import { Pressable } from "react-native";
import {
  backgroundStyle,
  borderStyle,
  layoutStyle,
  paddingStyle,
} from "../../styles";
import Text from "../utility-components/text/Text";
import { COLOR_1, COLOR_4, SIZE_14, SIZE_36, SIZE_42 } from "../../constants";

type MessageTextBubbleProps = {
  text: string;
  isSeen: boolean;
  isClientAuthor: boolean;
  onPress: () => void;
};

export default function MessageTextBubble({
  isClientAuthor,
  isSeen,
  text,
  onPress,
}: MessageTextBubbleProps) {
  return (
    <Pressable
      style={[
        paddingStyle.padding_vertical_9,
        paddingStyle.padding_horizontal_18,
        isClientAuthor
          ? isSeen
            ? backgroundStyle.background_ocean_blue
            : backgroundStyle.background_aqua_green
          : backgroundStyle.background_dove_grey,
        borderStyle.border_radius_24,
        {
          minWidth: SIZE_36,
          minHeight: SIZE_36,
        },
        layoutStyle.content_center,
      ]}
      onPress={onPress}
    >
      <Text
        color={isClientAuthor ? COLOR_1 : COLOR_4}
        weight="light_medium"
        size={SIZE_14}
        numberOfLines={0}
      >
        {text}
      </Text>
    </Pressable>
  );
}
