import { useRouter } from "expo-router";
import AppScreen from "../../components/AppScreen";
import Header from "../../components/Header";
import Button from "../../components/utility-components/button/Button";
import { marginStyle } from "../../styles";

export default function Notification() {
  const router = useRouter();

  return (
    <AppScreen>
      <Header title="Notifications" hideBack />

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
    </AppScreen>
  );
}
