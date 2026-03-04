import { STATES, CAPITAL_WIKI } from '../data/states'
import { NFL_TEAMS, STARTING_QBS } from '../data/nfl'
import { WATERWAYS } from '../data/waterways'

// Strip parenthetical notes from famous-people entries, e.g. "Stephen King (born)" → "Stephen King"
function cleanPersonName(name) {
  return name.replace(/\s*\([^)]*\)\s*/g, '').replace(/\s*\.\.\..*/g, '').trim()
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickWrong(correct, pool, count = 3) {
  return shuffle(pool.filter(x => x !== correct)).slice(0, count)
}

function makeOptions(correct, pool) {
  const wrong = pickWrong(correct, pool)
  return shuffle([correct, ...wrong])
}

// ── Question generators ──────────────────────────────────────────────────────

function makeCapitalQuestion(state) {
  const allCapitals = STATES.map(s => s.capital)
  return {
    id: `capital_${state.abbr}_${Date.now()}`,
    type: 'capitals',
    question: `What is the capital of ${state.name}?`,
    correctAnswer: state.capital,
    correctStateAbbr: state.abbr,
    options: makeOptions(state.capital, allCapitals),
    hint: `It starts with "${state.capital[0]}"`,
    explanation: `${state.capital} has been the capital of ${state.name} since ${state.admitted}.`,
    wikiTitle: CAPITAL_WIKI[state.abbr] ?? null
  }
}

function makeNameStateQuestion(state) {
  const allNames = STATES.map(s => s.name)
  return {
    id: `namestate_${state.abbr}_${Date.now()}`,
    type: 'stateId',
    question: 'Name this highlighted state:',
    correctAnswer: state.name,
    correctStateAbbr: state.abbr,
    highlightState: state.abbr,
    options: makeOptions(state.name, allNames),
    hint: state.nickname,
    explanation: `${state.name} (${state.abbr}) — ${state.nickname}`
  }
}

function makeFindStateQuestion(state) {
  return {
    id: `findstate_${state.abbr}_${Date.now()}`,
    type: 'stateId',
    mapClick: true,
    question: `Click on ${state.name} on the map`,
    correctAnswer: state.name,
    correctStateAbbr: state.abbr,
    hint: `Hint: It's in the ${state.region}`,
    explanation: `${state.name} is in the ${state.region} region.`
  }
}

function makeLandmarkQuestion(state) {
  if (!state.landmarks || state.landmarks.length === 0) return null
  const landmark = state.landmarks[Math.floor(Math.random() * state.landmarks.length)]
  const allNames = STATES.map(s => s.name)
  return {
    id: `landmark_${state.abbr}_${landmark}_${Date.now()}`,
    type: 'landmarks',
    question: `Which state is home to "${landmark}"?`,
    correctAnswer: state.name,
    correctStateAbbr: state.abbr,
    options: makeOptions(state.name, allNames),
    hint: `It's in the ${state.region}`,
    explanation: `${landmark} is located in ${state.name}.`,
    wikiTitle: landmark
  }
}

function makeFamousPersonQuestion(state) {
  if (!state.famousPeople || state.famousPeople.length === 0) return null
  const person = state.famousPeople[Math.floor(Math.random() * state.famousPeople.length)]
  const allNames = STATES.map(s => s.name)
  return {
    id: `person_${state.abbr}_${Date.now()}`,
    type: 'famousPeople',
    question: `Which state is ${person} associated with?`,
    correctAnswer: state.name,
    correctStateAbbr: state.abbr,
    options: makeOptions(state.name, allNames),
    hint: `Think about ${state.region}…`,
    explanation: `${person} is famously associated with ${state.name}.`,
    wikiTitle: cleanPersonName(person)
  }
}

// Returns just the team nickname, e.g. "Arizona Cardinals" → "Cardinals"
function nickname(team) {
  return team.name.split(' ').pop()
}

function makeNflTeamQuestion(team) {
  const allStateNames = [...new Set(NFL_TEAMS.map(t => {
    const st = STATES.find(s => s.abbr === t.state)
    return st ? st.name : t.state
  }))]
  const stateName = STATES.find(s => s.abbr === team.state)?.name || team.state
  return {
    id: `nfl_${team.id}_${Date.now()}`,
    type: 'nfl',
    question: `In which state do the ${nickname(team)} play?`,
    correctAnswer: stateName,
    correctStateAbbr: team.state,
    options: makeOptions(stateName, allStateNames),
    hint: `They play at ${team.stadium}`,
    explanation: `The ${team.name} play at ${team.stadium} in ${team.city}, ${team.state}.`,
    logoUrl: `https://a.espncdn.com/i/teamlogos/nfl/500/${team.id.toLowerCase()}.png`
  }
}

