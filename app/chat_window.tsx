// import { router, useLocalSearchParams } from "expo-router";
// import AppScreen from "../components/AppScreen";
// import { useAppSelector } from "../hooks/storeHooks";
// import { selectAccountParams } from "../store/account/account.selectors";
// import Header from "../components/Header";
// import { FlatList, ListRenderItemInfo, SectionList, View } from "react-native";
// import {
//   backgroundStyle,
//   borderStyle,
//   layoutStyle,
//   marginStyle,
//   paddingStyle,
// } from "../styles";
// import {
//   SIZE_120,
//   SIZE_14,
//   SIZE_16,
//   SIZE_17,
//   SIZE_18,
//   SIZE_20,
//   SIZE_24,
//   SIZE_30,
//   SIZE_36,
//   SIZE_40,
//   SIZE_54,
//   SIZE_6,
//   VERMILION_RED,
// } from "../constants";
// import AppText from "../components/AppText";
// import Avatar from "../components/Avatar";
// import { useChat } from "../hooks/chat.hook";
// import Animated, { Layout } from "react-native-reanimated";
// import { useCallback, useEffect, useState } from "react";
// import Message from "../components/chat/Message";
// import { TextInput } from "react-native-gesture-handler";
// import BasicPressable from "../components/pressables/BasicPressable";
// import Icon from "../components/Icon";
// import { RootState } from "../store";
// import { shallowEqual } from "react-redux";
// import Button from "../components/Button";
// import AnimatedLaodingIndicator from "../components/AnimatedLaodingIndicator";
// import CircleIcon from "../components/CircleIcon";

// const MessageBox = () => {
//   return (
//     <View
//       style={[
//         layoutStyle.flex_direction_row,
//         layoutStyle.align_item_center,
//         paddingStyle.padding_6,
//       ]}
//     >
//       <Animated.ScrollView fadingEdgeLength={30} overScrollMode="never">
//         <TextInput
//           hitSlop={{ horizontal: SIZE_18, vertical: SIZE_6 }}
//           multiline
//           placeholder="Write here"
//           style={[
//             {
//               minHeight: SIZE_36,
//               fontFamily: "medium",
//               fontSize: SIZE_16,
//               lineHeight: SIZE_16 * 1.3,
//             },
//           ]}
//         />
//       </Animated.ScrollView>
//       <BasicPressable style={marginStyle.margin_right_18}>
//         <Icon name="attach" size={SIZE_24} />
//       </BasicPressable>
//       <BasicPressable>
//         <Icon name="photo-camera-outline" size={SIZE_24} />
//       </BasicPressable>
//     </View>
//   );
// };

// const ChatWindow = () => {
//   const { chatId, username } = useLocalSearchParams<{
//     chatId: string;
//     username: string;
//   }>();

//   const placeholderAccountSelector = useCallback(
//     (state: RootState) => selectAccountParams(state, username!, ["fullname"]),
//     [username]
//   );

//   const placeholderAccount = useAppSelector(
//     placeholderAccountSelector,
//     shallowEqual
//   );

//   const { chatParams, fetchChatDetails, fetchMoreMessages, removeMessages } =
//     useChat(chatId!, username!);

//   const renderMessages = useCallback(({ item }: ListRenderItemInfo<string>) => {
//     return <Message id={item} />;
//   }, []);

//   if (!placeholderAccount) return null;

//   const receipientAccount = chatParams?.receipient
//     ? chatParams.receipient
//     : placeholderAccount;

//   useEffect(() => {
//     if (chatParams?.state === "idle") {
//       fetchChatDetails();
//     }
//   }, [chatParams]);

