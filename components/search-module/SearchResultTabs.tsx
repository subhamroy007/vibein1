import { useCallback, useState } from "react";
import {
  Route,
  SceneRendererProps,
  TabBar,
  TabView,
} from "react-native-tab-view";
import AccountSearchResultTab from "./AccountSearchResultTab";
import HashtagSearchResultTab from "./HashtagSearchResultTab";
import Text from "../utility-components/text/Text";
import { SIZE_2 } from "../../constants";
import { borderStyle } from "../../styles";
import PostSearchResultTab from "./PostSearchResultTab";

export default function SearchResultTabs() {
  const [index, setIndex] = useState(0);

  const [routes, setRoutes] = useState<Route[]>([
    { key: "posts-tab", title: "accounts" },
    { key: "accounts-tab", title: "accounts" },
    { key: "hashtags-tab", title: "hashtags" },
  ]);

  const renderTabsCallback = useCallback(
    ({
      route,
    }: SceneRendererProps & {
      route: Route;
    }) => {
      switch (route.key) {
        case "posts-tab":
          return <PostSearchResultTab focused={index === 0} />;
        case "accounts-tab":
          return <AccountSearchResultTab focused={index === 1} />;
        case "hashtags-tab":
          return <HashtagSearchResultTab focused={index === 2} />;
      }
    },
    [index]
  );

  return (
    <TabView
      overScrollMode={"never"}
      onIndexChange={setIndex}
      renderScene={renderTabsCallback}
      navigationState={{ index, routes }}
      renderTabBar={(props) => {
        return (
          <TabBar
            {...props}
            bounces={false}
            activeColor="black"
            inactiveColor="grey"
            android_ripple={{ radius: 0 }}
            style={[
              {
                backgroundColor: "transparent",
                elevation: 0,
              },
              borderStyle.border_bottom_color_2,
              borderStyle.border_bottom_width_hairline,
            ]}
            renderLabel={({ color, route }) => {
              switch (route.key) {
                case "posts-tab":
                  return (
                    <Text color={color} weight="semi-bold">
                      posts
                    </Text>
                  );
                case "accounts-tab":
                  return (
                    <Text color={color} weight="semi-bold">
                      accounts
                    </Text>
                  );
                case "hashtags-tab":
                  return (
                    <Text color={color} weight="semi-bold">
                      hashtags
                    </Text>
                  );
              }
            }}
            indicatorStyle={{
              height: 0,
            }}
          />
        );
      }}
    />
  );
}
