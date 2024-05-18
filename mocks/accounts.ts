import { nanoid } from "@reduxjs/toolkit";
import { getProfilePictureUrl } from "./data";
import { AccountResponseParams } from "../types/response.types";
import { getRandom } from ".";
import { AccountField, AccountParams } from "../types/utility.types";

const usernames = [
  "bhavin_333",
  "sonalikul",
  "sharanyantics",
  "shrushtijainn",
  "urmillathakka22",
  "kohlihimansh",
  "hardiksharma.a",
  "shambhavi1997",
  "payalgamingg",
  "_rajat",
  "_itz_shinu_",
  "vans_hika8142",
  "nandini_jaiswal_29",
  "jaimin_009",
  "mich.sharonnnn",
  "ptl_jayshri_14",
  "ahmedkhan_3012",
  "zaiduu_here",
  "patel_dhaval_005",
  "iamkrish.___",
];

const fullnames = [
  "Krish Patel",
  "dipti sharma❣",
  "patel_dhaval_005",
  "patel_dhaval_00Ethesham Ahmed Khan5",
  "ptl_jayshri_🍁",
  "M I C H 🤍",
  "Jaimin Mangroliya",
  "Nandini Jaiswal 🔥🌝",
  "Vanshika kamboj",
  "Medico",
  "Payal Gaming",
  "anewsa patidar",
  "Shambhavi Singh",
  "Hardik Sharma",
  "Himansh Kohli",
  "urmilla",
  "Shrushti",
  "Sharanya Rajgopal",
  "Sonali Kulkarni",
  "Bhavin Bhanushali 🇮🇳",
];

const bios = [
  `#arusquad
snap: aryanshiiiii
Himachal || INDORE 📍`,

  `Be a miracle. ✨`,

  `📍Mumbai
1.8M on Snapchat
Mgmt: @castingbeans
Mail: castingbeanstalents@gmail.com`,

  `Authenticity is power💫
#12thFail streaming on @disneyplushotstar
`,

  `not adulting today
`,

  `Coffee addict, occasional poet, forever grooving & an intuitive actor.
Twitter: tamannaahspeaks`,

  `Managed by @svfbrands
📍Kolkata
📩 priyankamitra06@gmail.com`,

  `Here to stay ♾
Growing and glowing ✨
Managed by @madify.official
`,

  `@thriftxpayal
@s8ul.esports CC
Managed by - @8bit_creatives
`,

  `Mumbai, India📍
Snapchat: navika_k
Managed by: @spatel2209`,

  `🌱 Podcast @kindnesswithamy
📈 Director @meatlessmeetmore
🍀 Ambassador @genv_eng`,

  `For inquiries - aliyahamidi0@gmail.com
Tap on link in bio to watch my latest music videos`,

  `Ssup peaches?
It’d be great to watch sunsets together 🏜️
.`,

  `Live life to the fullest..🗽
Fashion • Lifestyle • Creator
MGMT @mrmayankm
Snapchat : Gima_ashi`,

  `Air hugs :)
Live and let Live♥️`,

  `#Dimple #Anupamaa
DEL | BOM📍
For collaborations`,

  `Magnificently cursed ✨
Archie in Half Ca, Mahi in Sisters, Akanksha in Hostel daze
& the biggest Taylor Swift fan you might know.`,

  `You probably mispronounced my name:)
✨Your reel life shinchan✨
Managed by: @monkentertainment
Tumhaara dil📍`,

  `👉DANCER 👈,a simple person 💃,want'$ to be something DIFFERENT`,

  `📍Delhi
Backup account: @kanishkasss_03
Business queries : kanishkasharmabusiness@gmail.com
YouTube👇🏻`,
];

export const generateAccountObject = (includeFields?: AccountField[]) => {
  const account: AccountResponseParams = {
    id: nanoid(10),
    userId: usernames[getRandom(usernames.length - 1)] + nanoid(6),
    profilePictureUri: getProfilePictureUrl(getRandom(40)),
  };

  if (includeFields) {
    if (includeFields.includes("bio")) {
      account.bio = bios[getRandom(bios.length - 1)];
    }

    if (includeFields.includes("has-followed-client")) {
      account.hasFollowedClient = Math.random() > 0.5;
    }
    if (includeFields.includes("has-requeste-to-follow-client")) {
      account.hasRequestedToFollowClient = account.hasFollowedClient
        ? false
        : Math.random() > 0.5;
    }
    if (includeFields.includes("is-available")) {
      account.isAvailable = Math.random() > 0.5;
    }
    if (includeFields.includes("is-blocked")) {
      account.isBlocked = Math.random() > 0.5;
    }

    if (includeFields.includes("is-followed")) {
      account.isFollowed = Math.random() > 0.5;
    }
    if (includeFields.includes("is-favourite")) {
      account.isFavourite = account.isFollowed ? Math.random() > 0.5 : false;
    }
    if (includeFields.includes("is-memory-hidden")) {
      account.isMemoryHidden = Math.random() > 0.5;
    }
    if (includeFields.includes("is-private")) {
      account.isPrivate = Math.random() > 0.5;
    }
    if (includeFields.includes("is-requested-to-follow")) {
      account.isRequestedToFollow = account.isFollowed
        ? false
        : Math.random() > 0.5;
    }

    if (includeFields.includes("no-of-followers")) {
      account.noOfFollowers = getRandom(1000000, 100);
    }
    if (includeFields.includes("no-of-followings")) {
      account.noOfFollowings = getRandom(700, 5);
    }
    if (includeFields.includes("no-of-posts")) {
      account.noOfPosts = getRandom(100, 9);
    }
  }

  return account;
};

