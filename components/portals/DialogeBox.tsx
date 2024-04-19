import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";
import { IconName } from "../../types/component.types";
import {
  backgroundStyle,
  borderStyle,
  layoutStyle,
  marginStyle,
  paddingStyle,
} from "../../styles";
import { TouchableHighlight, View } from "react-native";
import Icon from "../utility-components/icon/Icon";
import Text from "../utility-components/text/Text";
import { DOVE_GREY, SIZE_12, SIZE_16, SIZE_48 } from "../../constants";

export type DialogBoxProps = {
  icon: IconName;
  info: string;
  option1: {
    text: string;
    color?: string;
    callback: () => void;
  };
  option2?: {
    text: string;
    color?: string;
    callback: () => void;
  };
  option3?: {
    text: string;
    color?: string;
    callback: () => void;
  };
};

export default function DialogBox({
  icon,
  info,
  option1,
  option2,
  option3,
}: DialogBoxProps) {
  const options = [option1];
  if (option2) {
    options.push(option2);
  }

  if (option3) {
    options.push(option3);
  }

  return (
    <Animated.View
      entering={ZoomIn.duration(200)}
      exiting={ZoomOut.duration(200)}
      style={[
        backgroundStyle.background_color_1,
        { width: "50%" },
        borderStyle.border_radius_24,
        layoutStyle.overflow_hidden,
      ]}
    >
      <View
        style={[
          layoutStyle.content_center,
          paddingStyle.padding_vertical_18,
          paddingStyle.padding_horizontal_18,
          borderStyle.border_bottom_color_2,
          borderStyle.border_bottom_width_hairline,
        ]}
      >
        <Icon name={icon} />
        <Text numberOfLines={0} color="grey" style={marginStyle.margin_top_12}>
          {info}
        </Text>
      </View>
      {options.map((option, index) => (
        <TouchableHighlight
          key={index}
          onPress={option.callback}
          style={[
            { height: SIZE_48 },
            layoutStyle.content_center,
            paddingStyle.padding_horizontal_24,
          ]}
          underlayColor={DOVE_GREY}
        >
          <Text color={option.color} weight="semi-bold" size={SIZE_16}>
            {option.text}
          </Text>
        </TouchableHighlight>
      ))}
    </Animated.View>
  );
}
