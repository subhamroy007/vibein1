import { Tabs } from "expo-router";
import BottomTabBar from "../../components/BottomTabBar";
import { backgroundStyle } from "../../styles";

const Layout = () => {
  return (
    <Tabs
      backBehavior="history"
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
      sceneContainerStyle={[backgroundStyle.background_color_1]}
    />
  );
};

export default Layout;
