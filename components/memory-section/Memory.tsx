import { backgroundStyle } from "../../styles";
import { SIZE_54, SIZE_60, windowHeight, windowWidth } from "../../constants";
import Animated, {
  Extrapolate,
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import { selectAccountMemorySection } from "../../store/account-store/account.selectors";
import { useCallback, useEffect, useState } from "react";
import MemoryBody from "./MemoryBody";
import MemoryPlaceHolder from "./MemoryPlaceHolder";
import { fetchAccountMemories } from "../../store/account-store/account.thunks";

export type MemoryProps = {
  userId: string;
  onEndReached: () => void;
  onStartReached: () => void;
  viewDistance: number;
  index: number;
  length: number;
  scrollOffset: SharedValue<number>;
};

export default function Memory({
  userId,
  viewDistance,
  onEndReached,
  onStartReached,
  index,
  length,
  scrollOffset,
}: MemoryProps) {
  const accountSection = useAppSelector((state) =>
    selectAccountMemorySection(state, userId)
  );

  const [focusedMemoryIndex, setFocusedMemoryIndex] = useState(0);

  const [noOfMemories, setNoOfMemories] = useState(0);

  const [pressedIn, setPressedIn] = useState(false);

  const barAnimationValue = useSharedValue(0);
  const isBarAnimating = useSharedValue(false);

  const goToNext = useCallback(() => {
    barAnimationValue.value = 0;
    isBarAnimating.value = false;
    if (focusedMemoryIndex < noOfMemories - 1) {
      setFocusedMemoryIndex(focusedMemoryIndex + 1);
    } else {
      onEndReached();
    }
  }, [noOfMemories, focusedMemoryIndex, onEndReached]);

  const gotoPrevious = useCallback(() => {
    barAnimationValue.value = 0;
    isBarAnimating.value = false;
    if (focusedMemoryIndex > 0) {
      setFocusedMemoryIndex(focusedMemoryIndex - 1);
    } else {
      onStartReached();
    }
  }, [focusedMemoryIndex, onStartReached]);

  useEffect(() => {
    if (accountSection?.memorySection?.data) {
      setNoOfMemories(accountSection.memorySection.data.length);
    }
  }, [accountSection?.memorySection?.data]);

  const onLongPress = useCallback(() => {
    setPressedIn(true);
  }, []);

  const onRelease = useCallback(() => {
    setPressedIn(false);
  }, []);

  let contentHeight = Math.round((windowWidth * 16) / 9);

  const maxMemoryHeight = SIZE_54 + SIZE_60 + contentHeight;

  let memoryHeight = windowHeight;

  if (windowHeight >= maxMemoryHeight) {
    memoryHeight = maxMemoryHeight;
  } else if (
    windowHeight < maxMemoryHeight &&
    windowHeight >= SIZE_60 + contentHeight
  ) {
    memoryHeight = SIZE_60 + contentHeight;
  } else {
    memoryHeight = windowHeight < contentHeight ? windowHeight : contentHeight;
    contentHeight = windowHeight < contentHeight ? windowHeight : contentHeight;
  }

  const onTap = useCallback(
    ({ absoluteX }: { absoluteX: number }) => {
      if (absoluteX <= windowWidth * 0.4) {
        gotoPrevious();
      } else if (absoluteX >= windowWidth * 0.6) {
        goToNext();
      }
    },
    [gotoPrevious, goToNext]
  );

  const tapGesture = Gesture.Tap().onStart(onTap);

  const longPressGesture = Gesture.LongPress()
    .onStart(onLongPress)
    .onTouchesUp(onRelease);

  const combinedGesture = Gesture.Exclusive(tapGesture, longPressGesture);

  const onContentReady = useCallback(() => {}, []);

  const dispatch = useAppDispatch();
  const fetchMemories = useCallback(() => {
    dispatch(fetchAccountMemories({ userId }));
  }, [userId]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            scrollOffset.value,
            [index * windowWidth, (length - 1) * windowWidth],
            [0, (length - 1 - index) * windowWidth],
            Extrapolate.CLAMP
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [index * windowWidth, (index + 1) * windowWidth],
            [1, 0.8],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  }, [index, length]);

  useEffect(() => {
    if (
      viewDistance >= 0 &&
      viewDistance <= 3 &&
      !accountSection?.memorySection?.data
    ) {
      fetchMemories();
    }
  }, [viewDistance, fetchMemories, accountSection?.memorySection?.data]);

  if (!accountSection) {
    return null;
  }

  const { account, memorySection } = accountSection;

  return (
    <GestureDetector gesture={combinedGesture}>
      <Animated.View
        style={[
          { width: windowWidth, height: memoryHeight },
          animatedStyle,
          backgroundStyle.background_color_4,
        ]}
      >
        {(!memorySection || !memorySection.data) && (
          <MemoryPlaceHolder
            account={account}
            callback={fetchMemories}
            height={contentHeight}
            isError={memorySection?.error ? true : false}
            isLoading={memorySection?.isLoading || false}
            useMaxHeight={memoryHeight === maxMemoryHeight}
          />
        )}
        {memorySection?.data && (
          <MemoryBody
            onContentReady={onContentReady}
            contentHeight={contentHeight}
            account={account}
            memoryId={memorySection.data[focusedMemoryIndex].key}
            useMaxHeight={memoryHeight === maxMemoryHeight}
            paused={pressedIn || viewDistance === -1}
            hideWidgets={pressedIn}
            preload={viewDistance <= 3}
            barAnimatedValue={barAnimationValue}
            currentIndex={focusedMemoryIndex}
            noOfMemories={noOfMemories}
            goToNext={goToNext}
            focused={viewDistance <= 0}
          />
        )}
      </Animated.View>
    </GestureDetector>
  );
}
