import { Pressable, StyleSheet, useWindowDimensions } from "react-native";
import { AlbumSelectorParams } from "../../hooks/utility.hooks";
import { backgroundStyle, layoutStyle, paddingStyle } from "../../styles";
import { Image } from "expo-image";
import AppText from "../AppText";
import { COLOR_1, COLOR_15, COLOR_8, SIZE_15, SIZE_16 } from "../../constants";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import * as FileSystem from "expo-file-system";
import { generateVideoThumbnail } from "../../utility";

const AlbumGridItem = ({
  firstFile,
  id,
  noOfFiles,
  title,
  onSelect,
}: AlbumSelectorParams & { onSelect: (albumId: string) => void }) => {
  const { width: screenWidth } = useWindowDimensions();

  const [posterUrl, setPosterUrl] = useState<string | null>(null);

  const width = Math.abs(screenWidth / 2 - 5 * StyleSheet.hairlineWidth);

  useEffect(() => {
    const rand = async () => {
      if (firstFile.type === "video") {
        const newPosterUrl =
          FileSystem.cacheDirectory +
          firstFile.filename.split(".")[0] +
          "_thumbnail.jpg";
        try {
          await generateVideoThumbnail(firstFile.uri, newPosterUrl);
          setPosterUrl(newPosterUrl);
        } catch (error) {
          console.log(error);
        }
      }
    };
    rand();
  }, [firstFile]);

  return (
    <Pressable
      style={[
        { width, aspectRatio: "1/1" },
        backgroundStyle.background_dove_grey,
      ]}
      onPress={() => onSelect(id)}
    >
      <Image
        style={[{ width, height: width }]}
        contentFit="cover"
        source={firstFile.type === "photo" ? firstFile.uri : posterUrl}
      />
      <LinearGradient
        style={[
          StyleSheet.absoluteFill,
          paddingStyle.padding_horizontal_6,
          paddingStyle.padding_vertical_6,
          layoutStyle.justify_content_flex_end,
        ]}
        colors={[COLOR_8, COLOR_15]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        locations={[0, 1]}
      >
        <AppText color={COLOR_1} size={SIZE_15}>
          {noOfFiles}
        </AppText>
        <AppText color={COLOR_1} size={SIZE_16}>
          {title}
        </AppText>
      </LinearGradient>
    </Pressable>
  );
};

export default AlbumGridItem;
