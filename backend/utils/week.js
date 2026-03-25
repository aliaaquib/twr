const getIsoWeekData = (date = new Date()) => {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNumber = target.getUTCDay() || 7;

  target.setUTCDate(target.getUTCDate() + 4 - dayNumber);

  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  const weekNumber = Math.ceil((((target - yearStart) / 86400000) + 1) / 7);

  return {
    year: target.getUTCFullYear(),
    weekNumber,
  };
};

const formatEditorialWeek = (date = new Date()) => {
  const { year, weekNumber } = getIsoWeekData(date);
  return `Week ${weekNumber}, ${year}`;
};

module.exports = {
  formatEditorialWeek,
};

