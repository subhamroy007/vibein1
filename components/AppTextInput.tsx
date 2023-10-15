import { useCallback, useRef, useState } from "react";
import {
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
  TextInputProps,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";

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
      numberOfLines={props.multiline ? 1 : undefined}
      style={[
        props.style,
        {
          maxHeight:
            inputContentHeight > 0
              ? Math.min(inputContentHeight, 100)
              : undefined,
        },
      ]}
    />
  );
}
