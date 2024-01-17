import { useCallback, useEffect } from "react";
import { useAccountMomentsRoute } from "../../hooks/account.hooks";
import GridPostList from "../grid-post/GripPostList";

const AccountMomentsTab = ({
  username,
  routeId,
}: {
  username: string;
  routeId: string;
}) => {
  const { routeParams, fetch } = useAccountMomentsRoute(username, routeId);

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
      portrait
      showViews
      showPlaceHolder
      enablePagination={!routeParams.data.hasEndReached}
      enableReresh
      gridPressRoute={{
        params: { routeId, username },
        pathname: "/account/[username]/moments_swipable_feed",
      }}
    />
  );
};

export default AccountMomentsTab;
