import Animated, { runOnJS } from "react-native-reanimated";
import { PostPhotoParams } from "../../types/utility.types";
import { layoutStyle } from "../../styles";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { useCallback, useState } from "react";
import { useSpringAnimation } from "../../hooks/animation.hooks";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { AlbumPhoto } from "../Album/AlbumPhoto";
import Icon, { AnimatedIcon } from "../Icon";
import { COLOR_15, COLOR_6, COLOR_8, SIZE_42 } from "../../constants";
import Carosol from "../Carosol/Carosol";
import { LinearGradient } from "expo-linear-gradient";

export type FullScreenAlbumProps = {
  photos: PostPhotoParams[];
  onDoubleTap: () => void;
};

export default function FullScreenAlbum({
  onDoubleTap,
  photos,
}: FullScreenAlbumProps) {
  const { width: screenWidth } = useWindowDimensions();

  const [photoIndex, setphotoIndex] = useState(0);

  const onMomentumScrollEndCallback = useCallback(
    ({
      nativeEvent: { contentOffset },
    }: NativeSyntheticEvent<NativeScrollEvent>) => {
      const newPhotoIndex = Math.floor(
        Math.floor(contentOffset.x) / Math.floor(screenWidth)
      );
      setphotoIndex(newPhotoIndex);
    },
    []
  );

  const {
    animatedStyle: animatedHeartIconStyle,
    startAnimation: startHeartIconAnimation,
  } = useSpringAnimation();

  const doubleTapCallback = useCallback(() => {
    startHeartIconAnimation();
    onDoubleTap();
  }, [startHeartIconAnimation, onDoubleTap]);

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      runOnJS(doubleTapCallback)();
    });

  const singleTapGesture = Gesture.Tap().onStart(() => {});
  const complexGesture = Gesture.Exclusive(doubleTapGesture, singleTapGesture);

  return (
    <GestureDetector gesture={complexGesture}>
      <Animated.View
        style={[
          layoutStyle.align_item_center,
          layoutStyle.justify_content_center,
          layoutStyle.flex_1,
        ]}
      >
        {photos.length > 1 ? (
          <>
            <Animated.ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal
              nestedScrollEnabled
              pagingEnabled
              overScrollMode="never"
              onMomentumScrollEnd={onMomentumScrollEndCallback}
              style={[layoutStyle.align_self_stretch, layoutStyle.flex_1]}
            >
              {photos.map((photo, index) => (
                <AlbumPhoto key={photo.url + index} {...photo} />
              ))}
              <LinearGradient
                style={StyleSheet.absoluteFill}
                colors={[COLOR_8, COLOR_15]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                locations={[0, 1]}
              />
            </Animated.ScrollView>
            <Carosol
              style={{ bottom: "18%" }}
              activeIndex={photoIndex}
              length={photos.length}
            />
          </>
        ) : (
          <AlbumPhoto {...photos[0]} />
        )}

        <AnimatedIcon
          style={animatedHeartIconStyle}
          name="heart-solid"
          size={SIZE_42}
          color={COLOR_6}
        />
      </Animated.View>
    </GestureDetector>
  );
}
