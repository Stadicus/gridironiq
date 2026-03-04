export const DIFFICULTY = {
  easy: {
    label: 'Explorer',
    description: '4 choices, no timer, hints enabled',
    emoji: '🌱',
    multipleChoice: true,
    timeLimit: null,
    hintsEnabled: true,
    questionCount: 10
  },
  medium: {
    label: 'Traveler',
    description: '4 choices, 15-second timer',
    emoji: '🧭',
    multipleChoice: true,
    timeLimit: 15,
    hintsEnabled: false,
    questionCount: 10
  },
  hard: {
    label: 'Expert',
    description: 'Type answers, 15-second timer',
    emoji: '🔥',
    multipleChoice: false,
    timeLimit: 15,
    hintsEnabled: false,
    questionCount: 10
  }
}
