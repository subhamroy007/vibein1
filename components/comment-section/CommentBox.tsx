import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInputSelectionChangeEventData,
  View,
} from "react-native";
import { SIZE_14, SIZE_15, SIZE_30, SIZE_54 } from "../../constants";
import {
  backgroundStyle,
  layoutStyle,
  marginStyle,
  paddingStyle,
} from "../../styles";
import { useAppSelector } from "../../hooks/storeHooks";
import { selectClientAccountParams } from "../../store/client/client.selector";
import Avatar from "../Avatar";
import { TextInput } from "react-native-gesture-handler";
import Button from "../utility-components/button/Button";
import { useCallback, useRef } from "react";

export type CommentBoxProps = {
  text: string;
  setText: (newText: string) => void;
  onSubmit: (submittedText: string) => void;
  onSelectionChange: (
    e: NativeSyntheticEvent<TextInputSelectionChangeEventData>
  ) => void;
  selection: { start: number; end: number };
};

export default function CommentBox({
  setText,
  text,
  onSubmit,
  selection,
  onSelectionChange,
}: CommentBoxProps) {
  const client = useAppSelector((state) => selectClientAccountParams(state));

  const trimmedText = useRef("");

  trimmedText.current = text.trim();

  const onButtonPress = useCallback(() => {
    onSubmit(trimmedText.current);
    setText("");
  }, [onSubmit]);

  if (!client) return null;

  return (
    <View style={container_style}>
      <Avatar url={client.profilePictureUri} size={SIZE_30} />
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="write comment..."
        style={text_input_style}
        onSelectionChange={onSelectionChange}
        selection={selection}
      />
      {trimmedText.current !== "" ? (
        <Button text={"send"} onPress={onButtonPress} />
      ) : undefined}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: SIZE_54,
  },
});

const container_style = [
  styles.container,
  layoutStyle.flex_direction_row,
  layoutStyle.align_item_center,
  paddingStyle.padding_horizontal_12,
  backgroundStyle.background_color_1,
];

const text_input_style = [
  layoutStyle.flex_1,
  marginStyle.margin_horizontal_12,
  layoutStyle.align_self_stretch,
  { fontSize: SIZE_14 },
];
