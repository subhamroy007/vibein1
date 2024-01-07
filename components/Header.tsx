import { Pressable, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import {
  backgroundStyle,
  borderStyle,
  layoutStyle,
  marginStyle,
  paddingStyle,
} from "../styles";
import { COLOR_1, SIZE_20, SIZE_24, SIZE_54 } from "../constants";
import AppText from "./AppText";
import Icon from "./Icon";
import { useNavigation } from "expo-router";
import { useCallback } from "react";

export type HeaderProps = {
  floating?: boolean;
  transparent?: boolean;
  title?: string;
};

const Header = ({ floating, transparent, title }: HeaderProps) => {
  const navigation = useNavigation();

  const backIconPressCallback = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);

  return (
    <Animated.View
      style={[
        styles.container,
        transparent ? undefined : borderStyle.border_bottom_width_hairline,
        floating ? layoutStyle.position_absolute : undefined,
        transparent ? undefined : backgroundStyle.background_color_1,
      ]}
    >
      <Pressable hitSlop={SIZE_24} onPress={backIconPressCallback}>
        <Icon
          name="arrow-left"
          size={SIZE_24}
          color={transparent ? COLOR_1 : undefined}
        />
      </Pressable>
      {title !== undefined && (
        <AppText
          weight="bold"
          size={SIZE_20}
          style={marginStyle.margin_left_18}
          color={transparent ? COLOR_1 : undefined}
        >
          {title}
        </AppText>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: SIZE_54,
    ...layoutStyle.flex_direction_row,
    ...layoutStyle.align_item_center,
    ...paddingStyle.padding_horizontal_12,
    ...borderStyle.border_bottom_color_2,
    ...layoutStyle.width_100_percent,
  },
});

export default Header;
