import { Pressable, StyleSheet, View, useWindowDimensions } from "react-native";
import { FileParams } from "../../hooks/utility.hooks";
import { backgroundStyle, layoutStyle } from "../../styles";
import { Image } from "expo-image";
import AppText from "../AppText";
import { COLOR_1, SIZE_24 } from "../../constants";
import Icon from "../Icon";
import { useEffect, useState } from "react";
import * as FileSystem from "expo-file-system";
import { generateVideoThumbnail } from "../../utility";

type FileGridItemProps = FileParams & {
  selectionCount: number;
  multiselect?: boolean;
  onSelect: (file: FileParams) => void;
  portrailt?: boolean;
};

const FileGridItem = (props: FileGridItemProps) => {
  const { width: screenWidth } = useWindowDimensions();

  const [posterUrl, setPosterUrl] = useState<string | null>(null);

  const {
    type,
    uri,
    multiselect,
    selectionCount,
    onSelect,
    portrailt,
    filename,
  } = props;

  const width = Math.abs(screenWidth / 3 - 4 * StyleSheet.hairlineWidth);

  const height = portrailt ? Math.abs((width * 3) / 2) : width;

  useEffect(() => {
    const rand = async () => {
      if (type === "video") {
        const newPosterUrl =
          FileSystem.cacheDirectory + filename.split(".")[0] + "_thumbnail.jpg";
        try {
          await generateVideoThumbnail(uri, newPosterUrl);
          setPosterUrl(newPosterUrl);
        } catch (error) {
          console.log(error);
        }
      }
    };
    rand();
  }, [type, uri, filename]);

  return (
    <Pressable
      style={[{ width, height }, backgroundStyle.background_dove_grey]}
      onPress={() => onSelect(props)}
    >
      <Image
        style={[{ width, height }]}
        contentFit="cover"
        source={type === "photo" ? uri : posterUrl}
      />
      {selectionCount > 0 ? (
        <View
          style={[
            StyleSheet.absoluteFill,
            layoutStyle.justify_content_center,
            layoutStyle.align_item_center,
            backgroundStyle.background_color_3,
          ]}
        >
          {multiselect ? (
            <AppText weight="regular" size={SIZE_24} color={COLOR_1}>
              +{selectionCount}
            </AppText>
          ) : (
            <Icon name="check" color={COLOR_1} />
          )}
        </View>
      ) : undefined}
    </Pressable>
  );
};

export default FileGridItem;