function makeNflStadiumQuestion(team) {
  const allStadiums = NFL_TEAMS.map(t => t.stadium)
  return {
    id: `nflstadium_${team.id}_${Date.now()}`,
    type: 'nflStadium',
    question: `What is the home stadium of the ${nickname(team)}?`,
    correctAnswer: team.stadium,
    correctStateAbbr: team.state,
    options: makeOptions(team.stadium, allStadiums),
    hint: `Located in ${team.city}, ${team.state}`,
    explanation: `The ${team.name} play at ${team.stadium} in ${team.city}, ${team.state}.`,
    wikiTitle: team.stadium
  }
}

function makeNflLogoQuestion(team) {
  const allTeamNames = NFL_TEAMS.map(t => t.name)
  return {
    id: `nfllogo_${team.id}_${Date.now()}`,
    type: 'nflLogo',
    question: 'Which NFL team does this logo belong to?',
    correctAnswer: team.name,
    correctStateAbbr: team.state,
    options: makeOptions(team.name, allTeamNames),
    hint: `They play in ${team.city}, ${team.state}`,
    explanation: `This is the logo of the ${team.name}.`,
    logoUrl: `https://a.espncdn.com/i/teamlogos/nfl/500/${team.id.toLowerCase()}.png`
  }
}

function makeNflDivisionQuestion(team) {
  const correct = `${team.conference} ${team.division}`
  const allDivisions = [
    'AFC East','AFC North','AFC South','AFC West',
    'NFC East','NFC North','NFC South','NFC West'
  ]
  return {
    id: `nfldivision_${team.id}_${Date.now()}`,
    type: 'nflDivision',
    question: `Which division do the ${nickname(team)} play in?`,
    correctAnswer: correct,
    correctStateAbbr: team.state,
    options: makeOptions(correct, allDivisions),
    hint: `Conference: ${team.conference}`,
    explanation: `The ${team.name} play in the ${correct}.`,
    logoUrl: `https://a.espncdn.com/i/teamlogos/nfl/500/${team.id.toLowerCase()}.png`
  }
}

function makeNflCityQuestion(team) {
  const allCities = [...new Set(NFL_TEAMS.map(t => t.city))]
  return {
    id: `nflcity_${team.id}_${Date.now()}`,
    type: 'nflCity',
    question: `What city do the ${nickname(team)} call home?`,
    correctAnswer: team.city,
    correctStateAbbr: team.state,
    options: makeOptions(team.city, allCities),
    hint: `They play in ${team.state}`,
    explanation: `The ${team.name} are based in ${team.city}, ${team.state}.`,
    logoUrl: `https://a.espncdn.com/i/teamlogos/nfl/500/${team.id.toLowerCase()}.png`
  }
}

function makeNicknameQuestion(state) {
  const allNames = STATES.map(s => s.name)
  return {
    id: `nickname_${state.abbr}_${Date.now()}`,
    type: 'nicknames',
    question: `Which state is known as "${state.nickname}"?`,
    correctAnswer: state.name,
    correctStateAbbr: state.abbr,
    options: makeOptions(state.name, allNames),
    hint: `It's in the ${state.region}`,
    explanation: `${state.name} is nicknamed "${state.nickname}".`,
    wikiTitle: `Flag of ${state.name}`
  }
}

// Pick wrong years that are numerically close to the correct year
function makeYearOptions(correctYear) {
  const allYears = [...new Set(STATES.map(s => s.admitted))]
    .filter(y => y !== correctYear)
    .sort((a, b) => Math.abs(a - correctYear) - Math.abs(b - correctYear))
  const wrong = shuffle(allYears.slice(0, 8)).slice(0, 3)
  return shuffle([String(correctYear), ...wrong.map(String)])
}

function makeStatehoodQuestion(state) {
  return {
    id: `statehood_${state.abbr}_${Date.now()}`,
    type: 'statehood',
    question: `In what year did ${state.name} become a state?`,
    correctAnswer: String(state.admitted),
    correctStateAbbr: state.abbr,
    options: makeYearOptions(state.admitted),
    hint: `It happened in the ${Math.floor(state.admitted / 50) * 50}s`,
    explanation: `${state.name} was admitted to the Union in ${state.admitted}.`,
    wikiTitle: `Flag of ${state.name}`
  }
}

