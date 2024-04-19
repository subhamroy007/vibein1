import { SafeAreaView } from "react-native-safe-area-context";
import {
  backgroundStyle,
  borderStyle,
  layoutStyle,
  marginStyle,
  paddingStyle,
} from "../../styles";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import { selectLikeSection } from "../../store/post-store/post.selectors";
import {
  fetchFilteredLikes,
  fetchLikes,
} from "../../store/post-store/post.thunks";
import { useBackHandler } from "@react-native-community/hooks";
import { FlatList, StyleSheet, View } from "react-native";
import { useDataFetchHook } from "../../hooks/utility.hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import AccountListItem from "../account/AccountListItem";
import { SIZE_120, SIZE_16, SIZE_20 } from "../../constants";
import Text from "../utility-components/text/Text";
import Icon from "../utility-components/icon/Icon";
import { TextInput } from "react-native-gesture-handler";
import DefaultPlaceholder from "../utility-components/DefaultPlaceholder";
import PressableIcon from "../utility-components/button/PressableIcon";

export default function PostLikeSection({
  id,
  onDismiss,
}: {
  id: string;
  onDismiss: () => void;
}) {
  const abortCallbackRef = useRef<((reason?: string) => void) | null>(null);

  const [searchPhase, setSearchPhase] = useState("");

  const likeSection = useAppSelector((state) =>
    selectLikeSection(state, id, searchPhase === "" ? null : searchPhase)
  );

  const resetPhase = useCallback(() => {
    setSearchPhase("");
  }, []);

  const paginationCallback = useCallback(() => {
    dispatch(fetchLikes({ postId: id }));
  }, []);

  const initCallback = useCallback(() => {
    dispatch(fetchLikes({ postId: id, refresh: true }));
  }, []);

  const getFilteredLikesCallback = useCallback(() => {
    if (abortCallbackRef.current) {
      abortCallbackRef.current();
    }
    const thunkInfo = dispatch(fetchFilteredLikes({ postId: id, searchPhase }));
    abortCallbackRef.current = thunkInfo.abort;
    thunkInfo
      .unwrap()
      .catch(() => {})
      .finally(() => {
        abortCallbackRef.current = null;
      });
  }, [id, searchPhase]);

  const dispatch = useAppDispatch();
  const { endReachedCallback } = useDataFetchHook(
    likeSection?.data?.allLikes.items,
    likeSection?.isLoading,
    paginationCallback
  );
  useBackHandler(() => {
    onDismiss();
    return true;
  });

  useEffect(() => {
    if (searchPhase !== "" && !likeSection?.data?.filteredAccounts) {
      getFilteredLikesCallback();
    }
  }, [
    searchPhase,
    likeSection?.data?.filteredAccounts,
    getFilteredLikesCallback,
  ]);

  useEffect(() => {
    initCallback();
  }, []);

  if (!likeSection) {
    return (
      <SafeAreaView
        style={[backgroundStyle.background_color_1, StyleSheet.absoluteFill]}
      />
    );
  }

  return (
    <SafeAreaView
      style={[backgroundStyle.background_color_1, StyleSheet.absoluteFill]}
    >
      {likeSection.data && (
        <View style={[{ height: SIZE_120 }, layoutStyle.content_center]}>
          <View
            style={[
              { width: "85%" },
              layoutStyle.flex_direction_row,
              layoutStyle.align_item_center,
              paddingStyle.padding_horizontal_18,
              paddingStyle.padding_vertical_9,
              backgroundStyle.background_dove_grey,
              borderStyle.border_radius_6,
            ]}
          >
            <TextInput
              style={[
                layoutStyle.flex_1,
                { fontSize: SIZE_16, fontFamily: "medium" },
              ]}
              placeholder={`search ${likeSection.data.engagementSummary.noOfLikes} likes...`}
              placeholderTextColor={"grey"}
              value={searchPhase}
              onChangeText={setSearchPhase}
            />

            {searchPhase === "" ? (
              <Icon
                size={SIZE_20}
                color="grey"
                name="search"
                style={marginStyle.margin_left_6}
              />
            ) : (
              <PressableIcon
                size={SIZE_20}
                color="grey"
                name="close"
                style={marginStyle.margin_left_6}
                onPress={resetPhase}
              />
            )}
          </View>
          <Text
            weight="semi-bold"
            color="grey"
            size={SIZE_16}
            style={[layoutStyle.align_self_center, marginStyle.margin_top_24]}
          >
            {likeSection.data.engagementSummary.noOfViews} views
          </Text>
        </View>
      )}
      <FlatList
        keyboardShouldPersistTaps={"always"}
        data={
          searchPhase === ""
            ? likeSection.data?.allLikes.items
            : likeSection.data?.filteredAccounts
        }
        renderItem={({ item }) => {
          return <AccountListItem id={item.key} />;
        }}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        ListEmptyComponent={
          <DefaultPlaceholder
            callback={
              searchPhase === "" ? initCallback : getFilteredLikesCallback
            }
            isError={likeSection.isError}
            isLoading={likeSection.isLoading}
          />
        }
        ListFooterComponent={
          searchPhase === "" &&
          likeSection.data?.allLikes.hasEndReached === false ? (
            <DefaultPlaceholder
              callback={paginationCallback}
              isError={likeSection.isError}
              isLoading={likeSection.isLoading}
            />
          ) : undefined
        }
        onEndReachedThreshold={0.2}
        onEndReached={
          searchPhase === "" &&
          likeSection.data?.allLikes.hasEndReached !== true
            ? endReachedCallback
            : undefined
        }
      />
    </SafeAreaView>
  );
}
