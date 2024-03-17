import { createAsyncThunk } from "@reduxjs/toolkit";
import { AsyncThunkConfig } from "./types/utility.types";
import { MessageResponseParams } from "./types/response.types";
import { FFmpegKit } from "ffmpeg-kit-react-native";
import * as FileSystem from "expo-file-system";

export function formatTimeDifference(utcDateString: string): string {
  const utcDate = new Date(utcDateString);
  const currentDate = new Date();

  const timeDifferenceInMilliseconds =
    currentDate.getTime() - utcDate.getTime();
  const timeDifferenceInSeconds = Math.floor(
    timeDifferenceInMilliseconds / 1000
  );

  if (timeDifferenceInSeconds < 60) {
    return "just now";
  } else if (timeDifferenceInSeconds < 3600) {
    const minutes = Math.floor(timeDifferenceInSeconds / 60);
    return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
  } else if (timeDifferenceInSeconds < 86400) {
    const hours = Math.floor(timeDifferenceInSeconds / 3600);
    return `${hours} hr${hours > 1 ? "s" : ""} ago`;
  } else if (timeDifferenceInSeconds < 604800) {
    const days = Math.floor(timeDifferenceInSeconds / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (timeDifferenceInSeconds < 2419200) {
    const weeks = Math.floor(timeDifferenceInSeconds / 604800);
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  } else if (timeDifferenceInSeconds < 29030400) {
    const months = Math.floor(timeDifferenceInSeconds / 2419200);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  } else {
    const years = Math.floor(timeDifferenceInSeconds / 29030400);
    return `${years} yr${years > 1 ? "s" : ""} ago`;
  }
}

export function formatNumber(n: number): string {
  if (n < 1000) {
    return n.toString();
  } else if (n < 1e6) {
    return `${Math.floor(n / 1000)}k`;
  } else if (n < 1e9) {
    return `${Math.floor(n / 1e6)}m`;
  } else {
    return `${Math.floor(n / 1e9)}b`;
  }
}

export const createAppAsyncThunk =
  createAsyncThunk.withTypes<AsyncThunkConfig>();

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today.getTime() - 86400000); // Subtract a day in milliseconds

  if (date.getDate() === today.getDate()) {
    // Today
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  } else if (date.getDate() === yesterday.getDate()) {
    // Yesterday
    return "Yesterday";
  } else {
    // Other dates
    const year = date.getFullYear().toString().slice(-2); // Two-digit year
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is 0-indexed
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}/${month}/${day}`;
  }
}

export function groupMessagesByDate(messages: MessageResponseParams[]) {
  const sections: {
    date: string;
    messages: string[];
  }[] = [];
  const today = new Date();
  const yesterday = new Date(today.getTime() - 86400000); // Subtract a day in milliseconds

  messages.sort((a, b) => {
    // Sort messages in descending order by timestamp
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  let currentDateSection: { date: string; messages: string[] } | undefined;

  for (const message of messages) {
    const date = new Date(message.createdAt);
    const formattedDate = formatDate(date.getTime()); // Use the formatDate function from previous response

    if (!currentDateSection || currentDateSection.date !== formattedDate) {
      currentDateSection = { date: formattedDate, messages: [] };
      sections.push(currentDateSection);
    }

    currentDateSection.messages.push(message.id);
  }

  return sections;
}

export function formatTime24Hour(milliseconds: number): string {
  const date = new Date(milliseconds);
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");

  // Ensure 24-hour format for hours:
  const formattedHours = hours % 24; // Handle hours greater than 23

  return `${formattedHours.toString().padStart(2, "0")}:${minutes}`;
}

export function getLocalTimeStringFromUTC(utcDateString: string): string {
  try {
    // Create a Date object from the UTC string, ensuring correct format handling
    const utcDate = new Date(utcDateString.replace(/-/g, "/"));

    // Get the local hour and minute values in 0-24 format
    const hours = utcDate.getHours();
    const minutes = utcDate.getMinutes().toString().padStart(2, "0");

    // Format the local time string with leading zeros for minutes
    return `${hours}:${minutes}`;
  } catch (error) {
    // Handle potential errors with input string or date parsing
    return "00:00";
  }
}

export function getRelativeTimeString(utcDateString: string): string {
  // Create Date objects for UTC input and current time
  const utcDate = new Date(utcDateString.replace(/-/g, "/"));
  const now = new Date();

  // Calculate the difference in milliseconds
  const diffMs = now.getTime() - utcDate.getTime();

  // Calculate difference in seconds, minutes, hours, days, weeks, months, and years
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30.4375); // Approximate months for accuracy
  const years = Math.floor(months / 12);

  // Determine the appropriate time unit based on difference
  let unit: string = "";
  let value: number = 0;
  if (seconds < 60) {
    unit = "just now";
  } else if (minutes < 60) {
    value = minutes;
    unit = value === 1 ? "minute" : "minutes";
  } else if (hours < 24) {
    value = hours;
    unit = value === 1 ? "hour" : "hours";
  } else if (days < 7) {
    value = days;
    unit = value === 1 ? "day" : "days";
  } else if (weeks < 4) {
    value = weeks;
    unit = value === 1 ? "week" : "weeks";
  } else if (months < 12) {
    value = months;
    unit = value === 1 ? "month" : "months";
  } else {
    value = years;
    unit = value === 1 ? "year" : "years";
  }

  // Return the formatted relative time string
  return value ? `${value} ${unit}` : unit;
}

export function getTop3MostRepeatedEmojis(
  reactions: { reactionEmoji: string }[]
): string {
  // Create a map to store emoji counts
  const emojiCounts = new Map<string, number>();
  for (const reaction of reactions) {
    emojiCounts.set(
      reaction.reactionEmoji,
      (emojiCounts.get(reaction.reactionEmoji) ?? 0) + 1
    );
  }

  // Convert map entries to an array of [emoji, count] pairs
  const emojiCountEntries = Array.from(emojiCounts.entries());

  // Sort the array in descending order by count
  emojiCountEntries.sort((a, b) => b[1] - a[1]);

  // Extract the top 3 emojis, handling cases with less than 3 unique emojis
  const top3Emojis = emojiCountEntries
    .slice(0, Math.min(3, emojiCountEntries.length))
    .map(([emoji]) => emoji);

  return top3Emojis.join();
}

export async function generateVideoThumbnail(
  videoUri: string,
  thumbnailUri: string
) {
  const targetFile = await FileSystem.getInfoAsync(thumbnailUri);
  if (!targetFile.exists) {
    await FFmpegKit.execute(
      `-i ${videoUri} -vf "thumbnail,scale=300:300:force_original_aspect_ratio=decrease" -frames:v 1 ${thumbnailUri}`
    );
  }
}
