import { Tabs } from "expo-router";
import BottomTabBar from "../../components/BottomTabBar";
import { backgroundStyle } from "../../styles";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import { selectClientAccountParams } from "../../store/client/client.selector";

const Layout = () => {
  const dispatch = useAppDispatch();

  const clientAccountParams = useAppSelector((state) =>
    selectClientAccountParams(state)
  );

  return (
    <Tabs
      backBehavior="history"
      screenOptions={{
        headerShown: false,
      }}
      sceneContainerStyle={[backgroundStyle.background_color_1]}
      tabBar={(props) => <BottomTabBar {...props} />}
    />
  );
};

export default Layout;
