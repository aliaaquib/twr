"use client";

import { useEffect, useState } from "react";

const TARGET_UTC_DAY = 3;
const TARGET_UTC_HOUR = 17;
const TARGET_UTC_MINUTE = 42;
const ZERO_LABEL = "new article coming in 0 days : 00 : 00 : 00";

const getEditorialWeekLabel = (date = new Date()) => {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNumber = target.getUTCDay() || 7;

  target.setUTCDate(target.getUTCDate() + 4 - dayNumber);

  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  const weekNumber = Math.ceil((((target - yearStart) / 86400000) + 1) / 7);

  return `Week ${weekNumber}, ${target.getUTCFullYear()}`;
};

const getThisWeekReleaseDate = (now = new Date()) => {
  const current = new Date(now);
  const target = new Date(current);

  target.setUTCHours(TARGET_UTC_HOUR, TARGET_UTC_MINUTE, 0, 0);

  const currentDay = current.getUTCDay();
  const dayDifference = TARGET_UTC_DAY - currentDay;
  target.setUTCDate(current.getUTCDate() + dayDifference);

  return target;
};

const getCountdownText = (latestWeeklyArticleDate, latestWeeklyArticleWeek) => {
  const now = new Date();
  const thisWeekRelease = getThisWeekReleaseDate(now);
  const latestWeeklyArticleTime = latestWeeklyArticleDate
    ? new Date(latestWeeklyArticleDate).getTime()
    : 0;
  const currentEditorialWeek = getEditorialWeekLabel(now);
  const hasCurrentWeekArticle = latestWeeklyArticleWeek === currentEditorialWeek;

  if (
    now.getTime() > thisWeekRelease.getTime() &&
    latestWeeklyArticleTime < thisWeekRelease.getTime() &&
    !hasCurrentWeekArticle
  ) {
    return ZERO_LABEL;
  }

  const nextRelease =
    now.getTime() <= thisWeekRelease.getTime() && !hasCurrentWeekArticle
      ? thisWeekRelease
      : new Date(thisWeekRelease.getTime() + 7 * 24 * 60 * 60 * 1000);

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
    setLabel(getCountdownText(latestWeeklyArticleDate, latestWeeklyArticleWeek));

    const intervalId = window.setInterval(() => {
      setLabel(getCountdownText(latestWeeklyArticleDate, latestWeeklyArticleWeek));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [latestWeeklyArticleDate, latestWeeklyArticleWeek]);

  return <p className="text-sm text-stone-500 dark:text-stone-400">{label}</p>;
}
