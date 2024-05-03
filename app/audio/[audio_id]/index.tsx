import { useLocalSearchParams } from "expo-router";
import { useAppDispatch, useAppSelector } from "../../../hooks/storeHooks";
import { selectAudioRouteParams } from "../../../store/audio-store/audio.selector";
import { useCallback, useEffect, useRef, useState } from "react";
import { fetchAudioRoute } from "../../../store/audio-store/audio.thunk";
import StackContainer from "../../../components/StackContainer";
import Header from "../../../components/Header";
import { RefreshControl, ScrollView, View } from "react-native";
import { layoutStyle, marginStyle } from "../../../styles";
import AudioDetails from "../../../components/audio/AudioDetails";
import AudioPostTabs from "../../../components/audio/AudioPostTabs";
import Icon from "../../../components/utility-components/icon/Icon";
import AudioMiniPlayer from "../../../components/audio/AudioMiniPlayer";
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useScrollViewOffset,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import PressableIconCircle from "../../../components/utility-components/button/PressableIconCircle";
import { SIZE_120, SIZE_48, SIZE_60 } from "../../../constants";
import { useLayout } from "@react-native-community/hooks";
import Spinner from "../../../components/utility-components/Spinner";
import { setAudioSaveState } from "../../../store/audio-store/audio.slice";

export default function Index() {
  const { audio_id } = useLocalSearchParams<{ audio_id: string }>();

  const [isLoading, setLoading] = useState(false);

  const [isError, setError] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const { onLayout, height } = useLayout();

  const { onLayout: onScrollLayout, height: scrollHeight } = useLayout();

  const isDataAvailable = useRef(false);

  const scrollOffset = useScrollViewOffset(scrollRef);

  const listScrollEnabled = useSharedValue(false);
  const dragging = useSharedValue(false);

  useDerivedValue(() => {
    if (Math.floor(height - scrollOffset.value) <= 0) {
      listScrollEnabled.value = true;
    } else {
      if (!dragging.value) {
        listScrollEnabled.value = false;
      }
    }
  }, [height]);

  const onScroll = useAnimatedScrollHandler({
    onBeginDrag() {
      dragging.value = true;
    },
    onEndDrag() {
      dragging.value = false;
    },
  });

  const dispatch = useAppDispatch();

  const routeParams = useAppSelector((state) =>
    selectAudioRouteParams(state, audio_id!)
  );

  isDataAvailable.current = routeParams ? true : false;

  const loadData = useCallback(() => {
    setError(false);
    dispatch(fetchAudioRoute({ audioId: audio_id! }))
      .unwrap()
      .catch((error) => {
        console.log("could not fetch audio route ", error);
        if (!isDataAvailable.current) {
          setError(true);
        } else {
          console.log("showing previously fetched data");
        }
      })
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  }, []);

  const onFetch = useCallback(() => {
    setLoading(true);
    loadData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (!isDataAvailable.current) {
      setLoading(true);
    }
    loadData();
  }, []);

  const onSavePress = useCallback(() => {
    dispatch(
      setAudioSaveState({
        audioId: audio_id!,
        value: !routeParams?.audio.isSaved!,
      })
    );
  }, [routeParams?.audio.isSaved]);

  useEffect(() => {
    onFetch();
  }, []);

  const animatedMiniPlayerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY:
            scrollOffset.value >= height
              ? withTiming(SIZE_120, { duration: 300 })
              : withTiming(0, { duration: 300 }),
        },
      ],
    };
  }, [height]);

  const animatedCameraIconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY:
            scrollOffset.value >= height
              ? withTiming(0, { duration: 300 })
              : withTiming(SIZE_120, { duration: 300 }),
        },
      ],
    };
  }, [height]);

  let element = null;
  let buttons = null;
  if (scrollHeight) {
    if (isLoading) {
      element = (
        <Spinner
          style={[
            layoutStyle.align_self_center,
            { marginTop: scrollHeight * 0.4 },
          ]}
        />
      );
    } else if (isError) {
      element = (
        <PressableIconCircle
          color={"grey"}
          name={"retry"}
          style={[
            layoutStyle.align_self_center,
            { marginTop: scrollHeight * 0.4 },
          ]}
        />
      );
    } else if (routeParams) {
      const { audio } = routeParams;
      element = (
        <>
          <AudioDetails
            audio={audio}
            onLayout={onLayout}
            onSavePress={onSavePress}
          />
          <AudioPostTabs
            audioId={audio_id!}
            noOfMoments={audio.noOfMoments}
            noOfPhotos={audio.noOfPhotos}
            onScroll={onScroll}
            nestedScrollEnabled={listScrollEnabled}
          />
        </>
      );
      buttons = height ? (
        <>
          <AudioMiniPlayer
            end={audio.bestSection[1]}
            start={audio.bestSection[0]}
            uri={audio.audioUri}
            style={[
              layoutStyle.position_absolute,
              layoutStyle.align_self_center,
              { bottom: SIZE_48 },
              animatedMiniPlayerStyle,
            ]}
          />
          <PressableIconCircle
            name={"photo-camera-outline"}
            size={SIZE_60}
            style={[
              layoutStyle.position_absolute,
              layoutStyle.align_self_center,
              { bottom: SIZE_48 },
              animatedCameraIconStyle,
            ]}
            solid
            backgroundColor={"white"}
            color={"black"}
            scale={0.5}
          />
        </>
      ) : null;
    }
  }

  return (
    <StackContainer>
      <Header
        title="Audio"
        ItemRight={
          isDataAvailable.current && !isLoading ? (
            <View style={layoutStyle.flex_direction_row}>
              <Icon name="send-outline" style={marginStyle.margin_right_18} />
              <Icon name="info" />
            </View>
          ) : undefined
        }
      />
      <Animated.ScrollView
        onLayout={onScrollLayout}
        ref={scrollRef}
        nestedScrollEnabled
        style={[layoutStyle.flex_1]}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {element}
      </Animated.ScrollView>
      {buttons}
    </StackContainer>
  );
}
