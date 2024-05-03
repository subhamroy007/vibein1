import { layoutStyle, marginStyle } from "../../../styles";
import Header from "../../../components/Header";
import { useLocalSearchParams } from "expo-router";
import { useAppDispatch, useAppSelector } from "../../../hooks/storeHooks";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import DefaultPlaceholder from "../../../components/utility-components/DefaultPlaceholder";
import AccountDetails from "../../../components/account/AccountDetails";
import FollowRequestBox from "../../../components/account/FollowRequestBox";
import ProfileTabs from "../../../components/account/ProfileTabs";
import { selectAccountProfile } from "../../../store/account-store/account.selectors";
import { fetchAccountProfileDetails } from "../../../store/account-store/account.thunks";
import ActionBox from "../../../components/account/ActionBox";
import { useAccountAction } from "../../../hooks/account.hooks";
import StackContainer from "../../../components/StackContainer";
import { useLayout } from "@react-native-community/hooks";
import Spinner from "../../../components/utility-components/Spinner";
import PressableIconCircle from "../../../components/utility-components/button/PressableIconCircle";
import Icon from "../../../components/utility-components/icon/Icon";
import { SIZE_24 } from "../../../constants";
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useDerivedValue,
  useScrollViewOffset,
  useSharedValue,
} from "react-native-reanimated";

export default function Home() {
  const { userid } = useLocalSearchParams<{ userid: string }>();

  const { onLayout, height } = useLayout();

  const { onLayout: onDetailsLayout, height: detailsHeight } = useLayout();

  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  const scrollOffset = useScrollViewOffset(scrollRef);

  const nestedScrollEnabled = useSharedValue(false);
  const dragging = useSharedValue(false);

  useDerivedValue(() => {
    if (Math.floor(detailsHeight - scrollOffset.value) <= 0) {
      nestedScrollEnabled.value = true;
    } else {
      if (!dragging.value) {
        nestedScrollEnabled.value = false;
      }
    }
  }, [detailsHeight]);

  const onNestedScroll = useAnimatedScrollHandler({
    onBeginDrag() {
      dragging.value = true;
    },
    onEndDrag() {
      dragging.value = false;
    },
  });

  const isDataAvailable = useRef(false);

  const [refreshing, setRefreshing] = useState(false);

  const [isLoading, setLoading] = useState(false);

  const [isError, setError] = useState(false);

  const dispatch = useAppDispatch();

  const routeParams = useAppSelector((state) =>
    selectAccountProfile(state, userid!)
  );
  const {
    changeBlockStatus,
    changeFollowRequestStatus,
    changeFollowingStatus,
    accpetFollowRequest,
    rejectFollowRequest,
  } = useAccountAction(routeParams?.account);

  isDataAvailable.current = routeParams ? true : false;

  const loadData = useCallback(() => {
    setError(false);
    dispatch(fetchAccountProfileDetails({ userId: userid! }))
      .unwrap()
      .catch((error) => {
        console.log("could not fetch account route ", error);
        if (!isDataAvailable.current) {
          setError(true);
        } else {
          console.log("showing previously fetched data");
        }
      })
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  }, []);

  const onFetch = useCallback(() => {
    setLoading(true);
    loadData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (!isDataAvailable.current) {
      setLoading(true);
    }
    loadData();
  }, []);

  useEffect(() => {
    onFetch();
  }, []);

  let element = null;
  if (height) {
    if (isLoading) {
      element = (
        <Spinner
          style={[layoutStyle.align_self_center, { marginTop: height * 0.4 }]}
        />
      );
    } else if (isError) {
      element = (
        <PressableIconCircle
          color={"grey"}
          name={"retry"}
          style={[layoutStyle.align_self_center, { marginTop: height * 0.4 }]}
        />
      );
    } else if (routeParams) {
      const {
        account: { isMemoryHidden, postMeta, ...restAccountParams },
      } = routeParams;

      element = (
        <>
          <AccountDetails
            account={restAccountParams}
            onAccept={accpetFollowRequest}
            onReject={rejectFollowRequest}
            onLayout={onDetailsLayout}
          />
          {restAccountParams.isBlocked ||
          (restAccountParams.isPrivate && !restAccountParams.isFollowed) ? (
            <ActionBox
              isBlocked={restAccountParams.isBlocked!}
              isRequestedToFollow={restAccountParams.isRequestedToFollow!}
              onRequest={changeFollowRequestStatus}
              onUnblock={changeBlockStatus}
            />
          ) : (
            <ProfileTabs
              hasMoments={postMeta?.hasMoments || false}
              hasPhotos={postMeta?.hasPhotos || false}
              userId={userid!}
              nestedScrollEnabled={nestedScrollEnabled}
              onNestedScroll={onNestedScroll}
            />
          )}
        </>
      );
    }
  }

  return (
    <StackContainer>
      <Header
        title={userid}
        ItemRight={
          isDataAvailable.current && !isLoading ? (
            <View style={layoutStyle.flex_direction_row}>
              <Icon name="send-outline" style={marginStyle.margin_right_18} />
              <Icon name="more-vert" size={SIZE_24} />
            </View>
          ) : undefined
        }
      />
      <Animated.ScrollView
        decelerationRate={0.999}
        ref={scrollRef}
        style={layoutStyle.flex_1}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onLayout={onLayout}
      >
        {element}
      </Animated.ScrollView>
    </StackContainer>
  );
}
