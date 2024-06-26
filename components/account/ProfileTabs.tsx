import { memo, useCallback, useState } from "react";
import { Route } from "react-native-tab-view";
import AccountAllPostsTab from "../account-tabs/AccountAllPostsTab";
import AccountPhotosTab from "../account-tabs/AccountPhotosTab";
import AccountMomentsTab from "../account-tabs/AccountMomentsTab";
import AccountTaggedPostsTab from "../account-tabs/AccountTagsTab";
import { SIZE_54, windowHeight, windowWidth } from "../../constants";
import { Layout } from "react-native-tab-view/lib/typescript/src/types";
import { shallowEqual } from "react-redux";
import TabView from "../swipable-tab/TabView";
import { IconName } from "../../types/component.types";
import { SharedValue } from "react-native-reanimated";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";

export type ProfileTabsProps = {
  hasPhotos: boolean;
  hasMoments: boolean;
  userId: string;
  nestedScrollEnabled: SharedValue<boolean>;
  onNestedScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
};

const ProfileTabs = ({
  hasMoments,
  hasPhotos,
  userId,
  nestedScrollEnabled,
  onNestedScroll,
}: ProfileTabsProps) => {
  const [index, setIndex] = useState(0);

  const renderTabsCallback = useCallback(
    (route: Route, layout: Layout) => {
      switch (route.key) {
        case "home-route":
          return (
            <AccountAllPostsTab
              userId={userId}
              key={route.key}
              layout={layout}
              nestedScrollEnabled={nestedScrollEnabled}
              onNestedScroll={onNestedScroll}
            />
          );
        case "photos-route":
          return (
            <AccountPhotosTab
              userId={userId}
              key={route.key}
              layout={layout}
              nestedScrollEnabled={nestedScrollEnabled}
              onNestedScroll={onNestedScroll}
            />
          );
        case "moments-route":
          return (
            <AccountMomentsTab
              userId={userId}
              key={route.key}
              layout={layout}
              nestedScrollEnabled={nestedScrollEnabled}
              onNestedScroll={onNestedScroll}
            />
          );
        case "tags-route":
          return (
            <AccountTaggedPostsTab
              userId={userId}
              key={route.key}
              layout={layout}
              nestedScrollEnabled={nestedScrollEnabled}
              onNestedScroll={onNestedScroll}
            />
          );
      }
    },
    [userId, nestedScrollEnabled, onNestedScroll]
  );

  const routes: Route[] = [
    { key: "home-route", icon: "home-outline" as IconName },
  ];

  if (hasPhotos) {
    routes.push({ key: "photos-route", icon: "image-outline" as IconName });
  }
  if (hasMoments) {
    routes.push({ key: "moments-route", icon: "moment-outline" as IconName });
  }

  routes.push({ key: "tags-route", icon: "tag-outline" as IconName });

  return (
    <TabView
      index={index}
      setIndex={setIndex}
      routes={routes}
      initialLayout={initialLayout}
      renderTabs={renderTabsCallback}
    />
  );
};

const initialLayout: Layout = {
  width: windowWidth,
  height: windowHeight - SIZE_54,
};

export default memo(ProfileTabs, shallowEqual);