export const generateAccount = (includeFields?: AccountField[]) => {
  const account: AccountParams = {
    id: nanoid(10),
    userId: usernames[getRandom(usernames.length - 1)] + nanoid(6),
    profilePictureUri: getProfilePictureUrl(getRandom(30, 1)),
  };

  if (includeFields) {
    if (includeFields.includes("name")) {
      account.name = fullnames[getRandom(fullnames.length - 1)];
    }

    if (includeFields.includes("bio")) {
      account.bio = bios[getRandom(bios.length - 1)];
    }
    if (includeFields.includes("is-blocked")) {
      account.isBlocked = Math.random() > 0.85;
    }
    if (includeFields.includes("is-available")) {
      account.isAvailable = Math.random() > 0.85;
    }
    if (includeFields.includes("is-private")) {
      account.isPrivate = Math.random() > 0.8;
    }
    if (includeFields.includes("has-followed-client")) {
      account.hasFollowedClient = !account.isBlocked && Math.random() > 0.5;
    }
    if (includeFields.includes("has-requeste-to-follow-client")) {
      account.hasRequestedToFollowClient =
        !account.hasFollowedClient && !account.isBlocked && Math.random() > 0.5;
    }
    if (includeFields.includes("is-followed")) {
      account.isFollowed =
        !account.isBlocked && !account.isAvailable && Math.random() > 0.5;
    }
    if (includeFields.includes("is-favourite")) {
      account.isFavourite = account.isFollowed && Math.random() > 0.5;
    }
    if (includeFields.includes("is-memory-hidden")) {
      account.isMemoryHidden = Math.random() > 0.5;
    }

    if (includeFields.includes("is-requested-to-follow")) {
      account.isRequestedToFollow =
        account.isFollowed === false &&
        account.isPrivate &&
        Math.random() > 0.5;
    }

    if (includeFields.includes("no-of-followers")) {
      account.noOfFollowers = getRandom(1000000, 100);
    }
    if (includeFields.includes("no-of-followings")) {
      account.noOfFollowings = getRandom(700, 5);
    }
    if (includeFields.includes("no-of-posts")) {
      const count = Math.random() > -1 ? getRandom(100, 9) : 0;
      account.noOfPosts = count;
      if (includeFields.includes("post-meta")) {
        account.postMeta = {
          hasMoments: count && Math.random() > 0.3 ? true : false,
          hasPhotos: count && Math.random() > 0.3 ? true : false,
        };
      }
    }

    if (includeFields.includes("no-of-tagged-posts")) {
      account.noOfTaggedPosts = Math.random() > 0.4 ? getRandom(1, 100) : 0;
    }

    if (includeFields.includes("memory-info")) {
      const count = Math.random() > 0.4 ? getRandom(10, 1) : 0;
      account.memoryInfo = {
        noOfAvailableMemories: count,
        noOfUnseenMemories: count,
      };
    }

    if (includeFields.includes("mute-settings") && account.isFollowed) {
      account.muteSettings = { memory: false, post: false };
    }

    if (includeFields.includes("notification-settings") && account.isFollowed) {
      account.notificationSettings = {
        memory: false,
        moment: false,
        photo: false,
      };
    }
  }

  return account;
};

export const generateAccounts = (
  count: number,
  includeFields?: AccountField[]
) => {
  const accounts: AccountParams[] = [];

  for (let i = 0; i < count; i++) {
    accounts.push(generateAccount(includeFields));
  }

  return accounts;
};

export const generateAccountObjects = (
  size: number,
  includeFields?: AccountField[]
) => {
  const accounts: AccountResponseParams[] = [];

  for (let i = 0; i < size; i++) {
    accounts.push(generateAccountObject(includeFields));
  }
  return accounts;
};
