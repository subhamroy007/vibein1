import { Tabs } from "expo-router";
import BottomTabBar from "../../components/BottomTabBar";
import { backgroundStyle } from "../../styles";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import { useEffect } from "react";
import { generateChatObjects } from "../../mocks/chat.mock";
import { selectClientAccountParams } from "../../store/client/client.selector";
import { addChats } from "../../store/inbox/chat.slice";
import { initInbox } from "../../store/client/client.slice";

const Layout = () => {
  const dispatch = useAppDispatch();

  const clientAccountParams = useAppSelector((state) =>
    selectClientAccountParams(state)
  );

  useEffect(() => {
    if (clientAccountParams) {
      const inboxChats = generateChatObjects(10, clientAccountParams, "dm");
      dispatch(addChats(inboxChats));
      dispatch(initInbox(inboxChats));
    }
  }, [clientAccountParams]);

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
