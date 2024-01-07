import { Image, ImageProps } from "expo-image";
import { useDownloadImage } from "../hooks/utility.hooks";
import { useEffect } from "react";

export type RetryableImageProps = ImageProps & {
  source: string;
  placeholder?: string;
  onLoadStart?: () => void;
  onLoad?: () => void;
  onError?: () => void;
};

export default function RetryableImage({
  source,
  placeholder,
  onLoad,
  onLoadStart,
  onError,
  ...restProps
}: RetryableImageProps) {
  const { urlValue, state } = useDownloadImage(source);

  useEffect(() => {
    switch (state) {
      case "loading":
        if (onLoadStart) {
          onLoadStart();
        }
        break;
      case "success":
        if (onLoad) {
          onLoad();
        }
        break;
      case "failed":
        if (onError) {
          onError();
        }
        break;
    }
  }, [state, onLoad, onLoadStart, onError]);

  return (
    <Image
      {...restProps}
      source={{ uri: urlValue ? urlValue : undefined }}
      placeholder={placeholder}
      contentFit="cover"
    />
  );
}
