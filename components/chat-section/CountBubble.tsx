import { StyleProp, View, ViewStyle } from "react-native";
import { COLOR_1, SIZE_12, SIZE_18, SIZE_22, SIZE_24 } from "../../constants";
import {
  backgroundStyle,
  layoutStyle,
  paddingStyle,
  text_style,
} from "../../styles";
import Text from "../utility-components/text/Text";

export default function CountBubble({
  count,
  style,
}: {
  count: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Text
      style={[
        { minWidth: SIZE_22, minHeight: SIZE_22, borderRadius: SIZE_22 },
        backgroundStyle.background_logo_blue,
        text_style.text_align_center,
        text_style.text_align_vertical_center,
        paddingStyle.padding_horizontal_6,
        style,
      ]}
      weight="light_medium"
      size={SIZE_12}
      color={COLOR_1}
    >
      {count}
    </Text>
  );
}
