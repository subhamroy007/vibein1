import { View, useWindowDimensions } from "react-native";
import RetryableVideo, {
  RetryableVideoProps,
  RetryableVideoRefParams,
} from "../RetryableVideo";
import { layoutStyle, paddingStyle } from "../../styles";
import { useEffect, useRef, useState } from "react";
import { Slider } from "@miblanchard/react-native-slider";

const VideoViewer = (props: RetryableVideoProps) => {
  const { width } = useWindowDimensions();

  const [position, setPosition] = useState(0);

  const [playing, setPlaying] = useState(false);

  const [duration, setDuration] = useState(0);

  const [sliderVisible, setSliderState] = useState(false);

  const videoRef = useRef<RetryableVideoRefParams | null>(null);

  useEffect(() => {
    if (!props.focused) {
      setSliderState(false);
    }
  }, [props.focused]);

  return (
    <View style={[{ width }, layoutStyle.height_100_percent]}>
      <RetryableVideo
        {...props}
        ref={videoRef}
        style={[layoutStyle.width_100_percent, layoutStyle.height_100_percent]}
        onReadyForDisplay={({ status }) => {
          if (status?.isLoaded) {
            setSliderState(true);
            setPosition(status.positionMillis);
            setDuration(status.durationMillis!);
            setPlaying(status.isPlaying);
          }
        }}
        onPlaybackStatusUpdate={(status) => {
          if (status.isLoaded) {
            setPosition(status.positionMillis);
            setPlaying(status.isPlaying);
          }
        }}
      />
      <View
        style={[
          layoutStyle.position_absolute,
          layoutStyle.width_100_percent,
          paddingStyle.padding_horizontal_12,
          { bottom: 20 },
        ]}
      >
        {sliderVisible && (
          <Slider
            value={position}
            onValueChange={(values) => {
              if (videoRef.current) {
                videoRef.current.seek(values[0]);
              }
            }}
            minimumValue={0}
            maximumValue={duration}
            step={200}
            animateTransitions
            animationType="timing"
          />
        )}
      </View>
    </View>
  );
};

export default VideoViewer;
