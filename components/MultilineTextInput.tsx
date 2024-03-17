import { ScrollView, StyleSheet, ViewProps } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { SIZE_16 } from "../constants";

type MultilineTextInputProps = {
  text: string;
  onTextChange: (text: string) => void;
  placeholder: string;
  size?: number;
} & ViewProps;

const MultilineTextInput = ({
  text,
  onTextChange,
  placeholder,
  size,
  ...restProps
}: MultilineTextInputProps) => {
  const fontSize = size ? size : SIZE_16;

  return (
    <ScrollView {...restProps} overScrollMode="never">
      <TextInput
        value={text}
        onChangeText={onTextChange}
        placeholder={placeholder}
        style={[styles.text, { fontSize }]}
        placeholderTextColor={"grey"}
        multiline
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: "medium",
  },
});

export default MultilineTextInput;
