import { StyleSheet, View } from "react-native";
import { layoutStyle, marginStyle } from "../../styles";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import { selectAccountParams } from "../../store/account-store/account.selectors";
import OutlinedAvatar from "../utility-components/OutlinedAvatar";
import Text from "../utility-components/text/Text";
import { SIZE_11, SIZE_84 } from "../../constants";
import { useCallback, useState } from "react";
import { fetchAccountMemories } from "../../store/account-store/account.thunks";
import Pressable from "../utility-components/button/Pressable";
import { useRouter } from "expo-router";
import { useAccountSelector } from "../../hooks/account.hooks";
import { AccountField } from "../../types/utility.types";

const accountFields: AccountField[] = ["memory-info"];

export default function MemoryAccount({
  userId,
  index,
}: {
  userId: string;
  index: number;
}) {
  const [showOutlineAnimation, setShowOutlineAnimation] = useState(false);

  const router = useRouter();

  const dispatch = useAppDispatch();

  const account = useAccountSelector(userId, accountFields);

  const onPress = useCallback(() => {
    if (account!.memoryInfo!.hasMemory) {
      if (account!.memoryInfo!.isMemoryAvailable) {
        console.log("going to the memory view route");
        router.push({
          params: { startingIndex: index },
          pathname: "/memory_route",
        });
      } else {
        console.log("going to load memory");
        // setShowOutlineAnimation(true);
        // dispatch(fetchAccountMemories({ userId }))
        //   .unwrap()
        //   .then((result) => {
        //     if (result.memories.length > 0) {
        //       router.push({
        //         params: { startingIndex: index },
        //         pathname: "/memory_route",
        //       });
        //     }
        //   })
        //   .catch((error) => {
        //     console.log("failed to fetch memories");
        //   })
        //   .finally(() => {
        //     setShowOutlineAnimation(false);
        //   });

        router.push({
          params: { startingIndex: index },
          pathname: "/memory_route",
        });
      }
    } else {
      console.log("going to account page");
    }
  }, [account?.memoryInfo, userId, router, index]);

  if (!account) return null;

  return (
    <View style={root_container_style}>
      <Pressable animateOnPress onPress={onPress}>
        <OutlinedAvatar
          url={account.profilePictureUri}
          size={SIZE_84}
          outlineWidth={8}
          gapWidth={6}
          animateOutline={showOutlineAnimation}
        />
      </Pressable>
      <Text weight="medium" size={SIZE_11} style={marginStyle.margin_top_4}>
        {account.username}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root_container: { width: SIZE_84 },
});

const root_container_style = [
  styles.root_container,
  layoutStyle.align_item_center,
];
