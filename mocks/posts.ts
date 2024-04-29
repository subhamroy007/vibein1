import {
  CommentResponseParams,
  PostPhotoAccountTagResponseParams,
  PostPhotoResponseParams,
  PostResponseParams,
} from "./../types/response.types";
import { nanoid } from "@reduxjs/toolkit";
import {
  MOMENT_VIDEOS,
  PHOTOS,
  getMomentVideoPosterUri,
  getPostMomentVideoThumbnailUrl,
  getPostMomentVideoUrl,
  getPostPhotoPreviewUrl,
  getPostPhotoUrl,
  photo_hashs,
  poster_hashs,
} from "./data";
import {
  AccountResponseParams,
  MomentPostResponseParams,
  PhotoPostResponseParams,
  OutDatedResponseParams2,
} from "../types/response.types";
import { getDate, getRandom } from ".";
import {
  PostVideoParams,
  OutdatedPhotoParams1,
  PhotoWithPreview,
  PostTemplateCommonParams,
} from "../types/utility.types";
import {
  generateAccount,
  generateAccountObject,
  generateAccountObjects,
  generateAccounts,
} from "./accounts";
import { CLIENT_ACCOUNT } from "../constants";
import { MOMENT_POSTER_BLURHASH, POST_PHOTO_BLURHASH } from "./blurHash";

export const captions = [
  `🌺🌺🌺

Styled by @riechamallick
Outfit @almaaribypooja
Jewellery @shopriyaaofficial
Makeup @ramesh.babu_makeupartist
Hair @mahesh_ravulapalli
Assistant @ig_atomicmonster
Clicked by @tdf.thedreamfilmer`,
  `smells like fall🍂
.
.
.
Dress: @commense.official
📸: @thenextmediaofficial
.
.
#nehajethwani #nehalians #fall`,
  `साड़ी और सादगी 💜`,
  `For times award in Vijaywada .
Wearing @payalsinghal
Shot by @media9manoj
Make up @makeupbymahendra7`,
  `Your Indian Snow White🤍

Captured by- @pranil_chintewar
Wearing- @samanthaajainstudio
Jewellery- @houseofqc @houseofjskjewels
Styled by- @shefalideora_
Make up- @ritikaturakhia01
`,
  `🌻🧡☀️
.
.
.
#nehajethwani #nehalians`,
  `🖤

PC by @rohitbagdi_rb

#explorepage #intagood #saarilove`,
  `Hola !! 👋🏼
.

Stylist - @jiva_karunya
Makeup- @athmi_makeupstories
Hair - @hairtales.by.punithavathy
📸 - @arunprasath_photography`,
  `Somewhere on your journey, don’t forget to turn around and enjoy the view 😍
#nomakeup #nofilter`,
  `blue eyes hypnotize teri kardi ai mennu

mua: @makeupartist_susmita ❤️
`,
  `A cute reminder❣️
.
.
.
#nehajethwani #nehalians
`,
  `Just 🌶️-ing!

For #lokmatstylishawards
📸- @harshal.bisare
Stylist - @its_mariyamm
Makeup - @makeupandhairbyriya
Hair - @ayushiiijainnn

Thank you @gladucamepr ❤️

#awardsnight #glam #photoshoot`,
  `nights like this.. ♡`,
  `Shade of red
For every woman ✨

📸@karanmehta_photography
💄 @the_gg_styles`,
  `Morning ☀️ 🐕 🐶
@devshreedeogarh`,
  `💙💙💙

Stylist - @style_by_pradnyaaaaa__
Photographer - @rk_fotografo
Makeup and Hair - @makeoverbysejalthakkar
Outfit - @upgradebya
Team - @greenlight__media`,
];

