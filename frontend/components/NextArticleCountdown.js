"use client";

import { useEffect, useState } from "react";

const TIMEZONE = "Asia/Bishkek";
const TARGET_LOCAL_DAY = 6;
const TARGET_LOCAL_HOUR = 10;
const TARGET_LOCAL_MINUTE = 0;
const ZERO_LABEL = "new article coming in 0 days : 00 : 00 : 00";

const WEEKDAY_TO_INDEX = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

const getTimezoneParts = (date = new Date()) => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);

  return {
    weekday: WEEKDAY_TO_INDEX[parts.find((part) => part.type === "weekday")?.value] ?? 0,
    year: Number(parts.find((part) => part.type === "year")?.value),
    month: Number(parts.find((part) => part.type === "month")?.value),
    day: Number(parts.find((part) => part.type === "day")?.value),
    hour: Number(parts.find((part) => part.type === "hour")?.value),
    minute: Number(parts.find((part) => part.type === "minute")?.value),
    second: Number(parts.find((part) => part.type === "second")?.value),
  };
};

const getNextReleaseDate = (now = new Date()) => {
  const current = getTimezoneParts(now);
  let daysUntilTarget = (TARGET_LOCAL_DAY - current.weekday + 7) % 7;
  const isPastTodayRelease =
    daysUntilTarget === 0 &&
    (current.hour > TARGET_LOCAL_HOUR ||
      (current.hour === TARGET_LOCAL_HOUR && current.minute >= TARGET_LOCAL_MINUTE));

  if (isPastTodayRelease) {
    daysUntilTarget = 7;
  }

  return new Date(
    Date.UTC(
      current.year,
      current.month - 1,
      current.day + daysUntilTarget,
      TARGET_LOCAL_HOUR - 6,
      TARGET_LOCAL_MINUTE,
      0,
      0
    )
  );
};

const getCountdownText = () => {
  const now = new Date();
  const nextRelease = getNextReleaseDate(now);
  const diff = nextRelease.getTime() - now.getTime();

  if (diff <= 0) {
    return ZERO_LABEL;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const formatUnit = (value) => String(value).padStart(2, "0");

  return `new article coming in ${days} days : ${formatUnit(hours)} : ${formatUnit(minutes)} : ${formatUnit(seconds)}`;
};

export default function NextArticleCountdown({
  latestWeeklyArticleDate = null,
  latestWeeklyArticleWeek = "",
}) {
  const [label, setLabel] = useState("new article coming in -- days : -- : -- : --");

  useEffect(() => {
    setLabel(getCountdownText());

    const intervalId = window.setInterval(() => {
      setLabel(getCountdownText());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [latestWeeklyArticleDate, latestWeeklyArticleWeek]);

  return <p className="text-sm text-stone-500 dark:text-stone-400">{label}</p>;
}
