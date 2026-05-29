import { XP_PER_LEVEL } from './constants/app.constants';

// Client-derived leveling math, kept server-side so responses agree with the UI.
export function levelFromXp(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function xpToNextLevel(xp: number): number {
  return XP_PER_LEVEL - (xp % XP_PER_LEVEL);
}

export function levelProgress(xp: number): number {
  return (xp % XP_PER_LEVEL) / XP_PER_LEVEL;
}

export function levelTitle(level: number): string {
  if (level < 5) return 'Spark';
  if (level < 10) return 'Connector';
  if (level < 20) return 'Vibe Weaver';
  if (level < 35) return 'Social Legend';
  return 'VibeLink Master';
}