export const generatePostObject = (
  type?: "photo" | "moment"
): OutDatedResponseParams2 => {
  const noOfViews = getRandom(400000);

  const noOfLikes = getRandom(noOfViews);

  const noOfComments = getRandom(noOfLikes);

  const commonParams: PostTemplateCommonParams<AccountResponseParams> = {
    id: nanoid(),
    advancedOptions: {
      commentSetting: "all",
      disableCirculation: false,
      disableSharing: false,
      hideEngagementCount: false,
    },
    createdAt: getDate(),
    author: generateAccountObject(),
    engagementSummary: {
      noOfComments: noOfComments,
      noOfLikes: noOfLikes,
      noOfViews: noOfViews,
    },
    isLiked: Math.random() < 0.5 ? false : true,
    isPinned: Math.random() < 0.5 ? false : true,
    isSaved: Math.random() < 0.5 ? false : true,
    isUpdated: Math.random() < 0.5 ? false : true,
    isViewed: Math.random() < 0.5 ? false : true,
    taggedAccounts: generateAccountObjects(getRandom(6, 1)),
    caption: captions[getRandom(captions.length - 1)],
  };

  const postTypeIdentifier = type
    ? type === "photo"
      ? 1
      : 2
    : getRandom(2, 1);

  if (postTypeIdentifier === 1) {
    const noOfPhotos = getRandom(10, 1);

    const photos: OutdatedPhotoParams1[] = [];

    for (let i = 0; i < noOfPhotos; i++) {
      photos.push(PHOTOS[getRandom(PHOTOS.length - 1)]);
    }
    return {
      ...commonParams,
      postType: "photo",
      photos,
    };
  }

  return {
    postType: "moment",
    video: MOMENT_VIDEOS[getRandom(MOMENT_VIDEOS.length - 1)],
    ...commonParams,
  };
};

export const generatePostObjects = (
  size: number,
  type?: "photo" | "moment"
) => {
  const posts: OutDatedResponseParams2[] = [];
  for (let i = 0; i < size; i++) {
    posts.push(generatePostObject(type));
  }
  return posts;
};

export const generatePhotoPost = (): PhotoPostResponseParams => {
  const photos = generatePhotos(
    getRandom(Math.random() > 0.6 ? 1 : 10, 1)
  ).map<PostPhotoResponseParams>((photo) => ({
    ...photo,
    taggedAccounts:
      Math.random() > 0.6
        ? generateAccounts(getRandom(10, 1), [
            "fullname",
            "has-followed-client",
          ]).map<PostPhotoAccountTagResponseParams>((account) => ({
            account,
            position: [getRandom(90, 10), getRandom(90, 10)],
          }))
        : undefined,
  }));

  return {
    advancedSettings: {
      commentDisabled: false,
      hideLikesAndViewsCount: false,
    },
    author: generateAccount(["fullname"]),
    createdAt: new Date().toUTCString(),
    engagementSummary: {
      noOfComments: getRandom(100000, 10),
      noOfLikes: getRandom(1000000, 10),
      noOfViews: getRandom(1000000, 10),
    },
    id: nanoid(),
    metadata: {
      href: "",
      isLiked: Math.random() > 0.5,
      isPinned: Math.random() > 0.5,
      isSaved: Math.random() > 0.5,
      isViewed: Math.random() > 0.5,
    },
    caption:
      Math.random() > 0
        ? captions[getRandom(captions.length - 1, 0)]
        : undefined,
    taggedLocation:
      Math.random() > 0
        ? { id: nanoid(), name: "kolkata city of joy" }
        : undefined,
    usedAudio:
      Math.random() > 0
        ? {
            id: nanoid(),
            title: "JAILER - Hukum Lyric Video",
            uri: "",
            usedSection: [0, 0],
          }
        : undefined,
    photos,
  };
};

export const generatePhotos = (count: number): PhotoWithPreview[] => {
  const photos: PhotoWithPreview[] = [];

  for (let i = 0; i < count; i++) {
    const index = getRandom(30, 1);

    photos.push({
      uri: getPostPhotoUrl(index),
      blurhash: POST_PHOTO_BLURHASH[index - 1],
      preview: getPostPhotoPreviewUrl(index),
    });
  }

  return photos;
};

