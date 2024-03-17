import { memo } from "react";
import { useMomentsFeed } from "../../hooks/client.hooks";
import SwipablePostList from "../swipable-post/SwipablePostList";

export type MomentsFeedProps = {
  focused: boolean;
};

const Component = ({ focused }: MomentsFeedProps) => {
  const { fetchPosts, momentsFeed, refresh } = useMomentsFeed(focused);
  return (
    <SwipablePostList
      data={momentsFeed.data?.items}
      isLoading={momentsFeed.isLoading}
      isError={
        momentsFeed.error
          ? !momentsFeed.failedToRefresh
            ? true
            : momentsFeed.data === null
          : false
      }
      onFetch={fetchPosts}
      onRefresh={refresh}
      hasEndReached={momentsFeed.data?.hasEndReached}
      focused={focused}
    />
  );
};

const MomentsFeed = memo<MomentsFeedProps>(
  Component,
  (prevProps, nextProps) => prevProps.focused === nextProps.focused
);

export default MomentsFeed;
