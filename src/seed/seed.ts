/* eslint-disable no-console */
import 'reflect-metadata';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import { ChallengeSchema } from '../challenges/schemas/challenge.schema';
import {
  ChallengeCategory,
  ChallengeDifficulty,
} from '../common/constants/app.constants';

dotenv.config();

const CHALLENGES = [
  {
    title: 'Compliment a stranger',
    description: 'Give a genuine compliment to someone you don’t know.',
    emoji: '💬',
    category: ChallengeCategory.social,
    difficulty: ChallengeDifficulty.easy,
    xpReward: 100,
    durationMinutes: 5,
    vibeTags: ['Chill'],
  },
  {
    title: 'Sketch your surroundings',
    description: 'Spend 15 minutes drawing whatever is in front of you.',
    emoji: '🎨',
    category: ChallengeCategory.creative,
    difficulty: ChallengeDifficulty.easy,
    xpReward: 120,
    durationMinutes: 15,
    vibeTags: ['Creative', 'Artsy'],
  },
  {
    title: 'Take a brisk walk',
    description: 'Get outside and walk for at least 10 minutes.',
    emoji: '🏃',
    category: ChallengeCategory.physical,
    difficulty: ChallengeDifficulty.easy,
    xpReward: 110,
    durationMinutes: 10,
    vibeTags: ['Sporty', 'Nature'],
  },
  {
    title: 'Two-minute breathing reset',
    description: 'Do a short guided breathing exercise to recenter.',
    emoji: '🧘',
    category: ChallengeCategory.mindful,
    difficulty: ChallengeDifficulty.easy,
    xpReward: 90,
    durationMinutes: 5,
    vibeTags: ['Chill'],
  },
  {
    title: 'Try a new café',
    description: 'Visit a coffee shop you’ve never been to and order something new.',
    emoji: '☕',
    category: ChallengeCategory.foodie,
    difficulty: ChallengeDifficulty.medium,
    xpReward: 150,
    durationMinutes: 20,
    vibeTags: ['Foodie', 'Traveler'],
  },
  {
    title: 'Share a song that matters',
    description: 'Send someone a song that means something to you and why.',
    emoji: '🎵',
    category: ChallengeCategory.music,
    difficulty: ChallengeDifficulty.easy,
    xpReward: 100,
    durationMinutes: 5,
    vibeTags: ['Musical'],
  },
];

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not set. Add it to your .env file.');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  const Challenge = mongoose.model('Challenge', ChallengeSchema);

  const challengeCount = await Challenge.countDocuments();
  if (challengeCount === 0) {
    await Challenge.insertMany(CHALLENGES);
    console.log(`Seeded ${CHALLENGES.length} challenges`);
  } else {
    console.log(`Challenges already present (${challengeCount}); skipping`);
  }

  await mongoose.disconnect();
  console.log('Done');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
