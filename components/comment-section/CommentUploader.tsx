import { Dispatch, SetStateAction, useCallback, useState } from "react";
import CommentBox from "./CommentBox";
import {
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  TextInputSelectionChangeEventData,
  View,
  ViewStyle,
} from "react-native";
import {
  HASTAG_AND_MENTION_IDENTIFIER_EXPRESSION,
  SIZE_20,
  SIZE_30,
  SIZE_42,
} from "../../constants";
import ReactionBox from "./ReactionBox";
import Animated, {
  SlideInDown,
  SlideInLeft,
  SlideOutDown,
  SlideOutLeft,
} from "react-native-reanimated";
import {
  backgroundStyle,
  borderStyle,
  layoutStyle,
  marginStyle,
  paddingStyle,
} from "../../styles";
import Avatar from "../Avatar";
import { getProfilePictureUrl } from "../../mocks/data";
import Text from "../utility-components/text/Text";
import PressableIcon from "../utility-components/button/PressableIcon";
import { AccountShortInfo } from "../../types/utility.types";

export type CommentUploaderProps = {
  onSubmit: (submittedText: string) => void;
  style?: StyleProp<Animated.AnimateStyle<StyleProp<ViewStyle>>>;
  text: string;
  setText: Dispatch<SetStateAction<string>>;
  replyTo?: AccountShortInfo;
  resetReplyTo?: () => void;
};

export default function CommentUploader({
  onSubmit,
  style,
  setText,
  text,
  replyTo,
  resetReplyTo,
}: CommentUploaderProps) {
  const [searchPhase, setSearchPhase] = useState("");

  const [selection, setSelection] = useState<{ start: number; end: number }>({
    end: 0,
    start: 0,
  });

  const onSelectionChange = useCallback(
    ({
      nativeEvent: { selection: newSelection },
    }: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
      setSelection(newSelection);
      if (newSelection.start === newSelection.end) {
        const processedText = text.substring(0, newSelection.end);
        const phases =
          processedText.match(HASTAG_AND_MENTION_IDENTIFIER_EXPRESSION) || [];
        if (
          phases.length > 0 &&
          phases[phases.length - 1] &&
          processedText.endsWith(phases[phases.length - 1])
        ) {
          setSearchPhase(phases[phases.length - 1]);
        } else {
          setSearchPhase("");
        }
      }
    },
    [text]
  );

  const onReactionPress = useCallback(
    (reaction: string) => {
      setText((value) => {
        const startSection = value.substring(0, selection.start);
        const endSection = value.substring(selection.end);
        return startSection + reaction + endSection;
      });
      setSelection((value) => ({
        start: value.start + 1,
        end: value.start + 1,
      }));
    },
    [selection]
  );

  const onSelect = useCallback(
    (data: string) => {
      setText((value) => {
        const startSection = value.substring(
          0,
          selection.start - searchPhase.length + 1
        );
        const endSection = value.substring(selection.end);
        return startSection + data + " " + endSection;
      });
      setSearchPhase("");
      const newPosition =
        selection.start - searchPhase.length + 1 + data.length + 1;
      setSelection({ end: newPosition, start: newPosition });
    },
    [searchPhase, selection]
  );

  return (
    <Animated.View style={[container_style, style]}>
      {replyTo && (
        <Animated.View
          entering={SlideInLeft.duration(400)}
          style={[
            { height: SIZE_42 },
            layoutStyle.align_item_center,
            paddingStyle.padding_horizontal_12,
            layoutStyle.flex_direction_row,
            backgroundStyle.background_dove_grey,
          ]}
        >
          <Avatar size={SIZE_30} url={replyTo.profilePictureUri} />
          <Text
            style={[layoutStyle.flex_1, marginStyle.margin_horizontal_9]}
            color="grey"
            weight="light_medium"
          >
            Replying to {replyTo.userId}
          </Text>
          <PressableIcon
            name={"close"}
            size={SIZE_20}
            color={"grey"}
            onPress={resetReplyTo}
          />
        </Animated.View>
      )}
      <ReactionBox onReactionPress={onReactionPress} />
      <CommentBox
        setText={setText}
        text={text}
        onSubmit={onSubmit}
        onSelectionChange={onSelectionChange}
        selection={selection}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    bottom: 0,
  },
});

const container_style = [
  styles.container,
  layoutStyle.position_absolute,
  layoutStyle.width_100_percent,
];
