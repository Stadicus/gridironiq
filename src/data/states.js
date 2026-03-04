// FIPS code → state abbreviation lookup
export const FIPS_TO_ABBR = {
  '01':'AL','02':'AK','04':'AZ','05':'AR','06':'CA','08':'CO','09':'CT',
  '10':'DE','11':'DC','12':'FL','13':'GA','15':'HI','16':'ID','17':'IL',
  '18':'IN','19':'IA','20':'KS','21':'KY','22':'LA','23':'ME','24':'MD',
  '25':'MA','26':'MI','27':'MN','28':'MS','29':'MO','30':'MT','31':'NE',
  '32':'NV','33':'NH','34':'NJ','35':'NM','36':'NY','37':'NC','38':'ND',
  '39':'OH','40':'OK','41':'OR','42':'PA','44':'RI','45':'SC','46':'SD',
  '47':'TN','48':'TX','49':'UT','50':'VT','51':'VA','53':'WA','54':'WV',
  '55':'WI','56':'WY'
}

export const ABBR_TO_FIPS = Object.fromEntries(Object.entries(FIPS_TO_ABBR).map(([k,v]) => [v,k]))

export const STATES = [
  // ── NORTHEAST ────────────────────────────────────────────────────────────
  {
    abbr:'ME', name:'Maine', capital:'Augusta', region:'Northeast',
    admitted:1820, nickname:'The Pine Tree State', lat:45.25, lng:-69.0,
    landmarks:['Acadia National Park','Portland Head Light','Bar Harbor','Kennebunkport'],
    famousPeople:['Stephen King','Henry Wadsworth Longfellow','Hannibal Hamlin','Joan Benoit Samuelson'],
    nflTeams:[],
    funFacts:['Easternmost state in the US','Produces 99% of the nation\'s blueberries']
  },
  {
    abbr:'NH', name:'New Hampshire', capital:'Concord', region:'Northeast',
    admitted:1788, nickname:'The Granite State', lat:43.68, lng:-71.5,
    landmarks:['Mount Washington','White Mountain National Forest','Lake Winnipesaukee','Hampton Beach'],
    famousPeople:['Franklin Pierce','Alan Shepard','Adam Sandler','Sarah Josepha Hale'],
    nflTeams:['New England Patriots'],
    funFacts:['First state to hold a presidential primary','Home of the highest recorded wind speed on Earth at Mount Washington']
  },
  {
    abbr:'VT', name:'Vermont', capital:'Montpelier', region:'Northeast',
    admitted:1791, nickname:'The Green Mountain State', lat:44.0, lng:-72.7,
    landmarks:['Stowe Mountain Resort','Lake Champlain','Shelburne Museum','Green Mountain National Forest'],
    famousPeople:['Calvin Coolidge','Bernie Sanders','Rudyard Kipling (lived there)','Ben Cohen & Jerry Greenfield'],
    nflTeams:[],
    funFacts:['Smallest state capital by population (Montpelier)','Has more cows than people']
  },
  {
    abbr:'MA', name:'Massachusetts', capital:'Boston', region:'Northeast',
    admitted:1788, nickname:'The Bay State', lat:42.25, lng:-71.8,
    landmarks:['Freedom Trail','Cape Cod National Seashore','Plymouth Rock','Harvard University','Salem Witch Museum'],
    famousPeople:['John F. Kennedy','Benjamin Franklin','Matt Damon','Mark Wahlberg','Edgar Allan Poe (born)'],
    nflTeams:['New England Patriots'],
    funFacts:['First public school in America established in Boston in 1635','Home of the first Thanksgiving']
  },
  {
    abbr:'RI', name:'Rhode Island', capital:'Providence', region:'Northeast',
    admitted:1790, nickname:'The Ocean State', lat:41.68, lng:-71.5,
    landmarks:['The Breakers (Newport Mansion)','Cliff Walk','Roger Williams Park','WaterFire Providence'],
    famousPeople:['H.P. Lovecraft','George M. Cohan','David Byrne','Nick Lachey','Patrick Kennedy'],
    nflTeams:[],
    funFacts:['Smallest state by area in the US','First colony to declare independence from Britain (1776)']
  },
  {
    abbr:'CT', name:'Connecticut', capital:'Hartford', region:'Northeast',
    admitted:1788, nickname:'The Constitution State', lat:41.6, lng:-72.7,
    landmarks:['Mystic Seaport Museum','Mark Twain House','Yale University','Gillette Castle'],
    famousPeople:['Mark Twain','Katharine Hepburn','Paul Newman','Meg Ryan','Michael Bolton'],
    nflTeams:[],
    funFacts:['First state to issue car licenses (1937)','Home to the first hamburger served in America (New Haven, 1895)']
  },
  {
    abbr:'NY', name:'New York', capital:'Albany', region:'Northeast',
    admitted:1788, nickname:'The Empire State', lat:42.9, lng:-75.5,
    landmarks:['Statue of Liberty','Niagara Falls','Times Square','Central Park','Adirondack Mountains'],
    famousPeople:['Theodore Roosevelt','Franklin D. Roosevelt','Lou Gehrig','Lady Gaga','Jay-Z'],
    nflTeams:['New York Giants','New York Jets','Buffalo Bills'],
    funFacts:['New York City is the most populous city in the US','The Erie Canal, opened in 1825, connected the Great Lakes to the Atlantic Ocean']
  },
  {
    abbr:'NJ', name:'New Jersey', capital:'Trenton', region:'Northeast',
    admitted:1787, nickname:'The Garden State', lat:40.14, lng:-74.5,
    landmarks:['Atlantic City Boardwalk','Liberty State Park','Cape May','Princeton University'],
    famousPeople:['Thomas Edison','Bruce Springsteen','Frank Sinatra','Jon Bon Jovi','Meryl Streep'],
    nflTeams:['New York Giants','New York Jets'],
    funFacts:['Most densely populated state in the US','Home to more diners per capita than any other state']
  },
  {
    abbr:'PA', name:'Pennsylvania', capital:'Harrisburg', region:'Northeast',
    admitted:1787, nickname:'The Keystone State', lat:40.9, lng:-77.8,
    landmarks:['Liberty Bell','Independence Hall','Gettysburg National Military Park','Fallingwater','Hersheypark'],
    famousPeople:['Benjamin Franklin','Will Smith','Taylor Swift','Andy Warhol','Jim Thorpe'],
    nflTeams:['Pittsburgh Steelers','Philadelphia Eagles'],
    funFacts:['First capital of the United States was Philadelphia','Home to the nation\'s first hospital (Pennsylvania Hospital, 1751)']
  },
  {
    abbr:'DE', name:'Delaware', capital:'Dover', region:'Northeast',
    admitted:1787, nickname:'The First State', lat:39.0, lng:-75.5,
    landmarks:['Winterthur Museum','Cape Henlopen State Park','Rehoboth Beach','Fort Delaware'],
    famousPeople:['Joe Biden','Caesar Rodney','Annie Jump Cannon','Ryan Phillippe'],
    nflTeams:[],
    funFacts:['First state to ratify the US Constitution (Dec 7, 1787)','More corporations are chartered in Delaware than in any other state']
  },
  {
    abbr:'MD', name:'Maryland', capital:'Annapolis', region:'Northeast',
    admitted:1788, nickname:'The Old Line State', lat:39.0, lng:-76.8,
    landmarks:['Inner Harbor (Baltimore)','U.S. Naval Academy','Assateague Island','Antietam National Battlefield'],
    famousPeople:['Frederick Douglass','Babe Ruth','Thurgood Marshall','Michael Phelps','Edgar Allan Poe (lived)'],
    nflTeams:['Baltimore Ravens'],
    funFacts:['National Anthem written by Marylander Francis Scott Key','Home to the Chesapeake Bay, the largest estuary in the US']
  },

  // ── SOUTHEAST ────────────────────────────────────────────────────────────
  {
    abbr:'VA', name:'Virginia', capital:'Richmond', region:'Southeast',
    admitted:1788, nickname:'Old Dominion', lat:37.5, lng:-78.5,
    landmarks:['Colonial Williamsburg','Monticello','Shenandoah National Park','Arlington National Cemetery','Mount Vernon'],
    famousPeople:['George Washington','Thomas Jefferson','Patrick Henry','Arthur Ashe','Ella Fitzgerald'],
    nflTeams:['Washington Commanders'],
    funFacts:['8 US Presidents were born in Virginia (more than any other state)','Home of the Pentagon, the world\'s largest office building by floor area']
  },
  {
    abbr:'WV', name:'West Virginia', capital:'Charleston', region:'Southeast',
    admitted:1863, nickname:'The Mountain State', lat:38.9, lng:-80.5,
    landmarks:['New River Gorge National Park','Harpers Ferry National Historical Park','Seneca Rocks','Blackwater Falls'],
    famousPeople:['Chuck Yeager','Pearl Buck','Brad Paisley','Jerry West','Don Knotts'],
    nflTeams:[],
    funFacts:['Only state formed by seceding from a Confederate state (Virginia) during the Civil War','New River Gorge Bridge was the longest steel arch bridge in the world when built (1977)']
  },
  {
    abbr:'NC', name:'North Carolina', capital:'Raleigh', region:'Southeast',
    admitted:1789, nickname:'The Tar Heel State', lat:35.5, lng:-79.4,
    landmarks:['Blue Ridge Parkway','Outer Banks','Great Smoky Mountains (partial)','Wright Brothers National Memorial'],
    famousPeople:['Michael Jordan','James Polk','Andrew Johnson','Ava Gardner','James Taylor'],
    nflTeams:['Carolina Panthers'],
    funFacts:['First powered airplane flight by the Wright Brothers took place at Kitty Hawk','First English colony in America was established at Roanoke Island (1587)']
  },
  {
    abbr:'SC', name:'South Carolina', capital:'Columbia', region:'Southeast',
    admitted:1788, nickname:'The Palmetto State', lat:33.8, lng:-81.2,
    landmarks:['Fort Sumter National Monument','Hilton Head Island','Myrtle Beach','Congaree National Park'],
    famousPeople:['Andrew Jackson','John C. Calhoun','Chris Rock','Darius Rucker','Stephen Colbert'],
    nflTeams:[],
    funFacts:['First state to secede from the Union (December 20, 1860)','The Civil War began at Fort Sumter, SC in 1861']
  },
  {
    abbr:'GA', name:'Georgia', capital:'Atlanta', region:'Southeast',
    admitted:1788, nickname:'The Peach State', lat:32.7, lng:-83.5,
    landmarks:['Okefenokee Swamp','Stone Mountain Park','Savannah Historic District','Georgia Aquarium'],
    famousPeople:['Martin Luther King Jr.','Jimmy Carter','Ray Charles','Usher','Julia Roberts'],
    nflTeams:['Atlanta Falcons'],
    funFacts:['Georgia is the largest state east of the Mississippi River','Home of the busiest airport in the world — Hartsfield-Jackson Atlanta International']
  },
  {
    abbr:'FL', name:'Florida', capital:'Tallahassee', region:'Southeast',
    admitted:1845, nickname:'The Sunshine State', lat:28.5, lng:-81.5,
    landmarks:['Everglades National Park','Kennedy Space Center','Walt Disney World','South Beach Miami'],
    famousPeople:['Sidney Poitier','Jim Morrison','Faye Dunaway','Hulk Hogan','Gloria Estefan'],
    nflTeams:['Miami Dolphins','Jacksonville Jaguars','Tampa Bay Buccaneers'],
    funFacts:['Florida has more golf courses than any other state','More lightning strikes than any other state — nicknamed the "Lightning Capital of the US"']
  },
  {
    abbr:'TN', name:'Tennessee', capital:'Nashville', region:'Southeast',
    admitted:1796, nickname:'The Volunteer State', lat:35.85, lng:-86.4,
    landmarks:['Grand Ole Opry','Graceland','Great Smoky Mountains National Park','Dollywood'],
    famousPeople:['Dolly Parton','Elvis Presley (raised)','Andrew Jackson','Al Gore','Morgan Freeman'],
    nflTeams:['Tennessee Titans'],
    funFacts:['Nashville is the country music capital of the world','Great Smoky Mountains is the most visited national park in the US']
  },
  {
    abbr:'KY', name:'Kentucky', capital:'Frankfort', region:'Southeast',
    admitted:1792, nickname:'The Bluegrass State', lat:37.5, lng:-85.3,
    landmarks:['Mammoth Cave National Park','Churchill Downs','Land Between the Lakes','Cumberland Falls'],
    famousPeople:['Abraham Lincoln','Muhammad Ali','George Clooney','Jennifer Lawrence','Diane Sawyer'],
    nflTeams:[],
    funFacts:['Home of the Kentucky Derby, the oldest horse race in America (since 1875)','Mammoth Cave is the world\'s longest known cave system (over 400 miles)']
  },
  {
    abbr:'AL', name:'Alabama', capital:'Montgomery', region:'Southeast',
    admitted:1819, nickname:'The Heart of Dixie', lat:32.8, lng:-86.8,
    landmarks:['U.S. Space & Rocket Center','Civil Rights Memorial','Talladega Superspeedway','Gulf State Park'],
    famousPeople:['Helen Keller','Hank Aaron','Rosa Parks','Condoleezza Rice','Harper Lee'],
    nflTeams:[],
    funFacts:['Montgomery was the first capital of the Confederacy','Home to NASA\'s Marshall Space Flight Center']
  },
  {
    abbr:'MS', name:'Mississippi', capital:'Jackson', region:'Southeast',
    admitted:1817, nickname:'The Magnolia State', lat:32.7, lng:-89.6,
    landmarks:['Vicksburg National Military Park','Natchez Trace Parkway','Mississippi Delta','Gulf Islands National Seashore'],
    famousPeople:['Elvis Presley (born in Tupelo)','Oprah Winfrey','William Faulkner','B.B. King','Jim Henson'],
    nflTeams:[],
    funFacts:['Mississippi River, which borders the state, is the second-longest river in North America','Biloxi was the first European settlement in Mississippi (1699)']
  },
  {
    abbr:'AR', name:'Arkansas', capital:'Little Rock', region:'Southeast',
    admitted:1836, nickname:'The Natural State', lat:34.8, lng:-92.2,
    landmarks:['Hot Springs National Park','Crater of Diamonds State Park','Crystal Bridges Museum','Buffalo National River'],
    famousPeople:['Bill Clinton','Hillary Clinton','Johnny Cash','Sam Walton','Scott Joplin'],
    nflTeams:[],
    funFacts:['Only state in the US where diamonds are found naturally (Crater of Diamonds SP)','Walmart was founded in Rogers, Arkansas (1962)']
  },
  {
    abbr:'LA', name:'Louisiana', capital:'Baton Rouge', region:'Southeast',
    admitted:1812, nickname:'The Pelican State', lat:31.0, lng:-91.8,
    landmarks:['French Quarter (New Orleans)','Oak Alley Plantation','Avery Island','Bayou Country'],
    famousPeople:['Louis Armstrong','Truman Capote','Britney Spears','Lil Wayne','Fats Domino'],
    nflTeams:['New Orleans Saints'],
    funFacts:['Louisiana is the only state with parishes instead of counties','New Orleans hosts Mardi Gras, the largest street party in North America']
  },

  // ── MIDWEST ──────────────────────────────────────────────────────────────
  {
    abbr:'OH', name:'Ohio', capital:'Columbus', region:'Midwest',
    admitted:1803, nickname:'The Buckeye State', lat:40.4, lng:-82.8,
    landmarks:['Rock & Roll Hall of Fame','Cedar Point Amusement Park','Wright Brothers National Museum','Hocking Hills State Park'],
    famousPeople:['Neil Armstrong','John Glenn','Steven Spielberg','LeBron James','Sheryl Crow'],
    nflTeams:['Cleveland Browns','Cincinnati Bengals'],
    funFacts:['7 US presidents were born in Ohio, more than any other state except Virginia','The Rock & Roll Hall of Fame is located in Cleveland because rock and roll disc jockey Alan Freed was from Ohio']
  },
  {
    abbr:'IN', name:'Indiana', capital:'Indianapolis', region:'Midwest',
    admitted:1816, nickname:'The Hoosier State', lat:40.27, lng:-86.13,
    landmarks:['Indianapolis Motor Speedway','Indiana Dunes National Park','Children\'s Museum of Indianapolis','Lincoln Boyhood National Memorial'],
    famousPeople:['Benjamin Harrison','Michael Jackson','David Letterman','Axl Rose','Larry Bird'],
    nflTeams:['Indianapolis Colts'],
    funFacts:['Indianapolis Motor Speedway is the highest-capacity sports venue in the world','Indiana produces more popcorn than any other state']
  },
  {
    abbr:'MI', name:'Michigan', capital:'Lansing', region:'Midwest',
    admitted:1837, nickname:'The Great Lakes State', lat:44.3, lng:-85.4,
    landmarks:['Mackinac Island','Sleeping Bear Dunes National Lakeshore','Henry Ford Museum','Pictured Rocks National Lakeshore'],
    famousPeople:['Henry Ford','Madonna','Stevie Wonder','Eminem','Diana Ross'],
    nflTeams:['Detroit Lions'],
    funFacts:['Michigan is the only state that consists of two separate peninsulas','More than 3,000 miles of freshwater shoreline — more than any other US state']
  },
  {
    abbr:'WI', name:'Wisconsin', capital:'Madison', region:'Midwest',
    admitted:1848, nickname:'The Badger State', lat:44.5, lng:-89.5,
    landmarks:['Wisconsin Dells','Door County','Lambeau Field (Green Bay)','House on the Rock'],
    famousPeople:['Frank Lloyd Wright','Orson Welles','Harry Houdini','Liberace','Gene Wilder'],
    nflTeams:['Green Bay Packers'],
    funFacts:['Wisconsin produces more cheese than any other US state','Green Bay Packers are the only publicly owned franchise in major US professional sports']
  },
  {
    abbr:'IL', name:'Illinois', capital:'Springfield', region:'Midwest',
    admitted:1818, nickname:'The Land of Lincoln', lat:40.35, lng:-88.99,
    landmarks:['Navy Pier','Willis Tower (Sears Tower)','Route 66 Museum (Springfield)','Starved Rock State Park'],
    famousPeople:['Abraham Lincoln','Barack Obama','Walt Disney (born)','Harrison Ford','Michelle Obama'],
    nflTeams:['Chicago Bears'],
    funFacts:['Chicago is nicknamed "The Windy City" — not because of its weather, but because of its boastful politicians','Springfield, the state capital, was once home to Abraham Lincoln for 24 years']
  },
  {
    abbr:'MN', name:'Minnesota', capital:'Saint Paul', region:'Midwest',
    admitted:1858, nickname:'The Land of 10,000 Lakes', lat:46.4, lng:-93.1,
    landmarks:['Mall of America','Boundary Waters Canoe Area','Minneapolis Sculpture Garden','Voyageurs National Park'],
    famousPeople:['Bob Dylan','Judy Garland','Charles Schulz','Prince','Jesse Ventura'],
    nflTeams:['Minnesota Vikings'],
    funFacts:['Minnesota actually has over 14,000 lakes, more than the 10,000 in its nickname','Mayo Clinic in Rochester is one of the world\'s most respected medical institutions']
  },
  {
    abbr:'IA', name:'Iowa', capital:'Des Moines', region:'Midwest',
    admitted:1846, nickname:'The Hawkeye State', lat:42.0, lng:-93.5,
    landmarks:['Iowa State Fair','Field of Dreams Movie Site','Effigy Mounds National Monument','Pikes Peak State Park'],
    famousPeople:['John Wayne','Ashton Kutcher','Herbert Hoover','Simon Estes','Cloris Leachman'],
    nflTeams:[],
    funFacts:['Iowa produces more corn than any other state','Iowa was the first state to give women the legal right to practice law (1869)']
  },
  {
    abbr:'MO', name:'Missouri', capital:'Jefferson City', region:'Midwest',
    admitted:1821, nickname:'The Show Me State', lat:38.45, lng:-92.3,
    landmarks:['Gateway Arch National Park','Mark Twain Boyhood Home','Silver Dollar City','Lake of the Ozarks'],
    famousPeople:['Mark Twain','Harry S. Truman','Walt Disney (raised)','T.S. Eliot','Nelly'],
    nflTeams:['Kansas City Chiefs'],
    funFacts:['The Gateway Arch in St. Louis is the tallest arch in the world at 630 feet','Missouri is known as the "Gateway to the West" as it was the starting point for the Lewis and Clark Expedition']
  },
  {
    abbr:'ND', name:'North Dakota', capital:'Bismarck', region:'Midwest',
    admitted:1889, nickname:'The Peace Garden State', lat:47.5, lng:-100.5,
    landmarks:['Theodore Roosevelt National Park','International Peace Garden','Bonanzaville Pioneer Village','Fort Abraham Lincoln'],
    famousPeople:['Louis L\'Amour','Roger Maris','Angie Dickinson','Phil Jackson','Lawrence Welk'],
    nflTeams:[],
    funFacts:['North Dakota and South Dakota became states on the same day (Nov 2, 1889)','North Dakota is the leading honey-producing state in the US']
  },
  {
    abbr:'SD', name:'South Dakota', capital:'Pierre', region:'Midwest',
    admitted:1889, nickname:'The Mount Rushmore State', lat:44.5, lng:-100.3,
    landmarks:['Mount Rushmore National Memorial','Crazy Horse Memorial','Badlands National Park','Wind Cave National Park'],
    famousPeople:['Sitting Bull (Chief)','Crazy Horse (Chief)','Tom Brokaw','Laura Ingalls Wilder','Pat O\'Brien'],
    nflTeams:[],
    funFacts:['Mount Rushmore took 14 years to carve (1927–1941)','Badlands National Park erodes about an inch per year']
  },
  {
    abbr:'NE', name:'Nebraska', capital:'Lincoln', region:'Midwest',
    admitted:1867, nickname:'The Cornhusker State', lat:41.5, lng:-99.9,
    landmarks:['Chimney Rock National Historic Site','Henry Doorly Zoo (Omaha)','Scotts Bluff National Monument','Sandhills'],
    famousPeople:['Warren Buffett','Johnny Carson','Malcolm X (born)','Fred Astaire','Henry Fonda'],
    nflTeams:[],
    funFacts:['Nebraska is the only state that has a unicameral (single-chamber) legislature','More miles of river than any other state in the contiguous US']
  },
  {
    abbr:'KS', name:'Kansas', capital:'Topeka', region:'Midwest',
    admitted:1861, nickname:'The Sunflower State', lat:38.5, lng:-98.4,
    landmarks:['Dodge City','Wizard of Oz Museum (Liberal)','Brown v. Board of Education National Historic Site','Eisenhower Presidential Library'],
    famousPeople:['Dwight D. Eisenhower','Amelia Earhart','Carry Nation','Bob Dole','Dennis Hopper'],
    nflTeams:['Kansas City Chiefs'],
    funFacts:['Geographic center of the contiguous United States is near Lebanon, Kansas','Kansas grows enough wheat each year to feed everyone in the world for two weeks']
  },

  // ── SOUTHWEST ────────────────────────────────────────────────────────────
  {
    abbr:'TX', name:'Texas', capital:'Austin', region:'Southwest',
    admitted:1845, nickname:'The Lone Star State', lat:31.5, lng:-99.3,
    landmarks:['The Alamo','Big Bend National Park','NASA Johnson Space Center','San Antonio River Walk'],
    famousPeople:['Sam Houston','Lyndon B. Johnson','George W. Bush','Beyoncé','Matthew McConaughey'],
    nflTeams:['Dallas Cowboys','Houston Texans'],
    funFacts:['Texas is the second-largest state by both area and population','The King Ranch in Texas is larger than the entire state of Rhode Island']
  },
  {
    abbr:'OK', name:'Oklahoma', capital:'Oklahoma City', region:'Southwest',
    admitted:1907, nickname:'The Sooner State', lat:35.5, lng:-97.5,
    landmarks:['Oklahoma City National Memorial','Route 66','Wichita Mountains Wildlife Refuge','Cherokee National Capitol'],
    famousPeople:['Will Rogers','Mickey Mantle','Ralph Ellison','Reba McEntire','Garth Brooks'],
    nflTeams:[],
    funFacts:['Oklahoma City bombing memorial honors 168 lives lost in the 1995 bombing','Oklahoma has the most miles of historic Route 66 (400 miles)']
  },
  {
    abbr:'NM', name:'New Mexico', capital:'Santa Fe', region:'Southwest',
    admitted:1912, nickname:'Land of Enchantment', lat:34.3, lng:-106.0,
    landmarks:['Carlsbad Caverns National Park','White Sands National Park','Taos Pueblo','Chaco Culture National Historical Park'],
    famousPeople:['John Denver (born)','Neil Patrick Harris','Holly Hunter','Conrad Hilton'],
    nflTeams:[],
    funFacts:['Santa Fe is the oldest state capital in the US (founded ~1610)','New Mexico has more PhDs per capita than any other state']
  },
  {
    abbr:'AZ', name:'Arizona', capital:'Phoenix', region:'Southwest',
    admitted:1912, nickname:'The Grand Canyon State', lat:34.2, lng:-111.5,
    landmarks:['Grand Canyon National Park','Monument Valley','Sedona Red Rocks','Saguaro National Park'],
    famousPeople:['César Chávez','Linda Ronstadt','Alice Cooper','Emma Stone','Frank Lloyd Wright (lived)'],
    nflTeams:['Arizona Cardinals'],
    funFacts:['Grand Canyon is 277 miles long, up to 18 miles wide, and over a mile deep','Arizona does not observe Daylight Saving Time (except the Navajo Nation)']
  },

  // ── WEST ─────────────────────────────────────────────────────────────────
  {
    abbr:'CO', name:'Colorado', capital:'Denver', region:'West',
    admitted:1876, nickname:'The Centennial State', lat:39.0, lng:-105.5,
    landmarks:['Rocky Mountain National Park','Mesa Verde National Park','Garden of the Gods','Pikes Peak'],
    famousPeople:['Jack Dempsey','Tim Allen','Don Cheadle','Roseanne Barr','Amy Grant'],
    nflTeams:['Denver Broncos'],
    funFacts:['Colorado has 58 "fourteeners" — mountains over 14,000 feet (more than any other state)','First US outdoor escalator was built in Colorado (1908)']
  },
  {
    abbr:'WY', name:'Wyoming', capital:'Cheyenne', region:'West',
    admitted:1890, nickname:'The Equality State', lat:43.0, lng:-107.6,
    landmarks:['Yellowstone National Park','Grand Teton National Park','Devils Tower National Monument','Flaming Gorge'],
    famousPeople:['Dick Cheney','Jackson Pollock','Jim Bridger','Patricia MacLachlan','Matthew Fox'],
    nflTeams:[],
    funFacts:['Wyoming was the first US territory to grant women the right to vote (1869)','Yellowstone is the world\'s first national park (established 1872)']
  },
  {
    abbr:'MT', name:'Montana', capital:'Helena', region:'West',
    admitted:1889, nickname:'Big Sky Country', lat:47.0, lng:-110.0,
    landmarks:['Glacier National Park','Little Bighorn Battlefield','Beartooth Highway','Flathead Lake'],
    famousPeople:['Gary Cooper','David Lynch','Jeannette Rankin','Evel Knievel','Dana Carvey'],
    nflTeams:[],
    funFacts:['Montana has more cattle than people','Glacier National Park has over 700 miles of hiking trails']
  },
  {
    abbr:'ID', name:'Idaho', capital:'Boise', region:'West',
    admitted:1890, nickname:'The Gem State', lat:44.4, lng:-114.6,
    landmarks:['Craters of the Moon National Monument','Sun Valley Ski Resort','Shoshone Falls','City of Rocks'],
    famousPeople:['Ezra Pound','Picabo Street','Harmon Killebrew','Gutzon Borglum (sculptor of Mt. Rushmore)','Philo Farnsworth (TV inventor)'],
    nflTeams:[],
    funFacts:['Idaho produces more than a third of all potatoes grown in the US','Hell\'s Canyon on the Idaho-Oregon border is deeper than the Grand Canyon']
  },
  {
    abbr:'WA', name:'Washington', capital:'Olympia', region:'West',
    admitted:1889, nickname:'The Evergreen State', lat:47.4, lng:-120.5,
    landmarks:['Mount Rainier National Park','Space Needle','Olympic National Park','Mount St. Helens'],
    famousPeople:['Jimi Hendrix','Bill Gates','Kurt Cobain','Bing Crosby','Kenny G'],
    nflTeams:['Seattle Seahawks'],
    funFacts:['Washington grows more apples than any other state','Mount Rainier is the most glaciated peak in the contiguous US']
  },
  {
    abbr:'OR', name:'Oregon', capital:'Salem', region:'West',
    admitted:1859, nickname:'The Beaver State', lat:44.0, lng:-120.5,
    landmarks:['Crater Lake National Park','Columbia River Gorge','Multnomah Falls','Oregon Coast','Timberline Lodge'],
    famousPeople:['Matt Groening','Beverly Cleary','Linus Pauling','Tonya Harding','Phil Knight'],
    nflTeams:[],
    funFacts:['Crater Lake is the deepest lake in the US at 1,943 feet','Oregon has the only state flag with a different image on each side']
  },
  {
    abbr:'CA', name:'California', capital:'Sacramento', region:'West',
    admitted:1850, nickname:'The Golden State', lat:36.8, lng:-119.4,
    landmarks:['Golden Gate Bridge','Yosemite National Park','Disneyland','Hollywood Walk of Fame','Redwood National Park'],
    famousPeople:['Richard Nixon','Ronald Reagan','Steve Jobs','Marilyn Monroe','Tiger Woods'],
    nflTeams:['San Francisco 49ers','Los Angeles Rams','Los Angeles Chargers'],
    funFacts:['California has the largest economy of any US state and would rank 5th globally if it were a country','Sequoia National Park is home to the General Sherman Tree, the largest living tree on Earth by volume']
  },
  {
    abbr:'NV', name:'Nevada', capital:'Carson City', region:'West',
    admitted:1864, nickname:'The Silver State', lat:39.5, lng:-116.9,
    landmarks:['Las Vegas Strip','Hoover Dam','Great Basin National Park','Valley of Fire State Park'],
    famousPeople:['Pat Nixon','Greg LeMond','Nevada\'s Sage Hen (state bird trivia!)','André Agassi','Wayne Newton'],
    nflTeams:['Las Vegas Raiders'],
    funFacts:['Nevada is the driest state in the US','More gold is mined in Nevada than in any other US state']
  },
  {
    abbr:'UT', name:'Utah', capital:'Salt Lake City', region:'West',
    admitted:1896, nickname:'The Beehive State', lat:39.3, lng:-111.5,
    landmarks:['Zion National Park','Arches National Park','Bryce Canyon National Park','Monument Valley','Temple Square'],
    famousPeople:['Philo Farnsworth (grew up)','Donny Osmond','Roseanne Barr (born)','James Woods','Nolan Bushnell'],
    nflTeams:[],
    funFacts:['Utah has five national parks — Zion, Bryce Canyon, Capitol Reef, Canyonlands, and Arches — known as the "Mighty Five"','The Great Salt Lake is the largest salt lake in the Western Hemisphere']
  },
  {
    abbr:'AK', name:'Alaska', capital:'Juneau', region:'West',
    admitted:1959, nickname:'The Last Frontier', lat:64.0, lng:-153.0,
    landmarks:['Denali National Park','Glacier Bay National Park','Kenai Fjords National Park','Northern Lights (Aurora Borealis)'],
    famousPeople:['Sarah Palin','Jewel','Carl Ben Eielson','Jefferson Davis (born)... wait','Libby Riddles (first woman to win Iditarod)'],
    nflTeams:[],
    funFacts:['Alaska is the largest state by area — bigger than the next three largest states combined','The sun doesn\'t set in Barrow, Alaska for 84 days each summer']
  },
  {
    abbr:'HI', name:'Hawaii', capital:'Honolulu', region:'West',
    admitted:1959, nickname:'The Aloha State', lat:20.5, lng:-157.0,
    landmarks:['Pearl Harbor National Memorial','Na Pali Coast','Kilauea Volcano','Haleakala National Park','Waimea Canyon'],
    famousPeople:['Barack Obama','Bruno Mars','Nicole Kidman (born)','Don Ho','Bette Midler (born)'],
    nflTeams:[],
    funFacts:['Hawaii is the only US state made up entirely of islands (137 islands/atolls)','Hawaii is the only US state that grows coffee commercially']
  }
]

