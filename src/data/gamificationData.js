export const LEVELS = [
  { level:1,  xpRequired:0,      title:'State Novice',       emoji:'🗺️' },
  { level:2,  xpRequired:100,    title:'Curious Explorer',   emoji:'🧭' },
  { level:3,  xpRequired:300,    title:'Road Tripper',       emoji:'🚗' },
  { level:4,  xpRequired:700,    title:'Map Reader',         emoji:'📍' },
  { level:5,  xpRequired:1500,   title:'State Scholar',      emoji:'📚' },
  { level:6,  xpRequired:3000,   title:'Geographer',         emoji:'🌎' },
  { level:7,  xpRequired:6000,   title:'Cartographer',       emoji:'🗾' },
  { level:8,  xpRequired:12000,  title:'State Champion',     emoji:'🏆' },
  { level:9,  xpRequired:20000,  title:'Capitol Expert',     emoji:'🏛️' },
  { level:10, xpRequired:35000,  title:'Geography Legend',   emoji:'⭐' }
]

// stats = getData() = { profile, streaks, quizStats, stateProgress, badges, dailyChallenge }
export const BADGES = [
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Complete your first quiz',
    emoji: '👣',
    condition: (s) => (s.profile?.totalQuestions ?? 0) >= 1
  },
  {
    id: 'on_a_roll',
    name: 'On a Roll',
    description: 'Get 5 correct answers in a row',
    emoji: '🎯',
    condition: (s) => (s.profile?.longestStreak ?? 0) >= 5
  },
  {
    id: 'hot_hand',
    name: 'Hot Hand',
    description: 'Get 10 correct answers in a row',
    emoji: '🔥',
    condition: (s) => (s.profile?.longestStreak ?? 0) >= 10
  },
  {
    id: 'unstoppable',
    name: 'Unstoppable',
    description: 'Get 25 correct answers in a row',
    emoji: '⚡',
    condition: (s) => (s.profile?.longestStreak ?? 0) >= 25
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Answer 5 questions in under 5 seconds each',
    emoji: '💨',
    condition: (s) => (s.profile?.fastAnswers ?? 0) >= 5
  },
  {
    id: 'capital_learner',
    name: 'Capital Learner',
    description: 'Answer 10 state capitals correctly',
    emoji: '🏙️',
    condition: (s) => (s.quizStats?.capitals?.correct ?? 0) >= 10
  },
  {
    id: 'capital_expert',
    name: 'Capital Expert',
    description: 'Answer all 50 state capitals correctly',
    emoji: '🏛️',
    condition: (s) => (s.quizStats?.capitals?.correct ?? 0) >= 50
  },
  {
    id: 'map_clicker',
    name: 'Map Clicker',
    description: 'Correctly identify 25 different states',
    emoji: '🖱️',
    condition: (s) => Object.values(s.stateProgress ?? {}).filter(p => p.correct > 0).length >= 25
  },
  {
    id: 'map_master',
    name: 'Map Master',
    description: 'Correctly identify all 50 states',
    emoji: '🗺️',
    condition: (s) => Object.values(s.stateProgress ?? {}).filter(p => p.correct > 0).length >= 50
  },
  {
    id: 'nfl_fan',
    name: 'NFL Fan',
    description: 'Name the home state of all 32 NFL teams',
    emoji: '🏈',
    condition: (s) => (s.quizStats?.nfl?.correct ?? 0) >= 32
  },
  {
    id: 'stadium_expert',
    name: 'Stadium Expert',
    description: 'Name all 32 NFL stadiums correctly',
    emoji: '🏟️',
    condition: (s) => (s.quizStats?.nflStadium?.correct ?? 0) >= 32
  },
  {
    id: 'daily_devotee',
    name: 'Daily Devotee',
    description: 'Complete 7 daily challenges',
    emoji: '📅',
    condition: (s) => (s.dailyChallenge?.totalCompleted ?? 0) >= 7
  },
  {
    id: 'perfect_week',
    name: 'Perfect Week',
    description: 'Complete 7 daily challenges in a row',
    emoji: '🌟',
    condition: (s) => (s.dailyChallenge?.streak ?? 0) >= 7
  },
  {
    id: 'regional_expert',
    name: 'Regional Expert',
    description: 'Achieve 80%+ accuracy across an entire region',
    emoji: '🌐',
    condition: (s) => (s._regionMastered ?? 0) >= 1   // set by checkNewBadges enrichment
  },
  {
    id: 'geography_legend',
    name: 'Geography Legend',
    description: 'Reach level 10',
    emoji: '👑',
    condition: (s) => (s.profile?.level ?? 1) >= 10
  }
]
