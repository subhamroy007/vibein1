import { nanoid } from "@reduxjs/toolkit";
import { MOMENT_VIDEOS, PHOTOS } from "./data";
import {
  AccountResponseParams,
  ChatResponseParams,
  MessageResponseParams,
  PostResponseParams,
} from "../types/response.types";
import { getDate, getRandom } from ".";
import {
  PostPhotoParams,
  PostTemplateCommonParams,
} from "../types/utility.types";
import { generateAccountObject, generateAccountObjects } from "./accounts";

const captions = [
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
): PostResponseParams => {
  const noOfViews = getRandom(400000);

  const noOfLikes = getRandom(noOfViews);

  const noOfComments = getRandom(noOfLikes);

  const commonParams: PostTemplateCommonParams<AccountResponseParams> = {
    _id: nanoid(),
    advancedOptions: {
      commentSetting: "all",
      disableCirculation: false,
      disableSharing: false,
      hideEngagementCount: false,
    },
    createdAt: getDate(),
    createdBy: generateAccountObject(),
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

    const photos: PostPhotoParams[] = [];

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
  const posts: PostResponseParams[] = [];
  for (let i = 0; i < size; i++) {
    posts.push(generatePostObject(type));
  }
  return posts;
};

export const generateMessageObject = (): MessageResponseParams => {
  return {
    id: nanoid(),
    likes: [],
    createdAt: new Date().toUTCString(),
    createdBy: generateAccountObject(),
    body: {
      text: "Hi, are u free tonight",
    },
  };
};

export const generateMessageObjects = (size: number) => {
  const messages: MessageResponseParams[] = [];

  for (let i = 0; i < size; i++) {
    messages.push(generateMessageObject());
  }
  return messages;
};

export const generateChatObject = (): ChatResponseParams => {
  const account = generateAccountObject();

  return {
    id: account._id,
    recentMessages: generateMessageObjects(8),
    receipient: {
      account: generateAccountObject(),
      lastActiveAt: new Date().toUTCString(),
    },
    noOfUnseenMessages: getRandom(10, 0) > 7 ? 0 : getRandom(300, 1),
    joinedAt: new Date().toUTCString(),
  };
};

export const generateChatObjects = (size: number) => {
  const chats: ChatResponseParams[] = [];

  for (let i = 0; i < size; i++) {
    chats.push(generateChatObject());
  }

  return chats;
};
