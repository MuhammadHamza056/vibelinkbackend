// Mirrors the Flutter frontend's core/constants/app_constants.dart so the
// backend stays consistent with the client's expectations.

export const XP_PER_LEVEL = 1000;
export const MAX_LEVEL = 50;
export const BURNOUT_THRESHOLD_DAYS = 14;
export const MIN_VIBE_MATCH_SCORE = 0.6;
export const MATCH_RADIUS_METERS = 5000;
export const CHALLENGE_MIN_MINUTES = 5;
export const CHALLENGE_MAX_MINUTES = 20;

// Canonical vibe tags (12).
export const VIBE_TAGS = [
  'Creative',
  'Adventurous',
  'Chill',
  'Foodie',
  'Musical',
  'Sporty',
  'Bookworm',
  'Gamer',
  'Traveler',
  'Artsy',
  'Techie',
  'Nature',
] as const;
export type VibeTag = (typeof VIBE_TAGS)[number];

// Challenge category emojis (12).
export const CHALLENGE_EMOJIS = [
  '🎯',
  '🎨',
  '🏃',
  '🧘',
  '🍕',
  '🎵',
  '📚',
  '🎮',
  '✈️',
  '☕',
  '🌳',
  '💬',
] as const;

export enum ChallengeCategory {
  social = 'social',
  creative = 'creative',
  physical = 'physical',
  mindful = 'mindful',
  foodie = 'foodie',
  music = 'music',
}

export enum ChallengeDifficulty {
  easy = 'easy',
  medium = 'medium',
  hard = 'hard',
}

export enum ChallengeStatus {
  available = 'available',
  active = 'active',
  completed = 'completed',
  expired = 'expired',
}

export enum AuthProvider {
  email = 'email',
  google = 'google',
  apple = 'apple',
}

export enum ConnectionStatus {
  pending = 'pending',
  accepted = 'accepted',
  rejected = 'rejected',
}
