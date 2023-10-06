import { useKeyboard } from "@react-native-community/hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputContentSizeChangeEventData,
  TextInputProps,
} from "react-native";

export default function AppTextInput(props: TextInputProps) {
  const { keyboardShown } = useKeyboard();

  const [inputContentHeight, setInputContentHeight] = useState(0);

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!keyboardShown && inputRef.current && inputRef.current.isFocused()) {
      inputRef.current.blur();
    }
  }, [keyboardShown]);

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
          maxHeight:
            inputContentHeight > 0
              ? Math.min(inputContentHeight, 100)
              : undefined,
        },
      ]}
    />
  );
}
