export const standardizedLevel = (level: string): string => {
  const normalizedLevel = level.trim().toLowerCase();
  if (
    [
      "l1",
      "l2",
      "l3",
      "e1",
      "e2",
      "sde1",
      "junior engineer",
      "junior developer",
    ].includes(normalizedLevel)
  ) {
    return "Junior";
  }
  if (
    [
      "l4",
      "l5",
      "e3",
      "e4",
      "sde2",
      "mid engineer",
      "mid level developer",
      "mid developer",
    ].includes(normalizedLevel)
  ) {
    return "Mid";
  }
  if (
    [
      "l6",
      "l7",
      "l8",
      "e5",
      "sde3",
      "sde4",
      "senior engineer",
      "senior developer",
    ].includes(normalizedLevel)
  ) {
    return "Senior";
  }
  if (
    [
      "l9",
      "l10",
      "e6",
      "e7",
      "sde5",
      "sde6",
      "principal engineer",
      "principal developer",
      "staff engineer",
      "staff developer",
    ].includes(normalizedLevel)
  ) {
    return "Staff";
  }

  return "Unknown";
};
