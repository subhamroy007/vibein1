import { Redirect, Stack } from "expo-router";
import { FFmpegKitConfig } from "ffmpeg-kit-react-native";
import { Platform, UIManager } from "react-native";
// if (Platform.OS === "android") {
//   if (UIManager.setLayoutAnimationEnabledExperimental) {
//     UIManager.setLayoutAnimationEnabledExperimental(true);
//   }
// }
import "webgltexture-loader-expo";
import "webgltexture-loader-expo-camera";

FFmpegKitConfig.disableLogs();

const index = () => {
  return (
    <>
      <Stack.Screen options={{ animation: "none" }} />
      <Redirect
        href={{
          pathname: "/tabs/home",
        }}
      />
    </>
  );
};

export default index;
