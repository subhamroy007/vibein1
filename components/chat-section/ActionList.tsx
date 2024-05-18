import { Pressable } from "react-native";
import { IconName } from "../../types/component.types";
import {
  backgroundStyle,
  borderStyle,
  layoutStyle,
  marginStyle,
  paddingStyle,
} from "../../styles";
import Icon from "../utility-components/icon/Icon";
import Text from "../utility-components/text/Text";
import { SIZE_14, SIZE_24, SIZE_42 } from "../../constants";
import Animated, {
  ZoomInEasyDown,
  ZoomOutEasyDown,
} from "react-native-reanimated";

type ActionIdentifier = {
  label: string;
  icon?: IconName;
  onPress: () => void;
  color?: string;
};

type ActionsListProps = {
  actions: ActionIdentifier[];
};

export default function ActionsList({ actions }: ActionsListProps) {
  return (
    <Animated.View
      style={[
        { width: "45%" },
        backgroundStyle.background_color_1,
        borderStyle.border_radius_6,
        marginStyle.margin_top_24,
      ]}
      entering={ZoomInEasyDown.duration(300)}
      exiting={ZoomOutEasyDown.duration(300)}
    >
      {actions.map((action, index) => (
        <Pressable
          style={[
            layoutStyle.flex_direction_row,
            layoutStyle.align_item_center,
            paddingStyle.padding_horizontal_12,
            {
              height: SIZE_42,
            },
          ]}
          onPress={action.onPress}
          key={index}
        >
          {action.icon !== undefined && (
            <Icon
              name={action.icon}
              color={action.color}
              style={marginStyle.margin_right_12}
              size={SIZE_24}
            />
          )}
          <Text color={action.color} size={SIZE_14}>
            {action.label}
          </Text>
        </Pressable>
      ))}
    </Animated.View>
  );
}
