import { Image, ImageProps, ImageStyle } from "expo-image";
import { useDownloadImage } from "../hooks/utility.hooks";
import { StyleProp } from "react-native";
import { ThunkState } from "../types/store.types";
import { useEffect } from "react";

export type RetryableImageProps = ImageProps & {
  source: string;
  placeholder?: string;
  onStateChange?: (currentState: ThunkState) => void;
};

export default function RetryableImage({
  source,
  placeholder,
  onStateChange,
  ...restProps
}: RetryableImageProps) {
  const { urlValue, state } = useDownloadImage(source);

  useEffect(() => {
    if (onStateChange) {
      onStateChange(state);
    }
  }, [state, onStateChange]);

  return (
    <Image
      {...restProps}
      source={{ uri: urlValue ? urlValue : undefined }}
      placeholder={placeholder}
      contentFit="cover"
    />
  );
}
