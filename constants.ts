import { Dimensions, PixelRatio } from "react-native";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const sizeRelativeToWidth = (value: number) =>
  PixelRatio.roundToNearestPixel((windowWidth * value) / 100);

const sizeRelativeToHeight = (value: number) =>
  PixelRatio.roundToNearestPixel((windowHeight * value) / 100);

export const SIZE_1 = sizeRelativeToWidth(0.27);

export const SIZE_3 = sizeRelativeToWidth(0.83);

export const SIZE_4 = sizeRelativeToWidth(1.11);

export const SIZE_6 = sizeRelativeToWidth(1.66);

export const SIZE_8 = sizeRelativeToWidth(2.22);

export const SIZE_9 = sizeRelativeToWidth(2.5);

export const SIZE_11 = sizeRelativeToWidth(3.05);

export const SIZE_12 = sizeRelativeToWidth(3.33);

export const SIZE_13 = sizeRelativeToWidth(3.61);

export const SIZE_14 = sizeRelativeToWidth(3.88);

export const SIZE_15 = sizeRelativeToWidth(4.16);

export const SIZE_16 = sizeRelativeToWidth(4.44);

export const SIZE_18 = sizeRelativeToWidth(5);

export const SIZE_20 = sizeRelativeToWidth(5.55);

export const SIZE_24 = sizeRelativeToWidth(6.66);

export const SIZE_27 = sizeRelativeToWidth(7.5);

export const SIZE_30 = sizeRelativeToWidth(8.33);

export const SIZE_36 = sizeRelativeToWidth(10);

export const SIZE_40 = sizeRelativeToWidth(11.11);

export const SIZE_42 = sizeRelativeToWidth(11.66);

export const SIZE_48 = sizeRelativeToWidth(13.33);

export const SIZE_54 = sizeRelativeToWidth(15);

export const SIZE_60 = sizeRelativeToWidth(16.66);

export const SIZE_90 = sizeRelativeToWidth(25);

export const HEIGHT_SCALE_1 = sizeRelativeToHeight(60);
export const HEIGHT_SCALE_2 = sizeRelativeToHeight(50);
export const HEIGHT_SCALE_3 = sizeRelativeToHeight(12.5);

export const COLOR_1 = "#FFFFFF";
export const COLOR_2 = "#AAAAAA";
export const COLOR_3 = "rgba(0, 0, 0, 0.5)";
export const COLOR_4 = "#000000";
export const COLOR_5 = "#3F71F2";
export const COLOR_6 = "#EE3434";
export const COLOR_7 = "#E9E9E9";
export const COLOR_8 = "transparent";
export const COLOR_9 = "rgba(0, 0, 0, 0.7)";
export const COLOR_10 = "red";
export const COLOR_11 = "#2EF642";
export const COLOR_12 = "#1E6ADC";

export const PRESSABLE_ANIMATION_DURATION = 150;
export const PRESSABLE_ANIMATION_RESET_DURATION = 25;
export const PHOTO_MAX_BLUR_RADIUS = 12;
