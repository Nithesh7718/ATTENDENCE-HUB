import { differenceInCalendarDays, parseISO } from "date-fns";

export const buildAttendanceMap = (records = []) => {
  const map = new Map();
  records.forEach((record) => {
    map.set(record.date, record.status);
  });
  return map;
};

const toDateKey = (value) => {
  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, "0");
  const day = `${value.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const calculateStreak = (records = []) => {
  const today = toDateKey(new Date());
  // A streak counts consecutive present days ending at (or before) today.
  // If the most recent record is older than yesterday, the streak is broken
  // by an untracked gap and counts as zero.
  const sorted = [...records].sort((a, b) => b.date.localeCompare(a.date));
  const mostRecent = sorted[0];
  if (!mostRecent) {
    return 0;
  }
  if (mostRecent.status !== "Present") {
    return 0;
  }
  const mostRecentDaysAgo = differenceInCalendarDays(parseISO(today), parseISO(mostRecent.date));
  if (mostRecentDaysAgo > 1) {
    return 0;
  }

  let streak = 0;
  let lastDate = mostRecent.date;

  for (const record of sorted) {
    if (record.status !== "Present") break;
    if (streak === 0) {
      streak = 1;
      continue;
    }
    const diff = differenceInCalendarDays(parseISO(lastDate), parseISO(record.date));
    if (diff === 1) {
      streak += 1;
      lastDate = record.date;
    } else {
      break;
    }
  }

  return streak;
};
