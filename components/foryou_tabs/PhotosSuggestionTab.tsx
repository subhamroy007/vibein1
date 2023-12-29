import { memo, useEffect } from "react";
import { useForYouPhotosFeed } from "../../hooks/client.hooks";
import FullScreenPostList from "../fullscreen-post/FullScreenPostList";

export type PhotosSuggestionTabProps = {
  focused: boolean;
};

const Component = ({ focused }: PhotosSuggestionTabProps) => {
  const { fetch, forYouPhotosFeedParams } = useForYouPhotosFeed();

  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <FullScreenPostList
      data={forYouPhotosFeedParams.posts}
      onRetry={fetch}
      state={forYouPhotosFeedParams.thunkInfo.state}
      tabFocused={focused}
    />
  );
};

const PhotosSuggestionTab = memo<PhotosSuggestionTabProps>(
  Component,
  (prevProps, nextProps) => prevProps.focused === nextProps.focused
);

export default PhotosSuggestionTab;
