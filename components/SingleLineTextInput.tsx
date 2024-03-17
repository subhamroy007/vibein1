import { StyleSheet, ViewProps } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { SIZE_16 } from "../constants";

type SingleLineTextInputProps = {
  text: string;
  onTextChange: (text: string) => void;
  placeholder: string;
  size?: number;
} & ViewProps;

const SingleLineTextInput = ({
  text,
  onTextChange,
  placeholder,
  size,
  ...restProps
}: SingleLineTextInputProps) => {
  const fontSize = size ? size : SIZE_16;

  return (
    <TextInput
      {...restProps}
      value={text}
      onChangeText={onTextChange}
      placeholder={placeholder}
      placeholderTextColor={"grey"}
      style={[styles.text, { fontSize }]}
    />
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: "medium",
  },
});

export default SingleLineTextInput;
