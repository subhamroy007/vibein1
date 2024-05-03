import { useCallback, useMemo, useState } from "react";
import TabView from "../swipable-tab/TabView";
import { SIZE_54, windowHeight, windowWidth } from "../../constants";
import { Layout, Route } from "react-native-tab-view/lib/typescript/src/types";
import AudioPhotosTab from "./AudioPhotosTab";
import { NativeScrollEvent, NativeSyntheticEvent, View } from "react-native";
import { layoutStyle } from "../../styles";
import AudioMomentsTab from "./AudioMomentsTab";
import { formatNumber } from "../../utility";
import Animated, { SharedValue } from "react-native-reanimated";

export default function AudioPostTabs({
  audioId,
  noOfMoments,
  noOfPhotos,
  onScroll,
  nestedScrollEnabled,
}: {
  audioId: string;
  noOfPhotos: number;
  noOfMoments: number;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  nestedScrollEnabled: SharedValue<boolean>;
}) {
  const [index, setIndex] = useState(0);

  const routes = useMemo<Route[]>(
    () => [
      { key: "moments", title: `${formatNumber(noOfMoments, true)} moments` },
      { key: "photos", title: `${formatNumber(noOfPhotos, true)} photos` },
    ],
    [noOfMoments, noOfPhotos]
  );

  const renderTabsCallback = useCallback(
    (route: Route, layout: Layout) => {
      switch (route.key) {
        case "photos":
          return (
            <View
              style={[layoutStyle.flex_1, { width: layout.width }]}
              key={route.key}
            >
              <AudioPhotosTab
                audioId={audioId}
                onScroll={onScroll}
                nestedScrollEnabled={nestedScrollEnabled}
              />
            </View>
          );
        case "moments":
          return (
            <View
              style={[layoutStyle.flex_1, { width: layout.width }]}
              key={route.key}
            >
              <AudioMomentsTab
                audioId={audioId}
                onScroll={onScroll}
                nestedScrollEnabled={nestedScrollEnabled}
              />
            </View>
          );
      }
    },
    [audioId, onScroll, nestedScrollEnabled]
  );

  return (
    <TabView
      index={index}
      setIndex={setIndex}
      initialLayout={initialLayout}
      routes={routes}
      renderTabs={renderTabsCallback}
    />
  );
}

const initialLayout: Layout = {
  width: windowWidth,
  height: windowHeight - SIZE_54,
};
