import AppScreen from "../../components/AppScreen";
import Header from "../../components/Header";
import { _Image } from "react-native";
import { useCallback, useState } from "react";
import Button from "../../components/utility-components/button/Button";
import { Portal } from "@gorhom/portal";
import SendSection from "../../components/portals/SendSection";
import { SendSectionItemIdentifier } from "../../types/utility.types";

export default function Notification() {
  const [value, setValue] = useState(false);

  const toggleValue = useCallback(() => setValue((data) => !data), []);

  const onSend = useCallback(
    (chats: SendSectionItemIdentifier[], text?: string) => {
      console.log("attachment sent to ", chats);
      console.log("message text is ", text);
    },
    []
  );

  return (
    <AppScreen>
      <Header title="Notifications" hideBack />
      <Button text={"press me"} onPress={toggleValue} />

      {value && (
        <Portal>
          <SendSection onDismiss={toggleValue} onSend={onSend} />
        </Portal>
      )}
    </AppScreen>
  );
}
