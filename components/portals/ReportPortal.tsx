import { useCallback, useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Text from "../utility-components/text/Text";
import { SIZE_14, SIZE_15, SIZE_16, SIZE_36, SIZE_40 } from "../../constants";
import {
  backgroundStyle,
  borderStyle,
  layoutStyle,
  marginStyle,
  paddingStyle,
  text_style,
} from "../../styles";
import Button from "../utility-components/button/Button";
import SwipeUpPortal from "./SwipeUpPortal";
import Pressable from "../utility-components/button/Pressable";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { TextInput } from "react-native-gesture-handler";

export type ReportPortalProps = {
  onDismiss: () => void;
  onSubmit: (reason: string, description?: string) => void;
  reasons: string[];
  info: string;
};

export default function ReportPortal({
  onDismiss,
  onSubmit,
  info,
  reasons,
}: ReportPortalProps) {
  const [selelctedReason, setSelectedReason] = useState<string | null>(null);

  const [reportDescription, setReportDescription] = useState("");

  const onSubmitButtonPress = useCallback(() => {
    onSubmit(
      selelctedReason!,
      reportDescription === "" ? undefined : reportDescription
    );
    onDismiss();
  }, [onSubmit, selelctedReason, reportDescription, onDismiss]);

  const onSubmitAndBlockButtonPress = useCallback(() => {
    onSubmit(
      selelctedReason!,
      reportDescription === "" ? undefined : reportDescription
    );
    onDismiss();
  }, [onSubmit, selelctedReason, reportDescription, onDismiss]);

  const position = useSharedValue(0);

  const buttonsContainerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: -position.value,
        },
      ],
    };
  });

  return (
    <KeyboardAvoidingView behavior="height">
      <SwipeUpPortal
        partialOpenThreshold={0.4}
        useMaxHeight
        onDismiss={onDismiss}
        title="Report"
        position={position}
      >
        {!selelctedReason ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            overScrollMode="never"
          >
            <Text
              size={SIZE_14}
              color="grey"
              numberOfLines={0}
              style={info_text_style}
            >
              {info}
            </Text>
            {reasons.map((reason) => (
              <Pressable
                key={reason}
                onPress={() => {
                  setSelectedReason(reason);
                }}
                useUnderlay
                style={reason_container_style}
              >
                <Text size={SIZE_16}>{reason}</Text>
              </Pressable>
            ))}
          </ScrollView>
        ) : (
          <View style={buttons_and_input_container_style}>
            <View style={paddingStyle.padding_12}>
              <TextInput
                maxLength={200}
                value={reportDescription}
                onChangeText={setReportDescription}
                style={text_input_style}
                multiline
                placeholder="write your concerns..."
              />
              <Text color="grey" style={marginStyle.margin_top_6}>
                {reportDescription.length}/200
              </Text>
            </View>

            <Animated.View
              style={[buttonsContainerAnimatedStyle, buttons_container_style]}
            >
              <Pressable
                style={report_and_block_button_style}
                useUnderlay
                onPress={onSubmitAndBlockButtonPress}
              >
                <Text size={SIZE_15} weight="semi-bold">
                  Report and Block
                </Text>
              </Pressable>

              <Button
                style={marginStyle.margin_top_12}
                animateOnPress
                width={"100%"}
                text="Submit Report"
                size={SIZE_36}
                scale={0.4}
                onPress={onSubmitButtonPress}
              />
            </Animated.View>
          </View>
        )}
      </SwipeUpPortal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  reason_container: {
    height: SIZE_40,
  },
  text_input: {
    aspectRatio: 3 / 2,
    fontSize: SIZE_15,
    fontFamily: "medium",
  },
});

const info_text_style = [marginStyle.margin_12, text_style.text_align_center];

const reason_container_style = [
  styles.reason_container,
  paddingStyle.padding_horizontal_12,
  layoutStyle.justify_content_center,
  layoutStyle.align_item_flex_start,
];

const buttons_and_input_container_style = [
  layoutStyle.flex_fill,
  layoutStyle.justify_content_space_between,
];

const text_input_style = [
  backgroundStyle.background_dove_grey,
  layoutStyle.align_self_center,
  paddingStyle.padding_12,
  layoutStyle.width_100_percent,
  text_style.text_align_vertical_top,
  styles.text_input,
];

const buttons_container_style = [
  backgroundStyle.background_color_1,
  borderStyle.border_top_width_hairline,
  borderStyle.border_color_2,
  paddingStyle.padding_12,
];

const report_and_block_button_style = [
  layoutStyle.width_100_percent,
  styles.reason_container,
  layoutStyle.content_center,
  paddingStyle.padding_horizontal_12,
];