function makeFlagQuestion(state) {
  const allNames = STATES.map(s => s.name)
  return {
    id: `flag_${state.abbr}_${Date.now()}`,
    type: 'flags',
    question: 'Which state does this flag belong to?',
    correctAnswer: state.name,
    correctStateAbbr: state.abbr,
    options: makeOptions(state.name, allNames),
    hint: `It's in the ${state.region}`,
    explanation: `This is the flag of ${state.name} — "${state.nickname}".`,
    wikiTitle: `Flag of ${state.name}`
  }
}

function makeWaterwayQuestion(waterway) {
  const stateName = STATES.find(s => s.abbr === waterway.state)?.name || waterway.state
  const stateRegion = STATES.find(s => s.abbr === waterway.state)?.region
  const allNames = STATES.map(s => s.name)
  return {
    id: `waterway_${waterway.name.replace(/ /g, '_')}_${Date.now()}`,
    type: 'waterways',
    question: waterway.question,
    correctAnswer: stateName,
    correctStateAbbr: waterway.state,
    options: makeOptions(stateName, allNames),
    hint: stateRegion ? `It's in the ${stateRegion}` : null,
    explanation: waterway.fact,
    wikiTitle: waterway.wikiTitle
  }
}

function makeNflQBQuestion(team) {
  const qb = STARTING_QBS[team.id]
  if (!qb) return null
  const allQBs = Object.values(STARTING_QBS)
  return {
    id: `nflqb_${team.id}_${Date.now()}`,
    type: 'nflQB',
    question: `Who is the ${nickname(team)}'s starting quarterback in the 2025 season?`,
    correctAnswer: qb,
    correctStateAbbr: team.state,
    options: makeOptions(qb, allQBs),
    hint: `They play in ${team.city}, ${team.state}`,
    explanation: `${qb} is the starting QB for the ${team.name}.`,
    logoUrl: `https://a.espncdn.com/i/teamlogos/nfl/500/${team.id.toLowerCase()}.png`
  }
}

// ── Public API ───────────────────────────────────────────────────────────────

export const QUIZ_MODES = {
  // ── Geography ──────────────────────────────────────────────────────────────
  stateId: {
    id: 'stateId',       category: 'geography',
    label: 'Find the State',
    description: 'Click or identify states on the map',
    emoji: '🗺️'
  },
  capitals: {
    id: 'capitals',      category: 'geography',
    label: 'State Capitals',
    description: 'Name the capital of each state',
    emoji: '🏛️'
  },
  landmarks: {
    id: 'landmarks',     category: 'geography',
    label: 'Famous Landmarks',
    description: 'Which state is this landmark in?',
    emoji: '🗽'
  },
  famousPeople: {
    id: 'famousPeople',  category: 'geography',
    label: 'Famous People',
    description: 'Which state is this person from?',
    emoji: '⭐'
  },
  nicknames: {
    id: 'nicknames',     category: 'geography',
    label: 'State Nicknames',
    description: 'Which state has this nickname?',
    emoji: '🏷️'
  },
  statehood: {
    id: 'statehood',     category: 'geography',
    label: 'Year of Statehood',
    description: 'When did each state join the Union?',
    emoji: '📜'
  },
  flags: {
    id: 'flags',         category: 'geography',
    label: 'State Flags',
    description: 'Name the state from its flag',
    emoji: '🚩'
  },
  waterways: {
    id: 'waterways',     category: 'geography',
    label: 'Rivers & Lakes',
    description: 'Which state is home to this waterway?',
    emoji: '💧'
  },
  mixed: {
    id: 'mixed',         category: 'geography',
    label: 'Mixed Quiz',
    description: 'Random questions from all categories',
    emoji: '🎲'
  },
  // ── NFL ────────────────────────────────────────────────────────────────────
  nflLogo: {
    id: 'nflLogo',       category: 'nfl',
    label: 'NFL Logos',
    description: 'Name the team from their logo',
    emoji: '🏷️'
  },
  nfl: {
    id: 'nfl',           category: 'nfl',
    label: 'NFL Teams',
    description: 'Which state does each team play in?',
    emoji: '🏈'
  },
  nflCity: {
    id: 'nflCity',       category: 'nfl',
    label: 'NFL Cities',
    description: 'Where does each team call home?',
    emoji: '🏙️'
  },
  nflDivision: {
    id: 'nflDivision',   category: 'nfl',
    label: 'NFL Divisions',
    description: 'Which division does each team play in?',
    emoji: '🗂️'
  },
  nflStadium: {
    id: 'nflStadium',    category: 'nfl',
    label: 'NFL Stadiums',
    description: 'Name each NFL team\'s stadium',
    emoji: '🏟️'
  },
  nflQB: {
    id: 'nflQB',         category: 'nfl',
    label: '2025 Starting QBs',
    description: 'Name each team\'s 2025 season starting quarterback',
    emoji: '🎯'
  },
}

