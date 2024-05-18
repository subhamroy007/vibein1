import { useNavigation, useRouter } from "expo-router";
import AppScreen from "../../components/AppScreen";
import Header from "../../components/Header";
import Button from "../../components/utility-components/button/Button";
import { marginStyle } from "../../styles";
import { useCallback, useRef, useState } from "react";
import { SwipeUpPortalRefParams } from "../../components/portals/SwipeUpPortal";
import { useIsFocused } from "../../hooks/utility.hooks";
import { useAppDispatch } from "../../hooks/storeHooks";
import { setNotificationText } from "../../store/client/client.slice";

export default function Notification() {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const portalRef = useRef<SwipeUpPortalRefParams>(null);

  const [visible, setVisible] = useState(false);

  const toggleVisible = useCallback(() => {
    setVisible((value) => !value);
  }, []);

  return (
    <AppScreen>
      <Header title="Notifications" hideBack />
      {/* 
      <Button
        text={"go to hashtag"}
        onPress={() => {
          router.push({
            pathname: "/hashtag/hashtag",
            params: { hashtag: "samsung" },
          });
        }}
      />
      <Button
        text={"go to location"}
        onPress={() => {
          router.push({
            pathname: "/location/location_id",
            params: { location_id: "1245" },
          });
        }}
        style={marginStyle.margin_top_20}
      />
      <Button
        text={"go to audio"}
        onPress={() => {
          router.push({
            pathname: "/audio/audio_id",
            params: { audio_id: "125" },
          });
        }}
        style={marginStyle.margin_top_20}
      />

      <Button
        text={"go to account"}
        onPress={() => {
          router.push({
            pathname: "/profile/userid",
            params: { userid: "jaimahakal" },
          });
        }}
        style={marginStyle.margin_top_20}
      />

      <Button
        text={"press me"}
        onPress={() => {
          dispatch(
            setNotificationText({
              message: `failed to upload comment 
roybond007 has turned off public mention`,
            })
          );
        }}
        style={marginStyle.margin_top_20}
      /> */}
      {/* {visible && (
        <Portal>
          <SwipeUpPortal
            ref={portalRef}
            onClose={toggleVisible}
            contentHeight={windowHeight * 0.8}
            title="options"
          >
            <Button
              text={"press me"}
              onPress={() => {
                portalRef.current?.close(() => {
                  console.log("portal closed");
                });
              }}
            />
            <Photo
              style={layoutStyle.flex_fill}
              uri={getMomentVideoPosterUri(13)}
            />
          </SwipeUpPortal>
        </Portal>
      )} */}
    </AppScreen>
  );
}
