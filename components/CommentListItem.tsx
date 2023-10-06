import { View } from "react-native";
import Comment, { CommentProps } from "./Comment";
import { useAppSelector } from "../hooks/storeHooks";
import { selectReplSectionParams } from "../store/comment/comment.selectors";

export default function CommentListItem(props: CommentProps) {
  const replySectionParams = useAppSelector((state) =>
    selectReplSectionParams(state, props.id)
  );

  if (!replySectionParams) {
    return null;
  }
  const { noOfReplies } = replySectionParams;
  return (
    <View>
      <Comment {...props} />
    </View>
  );
}
