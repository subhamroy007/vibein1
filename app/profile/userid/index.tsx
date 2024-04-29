import { SafeAreaView } from "react-native-safe-area-context";
import {
  borderStyle,
  layoutStyle,
  marginStyle,
  paddingStyle,
} from "../../../styles";
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
import Icon from "../../../components/utility-components/icon/Icon";
import Text from "../../../components/utility-components/text/Text";
import { SIZE_15, SIZE_16 } from "../../../constants";
import Button from "../../../components/utility-components/button/Button";
import ActionBox from "../../../components/account/ActionBox";
import { useAccountAction } from "../../../hooks/account.hooks";
import StackContainer from "../../../components/StackContainer";

export default function Home() {
  const { userid } = useLocalSearchParams<{ userid: string }>();

  const isDataAvailable = useRef(false);

  const [refreshing, setRefreshing] = useState(false);

  const [nestedScrollingEnabled, setNestedScrollingState] = useState(false);

  const [isLoading, setLoading] = useState(false);

  const [isError, setError] = useState(false);

  const dispatch = useAppDispatch();

  const profileParams = useAppSelector((state) =>
    selectAccountProfile(state, userid!)
  );
  const {
    changeBlockStatus,
    changeFollowRequestStatus,
    changeFollowingStatus,
    accpetFollowRequest,
    rejectFollowRequest,
  } = useAccountAction(profileParams?.account);

  isDataAvailable.current = profileParams ? true : false;

  const fetchProfileDetalis = useCallback(
    (shouldSetLoading: boolean, shouldSetError: boolean) => {
      setError(false);
      if (shouldSetLoading) {
        setLoading(true);
      }
      dispatch(fetchAccountProfileDetails({ userId: userid! }))
        .unwrap()
        .catch((error: any) => {
          console.log(error);
          if (shouldSetError) {
            setError(true);
          }
        })
        .finally(() => {
          setRefreshing(false);
          setLoading(false);
        });
    },
    [userid]
  );

  const onRefresh = useCallback(() => {
    if (!isLoading) {
      setRefreshing(true);
      fetchProfileDetalis(!isDataAvailable.current, !isDataAvailable.current);
    }
  }, [fetchProfileDetalis, isLoading]);

  const onLoad = useCallback(() => {
    fetchProfileDetalis(true, true);
  }, [fetchProfileDetalis]);

  // useEffect(() => {
  //   fetchProfileDetalis(true, !isDataAvailable.current);
  // }, [fetchProfileDetalis]);

  const onMomentumScrollEnd = useCallback(
    ({
      nativeEvent: { contentOffset, contentSize, layoutMeasurement },
    }: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (
        Math.round(
          contentSize.height - layoutMeasurement.height - contentOffset.y
        ) === 0
      ) {
        setNestedScrollingState(true);
      } else {
        setNestedScrollingState(false);
      }
    },
    []
  );

  let element = null;

  if (isLoading || isError) {
    element = (
      <DefaultPlaceholder
        callback={onLoad}
        isError={isError}
        isLoading={isLoading}
      />
    );
  } else if (profileParams) {
    const {
      account: {
        isMemoryHidden,
        postMeta,
        hasRequestedToFollowClient,
        ...restAccountParams
      },
    } = profileParams;

    element = (
      <>
        {hasRequestedToFollowClient && (
          <FollowRequestBox
            userId={userid!}
            onAccept={accpetFollowRequest}
            onReject={rejectFollowRequest}
          />
        )}
        <AccountDetails account={restAccountParams} />
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
            nestedScrollEnabled={nestedScrollingEnabled}
          />
        )}
      </>
    );
  }

  return (
    <StackContainer>
      <Header title={userid} />
      <ScrollView
        style={layoutStyle.flex_1}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onMomentumScrollEnd={onMomentumScrollEnd}
      >
        {element}
      </ScrollView>
    </StackContainer>
  );
}