export const generateMomentPost = (): MomentPostResponseParams => {
  return {
    advancedSettings: {
      commentDisabled: false,
      hideLikesAndViewsCount: false,
    },
    author: generateAccount(["fullname"]),
    createdAt: new Date().toUTCString(),
    engagementSummary: {
      noOfComments: getRandom(100000, 10),
      noOfLikes: getRandom(1000000, 10),
      noOfViews: getRandom(1000000, 10),
    },
    id: nanoid(),
    metadata: {
      href: "",
      isLiked: Math.random() > 0.5,
      isPinned: Math.random() > 0.5,
      isSaved: Math.random() > 0.5,
      isViewed: Math.random() > 0.5,
    },
    video: generateVideo(),
    taggedAccounts:
      Math.random() > 0.6
        ? generateAccounts(getRandom(10, 1), [
            "fullname",
            "has-followed-client",
          ])
        : undefined,
    caption:
      Math.random() > 0.3
        ? captions[getRandom(captions.length - 1, 0)]
        : undefined,
    taggedLocation:
      Math.random() > 0.6
        ? { id: nanoid(), name: "kolkata city of joy" }
        : undefined,
    usedAudio:
      Math.random() > 0
        ? {
            id: nanoid(),
            title: "JAILER - Hukum Lyric Video",
          }
        : undefined,
  };
};

export const generateMomentPosts = (count: number) => {
  const posts: MomentPostResponseParams[] = [];

  for (let i = 0; i < count; i++) {
    posts.push(generateMomentPost());
  }

  return posts;
};

export const generatePhotoPosts = (count: number) => {
  const posts: PhotoPostResponseParams[] = [];

  for (let i = 0; i < count; i++) {
    posts.push(generatePhotoPost());
  }

  return posts;
};

export const generateVideo = (): PostVideoParams => {
  const index = getRandom(30, 1);

  return {
    uri: getPostMomentVideoUrl(index),
    duration: 0,
    preview: "",
    poster: {
      blurhash: MOMENT_POSTER_BLURHASH[index - 1],
      uri: getMomentVideoPosterUri(index),
    },
    muted: Math.random() > 0.7,
  };
};

export const generatePost = (count: number, type?: "photos" | "moments") => {
  const posts: PostResponseParams[] = [];

  for (let i = 0; i < count; i++) {
    if (!type) {
      if (Math.random() > 0.5) {
        posts.push({ type: "photo-post", ...generatePhotoPost() });
      } else {
        posts.push({ type: "moment-post", ...generateMomentPost() });
      }
    } else if (type === "photos") {
      posts.push({ type: "photo-post", ...generatePhotoPost() });
    } else {
      posts.push({ type: "moment-post", ...generateMomentPost() });
    }
  }

  return posts;
};

export const generateComment = (
  postId: string,
  commentId?: string
): CommentResponseParams => {
  return {
    id: nanoid(),
    pinned: commentId ? false : Math.random() > 0.7,
    postId,
    author: generateAccount(),
    createdAt: new Date().toUTCString(),
    isLiked: Math.random() > 0.7,
    noOfLikes: Math.random() > 0.3 ? getRandom(1000, 1) : 0,
    text: captions[getRandom(captions.length - 1)],
    repliedTo: commentId,
    noOfReplies: commentId ? 0 : Math.random() > 0.5 ? 0 : getRandom(1000, 1),
  };
};

export const generateComments = (
  count: number,
  postId: string,
  commentId?: string
): CommentResponseParams[] => {
  const comments: CommentResponseParams[] = [];

  for (let i = 0; i < count; i++) {
    comments.push(generateComment(postId, commentId));
  }

  return comments;
};

export const generateNewComment = (
  postId: string,
  text: string,
  repliedTo?: string
): CommentResponseParams => {
  return {
    id: nanoid(),
    author: CLIENT_ACCOUNT,
    createdAt: new Date().toUTCString(),
    isLiked: false,
    noOfLikes: 0,
    noOfReplies: 0,
    pinned: false,
    postId,
    text,
    repliedTo,
  };
};
