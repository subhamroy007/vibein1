import { memo, useCallback } from "react";
import { useForYouPhotosFeed } from "../../hooks/client.hooks";
import FullScreenPostList from "../fullscreen-post/FullScreenPostList";

export type PhotosSuggestionTabProps = {
  focused: boolean;
};

const Component = ({ focused }: PhotosSuggestionTabProps) => {
  const { fetch, forYouPhotosFeedParams } = useForYouPhotosFeed();

  const initRequest = useCallback(() => fetch(true), []);

  return (
    <FullScreenPostList
      data={forYouPhotosFeedParams.data.feed}
      enablePagination
      enableReresh
      initRequest={initRequest}
      paginationRequest={fetch}
      state={forYouPhotosFeedParams.state}
      tabFocused={focused}
    />
  );
};

const PhotosSuggestionTab = memo<PhotosSuggestionTabProps>(
  Component,
  (prevProps, nextProps) => prevProps.focused === nextProps.focused
);

export default PhotosSuggestionTab;
