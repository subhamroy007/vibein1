import {
  NativeSyntheticEvent,
  TextInputSelectionChangeEventData,
  View,
} from "react-native";
import { SIZE_15, SIZE_54 } from "../../constants";
import {
  backgroundStyle,
  borderStyle,
  layoutStyle,
  marginStyle,
  paddingStyle,
} from "../../styles";
import { useAppSelector } from "../../hooks/storeHooks";
import { selectClientAccountParams } from "../../store/client/client.selector";
import Avatar from "../Avatar";
import { TextInput } from "react-native-gesture-handler";
import Button from "../utility-components/button/Button";
import { useCallback } from "react";

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

  const trimmedText = text.trim();

  const onButtonPress = useCallback(() => {
    onSubmit(trimmedText);
    setText("");
  }, [onSubmit, trimmedText]);

  if (!client) return null;

  return (
    <View
      style={[
        { minHeight: SIZE_54 },
        layoutStyle.flex_direction_row,
        layoutStyle.align_item_flex_start,
        paddingStyle.padding_horizontal_12,
        backgroundStyle.background_color_1,
      ]}
    >
      <Avatar url={client.profilePictureUri} style={marginStyle.margin_top_9} />
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="write comment..."
        style={[
          layoutStyle.flex_1,
          marginStyle.margin_horizontal_12,
          layoutStyle.align_self_stretch,
          { fontSize: SIZE_15, fontFamily: "medium" },
        ]}
        multiline
        onSelectionChange={onSelectionChange}
        selection={selection}
      />
      {trimmedText !== "" ? (
        <Button
          text={"send"}
          style={marginStyle.margin_top_12}
          onPress={onButtonPress}
        />
      ) : undefined}
    </View>
  );
}
