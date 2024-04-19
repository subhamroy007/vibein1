import { View } from "react-native";
import AppScreen from "../../components/AppScreen";
import Header from "../../components/Header";
import { useState } from "react";
import Animated, {
  Extrapolate,
  interpolate,
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SIZE_30, SIZE_70 } from "../../constants";
import { layoutStyle } from "../../styles";
import Text from "../../components/utility-components/text/Text";

export default function Inbox() {
  const [data, _] = useState([
    "red",
    "green",
    "blue",
    "pink",
    "orange",
    "yellow",
    "purple",
    "violet",
    "grey",
    "black",
    "yellow",
    "pink",
    "red",
    "purple",
  ]);

  const scrollOffset = useSharedValue(400);

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const translationY = useSharedValue(400);
  const dragging = useSharedValue(false);

  const onScroll = useAnimatedScrollHandler(
    {
      onScroll(event) {
        scrollOffset.value = event.contentOffset.y;
      },
      onBeginDrag(event) {
        dragging.value = true;
      },
      onEndDrag(event, context) {
        dragging.value = false;
      },
    },
    []
  );

  useDerivedValue(() => {
    if (dragging.value) {
      translationY.value = interpolate(
        scrollOffset.value,
        [0, 400],
        [0, 400],
        Extrapolate.CLAMP
      );
    } else {
      if (translationY.value < 400) {
        translationY.value = withTiming(400, { duration: 400 });
        scrollTo(scrollRef, 0, translationY.value, false);
      }
    }
  }, []);

  useDerivedValue(() => {
    if (
      !dragging.value &&
      scrollOffset.value < 400 &&
      translationY.value === 400
    ) {
      scrollTo(scrollRef, 0, 400, false);
    }
  }, []);

  const itemContainerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [0, 400],
            [-400, 0],
            Extrapolate.CLAMP
          ),
        },
      ],
      paddingTop: 400,
    };
  }, []);

  const listStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            translationY.value,
            [0, 400],
            [200, 0],
            Extrapolate.CLAMP
          ),
        },
      ],
      backgroundColor: "white",
    };
  }, []);

  return (
    <AppScreen>
      <Header hideBack title="Messages" />

      <Animated.ScrollView
        ref={scrollRef}
        overScrollMode="never"
        contentOffset={{ x: 0, y: 400 }}
        onScroll={onScroll}
        // onMomentumScrollEnd={() => {
        //   dragging.value = false;
        // }}
        style={listStyle}
        scrollEventThrottle={16}
      >
        <Animated.View style={itemContainerAnimatedStyle}>
          {data.map((item, index) => {
            return (
              <View
                style={[
                  { height: SIZE_70, backgroundColor: item },
                  layoutStyle.content_center,
                ]}
                key={index}
              >
                <Text size={SIZE_30} color="white">
                  {item}
                </Text>
              </View>
            );
          })}
        </Animated.View>
      </Animated.ScrollView>
    </AppScreen>
  );
}
