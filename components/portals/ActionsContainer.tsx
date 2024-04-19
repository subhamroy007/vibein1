import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";
import {
  backgroundStyle,
  borderStyle,
  layoutStyle,
  paddingStyle,
} from "../../styles";
import Text from "../utility-components/text/Text";
import { DOVE_GREY, SIZE_16, SIZE_48 } from "../../constants";
import { TouchableHighlight } from "react-native";

export type ActionParams = {
  text: string;
  color?: string;
  callback: () => void;
};

export type ActionsContainerProps = {
  actions: ActionParams[];
};

export default function ActionsContainer({ actions }: ActionsContainerProps) {
  return (
    <Animated.View
      entering={ZoomIn.duration(200)}
      exiting={ZoomOut.duration(200)}
      style={[
        backgroundStyle.background_color_1,
        { minWidth: "50%", maxWidth: "80%" },
        borderStyle.border_radius_24,
        layoutStyle.overflow_hidden,
      ]}
    >
      {actions.map((action, index) => (
        <TouchableHighlight
          underlayColor={DOVE_GREY}
          key={index}
          onPress={action.callback}
          style={[
            layoutStyle.content_center,
            paddingStyle.padding_horizontal_24,
            { height: SIZE_48 },
          ]}
        >
          <Text color={action.color} weight="semi-bold" size={SIZE_16}>
            {action.text}
          </Text>
        </TouchableHighlight>
      ))}
    </Animated.View>
  );
}
