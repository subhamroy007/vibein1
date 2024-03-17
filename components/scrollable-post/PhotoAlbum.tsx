import { layoutStyle } from "../../styles";
import { AudioWithUri, PhotoWithHash } from "../../types/utility.types";
import { useDeviceLayout } from "../../hooks/utility.hooks";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useCallback, useState } from "react";
import { SIZE_10 } from "../../constants";
import { useMediaMutedState } from "../../hooks/client.hooks";
import Carosol from "../utility-components/media/Carosol";
import PhotoAlbumItem from "./PhotoAlbumItem";

const PhotoAlbum = ({
  photos,
  audio,
  preload,
}: {
  photos: PhotoWithHash[];
  audio?: AudioWithUri;
  preload: boolean;
}) => {
  const [muted] = useMediaMutedState();

  const [focusedIndex, setFocusedIndex] = useState(0);
  const { width } = useDeviceLayout();

  const scrollHandler = useCallback(
    ({
      nativeEvent: { contentOffset },
    }: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currentIndex = Math.round(contentOffset.x / width);
      setFocusedIndex(currentIndex);
    },
    []
  );

  return (
    <>
      {photos.length > 1 ? (
        <View style={layoutStyle.flex_fill}>
          <ScrollView
            onScroll={scrollHandler}
            horizontal
            showsHorizontalScrollIndicator={false}
            overScrollMode="never"
            pagingEnabled
            style={layoutStyle.flex_1}
          >
            {photos.map((photo, index) => (
              <PhotoAlbumItem key={index} {...photo} preload={preload} />
            ))}
          </ScrollView>
          <Carosol
            length={photos.length}
            focusedIndex={focusedIndex}
            style={carosol_style}
          />
        </View>
      ) : (
        <PhotoAlbumItem {...photos[0]} preload={preload} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  carosol: { bottom: SIZE_10 },
});

const carosol_style = [
  styles.carosol,
  layoutStyle.position_absolute,
  layoutStyle.align_self_center,
];

export default PhotoAlbum;
