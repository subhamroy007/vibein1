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
import { useNavigation } from "expo-router";
import { ReactNode, useCallback } from "react";
import Icon from "./utility-components/icon/Icon";
import Text from "./utility-components/text/Text";

export type HeaderProps = {
  floating?: boolean;
  floatOffset?: SharedValue<number>;
  transparent?: boolean;
  title?: string;
  ItemLeft?: ReactNode;
  ItemRight?: ReactNode;
  ItemMiddle?: ReactNode;
  hideBack?: boolean;
  leftAligned?: boolean;
};

const Header = ({
  floating,
  floatOffset,
  transparent,
  title,
  ItemLeft,
  ItemMiddle,
  ItemRight,
  hideBack,
  leftAligned,
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
          { left: 0, zIndex: 3 },
          layoutStyle.align_item_center,
          layoutStyle.justify_content_center,
          layoutStyle.height_100_percent,
          paddingStyle.padding_horizontal_12,
          transparent ? undefined : backgroundStyle.background_color_1,
          leftAligned ? undefined : layoutStyle.position_absolute,
        ]}
      >
        {ItemLeft ? (
          ItemLeft
        ) : hideBack ? undefined : (
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
          layoutStyle.flex_1,
          leftAligned
            ? layoutStyle.align_item_flex_start
            : layoutStyle.align_item_center,
          layoutStyle.justify_content_center,
        ]}
      >
        {title !== undefined && (
          <Text
            weight="bold"
            size={SIZE_20}
            color={transparent ? COLOR_1 : undefined}
            numberOfLines={0}
          >
            {title}
          </Text>
        )}
        {ItemMiddle && ItemMiddle}
      </View>
      <View
        style={[
          { right: 0, zIndex: 3 },
          layoutStyle.align_item_center,
          layoutStyle.justify_content_center,
          layoutStyle.position_absolute,
          layoutStyle.height_100_percent,
          paddingStyle.padding_horizontal_12,
          transparent ? undefined : backgroundStyle.background_color_1,
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
    ...borderStyle.border_bottom_color_2,
    ...layoutStyle.width_100_percent,
  },
});

export default Header;
