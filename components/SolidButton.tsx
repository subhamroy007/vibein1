import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import AppText from "./AppText";
import { COLOR_1 } from "../constants";
import {
  backgroundStyle,
  borderStyle,
  layoutStyle,
  paddingStyle,
} from "../styles";

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
      style={[style, styles.touchable_container]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <AppText weight="medium" color={COLOR_1} size={size} numberOfLines={1}>
        {title}
      </AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable_container: {
    ...paddingStyle.padding_vertical_8,
    ...paddingStyle.padding_horizontal_16,
    ...layoutStyle.align_item_center,
    ...layoutStyle.justify_content_center,
    ...backgroundStyle.background_color_5,
    ...borderStyle.border_radius_6,
  },
});
