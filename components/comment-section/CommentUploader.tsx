import { useCallback, useEffect, useRef, useState } from "react";
import CommentBox from "./CommentBox";
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInputSelectionChangeEventData,
  View,
} from "react-native";
import { HASTAG_AND_MENTION_IDENTIFIER_EXPRESSION } from "../../constants";
import ReactionBox from "./ReactionBox";
import SearchSection from "./SearchSection";
import { SafeAreaView } from "react-native-safe-area-context";
import { layoutStyle } from "../../styles";

export type CommentUploaderProps = {
  onSubmit: (submittedText: string) => void;
};

export default function CommentUploader({ onSubmit }: CommentUploaderProps) {
  const [text, setText] = useState("");

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
    <View
      style={[
        layoutStyle.justify_content_flex_end,
        layoutStyle.position_absolute,
        layoutStyle.width_100_percent,
        {
          bottom: 0,
        },
        searchPhase !== "" ? layoutStyle.height_100_percent : undefined,
      ]}
    >
      {searchPhase !== "" ? (
        <SearchSection searchPhase={searchPhase} onSelect={onSelect} />
      ) : (
        <ReactionBox onReactionPress={onReactionPress} />
      )}

      <CommentBox
        setText={setText}
        text={text}
        onSubmit={onSubmit}
        onSelectionChange={onSelectionChange}
        selection={selection}
      />
    </View>
  );
}
