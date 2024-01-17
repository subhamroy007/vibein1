import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import {
  backgroundStyle,
  borderStyle,
  layoutStyle,
  paddingStyle,
} from "../styles";
import { COLOR_1, SIZE_18, SIZE_20, SIZE_24, SIZE_54 } from "../constants";
import AppText from "./AppText";
import Icon from "./Icon";
import { useNavigation } from "expo-router";
import { ReactNode, useCallback } from "react";

export type HeaderProps = {
  floating?: boolean;
  floatOffset?: SharedValue<number>;
  transparent?: boolean;
  title?: string;
  ItemLeft?: ReactNode;
  ItemRight?: ReactNode;
  ItemMiddle?: ReactNode;
};

const Header = ({
  floating,
  floatOffset,
  transparent,
  title,
  ItemLeft,
  ItemMiddle,
  ItemRight,
}: HeaderProps) => {
  const navigation = useNavigation();

  const backIconPressCallback = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: floatOffset ? -floatOffset.value : 0 }],
    };
  }, []);

  return (
    <Animated.View
      style={[
        animatedStyle,
        styles.container,
        transparent ? undefined : borderStyle.border_bottom_width_hairline,
        floating ? layoutStyle.position_absolute : undefined,
        transparent ? undefined : backgroundStyle.background_color_1,
      ]}
    >
      <View
        style={[
          { width: "20%" },
          layoutStyle.align_item_flex_start,
          layoutStyle.justify_content_center,
        ]}
      >
        {ItemLeft ? (
          ItemLeft
        ) : (
          <Pressable hitSlop={SIZE_24} onPress={backIconPressCallback}>
            <Icon
              name="arrow-left"
              size={SIZE_24}
              color={transparent ? COLOR_1 : undefined}
            />
          </Pressable>
        )}
      </View>
      <View
        style={[
          { width: "60%" },
          layoutStyle.align_item_center,
          layoutStyle.justify_content_center,
        ]}
      >
        {title !== undefined && (
          <AppText
            weight="bold"
            size={SIZE_18}
            color={transparent ? COLOR_1 : undefined}
            isMultiline
          >
            {title}
          </AppText>
        )}
        {ItemMiddle && ItemMiddle}
      </View>
      <View
        style={[
          { width: "20%" },
          layoutStyle.align_item_flex_end,
          layoutStyle.justify_content_center,
        ]}
      >
        {ItemRight && ItemRight}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: SIZE_54,
    ...layoutStyle.flex_direction_row,
    ...paddingStyle.padding_horizontal_12,
    ...borderStyle.border_bottom_color_2,
    ...layoutStyle.width_100_percent,
  },
});

export default Header;
