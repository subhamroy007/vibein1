import { memo, useCallback } from "react";
import { useForYouMomentsFeed } from "../../hooks/client.hooks";
import FullScreenPostList from "../fullscreen-post/FullScreenPostList";

export type MomentsSuggestionTabProps = {
  focused: boolean;
};

const Component = ({ focused }: MomentsSuggestionTabProps) => {
  const { fetch, forYouMomentsFeedParams } = useForYouMomentsFeed();

  const initRequest = useCallback(() => fetch(true), []);
  return (
    <FullScreenPostList
      data={forYouMomentsFeedParams.data.feed}
      enablePagination
      enableReresh
      initRequest={initRequest}
      paginationRequest={fetch}
      state={forYouMomentsFeedParams.state}
      tabFocused={focused}
    />
  );
};

const MomentsSuggestionTab = memo<MomentsSuggestionTabProps>(
  Component,
  (prevProps, nextProps) => prevProps.focused === nextProps.focused
);

export default MomentsSuggestionTab;