export function generateQuestions(mode, count = 10, regionFilter = null) {
  let states = regionFilter
    ? STATES.filter(s => s.region === regionFilter)
    : STATES

  states = shuffle(states)
  const questions = []

  if (mode === 'stateId') {
    const useMapClick = Math.random() > 0.5
    for (const s of states.slice(0, count)) {
      const q = useMapClick ? makeFindStateQuestion(s) : makeNameStateQuestion(s)
      if (q) questions.push(q)
    }
  } else if (mode === 'capitals') {
    for (const s of states.slice(0, count)) {
      questions.push(makeCapitalQuestion(s))
    }
  } else if (mode === 'landmarks') {
    for (const s of states) {
      const q = makeLandmarkQuestion(s)
      if (q) questions.push(q)
      if (questions.length >= count) break
    }
  } else if (mode === 'famousPeople') {
    for (const s of states) {
      const q = makeFamousPersonQuestion(s)
      if (q) questions.push(q)
      if (questions.length >= count) break
    }
  } else if (mode === 'nfl') {
    const teams = shuffle(NFL_TEAMS)
    for (const t of teams.slice(0, count)) {
      questions.push(makeNflTeamQuestion(t))
    }
  } else if (mode === 'nflStadium') {
    const teams = shuffle(NFL_TEAMS)
    for (const t of teams.slice(0, count)) {
      questions.push(makeNflStadiumQuestion(t))
    }
  } else if (mode === 'nflLogo') {
    const teams = shuffle(NFL_TEAMS)
    for (const t of teams.slice(0, count)) {
      questions.push(makeNflLogoQuestion(t))
    }
  } else if (mode === 'nflDivision') {
    const teams = shuffle(NFL_TEAMS)
    for (const t of teams.slice(0, count)) {
      questions.push(makeNflDivisionQuestion(t))
    }
  } else if (mode === 'nflCity') {
    const teams = shuffle(NFL_TEAMS)
    for (const t of teams.slice(0, count)) {
      questions.push(makeNflCityQuestion(t))
    }
  } else if (mode === 'nflQB') {
    const teams = shuffle(NFL_TEAMS).filter(t => STARTING_QBS[t.id])
    for (const t of teams.slice(0, count)) {
      questions.push(makeNflQBQuestion(t))
    }
  } else if (mode === 'nicknames') {
    for (const s of states.slice(0, count)) {
      questions.push(makeNicknameQuestion(s))
    }
  } else if (mode === 'statehood') {
    for (const s of states.slice(0, count)) {
      questions.push(makeStatehoodQuestion(s))
    }
  } else if (mode === 'flags') {
    for (const s of states.slice(0, count)) {
      questions.push(makeFlagQuestion(s))
    }
  } else if (mode === 'waterways') {
    let pool = regionFilter
      ? WATERWAYS.filter(w => STATES.find(s => s.abbr === w.state)?.region === regionFilter)
      : WATERWAYS
    for (const w of shuffle(pool).slice(0, count)) {
      questions.push(makeWaterwayQuestion(w))
    }
  } else if (mode === 'mixed') {
    const rndState = () => STATES[Math.floor(Math.random() * STATES.length)]
    const rndTeam  = () => NFL_TEAMS[Math.floor(Math.random() * NFL_TEAMS.length)]
    const rndWater = () => WATERWAYS[Math.floor(Math.random() * WATERWAYS.length)]
    const generators = [
      () => makeCapitalQuestion(rndState()),
      () => makeLandmarkQuestion(rndState()),
      () => makeFamousPersonQuestion(rndState()),
      () => makeNicknameQuestion(rndState()),
      () => makeFlagQuestion(rndState()),
      () => makeWaterwayQuestion(rndWater()),
      () => makeNflLogoQuestion(rndTeam()),
      () => makeNflTeamQuestion(rndTeam()),
      () => makeNflCityQuestion(rndTeam()),
      () => makeNflQBQuestion(rndTeam()),
      () => makeNameStateQuestion(rndState()),
    ]
    while (questions.length < count) {
      const gen = generators[Math.floor(Math.random() * generators.length)]
      const q = gen()
      if (q) questions.push(q)
    }
  }

  return questions.slice(0, count)
}

export function generateDailyChallenge() {
  // Seed by date so the same challenge is generated each day
  const seed = new Date().toISOString().split('T')[0]
  Math.seedrandom?.(seed) // only if seedrandom is available; otherwise just use shuffle
  return generateQuestions('mixed', 5)
}
