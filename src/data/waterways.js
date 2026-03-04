// Rivers and Lakes with a clear primary-state association for quiz questions
export const WATERWAYS = [
  // ── Rivers ────────────────────────────────────────────────────────────────
  {
    name: 'Mississippi River', type: 'river', state: 'MN',
    question: 'The Mississippi River originates in which state?',
    fact: 'The Mississippi begins at Lake Itasca in Minnesota and flows 2,340 miles to the Gulf of Mexico.',
    wikiTitle: 'Mississippi River'
  },
  {
    name: 'Colorado River', type: 'river', state: 'CO',
    question: 'The Colorado River originates in — and is named after — which state?',
    fact: 'The Colorado River begins in the Rocky Mountains of Colorado and carved the Grand Canyon over millions of years.',
    wikiTitle: 'Colorado River'
  },
  {
    name: 'Missouri River', type: 'river', state: 'MT',
    question: 'The Missouri River, the longest river in North America, begins in which state?',
    fact: 'The Missouri River originates at the confluence of the Gallatin, Madison, and Jefferson rivers in Montana.',
    wikiTitle: 'Missouri River'
  },
  {
    name: 'Rio Grande', type: 'river', state: 'TX',
    question: 'The Rio Grande forms the entire southern border of which US state?',
    fact: 'The Rio Grande stretches 1,896 miles and forms the complete US–Mexico border along Texas.',
    wikiTitle: 'Rio Grande'
  },
  {
    name: 'Hudson River', type: 'river', state: 'NY',
    question: 'The Hudson River flows south through which state before emptying into New York Harbor?',
    fact: 'The Hudson River stretches 315 miles through New York and was central to early American commerce.',
    wikiTitle: 'Hudson River'
  },
  {
    name: 'Sacramento River', type: 'river', state: 'CA',
    question: 'The Sacramento River, the longest river in which state, flows into San Francisco Bay?',
    fact: 'The Sacramento River is California\'s largest river and a vital source of fresh water for the state.',
    wikiTitle: 'Sacramento River'
  },
  {
    name: 'Tennessee River', type: 'river', state: 'TN',
    question: 'The Tennessee River is the primary river flowing through which state?',
    fact: 'The Tennessee River is a tributary of the Ohio River and was transformed by TVA dams in the 1930s.',
    wikiTitle: 'Tennessee River'
  },
  {
    name: 'Snake River', type: 'river', state: 'ID',
    question: 'The Snake River, which carved Hells Canyon, primarily flows through which state?',
    fact: 'The Snake River runs 1,078 miles and is Idaho\'s major river, draining much of the Snake River Plain.',
    wikiTitle: 'Snake River'
  },
  {
    name: 'Platte River', type: 'river', state: 'NE',
    question: 'The Platte River runs west to east across which Great Plains state?',
    fact: 'The Platte River was a key route for westward migration along the Oregon, California, and Mormon trails.',
    wikiTitle: 'Platte River'
  },
  {
    name: 'James River', type: 'river', state: 'VA',
    question: 'The James River flows east to the Chesapeake Bay through which state?',
    fact: 'The James River was the site of the first permanent English settlement in America at Jamestown (1607).',
    wikiTitle: 'James River (Virginia)'
  },
  {
    name: 'Willamette River', type: 'river', state: 'OR',
    question: 'The Willamette River flows northward through which Pacific Northwest state?',
    fact: 'The Willamette Valley in Oregon is home to over two-thirds of the state\'s population and its capital, Salem.',
    wikiTitle: 'Willamette River'
  },
  {
    name: 'Potomac River', type: 'river', state: 'MD',
    question: 'The Potomac River forms the southern boundary of which Mid-Atlantic state?',
    fact: 'The Potomac River flows through Washington D.C. and forms the border between Maryland and Virginia.',
    wikiTitle: 'Potomac River'
  },
  {
    name: 'Susquehanna River', type: 'river', state: 'PA',
    question: 'The Susquehanna River, the longest river on the US East Coast, primarily flows through which state?',
    fact: 'The Susquehanna drains 27,500 square miles and supplies about half the fresh water entering the Chesapeake Bay.',
    wikiTitle: 'Susquehanna River'
  },
  {
    name: 'Yellowstone River', type: 'river', state: 'MT',
    question: 'The Yellowstone River, the longest free-flowing river in the lower 48, ends its journey in which state?',
    fact: 'The Yellowstone flows from Wyoming through Montana, joining the Missouri River near the North Dakota border.',
    wikiTitle: 'Yellowstone River'
  },
  {
    name: 'Connecticut River', type: 'river', state: 'CT',
    question: 'Which New England state did the Connecticut River give its name to?',
    fact: 'The Connecticut River is the longest river in New England, flowing through four states before reaching Long Island Sound.',
    wikiTitle: 'Connecticut River'
  },

  // ── Lakes ─────────────────────────────────────────────────────────────────
  {
    name: 'Great Salt Lake', type: 'lake', state: 'UT',
    question: 'The Great Salt Lake, the largest saltwater lake in the Western Hemisphere, is in which state?',
    fact: 'The Great Salt Lake in Utah is so salty that swimmers float effortlessly — it has no outlet to the ocean.',
    wikiTitle: 'Great Salt Lake'
  },
  {
    name: 'Crater Lake', type: 'lake', state: 'OR',
    question: 'Crater Lake, the deepest lake in the United States at 1,943 feet, is located in which state?',
    fact: 'Crater Lake in Oregon formed when Mount Mazama collapsed about 7,700 years ago — it has no rivers flowing in or out.',
    wikiTitle: 'Crater Lake'
  },
  {
    name: 'Lake Okeechobee', type: 'lake', state: 'FL',
    question: 'Lake Okeechobee, the largest lake entirely within the contiguous United States, is in which state?',
    fact: 'Lake Okeechobee in Florida covers about 730 square miles and is nicknamed "Florida\'s Inland Sea."',
    wikiTitle: 'Lake Okeechobee'
  },
  {
    name: 'Flathead Lake', type: 'lake', state: 'MT',
    question: 'Flathead Lake, the largest natural freshwater lake west of the Mississippi, is in which state?',
    fact: 'Flathead Lake in Montana covers 197 square miles and is renowned for its crystal-clear water and cherry orchards.',
    wikiTitle: 'Flathead Lake'
  },
  {
    name: 'Lake Champlain', type: 'lake', state: 'VT',
    question: 'Lake Champlain, briefly declared the sixth Great Lake in 1998, borders which New England state?',
    fact: 'Lake Champlain stretches along the Vermont–New York border and was a key battleground in the War of 1812.',
    wikiTitle: 'Lake Champlain'
  },
  {
    name: 'Mono Lake', type: 'lake', state: 'CA',
    question: 'The ancient Mono Lake, famous for its eerie tufa towers, is located in which state?',
    fact: 'Mono Lake in California is over 1 million years old and three times saltier than the ocean.',
    wikiTitle: 'Mono Lake'
  },
  {
    name: 'Yellowstone Lake', type: 'lake', state: 'WY',
    question: 'Yellowstone Lake, the largest high-elevation lake in North America, is in which state?',
    fact: 'Yellowstone Lake sits at 7,733 feet in Wyoming and sits atop one of the world\'s largest supervolcanoes.',
    wikiTitle: 'Yellowstone Lake'
  },
  {
    name: 'Lake Winnebago', type: 'lake', state: 'WI',
    question: 'Lake Winnebago, the largest inland lake in the Midwest, is located in which state?',
    fact: 'Lake Winnebago in Wisconsin covers 215 square miles and hosts the world\'s largest sturgeon spearing event each February.',
    wikiTitle: 'Lake Winnebago'
  },
  {
    name: 'Lake Mead', type: 'lake', state: 'NV',
    question: 'Lake Mead, the largest reservoir in the United States by volume, is primarily located in which state?',
    fact: 'Lake Mead was formed by the Hoover Dam on the Nevada–Arizona border and supplies water to 25 million people.',
    wikiTitle: 'Lake Mead'
  },
  {
    name: 'Lake Tahoe', type: 'lake', state: 'CA',
    question: 'Lake Tahoe sits on the border of Nevada and which other state?',
    fact: 'Lake Tahoe is the largest alpine lake in North America, straddling the California–Nevada border at 6,225 feet elevation.',
    wikiTitle: 'Lake Tahoe'
  },
]
