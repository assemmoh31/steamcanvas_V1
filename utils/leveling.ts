
export const LEVEL_THRESHOLDS = [
  { level: 0, min: 0, name: 'Starter' },
  { level: 1, min: 2500, name: 'Bronze' },
  { level: 2, min: 15000, name: 'Silver' },
  { level: 3, min: 50000, name: 'Gold' },
  { level: 4, min: 125000, name: 'Diamond' },
  { level: 5, min: 250000, name: 'Mythic' },
];

export interface LevelInfo {
  level: number;
  tierName: string;
  currentXP: number;
  nextLevelXP: number | null;
  progressPercent: number;
}

export const calculateCreatorLevel = (totalSales: number): LevelInfo => {
  let currentLevel = 0;
  let tierName = 'Starter';
  
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalSales >= LEVEL_THRESHOLDS[i].min) {
      currentLevel = LEVEL_THRESHOLDS[i].level;
      tierName = LEVEL_THRESHOLDS[i].name;
      break;
    }
  }

  const nextThreshold = LEVEL_THRESHOLDS.find(t => t.level === currentLevel + 1);
  const currentThreshold = LEVEL_THRESHOLDS.find(t => t.level === currentLevel)!;

  if (!nextThreshold) {
    return { level: currentLevel, tierName, currentXP: totalSales, nextLevelXP: null, progressPercent: 100 };
  }

  const range = nextThreshold.min - currentThreshold.min;
  const progressInLevel = totalSales - currentThreshold.min;
  const percent = Math.min(Math.max((progressInLevel / range) * 100, 0), 100);

  return {
    level: currentLevel,
    tierName,
    currentXP: totalSales,
    nextLevelXP: nextThreshold.min,
    progressPercent: percent,
  };
};
