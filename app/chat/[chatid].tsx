import { Stack } from "expo-router";
import AppScreen from "../../components/AppScreen";
import { View } from "react-native";
import { SIZE_12, SIZE_54 } from "../../constants";
import Icon from "../../components/Icon";
import {
  borderStyle,
  layoutStyle,
  marginStyle,
  paddingStyle,
} from "../../styles";
import AppTextInput from "../../components/AppTextInput";
import { ScrollView } from "react-native-gesture-handler";
import { useLayout } from "@react-native-community/hooks";
import Animated, { Layout } from "react-native-reanimated";

const ChatWindow = () => {
  const { height: inputHeight, onLayout } = useLayout();

  return (
    <AppScreen>
      <View style={layoutStyle.flex_1} />
      <Animated.View
        style={[
          {
            minHeight: SIZE_54,
          },
          borderStyle.border_top_width_hairline,
          borderStyle.border_color_2,
          layoutStyle.flex_direction_row,
          layoutStyle.align_item_center,
          paddingStyle.padding_horizontal_12,
        ]}
        layout={Layout.duration(200)}
      >
        <ScrollView
          style={[
            layoutStyle.flex_1,
            marginStyle.margin_right_12,
            {
              height: inputHeight ? Math.min(inputHeight, 200) : SIZE_54,
            },
          ]}
          fadingEdgeLength={18}
          showsVerticalScrollIndicator={false}
        >
          <AppTextInput
            onLayout={onLayout}
            multiline
            autoFocus
            placeholder="write message"
          />
        </ScrollView>

        <Icon name="album" style={marginStyle.margin_right_12} />
        <Icon name="explore" />
      </Animated.View>
    </AppScreen>
  );
};

export default ChatWindow;
