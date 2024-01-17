import { useCallback, useEffect } from "react";
import { useAccountTagsRoute } from "../../hooks/account.hooks";
import GridPostList from "../grid-post/GripPostList";

const AccountTagsTab = ({
  username,
  routeId,
}: {
  username: string;
  routeId: string;
}) => {
  const { routeParams, fetch } = useAccountTagsRoute(username, routeId);

  const initRequest = useCallback(() => fetch(true), []);

  if (!routeParams) {
    return null;
  }

  return (
    <GridPostList
      data={routeParams.data.posts}
      initRequest={initRequest}
      paginationRequest={fetch}
      state={routeParams.state}
      showViews
      showPlaceHolder
      enablePagination={!routeParams.data.hasEndReached}
      enableReresh
      gridPressRoute={{
        params: { routeId, username },
        pathname: "/account/[username]/tagged_post_scrollable_feed",
      }}
    />
  );
};

export default AccountTagsTab;
