import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import TabView from "../../../components/swipable-tab/TabView";
import { useCallback, useMemo, useState } from "react";
import { Route } from "react-native-tab-view";
import { Layout } from "react-native-tab-view/lib/typescript/src/types";
import FollowingsTab from "../../../components/account/related-account-tabs/FollowingsTab";
import FollowersTab from "../../../components/account/related-account-tabs/FollowersTab";
import SuggestedTab from "../../../components/account/related-account-tabs/SuggestedTab";
import Header from "../../../components/Header";
import { layoutStyle } from "../../../styles";

export default function RelatedAccounts() {
  const { route_key, userid } = useLocalSearchParams<{
    userid: string;
    route_key: string;
  }>();

  const [index, setIndex] = useState(0);

  const routes = useMemo<Route[]>(
    () => [
      { key: "followings", title: "followings" },
      { key: "followers", title: "followers" },
      { key: "suggested", title: "suggested" },
    ],
    []
  );

  const renderTabs = useCallback(
    (route: Route, layout: Layout) => {
      switch (route.key) {
        case "followings":
          return (
            <FollowingsTab layout={layout} userId={userid!} key={route.key} />
          );
        case "followers":
          return (
            <FollowersTab layout={layout} userId={userid!} key={route.key} />
          );
        case "suggested":
          return (
            <SuggestedTab layout={layout} userId={userid!} key={route.key} />
          );
      }
    },
    [userid]
  );

  return (
    <SafeAreaView style={layoutStyle.flex_1}>
      <Header title={userid} />
      <TabView
        index={index}
        setIndex={setIndex}
        routes={routes}
        renderTabs={renderTabs}
      />
    </SafeAreaView>
  );
}
