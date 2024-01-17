import { useCallback, useEffect } from "react";
import { useAccountPhotosRoute } from "../../hooks/account.hooks";
import GridPostList from "../grid-post/GripPostList";

const AccountPhotosTab = ({
  username,
  routeId,
}: {
  username: string;
  routeId: string;
}) => {
  const { routeParams, fetch } = useAccountPhotosRoute(username, routeId);

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
        pathname: "/account/[username]/photos_swipable_feed",
      }}
    />
  );
};

export default AccountPhotosTab;
