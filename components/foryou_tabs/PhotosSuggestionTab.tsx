import { memo } from "react";
import { usePhotosFeed } from "../../hooks/client.hooks";
import SwipablePostList from "../swipable-post/SwipablePostList";

export type PhotosFeedProps = {
  focused: boolean;
};

const Component = ({ focused }: PhotosFeedProps) => {
  const { fetchPosts, photosFeed, refresh } = usePhotosFeed(focused);

  return (
    <SwipablePostList
      data={photosFeed.data?.items}
      isLoading={photosFeed.isLoading}
      isError={
        photosFeed.error
          ? !photosFeed.failedToRefresh
            ? true
            : photosFeed.data === null
          : false
      }
      onFetch={fetchPosts}
      onRefresh={refresh}
      hasEndReached={photosFeed.data?.hasEndReached}
      focused={focused}
    />
  );
};

const PhotosFeed = memo<PhotosFeedProps>(
  Component,
  (prevProps, nextProps) => prevProps.focused === nextProps.focused
);

export default PhotosFeed;
