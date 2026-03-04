export const NFL_TEAMS = [
  // ── AFC EAST ─────────────────────────────────────────────────────────────
  { id:'NE',  name:'New England Patriots',   city:'Foxborough',       state:'MA', stadium:'Gillette Stadium',         conference:'AFC', division:'East', founded:1960 },
  { id:'BUF', name:'Buffalo Bills',          city:'Orchard Park',     state:'NY', stadium:'Highmark Stadium',         conference:'AFC', division:'East', founded:1960 },
  { id:'MIA', name:'Miami Dolphins',         city:'Miami',            state:'FL', stadium:'Hard Rock Stadium',        conference:'AFC', division:'East', founded:1966 },
  { id:'NYJ', name:'New York Jets',          city:'East Rutherford',  state:'NJ', stadium:'MetLife Stadium',          conference:'AFC', division:'East', founded:1960 },

  // ── AFC NORTH ────────────────────────────────────────────────────────────
  { id:'BAL', name:'Baltimore Ravens',       city:'Baltimore',        state:'MD', stadium:'M&T Bank Stadium',         conference:'AFC', division:'North', founded:1996 },
  { id:'CLE', name:'Cleveland Browns',       city:'Cleveland',        state:'OH', stadium:'Cleveland Browns Stadium',  conference:'AFC', division:'North', founded:1946 },
  { id:'PIT', name:'Pittsburgh Steelers',    city:'Pittsburgh',       state:'PA', stadium:'Acrisure Stadium',         conference:'AFC', division:'North', founded:1933 },
  { id:'CIN', name:'Cincinnati Bengals',     city:'Cincinnati',       state:'OH', stadium:'Paycor Stadium',           conference:'AFC', division:'North', founded:1968 },

  // ── AFC SOUTH ────────────────────────────────────────────────────────────
  { id:'HOU', name:'Houston Texans',         city:'Houston',          state:'TX', stadium:'NRG Stadium',              conference:'AFC', division:'South', founded:2002 },
  { id:'IND', name:'Indianapolis Colts',     city:'Indianapolis',     state:'IN', stadium:'Lucas Oil Stadium',        conference:'AFC', division:'South', founded:1953 },
  { id:'JAX', name:'Jacksonville Jaguars',   city:'Jacksonville',     state:'FL', stadium:'EverBank Stadium',         conference:'AFC', division:'South', founded:1995 },
  { id:'TEN', name:'Tennessee Titans',       city:'Nashville',        state:'TN', stadium:'Nissan Stadium',           conference:'AFC', division:'South', founded:1960 },

  // ── AFC WEST ─────────────────────────────────────────────────────────────
  { id:'KC',  name:'Kansas City Chiefs',     city:'Kansas City',      state:'MO', stadium:'GEHA Field at Arrowhead Stadium', conference:'AFC', division:'West', founded:1960 },
  { id:'LV',  name:'Las Vegas Raiders',      city:'Las Vegas',        state:'NV', stadium:'Allegiant Stadium',        conference:'AFC', division:'West', founded:1960 },
  { id:'LAC', name:'Los Angeles Chargers',   city:'Inglewood',        state:'CA', stadium:'SoFi Stadium',             conference:'AFC', division:'West', founded:1960 },
  { id:'DEN', name:'Denver Broncos',         city:'Denver',           state:'CO', stadium:'Empower Field at Mile High', conference:'AFC', division:'West', founded:1960 },

  // ── NFC EAST ─────────────────────────────────────────────────────────────
  { id:'DAL', name:'Dallas Cowboys',         city:'Arlington',        state:'TX', stadium:'AT&T Stadium',             conference:'NFC', division:'East', founded:1960 },
  { id:'NYG', name:'New York Giants',        city:'East Rutherford',  state:'NJ', stadium:'MetLife Stadium',          conference:'NFC', division:'East', founded:1925 },
  { id:'PHI', name:'Philadelphia Eagles',    city:'Philadelphia',     state:'PA', stadium:'Lincoln Financial Field',  conference:'NFC', division:'East', founded:1933 },
  { id:'WAS', name:'Washington Commanders', city:'Landover',         state:'MD', stadium:'Northwest Stadium',        conference:'NFC', division:'East', founded:1932 },

  // ── NFC NORTH ────────────────────────────────────────────────────────────
  { id:'CHI', name:'Chicago Bears',          city:'Chicago',          state:'IL', stadium:'Soldier Field',            conference:'NFC', division:'North', founded:1920 },
  { id:'DET', name:'Detroit Lions',          city:'Detroit',          state:'MI', stadium:'Ford Field',               conference:'NFC', division:'North', founded:1930 },
  { id:'GB',  name:'Green Bay Packers',      city:'Green Bay',        state:'WI', stadium:'Lambeau Field',            conference:'NFC', division:'North', founded:1921 },
  { id:'MIN', name:'Minnesota Vikings',      city:'Minneapolis',      state:'MN', stadium:'U.S. Bank Stadium',        conference:'NFC', division:'North', founded:1961 },

  // ── NFC SOUTH ────────────────────────────────────────────────────────────
  { id:'ATL', name:'Atlanta Falcons',        city:'Atlanta',          state:'GA', stadium:'Mercedes-Benz Stadium',   conference:'NFC', division:'South', founded:1966 },
  { id:'CAR', name:'Carolina Panthers',      city:'Charlotte',        state:'NC', stadium:'Bank of America Stadium', conference:'NFC', division:'South', founded:1995 },
  { id:'NO',  name:'New Orleans Saints',     city:'New Orleans',      state:'LA', stadium:'Caesars Superdome',        conference:'NFC', division:'South', founded:1967 },
  { id:'TB',  name:'Tampa Bay Buccaneers',   city:'Tampa',            state:'FL', stadium:'Raymond James Stadium',   conference:'NFC', division:'South', founded:1976 },

  // ── NFC WEST ─────────────────────────────────────────────────────────────
  { id:'ARI', name:'Arizona Cardinals',      city:'Glendale',         state:'AZ', stadium:'State Farm Stadium',       conference:'NFC', division:'West', founded:1920 },
  { id:'LAR', name:'Los Angeles Rams',       city:'Inglewood',        state:'CA', stadium:'SoFi Stadium',             conference:'NFC', division:'West', founded:1936 },
  { id:'SF',  name:'San Francisco 49ers',    city:'Santa Clara',      state:'CA', stadium:"Levi's Stadium",           conference:'NFC', division:'West', founded:1946 },
  { id:'SEA', name:'Seattle Seahawks',       city:'Seattle',          state:'WA', stadium:'Lumen Field',              conference:'NFC', division:'West', founded:1976 }
]