//   let element = null;
//   let loadingElement = (
//     <View
//       style={[layoutStyle.flex_direction_row, layoutStyle.align_item_center]}
//     >
//       <AnimatedLaodingIndicator size={SIZE_24} />
//       <AppText
//         size={SIZE_14}
//         weight="bold"
//         style={marginStyle.margin_left_6}
//         color={"grey"}
//       >
//         {/* <Button
//         text={"go to account"}
//         onPress={() => {
//           router.push({
//             pathname: "/hashtag/hashtag",
//             params: { hashtag: "samsung" },
//           });
//         }}
//       /> */}
//         loading chat...
//       </AppText>
//     </View>
//   );
//   if (chatParams) {
//     const { messages, receipient, state, joinedAt } = chatParams;
//     if (chatParams.state === "loading") {
//       element = loadingElement;
//     } else if (chatParams.state === "failed") {
//       element = (
//         <BasicPressable
//           style={[
//             layoutStyle.flex_direction_row,
//             layoutStyle.align_item_center,
//           ]}
//           onPress={fetchChatDetails}
//         >
//           <Icon name="retry" size={SIZE_24} color="grey" />
//           <AppText
//             size={SIZE_14}
//             weight="bold"
//             style={marginStyle.margin_left_6}
//             color={"grey"}
//           >
//             Try Again
//           </AppText>
//         </BasicPressable>
//       );
//     } else if (receipient.isBlocked) {
//       element = (
//         <BasicPressable>
//           <AppText size={SIZE_14} weight="bold" color={"grey"}>
//             Unblock
//           </AppText>
//         </BasicPressable>
//       );
//     } else if (receipient.isAvailable === false) {
//       element = (
//         <AppText weight="semi-bold" color="grey">
//           you can no longer send message to this chat
//         </AppText>
//       );
//     } else if (!joinedAt) {
//       if (messages.data.length > 0) {
//         element = (
//           <View
//             style={[
//               layoutStyle.flex_direction_row,
//               layoutStyle.align_item_center,
//               layoutStyle.align_self_stretch,
//               layoutStyle.justify_content_space_between,
//             ]}
//           >
//             <Button title="accept" width={30} />
//             <Button
//               title="delete"
//               width={30}
//               backgroundColor={VERMILION_RED}
//               onPress={() => {
//                 router.back();
//                 removeMessages();
//               }}
//             />
//             <Button
//               title="block"
//               width={30}
//               hideBackground
//               titleColor={VERMILION_RED}
//               onPress={() => {
//                 router.back();
//                 removeMessages();
//               }}
//             />
//           </View>
//         );
//       } else {
//         element = <MessageBox />;
//       }
//     } else {
//       if (receipient.isMember || !receipient.isMessageRequestRestricted) {
//         element = <MessageBox />;
//       } else {
//         element = (
//           <AppText
//             weight="semi-bold"
//             color="grey"
//             isMultiline
//             style={{ textAlign: "center" }}
//           >
//             your message invitation has been sent, once the user accepts the
//             reuqest you will be able to send more messages
//           </AppText>
//         );
//       }
//     }
//   } else {
//     element = loadingElement;
//   }

//   return (
//     <AppScreen>
//       <Header
//         leftAligned
//         ItemMiddle={
//           <View style={[layoutStyle.flex_direction_row]}>
//             <Avatar url={placeholderAccount.profilePictureUri} size={SIZE_30} />
//             <View style={marginStyle.margin_left_6}>
//               <AppText weight="semi-bold">{receipientAccount.fullname}</AppText>
//               <AppText weight="semi-bold" color="grey">
//                 {receipientAccount.username}
//               </AppText>
//             </View>
//           </View>
//         }
//         ItemRight={
//           chatParams?.state === "success" && (
//             <BasicPressable>
//               <Icon name="more-vert" size={SIZE_24} />
//             </BasicPressable>
//           )
//         }
//       />
//       <Animated.FlatList
//         overScrollMode={"never"}
//         data={chatParams?.messages.data}
//         keyExtractor={(item) => item}
//         renderItem={renderMessages}
//         showsVerticalScrollIndicator={false}
//         inverted
//         itemLayoutAnimation={Layout.duration(4000)}
//       />

//       <Animated.View
//         style={[
//           layoutStyle.align_item_center,
//           layoutStyle.justify_content_flex_start,
//           { minHeight: SIZE_54, maxHeight: SIZE_120 },
//           borderStyle.border_top_width_hairline,
//           borderStyle.border_color_2,
//           layoutStyle.flex_direction_row,
//           // backgroundStyle.background_dove_grey,
//           paddingStyle.padding_horizontal_12,
//         ]}
//         layout={Layout.duration(300)}
//       >
//         {element}
//       </Animated.View>
//     </AppScreen>
//   );
// };

// export default ChatWindow;
