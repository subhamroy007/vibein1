import {
  FlatList,
  Keyboard,
  ListRenderItemInfo,
  StyleSheet,
  View,
} from "react-native";
import { layoutStyle } from "../../styles";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import { selectSendSection } from "../../store/client/client.selector";
import { useCallback, useEffect, useRef, useState } from "react";
import { SIZE_90, windowHeight } from "../../constants";
import DefaultPlaceholder from "../utility-components/DefaultPlaceholder";
import { fetchSendSectionAccounts } from "../../store/client/client.thunk";
import { resetSendSectionSearchResult } from "../../store/client/client.slice";
import { SendSectionItemSelectorParams } from "../../types/selector.types";
import SendListItem from "../send_section/SendListItem";
import { SendSectionItemIdentifier } from "../../types/utility.types";
import SwipeUpPortal, { SwipeUpPortalRefParams } from "./SwipeUpPortal";
import SearchBox from "../utility-components/SearchBox";
import { useKeyboard } from "@react-native-community/hooks";
import MessageBox from "../send_section/MessageBox";
import { useSharedValue } from "react-native-reanimated";

export type SendSectionProps = {
  onDismiss: () => void;
  onSend: (chats: SendSectionItemIdentifier[], text?: string) => void;
};

export default function SendSection({ onDismiss, onSend }: SendSectionProps) {
  const [searchText, setSearchText] = useState("");
  const [selectedItems, setSelectedItems] = useState<
    SendSectionItemIdentifier[]
  >([]);

  const portalPosition = useSharedValue(0);

  const { keyboardShown } = useKeyboard();

  const portalRef = useRef<SwipeUpPortalRefParams>(null);

  const abortCallbackRef = useRef<((reason?: string) => void) | null>(null);
  const dispatch = useAppDispatch();

  const sendSection = useAppSelector((state) =>
    selectSendSection(state, searchText === "" ? null : searchText)
  );

  const { hasSearchResult, isError, isLoading, items } = sendSection;

  const findAccounts = useCallback(() => {
    if (abortCallbackRef.current) {
      abortCallbackRef.current();
    }
    const thunkInfo = dispatch(
      fetchSendSectionAccounts({ searchPhase: searchText })
    );
    abortCallbackRef.current = thunkInfo.abort;
    thunkInfo
      .unwrap()
      .catch(() => {})
      .finally(() => {
        abortCallbackRef.current = null;
      });
  }, [searchText]);

  const onItemPress = useCallback(
    (currentItem: SendSectionItemIdentifier, select: boolean) => {
      if (select) {
        setSelectedItems((value) => [currentItem, ...value]);
      } else {
        setSelectedItems((value) =>
          value.filter((item) => item.id !== currentItem.id)
        );
      }
    },
    []
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<SendSectionItemSelectorParams>) => {
      return (
        <SendListItem
          {...item}
          selected={
            selectedItems.findIndex(
              (selectedItem) => selectedItem.id === item.id
            ) !== -1
          }
          onPress={onItemPress}
        />
      );
    },
    [onItemPress, selectedItems]
  );

  const sendAttachment = useCallback(
    (text?: string) => {
      if (portalRef.current) {
        portalRef.current.close();
        Keyboard.dismiss();
        onSend(selectedItems, text);
      }
    },
    [onSend, selectedItems]
  );

  useEffect(() => {
    if (searchText !== "" && !hasSearchResult) {
      findAccounts();
    }
  }, [hasSearchResult, searchText, findAccounts]);

  useEffect(() => {
    return () => {
      dispatch(resetSendSectionSearchResult());
    };
  }, []);

  useEffect(() => {
    if (keyboardShown && portalRef.current) {
      portalRef.current.open();
    }
  }, [keyboardShown]);

  return (
    <SwipeUpPortal
      ref={portalRef}
      onClose={onDismiss}
      title="send"
      containerHeight={windowHeight}
      position={portalPosition}
    >
      <FlatList
        keyboardShouldPersistTaps={"always"}
        data={items}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        ListFooterComponent={
          isLoading || isError ? (
            <DefaultPlaceholder
              isError={isError}
              isLoading={isLoading}
              callback={findAccounts}
            />
          ) : undefined
        }
        ListHeaderComponent={
          <View style={input_container_style}>
            <SearchBox setText={setSearchText} text={searchText} />
          </View>
        }
      />
      {selectedItems.length > 0 && (
        <MessageBox
          onSend={sendAttachment}
          items={selectedItems}
          onItemPress={onItemPress}
          portalPosition={portalPosition}
        />
      )}
    </SwipeUpPortal>
  );
}

const styles = StyleSheet.create({
  input_container: { height: SIZE_90 },
});

const input_container_style = [
  styles.input_container,
  layoutStyle.content_center,
];
