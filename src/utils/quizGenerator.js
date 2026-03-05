import { STATES, CAPITAL_WIKI } from '../data/states'
import { NFL_TEAMS, TEAM_BY_ID, STARTING_QBS, NFL_LEGENDS } from '../data/nfl'
import { WATERWAYS } from '../data/waterways'

// Strip parenthetical notes and ellipsis from names, used for both famous people and landmarks
function cleanName(name) {
  if (!name) return ''
  return name.replace(/\s*\([^)]*\)\s*/g, '').replace(/\s*\.\.\..*/g, '').trim()
}

// Alias for backward compatibility
function cleanPersonName(name) {
  return cleanName(name)
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

// Explanations for why each state has its nickname
const NICKNAME_ORIGINS = {
  AL: 'Alabama is the "Heart of Dixie" because it was a central state of the Confederacy during the Civil War.',
  AK: 'Alaska is the "Last Frontier" due to its vast, largely undeveloped wilderness — the final American frontier.',
  AZ: 'Arizona is the "Grand Canyon State" after the world-famous Grand Canyon that runs through its northwest.',
  AR: 'Arkansas is the "Natural State" for its beautiful mountains, rivers, and diverse natural landscapes.',
  CA: 'California is the "Golden State" after the 1849 Gold Rush, its golden poppy flower, and sunny climate.',
  CO: 'Colorado is the "Centennial State" because it was admitted to the Union in 1876, 100 years after independence.',
  CT: 'Connecticut is the "Constitution State" — its Fundamental Orders of 1639 is considered the first written constitution.',
  DE: 'Delaware is the "First State" because it was the first to ratify the U.S. Constitution on December 7, 1787.',
  FL: 'Florida is the "Sunshine State" for its year-round sunny weather and warm subtropical climate.',
  GA: 'Georgia is the "Peach State" for its fame as a top producer of juicy, high-quality peaches.',
  HI: 'Hawaii is the "Aloha State" after the Hawaiian word "aloha," meaning love, peace, and compassion.',
  ID: 'Idaho is the "Gem State" for its rich deposits of more than 70 types of precious and semi-precious stones.',
  IL: 'Illinois is the "Prairie State" for the vast, flat grasslands that cover much of its landscape.',
  IN: 'Indiana is the "Hoosier State" — residents are called Hoosiers, though the exact origin of the term is disputed.',
  IA: 'Iowa is the "Hawkeye State" in honor of Chief Black Hawk, a Sauk leader who resisted displacement from the region.',
  KS: 'Kansas is the "Sunflower State" after the wild sunflowers that blanket its prairies — also the state flower.',
  KY: 'Kentucky is the "Bluegrass State" for the blue-tinged grass (Poa pratensis) that turns fields bluish in spring.',
  LA: 'Louisiana is the "Pelican State" after the brown pelican, a symbol of the state since colonial times.',
  ME: 'Maine is the "Pine Tree State" for its vast evergreen forests — the eastern white pine is the state tree.',
  MD: 'Maryland is the "Old Line State," honoring the Maryland Line — Continental Army troops praised by Washington.',
  MA: 'Massachusetts is the "Bay State" after Massachusetts Bay, the colony founded by Puritan settlers in 1630.',
  MI: 'Michigan is the "Great Lakes State" because it borders four of the five Great Lakes — more than any other state.',
  MN: 'Minnesota is the "North Star State" from its motto "L\'Étoile du Nord" (Star of the North) adopted in 1861.',
  MS: 'Mississippi is the "Magnolia State" for the beautiful magnolia trees and blossoms found throughout the state.',
  MO: 'Missouri is the "Show Me State" — a phrase reflecting the state\'s tradition of practical, skeptical citizens.',
  MT: 'Montana is the "Treasure State" for its vast mineral wealth including gold, silver, copper, and coal.',
  NE: 'Nebraska is the "Cornhusker State" after the corn-husking laborers who harvested its abundant corn fields.',
  NV: 'Nevada is the "Silver State" in honor of its booming silver mining industry that drove settlement in the 1800s.',
  NH: 'New Hampshire is the "Granite State" for the granite that forms its mountains and bedrock landscape.',
  NJ: 'New Jersey is the "Garden State" for its rich farmland — the phrase was coined by Abraham Browning in 1876.',
  NM: 'New Mexico is the "Land of Enchantment" for its stunning desert landscapes, ancient ruins, and vibrant cultures.',
  NY: 'New York is the "Empire State" — George Washington called it "the seat of empire" after the Revolutionary War.',
  NC: 'North Carolina is the "Tar Heel State" after Civil War soldiers said to have fought as if their heels were tarred.',
  ND: 'North Dakota is the "Peace Garden State" after the International Peace Garden on the US–Canada border.',
  OH: 'Ohio is the "Buckeye State" after the Ohio buckeye tree whose nuts resemble the eye of a deer (a buck).',
  OK: 'Oklahoma is the "Sooner State" after settlers who illegally entered the territory "sooner" than permitted.',
  OR: 'Oregon is the "Beaver State" after the beaver — once abundant here and key to the fur trade.',
  PA: 'Pennsylvania is the "Keystone State" — it was the central, or "keystone," colony among the original thirteen.',
  RI: 'Rhode Island is the "Ocean State" because its coastline is extensive relative to its small land area.',
  SC: 'South Carolina is the "Palmetto State" after the sabal palmetto tree — soldiers used its logs to build Fort Moultrie.',
  SD: 'South Dakota is the "Mount Rushmore State" after the iconic presidential sculpture carved into the Black Hills.',
  TN: 'Tennessee is the "Volunteer State" after the thousands of volunteers who answered Andrew Jackson\'s call in the War of 1812.',
  TX: 'Texas is the "Lone Star State" after the single star on its flag — reflecting its time as an independent republic.',
  UT: 'Utah is the "Beehive State" — the beehive symbolized industry and cooperation among early Mormon settlers.',
  VT: 'Vermont is the "Green Mountain State" — its name comes from the French "Verts Monts," meaning green mountains.',
  VA: 'Virginia is the "Old Dominion" — King Charles II called it his "Old Dominion" for its loyalty to the Crown.',
  WA: 'Washington is the "Evergreen State" for its lush, year-round green forests of Douglas fir and cedar.',
  WV: 'West Virginia is the "Mountain State" after the rugged Appalachian mountain ranges that cover most of the state.',
  WI: 'Wisconsin is the "Badger State" — early lead miners were called "badgers" for digging tunnels to survive winter.',
  WY: 'Wyoming is the "Equality State" — it was the first U.S. territory to grant women the right to vote, in 1869.'
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
    wikiTitle: cleanName(landmark)  // Apply consistent name cleaning
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
    explanation: `${cleanPersonName(person)} is from ${state.name}.`,
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
    explanation: NICKNAME_ORIGINS[state.abbr] || `${state.name} is nicknamed "${state.nickname}".`
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

function makeNflMVPQuestion(player) {
  const team = TEAM_BY_ID[player.teamId]
  if (!team) return null
  const allTeamNames = NFL_TEAMS.map(t => t.name)
  return {
    id: `nflmvp_${player.name.replace(/\W+/g, '_')}_${Date.now()}`,
    type: 'nflMVP',
    question: `Which NFL team is ${player.name} known for?`,
    correctAnswer: team.name,
    correctStateAbbr: team.state,
    options: makeOptions(team.name, allTeamNames),
    hint: `Think ${team.city}, ${team.state}`,
    explanation: `${player.name} is one of the most iconic players in ${team.name} history.`,
    wikiTitle: player.wikiTitle
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
    description: 'Random geography questions from all geo categories',
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
  nflMVP: {
    id: 'nflMVP',        category: 'nfl',
    label: 'Legends & Stars',
    description: 'Match the player to their iconic NFL team',
    emoji: '🌟'
  },
  nflMixed: {
    id: 'nflMixed',      category: 'nfl',
    label: 'Mixed NFL',
    description: 'Random questions from all NFL categories',
    emoji: '🎲'
  },
}

export function generateQuestions(mode, count = 10, regionFilter = null) {
  try {
    let states = regionFilter
      ? STATES.filter(s => s.region === regionFilter)
      : STATES

    if (!states || states.length === 0) {
      console.warn(`generateQuestions: No states found for mode ${mode}, region ${regionFilter}`)
      return []
    }

    states = shuffle(states)
    const questions = []

    if (mode === 'stateId') {
      const useMapClick = Math.random() > 0.5
      for (const s of states.slice(0, count)) {
        try {
          const q = useMapClick ? makeFindStateQuestion(s) : makeNameStateQuestion(s)
          if (q) questions.push(q)
        } catch (err) {
          console.warn(`Error generating stateId question for ${s?.abbr}:`, err)
        }
      }
    } else if (mode === 'capitals') {
      for (const s of states.slice(0, count)) {
        try {
          questions.push(makeCapitalQuestion(s))
        } catch (err) {
          console.warn(`Error generating capital question for ${s?.abbr}:`, err)
        }
      }
    } else if (mode === 'landmarks') {
      for (const s of states) {
        try {
          const q = makeLandmarkQuestion(s)
          if (q) questions.push(q)
        } catch (err) {
          console.warn(`Error generating landmark question for ${s?.abbr}:`, err)
        }
        if (questions.length >= count) break
      }
    } else if (mode === 'famousPeople') {
      for (const s of states) {
        try {
          const q = makeFamousPersonQuestion(s)
          if (q) questions.push(q)
        } catch (err) {
          console.warn(`Error generating famous person question for ${s?.abbr}:`, err)
        }
        if (questions.length >= count) break
      }
    } else if (mode === 'nfl') {
      const teams = shuffle(NFL_TEAMS || [])
      for (const t of teams.slice(0, count)) {
        try {
          questions.push(makeNflTeamQuestion(t))
        } catch (err) {
          console.warn(`Error generating NFL team question for ${t?.id}:`, err)
        }
      }
    } else if (mode === 'nflStadium') {
      const teams = shuffle(NFL_TEAMS || [])
      for (const t of teams.slice(0, count)) {
        try {
          questions.push(makeNflStadiumQuestion(t))
        } catch (err) {
          console.warn(`Error generating NFL stadium question for ${t?.id}:`, err)
        }
      }
    } else if (mode === 'nflLogo') {
      const teams = shuffle(NFL_TEAMS || [])
      for (const t of teams.slice(0, count)) {
        try {
          questions.push(makeNflLogoQuestion(t))
        } catch (err) {
          console.warn(`Error generating NFL logo question for ${t?.id}:`, err)
        }
      }
    } else if (mode === 'nflDivision') {
      const teams = shuffle(NFL_TEAMS || [])
      for (const t of teams.slice(0, count)) {
        try {
          questions.push(makeNflDivisionQuestion(t))
        } catch (err) {
          console.warn(`Error generating NFL division question for ${t?.id}:`, err)
        }
      }
    } else if (mode === 'nflCity') {
      const teams = shuffle(NFL_TEAMS || [])
      for (const t of teams.slice(0, count)) {
        try {
          questions.push(makeNflCityQuestion(t))
        } catch (err) {
          console.warn(`Error generating NFL city question for ${t?.id}:`, err)
        }
      }
    } else if (mode === 'nflQB') {
      const teams = shuffle((NFL_TEAMS || []).filter(t => STARTING_QBS?.[t.id]))
      for (const t of teams.slice(0, count)) {
        try {
          questions.push(makeNflQBQuestion(t))
        } catch (err) {
          console.warn(`Error generating NFL QB question for ${t?.id}:`, err)
        }
      }
    } else if (mode === 'nflMVP') {
      const players = shuffle([...(NFL_LEGENDS || [])])
      for (const p of players.slice(0, count)) {
        try {
          const q = makeNflMVPQuestion(p)
          if (q) questions.push(q)
        } catch (err) {
          console.warn(`Error generating NFL MVP question:`, err)
        }
      }
    } else if (mode === 'nicknames') {
      for (const s of states.slice(0, count)) {
        try {
          questions.push(makeNicknameQuestion(s))
        } catch (err) {
          console.warn(`Error generating nickname question for ${s?.abbr}:`, err)
        }
      }
    } else if (mode === 'flags') {
      for (const s of states.slice(0, count)) {
        try {
          questions.push(makeFlagQuestion(s))
        } catch (err) {
          console.warn(`Error generating flag question for ${s?.abbr}:`, err)
        }
      }
    } else if (mode === 'waterways') {
      let pool = regionFilter
        ? (WATERWAYS || []).filter(w => STATES?.find(s => s.abbr === w.state)?.region === regionFilter)
        : (WATERWAYS || [])
      for (const w of shuffle(pool).slice(0, count)) {
        try {
          questions.push(makeWaterwayQuestion(w))
        } catch (err) {
          console.warn(`Error generating waterway question:`, err)
        }
      }
    } else if (mode === 'mixed') {
      const rndState = () => STATES[Math.floor(Math.random() * (STATES?.length || 0))]
      const rndWater = () => WATERWAYS[Math.floor(Math.random() * (WATERWAYS?.length || 0))]
      const generators = [
        () => makeCapitalQuestion(rndState()),
        () => makeLandmarkQuestion(rndState()),
        () => makeFamousPersonQuestion(rndState()),
        () => makeNicknameQuestion(rndState()),
        () => makeFlagQuestion(rndState()),
        () => makeWaterwayQuestion(rndWater()),
        () => makeNameStateQuestion(rndState()),
      ]
      while (questions.length < count) {
        try {
          const gen = generators[Math.floor(Math.random() * generators.length)]
          const q = gen()
          if (q) questions.push(q)
        } catch (err) {
          console.warn(`Error generating mixed question:`, err)
        }
      }
    } else if (mode === 'nflMixed') {
      const rndTeam   = () => NFL_TEAMS[Math.floor(Math.random() * (NFL_TEAMS?.length || 0))]
      const rndLegend = () => NFL_LEGENDS[Math.floor(Math.random() * (NFL_LEGENDS?.length || 0))]
      const generators = [
        () => makeNflLogoQuestion(rndTeam()),
        () => makeNflTeamQuestion(rndTeam()),
        () => makeNflCityQuestion(rndTeam()),
        () => makeNflQBQuestion(rndTeam()),
        () => makeNflDivisionQuestion(rndTeam()),
        () => makeNflStadiumQuestion(rndTeam()),
        () => makeNflMVPQuestion(rndLegend()),
      ]
      while (questions.length < count) {
        try {
          const gen = generators[Math.floor(Math.random() * generators.length)]
          const q = gen()
          if (q) questions.push(q)
        } catch (err) {
          console.warn(`Error generating NFL mixed question:`, err)
        }
      }
    }

    return questions.slice(0, count)
  } catch (err) {
    console.error(`Critical error in generateQuestions(${mode}):`, err)
    return []
  }
}

export function generateDailyChallenge() {
  // Seed by date so the same challenge is generated each day
  const seed = new Date().toISOString().split('T')[0]
  Math.seedrandom?.(seed) // only if seedrandom is available; otherwise just use shuffle
  return generateQuestions('mixed', 5)
}
