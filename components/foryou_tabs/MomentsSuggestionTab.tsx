import { memo, useEffect } from "react";
import { useForYouMomentsFeed } from "../../hooks/client.hooks";
import FullScreenPostList from "../fullscreen-post/FullScreenPostList";

export type MomentsSuggestionTabProps = {
  focused: boolean;
};

const Component = ({ focused }: MomentsSuggestionTabProps) => {
  const { fetch, forYouMomentsFeedParams } = useForYouMomentsFeed();

  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <FullScreenPostList
      data={forYouMomentsFeedParams.posts}
      onRetry={fetch}
      state={forYouMomentsFeedParams.thunkInfo.state}
      tabFocused={focused}
    />
  );
};

const MomentsSuggestionTab = memo<MomentsSuggestionTabProps>(
  Component,
  (prevProps, nextProps) => prevProps.focused === nextProps.focused
);

export default MomentsSuggestionTab;
