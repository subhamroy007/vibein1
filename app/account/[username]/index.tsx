import { useLocalSearchParams } from "expo-router";
import AppScreen from "../../../components/AppScreen";
import Header from "../../../components/Header";
import { useCallback, useState } from "react";
import { StyleSheet } from "react-native";
import {
  Route,
  SceneRendererProps,
  TabBar,
  TabView,
} from "react-native-tab-view";
import Icon from "../../../components/Icon";
import { COLOR_1, COLOR_16, COLOR_2, COLOR_4 } from "../../../constants";
import AccountHomeTab from "../../../components/account-tabs/AccountHomeTab";
import { useAppDispatch } from "../../../hooks/storeHooks";
import AccountPhotosTab from "../../../components/account-tabs/AccountPhotosTab";
import AccountMomentsTab from "../../../components/account-tabs/AccountMomentsTab";
import AccountTagsTab from "../../../components/account-tabs/AccountTagsTab";
import { useAccountProfileRouteInit } from "../../../hooks/account.hooks";

const AccountProfileRoute = () => {
  const dispatch = useAppDispatch();

  const { username } = useLocalSearchParams<{ username: string }>();

  const routeId = useAccountProfileRouteInit(username!);

  const [index, setIndex] = useState(0);

  const [routes, setRoutes] = useState<Route[]>([
    { key: "home-route", title: "Home" },
    { key: "photos-route", title: "Photos" },
    { key: "moments-route", title: "Moments" },
    { key: "tags-route", title: "Tags" },
  ]);

  const renderTabsCallback = useCallback(
    ({
      route,
    }: SceneRendererProps & {
      route: Route;
    }) => {
      switch (route.key) {
        case "home-route":
          return <AccountHomeTab username={username!} routeId={routeId} />;
        case "photos-route":
          return <AccountPhotosTab username={username!} routeId={routeId} />;
        case "moments-route":
          return <AccountMomentsTab username={username!} routeId={routeId} />;
        case "tags-route":
          return <AccountTagsTab username={username!} routeId={routeId} />;
      }
    },
    [index, username]
  );

  return (
    <AppScreen>
      <Header title={username} />
      <TabView
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderTabsCallback}
        tabBarPosition="bottom"
        overScrollMode={"never"}
        overdrag={false}
        renderTabBar={(props) => {
          return (
            <TabBar
              {...props}
              bounces={false}
              android_ripple={{ radius: 0 }}
              activeColor={COLOR_4}
              inactiveColor={COLOR_16}
              renderLabel={({ color, route }) => {
                switch (route.key) {
                  case "home-route":
                    return <Icon name="home-outline" color={color} />;
                  case "photos-route":
                    return <Icon name="image-outline" color={color} />;
                  case "moments-route":
                    return <Icon name="moment-outline" color={color} />;
                  case "tags-route":
                    return <Icon name="tag-outline" color={color} />;
                }
              }}
              indicatorStyle={{ backgroundColor: COLOR_4 }}
              indicatorContainerStyle={{
                backgroundColor: COLOR_1,
                borderTopWidth: StyleSheet.hairlineWidth,
                borderTopColor: COLOR_2,
              }}
            />
          );
        }}
      />
    </AppScreen>
  );
};

export default AccountProfileRoute;
