import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";
import AppText from "./AppText";
import { COLOR_1, COLOR_5 } from "../constants";
import { backgroundStyle, layoutStyle, paddingStyle } from "../styles";

export type SolidButtonProps = {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  size?: number;
};

export default function SolidButton({
  onPress,
  title,
  style,
  size,
}: SolidButtonProps) {
  return (
    <TouchableOpacity
      style={[
        {
          borderRadius: 6,
        },
        style,
        paddingStyle.padding_vertical_8,
        paddingStyle.padding_horizontal_16,
        layoutStyle.align_item_center,
        layoutStyle.justify_content_center,
        backgroundStyle.background_color_5,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <AppText weight="medium" color={COLOR_1} size={size} numberOfLines={1}>
        {title}
      </AppText>
    </TouchableOpacity>
  );
}
