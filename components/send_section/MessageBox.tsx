import { ScrollView, View } from "react-native";
import { COLOR_1, SIZE_15, SIZE_42, SIZE_60 } from "../../constants";
import {
  backgroundStyle,
  borderStyle,
  layoutStyle,
  marginStyle,
  paddingStyle,
} from "../../styles";
import PressableIconCircle from "../utility-components/button/PressableIconCircle";
import { TextInput } from "react-native-gesture-handler";
import { useCallback, useRef, useState } from "react";
import { SendSectionItemIdentifier } from "../../types/utility.types";
import Text from "../utility-components/text/Text";
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useKeyboard } from "@react-native-community/hooks";

export type MessageBoxProps = {
  onSend: (text?: string) => void;
  items: SendSectionItemIdentifier[];
  onItemPress: (
    currentItem: SendSectionItemIdentifier,
    select: boolean
  ) => void;
  portalPosition: SharedValue<number>;
};

export default function MessageBox({
  onSend,
  items,
  onItemPress,
  portalPosition,
}: MessageBoxProps) {
  const [messageText, setMessageText] = useState("");

  const { keyboardHeight, keyboardShown } = useKeyboard();

  const trimmedText = useRef("");

  trimmedText.current = messageText.trim();

  const onSendIconPress = useCallback(() => {
    onSend(trimmedText.current === "" ? undefined : trimmedText.current);
  }, [onSend]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: -portalPosition.value,
        },
      ],
      bottom: keyboardShown ? keyboardHeight : 0,
    };
  }, [keyboardHeight, keyboardShown]);

  return (
    <Animated.View
      style={[
        backgroundStyle.background_color_1,
        borderStyle.border_color_2,
        borderStyle.border_top_width_hairline,
        animatedStyle,
      ]}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={paddingStyle.padding_vertical_6}
        contentContainerStyle={paddingStyle.padding_horizontal_6}
        overScrollMode="never"
      >
        {items.map((item) => (
          <Text
            onPress={() => onItemPress(item, false)}
            key={item.id}
            style={[
              paddingStyle.padding_horizontal_18,
              paddingStyle.padding_vertical_9,
              backgroundStyle.background_aqua_green,
              borderStyle.border_radius_24,
              marginStyle.margin_horizontal_3,
            ]}
            color={COLOR_1}
            weight="semi-bold"
            size={SIZE_15}
          >
            {item.name}
          </Text>
        ))}
      </ScrollView>
      <View
        style={[
          { height: SIZE_60 },
          layoutStyle.align_item_center,
          layoutStyle.flex_direction_row,
          paddingStyle.padding_horizontal_18,
          backgroundStyle.background_color_1,
        ]}
      >
        <TextInput
          style={[layoutStyle.flex_1, { fontSize: SIZE_15 }]}
          placeholderTextColor={"grey"}
          placeholder="write a message..."
          onSubmitEditing={onSendIconPress}
          value={messageText}
          onChangeText={setMessageText}
        />
        <PressableIconCircle
          name={"arrow-right"}
          size={SIZE_42}
          solid
          onPress={onSendIconPress}
        />
      </View>
    </Animated.View>
  );
}
