import { useCallback, useState } from "react";
import {
  Route,
  SceneRendererProps,
  TabBar,
  TabView,
} from "react-native-tab-view";
import MomentsSuggestionTab from "../../components/foryou_tabs/MomentsSuggestionTab";
import PhotosSuggestionTab from "../../components/foryou_tabs/PhotosSuggestionTab";
import { backgroundStyle, layoutStyle } from "../../styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { useScreenInit } from "../../hooks/utility.hooks";
import { View } from "react-native";
import Text from "../../components/utility-components/text/Text";

export default function Foryou() {
  const [index, setIndex] = useState(0);

  const [routes, setRoutes] = useState<Route[]>([
    { key: "photo-tab", title: "Photos" },
    { key: "moment-tab", title: "Moments" },
  ]);

  useScreenInit(true);

  const renderTabsCallback = useCallback(
    ({
      route,
    }: SceneRendererProps & {
      route: Route;
    }) => {
      switch (route.key) {
        case "photo-tab":
          return <PhotosSuggestionTab focused={index === 0} />;
        case "moment-tab":
          return <MomentsSuggestionTab focused={index === 1} />;
      }
    },
    [index]
  );

  return (
    <SafeAreaView
      style={[layoutStyle.flex_fill, backgroundStyle.background_color_4]}
    >
      <View style={layoutStyle.flex_fill}>
        <TabView
          overScrollMode={"never"}
          onIndexChange={setIndex}
          renderScene={renderTabsCallback}
          swipeEnabled={false}
          navigationState={{ index, routes }}
          renderTabBar={(props) => {
            return (
              <TabBar
                {...props}
                bounces={false}
                android_ripple={{ radius: 0 }}
                style={{
                  backgroundColor: "transparent",
                  position: "absolute",
                  top: 0,
                  left: "20%",
                  width: "60%",
                  elevation: 0,
                }}
                renderLabel={({ color, route }) => {
                  switch (route.key) {
                    case "photo-tab":
                      return (
                        <Text color={color} weight="semi-bold">
                          PHOTOS
                        </Text>
                      );
                    case "moment-tab":
                      return (
                        <Text color={color} weight="semi-bold">
                          MOMENTS
                        </Text>
                      );
                  }
                }}
                indicatorStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                  height: 3,
                  width: "50%",
                }}
              />
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}
