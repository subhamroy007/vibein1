import { createAsyncThunk } from "@reduxjs/toolkit";
import { AsyncThunkConfig } from "./types/utility.types";
import { MessageResponseParams } from "./types/response.types";

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
