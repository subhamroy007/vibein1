import { nanoid } from "@reduxjs/toolkit";
import { getProfilePictureUrl } from "./data";
import { AccountResponseParams } from "../types/response.types";
import { getRandom } from ".";

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
  "_bachuuuu",
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
  "ᴹᴿ°᭄ⓩⒶⒾⒹ❣",
  "patel_dhaval_005",
  "patel_dhaval_00Ethesham Ahmed Khan5",
  "ptl_jayshri_🍁",
  "M I C H 🤍",
  "Jaimin Mangroliya",
  "Nandini Jaiswal 🔥🌝",
  "Vanshika kamboj",
  "Medico",
  "Payal Gaming",
  "_bachuuuu",
  "Shambhavi Singh",
  "Hardik Sharma",
  "Himansh Kohli",
  "urmilla",
  "Shrushti",
  "Sharanya Rajgopal",
  "Sonali Kulkarni",
  "Bhavin Bhanushali 🇮🇳",
];

export const generateAccountObject = () => {
  const account: AccountResponseParams = {
    _id: nanoid(),
    username: usernames[getRandom(usernames.length - 1)],
    profilePictureUrl: getProfilePictureUrl(getRandom(40)),
    isActive: true,
    hasRequestedToFollow: false,
    isAvailable: true,
    isBlocked: false,
    isFollowed: false,
    isFollowing: Math.random() < 0.5 ? true : false,
    isPrivate: false,
  };

  const fullname = fullnames[getRandom(fullnames.length - 1)];
  account["fullname"] = fullname;

  return account;
};

export const generateAccountObjects = (size: number) => {
  const accounts: AccountResponseParams[] = [];

  for (let i = 0; i < size; i++) {
    accounts.push(generateAccountObject());
  }
  return accounts;
};