// Quick lookup by abbreviation
export const STATE_BY_ABBR = Object.fromEntries(STATES.map(s => [s.abbr, s]))

// States grouped by region
export const REGIONS = {
  Northeast: STATES.filter(s => s.region === 'Northeast'),
  Southeast: STATES.filter(s => s.region === 'Southeast'),
  Midwest:   STATES.filter(s => s.region === 'Midwest'),
  Southwest: STATES.filter(s => s.region === 'Southwest'),
  West:      STATES.filter(s => s.region === 'West')
}

// Wikipedia article titles for each state's capitol building
export const CAPITAL_WIKI = {
  ME:'Maine State House',          NH:'New Hampshire State House',    VT:'Vermont State House',
  MA:'Massachusetts State House',  RI:'Rhode Island State House',     CT:'Connecticut State Capitol',
  NY:'New York State Capitol',     NJ:'New Jersey State House',       PA:'Pennsylvania State Capitol',
  DE:'Legislative Hall',           MD:'Maryland State House',         VA:'Virginia State Capitol',
  WV:'West Virginia State Capitol',NC:'North Carolina State Capitol', SC:'South Carolina State House',
  GA:'Georgia State Capitol',      FL:'Florida State Capitol',        TN:'Tennessee State Capitol',
  KY:'Kentucky State Capitol',     AL:'Alabama State Capitol',        MS:'Mississippi State Capitol',
  AR:'Arkansas State Capitol',     LA:'Louisiana State Capitol',      OH:'Ohio Statehouse',
  IN:'Indiana Statehouse',         MI:'Michigan State Capitol',       WI:'Wisconsin State Capitol',
  IL:'Illinois State Capitol',     MN:'Minnesota State Capitol',      IA:'Iowa State Capitol',
  MO:'Missouri State Capitol',     ND:'North Dakota State Capitol',   SD:'South Dakota State Capitol',
  NE:'Nebraska State Capitol',     KS:'Kansas State Capitol',         TX:'Texas State Capitol',
  OK:'Oklahoma State Capitol',     NM:'New Mexico State Capitol',     AZ:'Arizona State Capitol',
  CO:'Colorado State Capitol',     WY:'Wyoming State Capitol',        MT:'Montana State Capitol',
  ID:'Idaho State Capitol',        WA:'Washington State Capitol',     OR:'Oregon State Capitol',
  CA:'California State Capitol',   NV:'Nevada State Capitol',         UT:'Utah State Capitol',
  AK:'Alaska State Capitol',       HI:'Hawaii State Capitol'
}