// Quick lookup by team ID
export const TEAM_BY_ID = Object.fromEntries(NFL_TEAMS.map(t => [t.id, t]))

// 2025 Season Starting Quarterbacks
export const STARTING_QBS = {
  NE:'Drake Maye',         BUF:'Josh Allen',          MIA:'Tua Tagovailoa',    NYJ:'Aaron Rodgers',
  BAL:'Lamar Jackson',     CLE:'Joe Flacco',           PIT:'Justin Fields',     CIN:'Joe Burrow',
  HOU:'C.J. Stroud',       IND:'Anthony Richardson',  JAX:'Trevor Lawrence',   TEN:'Will Levis',
  KC:'Patrick Mahomes',    LV:'Aidan O\'Connell',      LAC:'Justin Herbert',    DEN:'Bo Nix',
  DAL:'Dak Prescott',      NYG:'Drew Lock',            PHI:'Jalen Hurts',       WAS:'Jayden Daniels',
  CHI:'Caleb Williams',    DET:'Jared Goff',           GB:'Jordan Love',        MIN:'J.J. McCarthy',
  ATL:'Michael Penix Jr.', CAR:'Bryce Young',          NO:'Spencer Rattler',    TB:'Baker Mayfield',
  ARI:'Kyler Murray',      LAR:'Matthew Stafford',     SF:'Brock Purdy',        SEA:'Geno Smith'
}

// Stadium coordinates [lng, lat] for map markers
export const NFL_COORDS = {
  NE: [-71.26, 42.09],  BUF: [-78.79, 42.77],  MIA: [-80.24, 25.95],
  NYJ: [-74.07, 40.83], NYG: [-74.07, 40.79],  // offset: share MetLife
  BAL: [-76.62, 39.28], CLE: [-81.70, 41.51],  PIT: [-80.02, 40.45],  CIN: [-84.52, 39.10],
  HOU: [-95.41, 29.68], IND: [-86.16, 39.76],  JAX: [-81.64, 30.32],  TEN: [-86.77, 36.17],
  KC:  [-94.48, 39.05], LV: [-115.18, 36.09],
  LAC: [-118.32, 33.95], LAR: [-118.36, 33.95], // offset: share SoFi
  DEN: [-105.02, 39.74],
  DAL: [-97.09, 32.75],  PHI: [-75.17, 39.90],
  WAS: [-76.86, 38.91],
  CHI: [-87.62, 41.86],  DET: [-83.05, 42.34],  GB: [-88.06, 44.50],   MIN: [-93.26, 44.97],
  ATL: [-84.40, 33.76],  CAR: [-80.85, 35.23],  NO: [-90.08, 29.95],   TB: [-82.50, 27.98],
  ARI: [-112.26, 33.53],
  SF:  [-121.97, 37.40], SEA: [-122.33, 47.60],
}

// Teams grouped by state
export const TEAMS_BY_STATE = NFL_TEAMS.reduce((acc, team) => {
  if (!acc[team.state]) acc[team.state] = []
  acc[team.state].push(team)
  return acc
}, {})
