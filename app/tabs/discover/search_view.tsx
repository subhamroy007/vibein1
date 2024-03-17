import {
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
  View,
} from "react-native";
import StackContainer from "../../../components/StackContainer";
import { SIZE_15, SIZE_20, SIZE_36, SIZE_60 } from "../../../constants";
import {
  backgroundStyle,
  borderStyle,
  layoutStyle,
  marginStyle,
  paddingStyle,
} from "../../../styles";
import { TextInput } from "react-native-gesture-handler";
import { useCallback, useEffect, useState } from "react";
import PressableIcon from "../../../components/utility-components/button/PressableIcon";
import Icon from "../../../components/utility-components/icon/Icon";
import SearchResultTabs from "../../../components/search-module/SearchResultTabs";
import QuickSearchSection from "../../../components/search-module/QuickSearchSection";
import { useAppDispatch } from "../../../hooks/storeHooks";
import {
  initFullSearch,
  resetFullSearch,
} from "../../../store/client/client.slice";
import Header from "../../../components/Header";

export type SearchBarProps = {
  text: string;
  setText: (value: string) => void;
  onSubmit: (text: string) => void;
  onFocus: () => void;
  onReset: () => void;
};

const SearchBar = ({
  onSubmit,
  setText,
  text,
  onFocus,
  onReset,
}: SearchBarProps) => {
  const resetText = useCallback(() => {
    setText("");
    onReset();
  }, [onReset]);

  const onSubmitEditing = useCallback(
    ({
      nativeEvent: { text },
    }: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => onSubmit(text),
    [onSubmit]
  );

  return (
    <View
      style={[
        layoutStyle.flex_direction_row,
        layoutStyle.align_item_center,
        backgroundStyle.background_dove_grey,
        { borderRadius: SIZE_36, height: SIZE_36 },
        layoutStyle.width_100_percent,
      ]}
    >
      <TextInput
        placeholder="search here..."
        style={[
          { fontSize: SIZE_15, flex: 1 },
          marginStyle.margin_horizontal_12,
        ]}
        value={text}
        onChangeText={setText}
        onSubmitEditing={onSubmitEditing}
        onFocus={onFocus}
      />
      {text !== "" ? (
        <PressableIcon
          name="close"
          size={SIZE_20}
          color="grey"
          style={marginStyle.margin_right_12}
          hitSlop={{ horizontal: SIZE_36, vertical: SIZE_36 }}
          onPress={resetText}
        />
      ) : (
        <Icon
          name="search"
          size={SIZE_20}
          color="grey"
          style={marginStyle.margin_right_12}
        />
      )}
    </View>
  );
};

export default function SearchView() {
  const [text, setText] = useState("");

  const [searchTabsOpen, setSearchTabsOpen] = useState(false);

  const toggleSearchTabsOpenState = useCallback(
    () => setSearchTabsOpen((value) => !value),
    []
  );

  const dispatch = useAppDispatch();
  useEffect(() => {
    return () => {
      dispatch(resetFullSearch());
    };
  }, []);

  const submitCallback = useCallback((finalText: string) => {
    setSearchTabsOpen(true);
    dispatch(initFullSearch(finalText.trim()));
  }, []);

  const onFocus = useCallback(() => {
    setSearchTabsOpen(false);
  }, []);

  return (
    <StackContainer>
      <Header
        ItemMiddle={
          <SearchBar
            onFocus={onFocus}
            onSubmit={submitCallback}
            setText={setText}
            text={text}
            onReset={onFocus}
          />
        }
      />
      {searchTabsOpen ? (
        <SearchResultTabs />
      ) : (
        <QuickSearchSection text={text} />
      )}
    </StackContainer>
  );
}
