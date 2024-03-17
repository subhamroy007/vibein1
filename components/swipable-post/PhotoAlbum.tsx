import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { PostPhotoAdapterParams } from "../../types/store.types";
import { layoutStyle } from "../../styles";
import { useCallback, useState } from "react";
import { useDeviceLayout } from "../../hooks/utility.hooks";
import Carosol from "../utility-components/media/Carosol";
import { useSpringAnimation } from "../../hooks/animation.hooks";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { AnimatedIcon } from "../Icon";
import { COLOR_6, SIZE_120, SIZE_45 } from "../../constants";
import Animated from "react-native-reanimated";
import PhotoAlbumItem from "./PhotoAlbumItem";

export type PhotoAlbumProps = {
  preload: boolean;
  photos: PostPhotoAdapterParams[];
  onDoubleTap: () => void;
};

const PhotoAlbum = ({ onDoubleTap, photos, preload }: PhotoAlbumProps) => {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const { width } = useDeviceLayout();

  const [showTags, setShowTags] = useState(false);

  const [animatedHeartStyle, startHeartAnimation] = useSpringAnimation();

  const scrollHandler = useCallback(
    ({
      nativeEvent: { contentOffset },
    }: NativeSyntheticEvent<NativeScrollEvent>) => {
      setShowTags(false);
      const currentIndex = Math.round(contentOffset.x / width);
      setFocusedIndex(currentIndex);
    },
    []
  );

  const tapCallback = useCallback(() => {
    setShowTags((value) => !value);
  }, []);

  const doubleTapCallback = useCallback(() => {
    startHeartAnimation();
    onDoubleTap();
  }, [onDoubleTap]);

  const tapGesture = Gesture.Tap().onStart(tapCallback).runOnJS(true);
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(doubleTapCallback)
    .runOnJS(true);

  const combinedGesture = Gesture.Exclusive(doubleTapGesture, tapGesture);

  return (
    <GestureDetector gesture={combinedGesture}>
      <Animated.View style={root_container}>
        {photos.length > 1 ? (
          <>
            <ScrollView
              onScroll={scrollHandler}
              showsHorizontalScrollIndicator={false}
              horizontal
              pagingEnabled
              overScrollMode="never"
            >
              {photos.map((photo, index) => (
                <PhotoAlbumItem
                  {...photo}
                  showTags={index === focusedIndex && showTags}
                  autoRetry={preload}
                  key={index}
                />
              ))}
            </ScrollView>
            <Carosol
              focusedIndex={focusedIndex}
              length={photos.length}
              style={carosol_style}
            />
          </>
        ) : (
          <PhotoAlbumItem
            {...photos[0]}
            autoRetry={preload}
            showTags={showTags}
          />
        )}
        <AnimatedIcon
          style={animatedHeartStyle}
          name={"heart-solid"}
          color={COLOR_6}
          size={SIZE_45}
        />
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  carosol: {
    bottom: SIZE_120,
  },
});

const root_container = [layoutStyle.fill, layoutStyle.content_center];
const carosol_style = [layoutStyle.position_absolute, styles.carosol];

export default PhotoAlbum;
