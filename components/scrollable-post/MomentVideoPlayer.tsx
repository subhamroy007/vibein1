import { View } from "react-native";
import { layoutStyle } from "../../styles";
import { PostVideoParams } from "../../types/utility.types";
import Video from "../Video";
import { useMediaMutedState } from "../../hooks/client.hooks";

const MomentVideoPlayer = ({
  poster,
  uri,
  focused,
  preload,
}: {
  focused: boolean;
  preload: boolean;
} & PostVideoParams) => {
  const [muted] = useMediaMutedState();

  return (
    <View style={layoutStyle.flex_fill}>
      <Video
        uri={uri}
        poster={poster}
        focused={focused}
        preload={preload}
        style={layoutStyle.fill}
        repeat
        muted={muted}
      />
    </View>
  );
};

export default MomentVideoPlayer;
