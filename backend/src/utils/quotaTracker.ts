let quotaResetTime: number | null = null;

export const setQuotaResetTime = () => {
  const now = new Date();

  const midnightUTC = new Date();
  midnightUTC.setUTCHours(24, 0, 0, 0);

  quotaResetTime = midnightUTC.getTime();
};

export const isQuotaBlocked = () => {
  if (!quotaResetTime) return false;

  return Date.now() < quotaResetTime;
};


export const getRemainingTime = () => {
  if (!quotaResetTime) return 0;
  return quotaResetTime - Date.now();
};
