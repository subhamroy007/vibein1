import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import { IconName } from "../../types/component.types";
import {
  backgroundStyle,
  borderStyle,
  layoutStyle,
  marginStyle,
  paddingStyle,
} from "../../styles";
import { Pressable, ScrollView, View } from "react-native";
import Icon from "../Icon";
import { SIZE_120, SIZE_15, SIZE_24 } from "../../constants";
import AppText from "../AppText";

const entering_animation = FadeInDown.duration(200);
const exiting_animation = FadeOutDown.duration(200);

const Options = ({
  options,
  position,
}: {
  options: {
    icon: IconName;
    label: string;
    color?: string;
    callback: () => void;
  }[];
  position: number;
}) => {
  return (
    <Animated.View
      style={[
        {
          width: SIZE_120,
          top: position,
          maxHeight: SIZE_120 * 2,
          overflow: "hidden",
        },
        borderStyle.border_radius_9,
        backgroundStyle.background_color_1,
      ]}
      entering={entering_animation}
      exiting={exiting_animation}
    >
      <ScrollView
        contentContainerStyle={paddingStyle.padding_vertical_6}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
      >
        {options.map((option) => (
          <Pressable
            onPress={option.callback}
            key={option.label}
            style={[
              paddingStyle.padding_horizontal_12,
              paddingStyle.padding_vertical_6,
              layoutStyle.flex_direction_row,
              layoutStyle.align_item_center,
            ]}
          >
            <Icon name={option.icon} color={option.color} size={SIZE_24} />
            <AppText
              color={option.color}
              weight="semi-bold"
              size={SIZE_15}
              style={marginStyle.margin_left_6}
            >
              {option.label}
            </AppText>
          </Pressable>
        ))}
      </ScrollView>
    </Animated.View>
  );
};

export default Options;
