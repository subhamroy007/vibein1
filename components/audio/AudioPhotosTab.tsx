import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import { fetchAudioPhotoPosts } from "../../store/audio-store/audio.thunk";
import { useRouter } from "expo-router";
import GridPostList from "../grid-post/GripPostList";
import { selectAudioPhotoPosts } from "../../store/audio-store/audio.selector";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { SharedValue } from "react-native-reanimated";

export default function AudioPhotosTab({
  audioId,
  onScroll,
  nestedScrollEnabled,
}: {
  audioId: string;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  nestedScrollEnabled: SharedValue<boolean>;
}) {
  const data = useAppSelector((state) => selectAudioPhotoPosts(state, audioId));

  const router = useRouter();

  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);

  const dispatch = useAppDispatch();

  const onEndReached = useCallback(async () => {
    setError(false);
    setLoading(true);
    dispatch(fetchAudioPhotoPosts({ audioId }))
      .unwrap()
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [audioId]);

  const onPostPress = useCallback(
    (id: string, index: number) => {
      router.push({
        params: { audio_id: audioId },
        pathname: "/audio/audio_id/photo_posts_swipable_feed",
      });
    },
    [audioId]
  );

  useEffect(() => {
    if (data === null) {
      onEndReached();
    }
  }, [data, onEndReached]);

  return (
    <GridPostList
      data={data?.items}
      onPress={onPostPress}
      onEndReach={onEndReached}
      isError={isError}
      isLoading={isLoading}
      hasEndReached={data?.hasEndReached}
      portrait
      showViews
      onScroll={onScroll}
      nestedScrollingEnabled={nestedScrollEnabled}
    />
  );
}
