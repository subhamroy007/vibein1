import { useCallback, useState } from "react";
import { PostPhotoParams } from "../../types/utility.types";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  useWindowDimensions,
} from "react-native";
import { AlbumPhoto } from "./AlbumPhoto";
import { layoutStyle } from "../../styles";
import Animated, { runOnJS } from "react-native-reanimated";
import { COLOR_6, SIZE_42 } from "../../constants";
import Carosol from "../Carosol/Carosol";
import { useSpringAnimation } from "../../hooks/animation.hooks";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Icon from "../Icon";

export type AlbumProps = {
  photos: PostPhotoParams[];
  onDoubleTap: () => void;
  onTap: () => void;
};

export default function Album({ photos, onDoubleTap, onTap }: AlbumProps) {
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

  const singleTapGesture = Gesture.Tap().onStart(() => {
    runOnJS(onTap)();
  });
  const complexGesture = Gesture.Exclusive(doubleTapGesture, singleTapGesture);

  return (
    <GestureDetector gesture={complexGesture}>
      <Animated.View
        style={[
          layoutStyle.align_item_center,
          layoutStyle.justify_content_center,
          layoutStyle.flex_1,
          { aspectRatio: "2/3", width: screenWidth },
        ]}
      >
        {photos.length > 1 ? (
          <>
            <Animated.ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal
              pagingEnabled
              overScrollMode="never"
              onMomentumScrollEnd={onMomentumScrollEndCallback}
              style={[layoutStyle.align_self_stretch, layoutStyle.flex_1]}
            >
              {photos.map((photo, index) => (
                <AlbumPhoto key={photo.url + index} {...photo} />
              ))}
            </Animated.ScrollView>
            <Carosol
              activeIndex={photoIndex}
              length={photos.length}
              style={{ bottom: "3%" }}
            />
          </>
        ) : (
          <AlbumPhoto {...photos[0]} />
        )}
        <Animated.View style={animatedHeartIconStyle}>
          <Icon name="heart-solid" size={SIZE_42} color={COLOR_6} />
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}
