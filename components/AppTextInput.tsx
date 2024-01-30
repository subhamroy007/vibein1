import { useCallback, useRef, useState } from "react";
import {
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
  TextInputProps,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { SIZE_14, SIZE_15 } from "../constants";

export default function AppTextInput(props: TextInputProps) {
  const [inputContentHeight, setInputContentHeight] = useState(0);

  const inputRef = useRef<TextInput>(null);

  const contentSizeChangeCallback = useCallback(
    ({
      nativeEvent: {
        contentSize: { height },
      },
    }: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
      setInputContentHeight(height);
    },
    []
  );

  return (
    <TextInput
      {...props}
      ref={inputRef}
      onContentSizeChange={contentSizeChangeCallback}
      style={[
        props.style,
        {
          fontFamily: "semi_bold",
          fontSize: SIZE_15,
          lineHeight: SIZE_15 * 1.3,
          textAlignVertical: "center",
        },
      ]}
    />
  );
}
