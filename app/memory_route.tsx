import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import Animated, {
  runOnJS,
  runOnUI,
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Memory from "../components/memory-section/Memory";
import {
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { ItemKey } from "../types/utility.types";
import { windowWidth } from "../constants";
import { useAppSelector } from "../hooks/storeHooks";
import { selectHomeFeedMemoryAccountsSection } from "../store/client/client.selector";
import { backgroundStyle, layoutStyle } from "../styles";

export default function MemoryRoute() {
  const { startingIndex } = useLocalSearchParams<{ startingIndex: string }>();

  const [isMoving, setMoving] = useState(false);

  const [noOfAccounts, setNoOfAccounts] = useState(0);

  const parsedIndex = startingIndex ? parseInt(startingIndex) : 0;

  const scrollOffset = useSharedValue(parsedIndex * windowWidth);

  const router = useRouter();

  const listRef = useAnimatedRef<Animated.FlatList<ItemKey>>();

  const result = useAppSelector((state) =>
    selectHomeFeedMemoryAccountsSection(state)
  );

  useEffect(() => {
    if (result.data) {
      setNoOfAccounts(result.data.items.length);
    }
  }, [result.data]);

  const [focusedIndex, setFocusedIndex] = useState(parsedIndex);

  const gotoNextAccount = useCallback(() => {
    if (focusedIndex < result.data!.items.length - 1) {
      setFocusedIndex(focusedIndex + 1);
      runOnUI(scrollTo)(listRef, (focusedIndex + 1) * windowWidth, 0, true);
    } else {
      router.back();
    }
  }, [focusedIndex, result.data?.items]);

  const gotoPreviousAccount = useCallback(() => {
    if (focusedIndex > 0) {
      runOnUI(scrollTo)(listRef, (focusedIndex - 1) * windowWidth, 0, true);
      setFocusedIndex(focusedIndex - 1);
    } else {
      router.back();
    }
  }, [focusedIndex]);

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<ItemKey>) => {
      const distance = Math.abs(index - focusedIndex);
      return (
        <Memory
          userId={item.key}
          onEndReached={gotoNextAccount}
          onStartReached={gotoPreviousAccount}
          viewDistance={distance === 0 && isMoving ? -1 : distance}
          index={index}
          length={noOfAccounts}
          scrollOffset={scrollOffset}
        />
      );
    },
    [focusedIndex, noOfAccounts, isMoving]
  );

  const onMomentumScrollEnd = useCallback(
    ({
      nativeEvent: { contentOffset },
    }: NativeSyntheticEvent<NativeScrollEvent>) => {
      const newIndex = Math.round(contentOffset.x / windowWidth);
      setMoving(false);
      setFocusedIndex(newIndex);
    },
    []
  );

  const onScroll = useAnimatedScrollHandler({
    onScroll(event) {
      scrollOffset.value = event.contentOffset.x;
    },
    onBeginDrag() {
      runOnJS(setMoving)(true);
    },
  });

  return (
    <SafeAreaView
      style={[layoutStyle.flex_1, backgroundStyle.background_color_4]}
    >
      <Animated.FlatList
        ref={listRef}
        overScrollMode={"never"}
        showsHorizontalScrollIndicator={false}
        horizontal
        pagingEnabled
        renderItem={renderItem}
        data={result.data?.items}
        onMomentumScrollEnd={onMomentumScrollEnd}
        contentOffset={{ y: 0, x: parsedIndex * windowWidth }}
        onScroll={onScroll}
      />
    </SafeAreaView>
  );
}
