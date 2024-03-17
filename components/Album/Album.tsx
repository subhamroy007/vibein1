import { useCallback, useState } from "react";
import { OutdatedPhotoParams1 } from "../../types/utility.types";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  useWindowDimensions,
} from "react-native";
import { AlbumPhoto } from "./AlbumPhoto";
import { layoutStyle } from "../../styles";
import Animated from "react-native-reanimated";
import { COLOR_6, SIZE_42 } from "../../constants";
import Carosol from "../Carosol/Carosol";
import { useSpringAnimation } from "../../hooks/animation.hooks";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { AnimatedIcon } from "../Icon";

export type AlbumProps = {
  photos: OutdatedPhotoParams1[];
  onDoubleTap: () => void;
  onTap: () => void;
};

export default function Album({ photos, onDoubleTap, onTap }: AlbumProps) {
  const { width: screenWidth } = useWindowDimensions();

  const [photoIndex, setphotoIndex] = useState(0);

  const scrollHandler = useCallback(
    ({
      nativeEvent: { contentOffset },
    }: NativeSyntheticEvent<NativeScrollEvent>) => {
      const newPhotoIndex = Math.abs(contentOffset.x / screenWidth);
      setphotoIndex(newPhotoIndex);
    },
    []
  );

  const {
    animatedStyle: animatedHeartIconStyle,
    startAnimation: startHeartIconAnimation,
  } = useSpringAnimation();

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      startHeartIconAnimation();
      onDoubleTap();
    })
    .runOnJS(true);

  const singleTapGesture = Gesture.Tap()
    .onStart(() => {
      onTap();
    })
    .runOnJS(true);
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
              onScroll={scrollHandler}
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
        <AnimatedIcon
          name="heart-solid"
          size={SIZE_42}
          color={COLOR_6}
          style={animatedHeartIconStyle}
        />
      </Animated.View>
    </GestureDetector>
  );
}
