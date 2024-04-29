import {
  StyleProp,
  TextProps as TxtProps,
  TextStyle,
  ViewProps,
  DimensionValue,
  FlatListProps,
  ViewStyle,
  ListRenderItemInfo,
} from "react-native";
import { AppDispatch, RootState } from "../store";
import { Tabs } from "expo-router";
import {
  GestureStateChangeEvent,
  LongPressGestureHandlerEventPayload,
  TapGestureHandlerEventPayload,
  TouchableHighlight,
} from "react-native-gesture-handler";
import { AnimateProps, SharedValue } from "react-native-reanimated";
import React, { ReactNode } from "react";
import { HitSlop } from "react-native-gesture-handler/lib/typescript/handlers/gestureHandlerCommon";
import { PostItemIdentifier } from "./store.types";
import { ItemKey } from "./utility.types";

export type IconName =
  | "home-outline"
  | "home-solid"
  | "send-outline"
  | "send-solid"
  | "heart-outline"
  | "heart-solid"
  | "search"
  | "search-bold"
  | "comment-solid"
  | "comment-outline"
  | "more-horiz"
  | "more-vert"
  | "star-outline"
  | "star-solid"
  | "tag-outline"
  | "tag-solid"
  | "hashtag"
  | "mention"
  | "retry"
  | "delete"
  | "reply"
  | "forward"
  | "copy-solid"
  | "copy-outline"
  | "download"
  | "upload"
  | "check"
  | "check-circle-outline"
  | "check-circle-solid"
  | "add"
  | "add-circle-outline"
  | "add-circle-solid"
  | "close"
  | "close-circle-outline"
  | "close-circle-solid"
  | "remove"
  | "remove-circle-outline"
  | "remove-circle-solid"
  | "arrow-up"
  | "arrow-down"
  | "arrow-left"
  | "arrow-right"
  | "explore-solid"
  | "explore-outline"
  | "error"
  | "pin-solid"
  | "pin-outline"
  | "link"
  | "attach"
  | "circulate"
  | "info"
  | "pause"
  | "play"
  | "hashtag"
  | "music"
  | "volume-on-solid"
  | "volume-on-outline"
  | "volume-off-solid"
  | "volume-off-outline"
  | "account-circle-outline"
  | "account-circle-solid"
  | "group-solid"
  | "group-outline"
  | "group-add-solid"
  | "group-add-outline"
  | "group-remove-solid"
  | "group-remove-outline"
  | "person"
  | "person-add"
  | "person-remove"
  | "inbox-outline"
  | "inbox-solid"
  | "image-outline"
  | "image-solid"
  | "moment-solid"
  | "moment-outline"
  | "video-outline"
  | "video-solid"
  | "photo-camera-outline"
  | "photo-camera-solid"
  | "video-camera-outline"
  | "video-camera-solid"
  | "menu"
  | "notification-outline"
  | "notification-solid"
  | "notification-off-outline"
  | "notification-off-solid"
  | "share"
  | "block"
  | "location-outline"
  | "location-solid"
  | "circle-outline"
  | "cicle-solid";

export type MultilineTextProps = {
  text: string;
  collapsed?: boolean;
  hightlightColor?: "primary" | "secondary" | string;
  onPress?: () => void;
} & TextProps;

export type GeneralTextProps = {
  size?: number;
  color?: string;
  weight?: "bold" | "medium" | "regular" | "semi-bold" | "extra-bold" | "light";
  scale?: number;
};

export type TextProps = GeneralTextProps & TxtProps;

export type GeneralIconProps = {
  name: IconName;
  size?: number;
  color?: string;
};

export type PressableGestureProps = {
  onPress?: (
    event: GestureStateChangeEvent<TapGestureHandlerEventPayload>
  ) => void;
  onPressIn?: (
    event: GestureStateChangeEvent<TapGestureHandlerEventPayload>
  ) => void;
  onPressOut?: (
    event: GestureStateChangeEvent<TapGestureHandlerEventPayload>,
    success: boolean
  ) => void;
  onLongPress?: (
    event: GestureStateChangeEvent<TapGestureHandlerEventPayload>
  ) => void;
  onCancel?: () => void;
  enabled?: boolean;
  children?: ReactNode;
  hitSlop?: HitSlop;
};

export type PressableGeneralProps = {
  animateOnPress?: boolean;
  animateOnLongPress?: boolean;
} & PressableGestureProps;

export type PressableProps = AnimateProps<ViewProps> &
  PressableGeneralProps & { useUnderlay?: boolean };

export type PressableIconProps = PressableGeneralProps &
  AnimateProps<IconProps>;

export type PressableIconCircleProps = PressableGeneralProps &
  AnimateProps<IconCircleProps>;

export type ButtonProps = PressableGeneralProps & AnimateProps<LabelProps>;

export type GeneralLabelProps = {
  text: string;
  outlineColor?: string;
  backgroundColor?: string;
  outlined?: boolean;
  outlineWidth?: number;
  keepBackgroundWithOutline?: boolean;
  width?: DimensionValue;
  stretch?: number;
};

export type LabelProps = GeneralLabelProps & TextProps;

export type CapsuleProps = {
  text: string;
  icon: IconName;
  outlineColor?: string;
  backgroundColor?: string;
  outlined?: boolean;
  outlineWidth?: number;
  keepBackgroundWithOutline?: boolean;
  width?: DimensionValue;
  size?: number;
  color?: string;
  weight?: "bold" | "medium" | "regular" | "semi-bold" | "extra-bold" | "light";
  iconScale?: number;
  textScale?: number;
  centerd?: boolean;
} & PressableProps;

export type DataFetchListGeneralProps<T> = {
  isLoading?: boolean;
  isError?: boolean;
  hasEndReached?: boolean;
  refreshing?: boolean;
  onEndReach?: () => void;
  onRefresh?: () => void;
  data: T[] | null | undefined;
  style?: StyleProp<ViewStyle>;
  header?: FlatListProps<T>["ListHeaderComponent"];
  nestedScrollingEnabled?: boolean;
};

export type ItemKeyListProps = DataFetchListGeneralProps<ItemKey>;

export type SuggestedAccountListProps = ItemKeyListProps & {
  onRemove: (userId: string) => void;
};

export type AccountListProps = ItemKeyListProps & {
  renderAccount: (item: ListRenderItemInfo<ItemKey>) => React.JSX.Element;
};

export type GridPostListProps = {
  portrait?: boolean;
  showViews?: boolean;
  showPin?: boolean;
  onPress: (id: string, index: number) => void;
} & DataFetchListGeneralProps<ItemKey>;

export type SwipablePostListProps = {
  focused: boolean;
} & DataFetchListGeneralProps<ItemKey>;

export type ScrollablePostListProps = DataFetchListGeneralProps<ItemKey> & {
  onPress: (id: string, index: number) => void;
};

export type IconProps = TxtProps & GeneralIconProps;

export type AnimatedIconProps = AnimateProps<TextProps> & GeneralIconProps;

export type IconCircleProps = {
  scale?: number;
  backgroundColor?: string;
  keepOutlineWithBackground?: boolean;
  outlineColor?: string;
  outlineWidth?: number;
  solid?: boolean;
} & IconProps;

export type AnimatedIconCircleProps = IconCircleProps & AnimateProps<ViewProps>;

type TabsProps = typeof Tabs extends React.FC<infer P> ? P : never;

export type BottomTabBarProps = Parameters<NonNullable<TabsProps["tabBar"]>>[0];
