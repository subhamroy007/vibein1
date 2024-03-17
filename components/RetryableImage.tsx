import { useCallback, useMemo, useState } from "react";
import { backgroundStyle } from "../styles";
import {
  StyleProp,
  Image,
  ImageProps,
  ImageStyle,
  NativeSyntheticEvent,
  ImageErrorEventData,
} from "react-native";

type RetryableImageProps = {
  hideBackground?: boolean;
  retry?: boolean;
  source: string;
  style?: ImageProps["style"];
  resizeMode?: ImageProps["resizeMode"];
  onError?: ImageProps["onError"];
  onLoadStart?: ImageProps["onLoadStart"];
};

export default function RetryableImage({
  source,
  style,
  resizeMode,
  hideBackground,
  retry,
  onError,
  ...restProps
}: RetryableImageProps) {
  const [retryCount, setRetryCount] = useState(false);

  const imageStyle = useMemo<StyleProp<ImageStyle>>(
    () => [
      style,
      hideBackground ? undefined : backgroundStyle.background_dove_grey,
    ],
    [style, hideBackground]
  );

  const errorCallback = useCallback(
    (event: NativeSyntheticEvent<ImageErrorEventData>) => {
      if (retry !== false) {
        setTimeout(() => {
          setRetryCount((prevState) => !prevState);
        }, 1200);
      }
      if (onError) {
        onError(event);
      }
    },
    [onError, retry]
  );

  return (
    <Image
      {...restProps}
      source={{ uri: source }}
      resizeMode={resizeMode ? resizeMode : "cover"}
      style={[imageStyle, { backgroundColor: "green" }]}
      onError={errorCallback}
    />
  );
}
