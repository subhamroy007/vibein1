import Header from "../../../components/Header";
import { useGlobalSearchParams } from "expo-router";
import { useAppDispatch, useAppSelector } from "../../../hooks/storeHooks";
import { useCallback, useState } from "react";
import StackContainer from "../../../components/StackContainer";
import SwipablePostList from "../../../components/swipable-post/SwipablePostList";
import { selectAudioMomentPosts } from "../../../store/audio-store/audio.selector";
import { fetchAudioMomentPosts } from "../../../store/audio-store/audio.thunk";

export default function MomentPostSwipableFeed() {
  const { audio_id } = useGlobalSearchParams<{ audio_id: string }>();

  const dispatch = useAppDispatch();

  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);

  const data = useAppSelector((state) =>
    selectAudioMomentPosts(state, audio_id!)
  );

  const onEndReached = useCallback(async () => {
    setError(false);
    setLoading(true);
    dispatch(fetchAudioMomentPosts({ audioId: audio_id! }))
      .unwrap()
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [audio_id!]);

  return (
    <StackContainer dark>
      <SwipablePostList
        data={data?.items}
        hasEndReached={data?.hasEndReached}
        onEndReach={onEndReached}
        isError={isError}
        isLoading={isLoading}
        focused
      />
      <Header title="Posts" floating transparent />
    </StackContainer>
  );
}
