import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import { selectLikeSection } from "../../store/post-store/post.selectors";
import {
  fetchFilteredLikes,
  fetchLikes,
} from "../../store/post-store/post.thunks";
import { useCallback, useEffect, useRef, useState } from "react";
import GeneralAccountList from "../account/GeneralAccountList";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { layoutStyle, marginStyle } from "../../styles";
import { SIZE_120, SIZE_16, SIZE_18 } from "../../constants";
import Text from "../utility-components/text/Text";
import SearchBox from "../utility-components/SearchBox";
import SwipeUpPortal from "./SwipeUpPortal";
import { Dictionary } from "@reduxjs/toolkit";
import { ItemKey } from "../../types/utility.types";
import Spinner from "../utility-components/Spinner";

export default function PostLikeSection({
  id,
  onClose,
}: {
  id: string;
  onClose: () => void;
}) {
  const { height: window_height } = useWindowDimensions();

  const [searchedLikes, setSearchedLikes] = useState<Dictionary<ItemKey[]>>({}); //dictionary of all the searched accounts

  const abortCallback = useRef<(() => void) | null>(null); //callback reference to abort an ongoing search request
  const [searchPhase, setSearchPhase] = useState(""); //current search phase

  const [isSearchLoading, setSearchLoading] = useState(false); //boolean to indicate the search loading state
  const [isSearchError, setSearchError] = useState(false); //boolean to indicate the search error state

  const lastSeachedPhase = useRef<string | null>(null); // reference to the last searched phase
  const trimmedText = searchPhase.trim(); //trim the text

  const [isLoading, setLoading] = useState(false); //boolean to indicate the loading state of the all likes request
  const [isError, setError] = useState(false); //boolean to indicate the error state of the all likes request

  const showData = useRef(false); //boolean reference to indicate whethere to show the current or previous loaded data

  const isDataAvailable = useRef(false); //boolean reference to indicate whthere data is available or not

  const filteredLikes = searchedLikes[searchPhase]; //list of the last seached accounts

  const likeSection = useAppSelector((state) => selectLikeSection(state, id)); //all likes cached data

  isDataAvailable.current = likeSection ? true : false; //check if any data is available or not

  //callback to load likes of the target posts
  const loadLikes = useCallback((refresh: boolean) => {
    setError(false); //reset the error state
    setLoading(true); //set the loading state to true
    dispatch(fetchLikes({ postId: id, refresh }))
      .unwrap()
      .catch(() => {
        if (!isDataAvailable.current || !refresh) {
          setError(true); //set the error state to true if no data is available and it was the first request
        }
        if (isDataAvailable.current) {
          showData.current = true; //incase any catched data is available set the show data reference to true
        }
      })
      .then(() => {
        if (refresh) {
          showData.current = true; // set the show data ref to true to show the fresh data
        }
      })
      .finally(() => {
        setLoading(false); //set the loading state to false
      });
  }, []);

  //callback to fetch next page of post likes
  const onEndReached = useCallback(() => {
    loadLikes(false);
  }, []);

  //callback to fetch the first page of the post likes
  const onInit = useCallback(() => {
    loadLikes(true);
  }, []);

  const dispatch = useAppDispatch();

  //load the first page of the post likes when the component is mounted
  useEffect(() => {
    onInit();
  }, []);

  //logic to fetch the searched accounts
  useEffect(() => {
    lastSeachedPhase.current = trimmedText; //set the trimmed text as the last searched phase ref
    if (trimmedText !== "" && !filteredLikes) {
      //if no accounts is available for the non-empty trimmed text then send the search request
      setSearchLoading(true); //set the search loading state to true
      setSearchError(false); //reset the search state
      const promise = dispatch(
        fetchFilteredLikes({ postId: id, searchPhase: trimmedText })
      ); //store the promise of the sent request
      abortCallback.current = promise.abort; //set the abort callback of the promise as the abortCallback ref
      promise
        .unwrap()
        .then((value) => {
          //in case new account is found, store them in the dictionary
          const newAccounts = value.accounts.map<ItemKey>((account) => ({
            key: account.userId,
          }));
          setSearchedLikes((value) => {
            return {
              ...value,
              [trimmedText]: newAccounts,
            };
          });
        })
        .catch(() => {
          if (trimmedText === lastSeachedPhase.current) {
            //if the request is failed and the trimmed text is still the last seached text then set the search error state to true
            setSearchError(true);
          }
        })
        .finally(() => {
          if (trimmedText === lastSeachedPhase.current) {
            //if the trimmed text is still the last searched phase then set the loading state to true and reset the last search phase ref and abort callback ref to null
            setSearchLoading(false);
            lastSeachedPhase.current = null;
            abortCallback.current = null;
          }
        });
    }

    return () => {
      if (abortCallback.current) {
        // incase the search phase is changed and the last search request is still not finished, abort it
        abortCallback.current();
        abortCallback.current = null;
      }
    };
  }, [trimmedText, filteredLikes]);

  if (likeSection === undefined) {
    return null;
  }

  let listData = null;
  if (trimmedText === "") {
    //in case the search phase is empty show the all likes list if the show data reference is set to true;
    listData = showData.current ? likeSection?.allLikes.items : null;
  } else {
    //if the search phase is not empty show the corresponding list of searched accounts
    listData = filteredLikes;
  }

  let header = null;
  if (isDataAvailable.current && showData.current) {
    //in case the data is available and the show data ref is set to true set the header
    header = (
      <View style={header_style}>
        <SearchBox
          text={searchPhase}
          setText={setSearchPhase}
          placeholder={`search ${likeSection?.engagementSummary.noOfLikes} likes...`}
        />
        <Text
          weight="light_medium"
          color="grey"
          size={SIZE_16}
          style={view_text_style}
        >
          {likeSection?.engagementSummary.noOfViews} views
        </Text>
      </View>
    );
  }

  let placeholder = null;
  if (trimmedText !== "") {
    //in case the data is available and the show data ref is set to true set the placeholder

    placeholder = (
      <View style={placeholder_style}>
        {isSearchLoading && (
          <Spinner size={SIZE_18} style={marginStyle.margin_right_9} />
        )}
        <Text weight="semi-bold" color="grey">
          {isSearchLoading
            ? "Searching..."
            : isSearchError
            ? "Request failed"
            : "No result found"}
        </Text>
      </View>
    );
  }

  return (
    <SwipeUpPortal
      onClose={onClose}
      contentHeight={window_height}
      title="likes"
    >
      <GeneralAccountList
        header={header}
        data={listData}
        hasEndReached={
          trimmedText === "" ? likeSection?.allLikes.hasEndReached : true
        }
        isError={trimmedText === "" ? isError : isSearchError}
        isLoading={trimmedText === "" ? isLoading : isSearchLoading}
        onEndReach={trimmedText === "" ? onEndReached : undefined}
        placeholder={placeholder}
      />
    </SwipeUpPortal>
  );
}

const styles = StyleSheet.create({
  header: {
    height: SIZE_120,
  },
});

const view_text_style = [
  layoutStyle.align_self_center,
  marginStyle.margin_top_24,
];

const header_style = [styles.header, layoutStyle.content_center];

const placeholder_style = [
  marginStyle.margin_top_24,
  layoutStyle.flex_direction_row,
  layoutStyle.content_center,
];
