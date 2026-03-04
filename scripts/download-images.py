#!/usr/bin/env python3
"""
Download Wikipedia and ESPN images for Gridiron IQ quiz app.
- Only downloads missing images (idempotent)
- Captures attribution info for display in app
- Works around Wikimedia protections using requests library
"""

import os
import sys
import json
import time
import requests
from pathlib import Path
from urllib.parse import quote, unquote
from typing import Optional, Dict, Any

# Fix Windows encoding issues
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

# Configuration
BASE_DIR = Path(__file__).parent.parent
PUBLIC_IMAGES = BASE_DIR / 'public' / 'images'
MANIFEST_PATH = BASE_DIR / 'src' / 'data' / 'imageManifest.js'
ATTRIBUTION_PATH = BASE_DIR / 'src' / 'data' / 'imageAttribution.json'

# Session with proper headers (mimics real browser)
SESSION = requests.Session()
SESSION.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'image/*,*/*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate',
    'DNT': '1',
    'Connection': 'keep-alive',
})

DIRECTORIES = {
    'nfl_logos': PUBLIC_IMAGES / 'nfl-logos',
    'capitals': PUBLIC_IMAGES / 'capitals',
    'flags': PUBLIC_IMAGES / 'flags',
    'landmarks': PUBLIC_IMAGES / 'landmarks',
    'famous_people': PUBLIC_IMAGES / 'famous-people',
    'stadiums': PUBLIC_IMAGES / 'stadiums',
    'players': PUBLIC_IMAGES / 'players',
    'waterways': PUBLIC_IMAGES / 'waterways',
}

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'

def slug(title: str) -> str:
    """Convert title to slug format."""
    return (title
            .lower()
            .replace('&', 'and')
            .replace('é', 'e')
            .replace('á', 'a')
            .replace('ó', 'o')
            .replace('í', 'i')
            .replace('ú', 'u')
            .replace('ü', 'u')
            .replace('ñ', 'n')
            .replace('ç', 'c')
            .replace('–', '-')
            .replace(''', '')
            .replace(''', '')
            .replace('"', '')
            .replace('"', '')
            )

def get_wiki_image_info(title: str) -> Optional[Dict[str, Any]]:
    """
    Fetch Wikipedia API to get thumbnail URL and attribution info.
    Returns dict with image_url, license, creator, description.
    """
    try:
        url = f'https://en.wikipedia.org/api/rest_v1/page/summary/{quote(title)}'

        for attempt in range(3):
            try:
                resp = SESSION.get(url, timeout=10)
                if resp.status_code == 200:
                    data = resp.json()
                    thumb_src = data.get('thumbnail', {}).get('source')

                    if not thumb_src:
                        return None

                    # Get description and extract attribution hints
                    description = data.get('description', '')
                    extract = data.get('extract', '')[:200]  # First 200 chars

                    return {
                        'image_url': thumb_src,
                        'title': data.get('title', title),
                        'description': description,
                        'extract': extract,
                        'license': 'CC BY-SA 3.0',  # Wikipedia default
                        'source': 'Wikipedia'
                    }
                elif resp.status_code == 404:
                    return None

                time.sleep(0.5 * (2 ** attempt))
            except requests.Timeout:
                if attempt < 2:
                    time.sleep(0.5 * (2 ** attempt))
                    continue
                return None
        return None
    except Exception as e:
        return None

def download_image(url: str, filepath: Path, max_retries: int = 3) -> bool:
    """Download image with retry logic."""
    for attempt in range(max_retries):
        try:
            headers = dict(SESSION.headers)
            if attempt == 1:
                headers['Accept'] = '*/*'
            elif attempt == 2:
                headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0'}

            resp = SESSION.get(url, headers=headers, timeout=15, stream=True, allow_redirects=True)

            if resp.status_code == 200:
                filepath.parent.mkdir(parents=True, exist_ok=True)
                with open(filepath, 'wb') as f:
                    for chunk in resp.iter_content(chunk_size=8192):
                        if chunk:
                            f.write(chunk)
                return True
            elif resp.status_code == 403:
                if attempt < max_retries - 1:
                    time.sleep(1.0 * (2 ** attempt))
                    continue
                return False
            elif resp.status_code == 404:
                return False
            else:
                if attempt < max_retries - 1:
                    time.sleep(0.5 * (2 ** attempt))
                    continue
                return False
        except requests.Timeout:
            if attempt < max_retries - 1:
                time.sleep(1.0 * (2 ** attempt))
                continue
            return False
        except Exception:
            if attempt < max_retries - 1:
                time.sleep(0.5 * (2 ** attempt))
                continue
            return False

    return False

def download_nfl_logos() -> tuple:
    """Download all NFL team logos from ESPN."""
    print(f'{Colors.BLUE}NFL Team Logos{Colors.END}')
    manifest = {}
    attribution = {}
    nfl_teams = [
        'NE', 'BUF', 'MIA', 'NYJ', 'BAL', 'CLE', 'PIT', 'CIN',
        'HOU', 'IND', 'JAX', 'TEN', 'KC', 'LV', 'LAC', 'DEN',
        'DAL', 'NYG', 'PHI', 'WAS', 'CHI', 'DET', 'GB', 'MIN',
        'ATL', 'CAR', 'NO', 'TB', 'ARI', 'LAR', 'SF', 'SEA'
    ]

    for team_id in nfl_teams:
        url = f'https://a.espncdn.com/i/teamlogos/nfl/500/{team_id}.png'
        filepath = DIRECTORIES['nfl_logos'] / f'{team_id.lower()}.png'

        # Skip if already exists
        if filepath.exists():
            manifest[url] = f'/images/nfl-logos/{team_id.lower()}.png'
            attribution[url] = {
                'source': 'ESPN CDN',
                'license': 'ESPN proprietary',
                'url': 'https://www.espn.com'
            }
            print(f'{Colors.GREEN}✓{Colors.END}', end='', flush=True)
            continue

        if download_image(url, filepath):
            manifest[url] = f'/images/nfl-logos/{team_id.lower()}.png'
            attribution[url] = {
                'source': 'ESPN CDN',
                'license': 'ESPN proprietary',
                'url': 'https://www.espn.com'
            }
            print(f'{Colors.GREEN}✓{Colors.END}', end='', flush=True)
        else:
            print(f'{Colors.RED}✗{Colors.END}', end='', flush=True)

        time.sleep(0.1)

    print(f' {Colors.GREEN}OK{Colors.END}')
    return manifest, attribution

def download_wiki_images(category: str, items: list, dir_key: str) -> tuple:
    """Download Wikipedia images for a category with attribution."""
    print(f'{Colors.BLUE}{category}{Colors.END}')
    manifest = {}
    attribution = {}
    failed = []

    for item in items:
        if isinstance(item, dict):
            title = item.get('title') or item.get('name')
        else:
            title = item

        local_filename = f'{slug(title)}.jpg'
        filepath = DIRECTORIES[dir_key] / local_filename
        local_path = f'/images/{dir_key.replace("_", "-")}/{local_filename}'

        # Skip if already exists
        if filepath.exists():
            manifest[title] = local_path
            attribution[title] = {
                'source': 'Wikipedia',
                'license': 'CC BY-SA 3.0',
                'url': f'https://en.wikipedia.org/wiki/{quote(title)}'
            }
            print(f'{Colors.GREEN}✓{Colors.END}', end='', flush=True)
            time.sleep(0.05)
            continue

        # Get image info from Wikipedia
        image_info = get_wiki_image_info(title)
        if not image_info:
            failed.append(title)
            print(f'{Colors.RED}✗{Colors.END}', end='', flush=True)
            time.sleep(0.1)
            continue

        # Download the image
        if download_image(image_info['image_url'], filepath):
            manifest[title] = local_path
            attribution[title] = {
                'source': 'Wikipedia',
                'license': 'CC BY-SA 3.0',
                'description': image_info.get('description', ''),
                'url': f'https://en.wikipedia.org/wiki/{quote(title)}',
                'extract': image_info.get('extract', '')
            }
            print(f'{Colors.GREEN}✓{Colors.END}', end='', flush=True)
        else:
            failed.append(title)
            print(f'{Colors.RED}✗{Colors.END}', end='', flush=True)

        time.sleep(0.15)

    print(f' {Colors.GREEN}OK{Colors.END}')
    return manifest, attribution, failed

def main():
    print(f'\n{Colors.BLUE}Starting image download (skipping existing)...{Colors.END}\n')

    # Create directories
    for dir_path in DIRECTORIES.values():
        dir_path.mkdir(parents=True, exist_ok=True)

    all_manifest = {}
    all_attribution = {}
    all_failures = []

    # 1. NFL Logos
    nfl_manifest, nfl_attr = download_nfl_logos()
    all_manifest.update(nfl_manifest)
    all_attribution.update(nfl_attr)

    # 2. State Capitals (50)
    capitals = [
        'Maine State House', 'New Hampshire State House', 'Vermont State House',
        'Massachusetts State House', 'Rhode Island State House', 'Connecticut State Capitol',
        'New York State Capitol', 'New Jersey State House', 'Pennsylvania State Capitol',
        'Legislative Hall', 'Maryland State House', 'Virginia State Capitol',
        'West Virginia State Capitol', 'North Carolina State Capitol', 'South Carolina State House',
        'Georgia State Capitol', 'Florida State Capitol', 'Tennessee State Capitol',
        'Kentucky State Capitol', 'Alabama State Capitol', 'Mississippi State Capitol',
        'Arkansas State Capitol', 'Louisiana State Capitol', 'Ohio Statehouse',
        'Indiana Statehouse', 'Michigan State Capitol', 'Wisconsin State Capitol',
        'Illinois State Capitol', 'Minnesota State Capitol', 'Iowa State Capitol',
        'Missouri State Capitol', 'North Dakota State Capitol', 'South Dakota State Capitol',
        'Nebraska State Capitol', 'Kansas State Capitol', 'Texas State Capitol',
        'Oklahoma State Capitol', 'New Mexico State Capitol', 'Arizona State Capitol',
        'Colorado State Capitol', 'Wyoming State Capitol', 'Montana State Capitol',
        'Idaho State Capitol', 'Washington State Capitol', 'Oregon State Capitol',
        'California State Capitol', 'Nevada State Capitol', 'Utah State Capitol',
        'Alaska State Capitol', 'Hawaii State Capitol'
    ]
    manifest, attr, failed = download_wiki_images('State Capitals', capitals, 'capitals')
    all_manifest.update(manifest)
    all_attribution.update(attr)
    all_failures.extend(failed)

    # 3. State Flags (50)
    flags = [f'Flag of {state}' for state in [
        'Maine', 'New Hampshire', 'Vermont', 'Massachusetts', 'Rhode Island',
        'Connecticut', 'New York', 'New Jersey', 'Pennsylvania', 'Delaware',
        'Maryland', 'Virginia', 'West Virginia', 'North Carolina', 'South Carolina',
        'Georgia', 'Florida', 'Tennessee', 'Kentucky', 'Alabama', 'Mississippi',
        'Arkansas', 'Louisiana', 'Ohio', 'Indiana', 'Michigan', 'Wisconsin',
        'Illinois', 'Minnesota', 'Iowa', 'Missouri', 'North Dakota', 'South Dakota',
        'Nebraska', 'Kansas', 'Texas', 'Oklahoma', 'New Mexico', 'Arizona',
        'Colorado', 'Wyoming', 'Montana', 'Idaho', 'Washington', 'Oregon',
        'California', 'Nevada', 'Utah', 'Alaska', 'Hawaii'
    ]]
    manifest, attr, failed = download_wiki_images('State Flags', flags, 'flags')
    all_manifest.update(manifest)
    all_attribution.update(attr)
    all_failures.extend(failed)

    # 4. Landmarks (207 total)
    landmarks = [
        'Acadia National Park', 'Portland Head Light', 'Bar Harbor', 'Kennebunkport',
        'Mount Washington', 'White Mountain National Forest', 'Lake Winnipesaukee', 'Hampton Beach',
        'Stowe Mountain Resort', 'Lake Champlain', 'Shelburne Museum', 'Green Mountain National Forest',
        'Freedom Trail', 'Cape Cod National Seashore', 'Plymouth Rock', 'Harvard University', 'Salem Witch Museum',
        'The Breakers', 'Cliff Walk', 'Roger Williams Park', 'WaterFire',
        'Mystic Seaport Museum', 'Mark Twain House', 'Yale University', 'Gillette Castle',
        'Statue of Liberty', 'Niagara Falls', 'Times Square', 'Central Park', 'Adirondack Mountains',
        'Atlantic City Boardwalk', 'Liberty State Park', 'Cape May', 'Princeton University',
        'Liberty Bell', 'Independence Hall', 'Gettysburg National Military Park', 'Fallingwater', 'Hersheypark',
        'Winterthur Museum', 'Cape Henlopen State Park', 'Rehoboth Beach', 'Fort Delaware',
        'Inner Harbor', 'U.S. Naval Academy', 'Assateague Island', 'Antietam National Battlefield',
        'Colonial Williamsburg', 'Monticello', 'Shenandoah National Park', 'Arlington National Cemetery', 'Mount Vernon',
        'New River Gorge National Park', 'Harpers Ferry National Historical Park', 'Seneca Rocks', 'Blackwater Falls',
        'Blue Ridge Parkway', 'Outer Banks', 'Great Smoky Mountains National Park', 'Wright Brothers National Memorial',
        'Fort Sumter National Monument', 'Hilton Head Island', 'Myrtle Beach', 'Congaree National Park',
        'Okefenokee Swamp', 'Stone Mountain Park', 'Savannah Historic District', 'Georgia Aquarium',
        'Everglades National Park', 'Kennedy Space Center', 'Walt Disney World', 'South Beach',
        'Grand Ole Opry', 'Graceland', 'Dollywood',
        'Mammoth Cave National Park', 'Churchill Downs', 'Land Between the Lakes', 'Cumberland Falls',
        'U.S. Space & Rocket Center', 'Civil Rights Memorial', 'Talladega Superspeedway', 'Gulf State Park',
        'Vicksburg National Military Park', 'Natchez Trace Parkway', 'Mississippi Delta', 'Gulf Islands National Seashore',
        'Hot Springs National Park', 'Crater of Diamonds State Park', 'Crystal Bridges Museum of American Art', 'Buffalo National River',
        'French Quarter', 'Oak Alley Plantation', 'Avery Island', 'Atchafalaya Basin',
        'Rock and Roll Hall of Fame', 'Cedar Point', 'National Museum of the United States Air Force', 'Hocking Hills State Park',
        'Indianapolis Motor Speedway', 'Indiana Dunes National Park', 'Children\'s Museum of Indianapolis', 'Lincoln Boyhood National Memorial',
        'Mackinac Island', 'Sleeping Bear Dunes National Lakeshore', 'Henry Ford Museum', 'Pictured Rocks National Lakeshore',
        'Wisconsin Dells', 'Door County', 'Lambeau Field', 'House on the Rock',
        'Navy Pier', 'Willis Tower', 'Abraham Lincoln Presidential Library and Museum', 'Starved Rock State Park',
        'Mall of America', 'Boundary Waters Canoe Area', 'Minneapolis Sculpture Garden', 'Voyageurs National Park',
        'Iowa State Fair', 'Field of Dreams Movie Site', 'Effigy Mounds National Monument', 'Pikes Peak State Park',
        'Gateway Arch National Park', 'Mark Twain Boyhood Home', 'Silver Dollar City', 'Lake of the Ozarks',
        'Theodore Roosevelt National Park', 'International Peace Garden', 'Bonanzaville, USA', 'Fort Abraham Lincoln',
        'Mount Rushmore National Memorial', 'Crazy Horse Memorial', 'Badlands National Park', 'Wind Cave National Park',
        'Chimney Rock National Historic Site', 'Henry Doorly Zoo and Aquarium', 'Scotts Bluff National Monument', 'Sandhills',
        'Dodge City', 'Tallgrass Prairie National Preserve', 'Brown v. Board of Education National Historic Site', 'Eisenhower Presidential Library and Museum',
        'The Alamo', 'Big Bend National Park', 'Johnson Space Center', 'San Antonio River Walk',
        'Oklahoma City National Memorial', 'Route 66', 'Wichita Mountains Wildlife Refuge', 'Cherokee National Capitol',
        'Carlsbad Caverns National Park', 'White Sands National Park', 'Taos Pueblo', 'Chaco Culture National Historical Park',
        'Grand Canyon National Park', 'Monument Valley', 'Sedona, Arizona', 'Saguaro National Park',
        'Rocky Mountain National Park', 'Mesa Verde National Park', 'Garden of the Gods', 'Pikes Peak',
        'Yellowstone National Park', 'Grand Teton National Park', 'Devils Tower National Monument', 'Flaming Gorge',
        'Glacier National Park', 'Little Bighorn Battlefield', 'Beartooth Highway', 'Flathead Lake',
        'Craters of the Moon National Monument', 'Sun Valley Resort', 'Shoshone Falls', 'City of Rocks National Reserve',
        'Mount Rainier National Park', 'Space Needle', 'Olympic National Park', 'Mount St. Helens',
        'Crater Lake National Park', 'Columbia River Gorge', 'Multnomah Falls', 'Oregon Coast', 'Timberline Lodge',
        'Golden Gate Bridge', 'Yosemite National Park', 'Disneyland', 'Hollywood Walk of Fame', 'Redwood National and State Parks',
        'Las Vegas Strip', 'Hoover Dam', 'Great Basin National Park', 'Valley of Fire State Park',
        'Zion National Park', 'Arches National Park', 'Bryce Canyon National Park', 'Temple Square',
        'Denali National Park and Preserve', 'Glacier Bay National Park and Preserve', 'Kenai Fjords National Park', 'Aurora borealis',
        'Pearl Harbor National Memorial', 'Nā Pali Coast', 'Kīlauea', 'Haleakalā National Park', 'Waimea Canyon State Park'
    ]
    manifest, attr, failed = download_wiki_images('Landmarks', landmarks, 'landmarks')
    all_manifest.update(manifest)
    all_attribution.update(attr)
    all_failures.extend(failed)

    # 5. Famous People (234 unique)
    people = [
        'Stephen King', 'Henry Wadsworth Longfellow', 'Hannibal Hamlin', 'Joan Benoit Samuelson',
        'Franklin Pierce', 'Alan Shepard', 'Adam Sandler', 'Sarah Josepha Hale',
        'Calvin Coolidge', 'Bernie Sanders', 'Rudyard Kipling', 'John Deere',
        'John F. Kennedy', 'Benjamin Franklin', 'Matt Damon', 'Mark Wahlberg', 'Edgar Allan Poe',
        'H.P. Lovecraft', 'George M. Cohan', 'David Byrne', 'Nick Lachey', 'Patrick Kennedy',
        'Mark Twain', 'Katharine Hepburn', 'Paul Newman', 'Meg Ryan', 'Michael Bolton',
        'Theodore Roosevelt', 'Franklin D. Roosevelt', 'Lou Gehrig', 'Lady Gaga', 'Jay-Z',
        'Thomas Edison', 'Bruce Springsteen', 'Frank Sinatra', 'Jon Bon Jovi', 'Meryl Streep',
        'Will Smith', 'Taylor Swift', 'Andy Warhol', 'Jim Thorpe',
        'Joe Biden', 'Caesar Rodney', 'Annie Jump Cannon', 'Ryan Phillippe',
        'Frederick Douglass', 'Babe Ruth', 'Thurgood Marshall', 'Michael Phelps',
        'George Washington', 'Thomas Jefferson', 'Patrick Henry', 'Arthur Ashe', 'Ella Fitzgerald',
        'Chuck Yeager', 'Pearl Buck', 'Brad Paisley', 'Jerry West', 'Don Knotts',
        'Michael Jordan', 'James Polk', 'Andrew Johnson', 'Ava Gardner', 'James Taylor',
        'Andrew Jackson', 'John C. Calhoun', 'Chris Rock', 'Darius Rucker', 'Stephen Colbert',
        'Martin Luther King Jr.', 'Jimmy Carter', 'Ray Charles', 'Usher', 'Julia Roberts',
        'Sidney Poitier', 'Jim Morrison', 'Faye Dunaway', 'Hulk Hogan', 'Gloria Estefan',
        'Dolly Parton', 'Elvis Presley', 'Al Gore', 'Morgan Freeman',
        'Abraham Lincoln', 'Muhammad Ali', 'George Clooney', 'Jennifer Lawrence', 'Diane Sawyer',
        'Helen Keller', 'Hank Aaron', 'Rosa Parks', 'Condoleezza Rice', 'Harper Lee',
        'Oprah Winfrey', 'William Faulkner', 'B.B. King', 'Jim Henson',
        'Bill Clinton', 'Hillary Clinton', 'Johnny Cash', 'Sam Walton', 'Scott Joplin',
        'Louis Armstrong', 'Truman Capote', 'Britney Spears', 'Lil Wayne', 'Fats Domino',
        'Neil Armstrong', 'John Glenn', 'Steven Spielberg', 'LeBron James', 'Sheryl Crow',
        'Benjamin Harrison', 'Michael Jackson', 'David Letterman', 'Axl Rose', 'Larry Bird',
        'Henry Ford', 'Madonna', 'Stevie Wonder', 'Eminem', 'Diana Ross',
        'Frank Lloyd Wright', 'Orson Welles', 'Harry Houdini', 'Liberace', 'Gene Wilder',
        'Barack Obama', 'Walt Disney', 'Harrison Ford', 'Michelle Obama',
        'Bob Dylan', 'Judy Garland', 'Charles Schulz', 'Prince', 'Jesse Ventura',
        'John Wayne', 'Ashton Kutcher', 'Herbert Hoover', 'Simon Estes', 'Cloris Leachman',
        'Harry S. Truman', 'T.S. Eliot', 'Nelly',
        'Louis L\'Amour', 'Roger Maris', 'Angie Dickinson', 'Phil Jackson', 'Lawrence Welk',
        'Sitting Bull', 'Crazy Horse', 'Tom Brokaw', 'Laura Ingalls Wilder', 'Pat O\'Brien',
        'Warren Buffett', 'Johnny Carson', 'Malcolm X', 'Fred Astaire', 'Henry Fonda',
        'Dwight D. Eisenhower', 'Amelia Earhart', 'Carry Nation', 'Bob Dole', 'Dennis Hopper',
        'Sam Houston', 'Lyndon B. Johnson', 'George W. Bush', 'Beyonce', 'Matthew McConaughey',
        'Will Rogers', 'Mickey Mantle', 'Ralph Ellison', 'Reba McEntire', 'Garth Brooks',
        'John Denver', 'Neil Patrick Harris', 'Holly Hunter', 'Conrad Hilton',
        'César Chávez', 'Linda Ronstadt', 'Alice Cooper', 'Emma Stone',
        'Jack Dempsey', 'Tim Allen', 'Don Cheadle', 'Roseanne Barr', 'Amy Grant',
        'Dick Cheney', 'Jackson Pollock', 'Jim Bridger', 'Patricia MacLachlan', 'Matthew Fox',
        'Gary Cooper', 'David Lynch', 'Jeannette Rankin', 'Evel Knievel', 'Dana Carvey',
        'Ezra Pound', 'Picabo Street', 'Harmon Killebrew', 'Gutzon Borglum', 'Philo Farnsworth',
        'Jimi Hendrix', 'Bill Gates', 'Kurt Cobain', 'Bing Crosby', 'Kenny G',
        'Matt Groening', 'Beverly Cleary', 'Linus Pauling', 'Tonya Harding', 'Phil Knight',
        'Richard Nixon', 'Ronald Reagan', 'Steve Jobs', 'Marilyn Monroe', 'Tiger Woods',
        'Pat Nixon', 'Greg LeMond', 'André Agassi', 'Wayne Newton', 'Jack Kramer',
        'Donny Osmond', 'James Woods', 'Nolan Bushnell',
        'Sarah Palin', 'Jewel', 'Carl Ben Eielson', 'Susan Butcher', 'Libby Riddles',
        'Bruno Mars', 'Nicole Kidman', 'Don Ho', 'Bette Midler'
    ]
    manifest, attr, failed = download_wiki_images('Famous People', people, 'famous_people')
    all_manifest.update(manifest)
    all_attribution.update(attr)
    all_failures.extend(failed)

    # 6. NFL Stadiums (30 unique)
    stadiums = [
        'Gillette Stadium', 'Highmark Stadium', 'Hard Rock Stadium', 'MetLife Stadium',
        'M&T Bank Stadium', 'Cleveland Browns Stadium', 'Acrisure Stadium', 'Paycor Stadium',
        'NRG Stadium', 'Lucas Oil Stadium', 'EverBank Stadium', 'Nissan Stadium',
        'GEHA Field at Arrowhead Stadium', 'Allegiant Stadium', 'SoFi Stadium',
        'Empower Field at Mile High', 'AT&T Stadium', 'Lincoln Financial Field', 'Northwest Stadium',
        'Soldier Field', 'Ford Field', 'Lambeau Field', 'U.S. Bank Stadium',
        'Mercedes-Benz Stadium', 'Bank of America Stadium', 'Caesars Superdome',
        'Raymond James Stadium', 'State Farm Stadium', 'Levi\'s Stadium', 'Lumen Field'
    ]
    manifest, attr, failed = download_wiki_images('NFL Stadiums', stadiums, 'stadiums')
    all_manifest.update(manifest)
    all_attribution.update(attr)
    all_failures.extend(failed)

    # 7. NFL Players/Legends (38)
    players = [
        'Patrick Mahomes', 'Josh Allen', 'Lamar Jackson', 'Joe Burrow', 'Jalen Hurts',
        'C. J. Stroud', 'Justin Jefferson', 'Travis Kelce', 'Tyreek Hill', 'Christian McCaffrey',
        'Saquon Barkley', 'Ja\'Marr Chase', 'Justin Herbert', 'Brock Purdy', 'T. J. Watt',
        'Micah Parsons', 'Myles Garrett', 'Derrick Henry',
        'Tom Brady', 'Jerry Rice', 'Walter Payton', 'Barry Sanders', 'Emmitt Smith',
        'Joe Montana', 'Peyton Manning', 'Brett Favre', 'John Elway', 'Dan Marino',
        'Lawrence Taylor', 'Ray Lewis', 'Randy Moss', 'Reggie White', 'Adrian Peterson',
        'Calvin Johnson', 'Larry Fitzgerald', 'Rob Gronkowski', 'Aaron Rodgers', 'Deion Sanders'
    ]
    manifest, attr, failed = download_wiki_images('NFL Players', players, 'players')
    all_manifest.update(manifest)
    all_attribution.update(attr)
    all_failures.extend(failed)

    # 8. Waterways (25)
    waterways = [
        'Mississippi River', 'Colorado River', 'Missouri River', 'Rio Grande', 'Hudson River',
        'Sacramento River', 'Tennessee River', 'Snake River', 'Platte River', 'James River',
        'Willamette River', 'Potomac River', 'Susquehanna River', 'Yellowstone River', 'Connecticut River',
        'Great Salt Lake', 'Crater Lake', 'Lake Okeechobee', 'Flathead Lake', 'Lake Champlain',
        'Mono Lake', 'Yellowstone Lake', 'Lake Winnebago', 'Lake Mead', 'Lake Tahoe'
    ]
    manifest, attr, failed = download_wiki_images('Waterways', waterways, 'waterways')
    all_manifest.update(manifest)
    all_attribution.update(attr)
    all_failures.extend(failed)

    # Write manifest
    print(f'\n{Colors.BLUE}Writing manifest and attribution...{Colors.END}')
    manifest_code = f"""// Auto-generated image manifest — maps wiki titles and logo URLs to local paths
// DO NOT EDIT manually. Re-run: python3 scripts/download-images.py

export const IMAGE_MANIFEST = {json.dumps(all_manifest, indent=2)}
"""
    MANIFEST_PATH.write_text(manifest_code)

    # Write attribution
    ATTRIBUTION_PATH.write_text(json.dumps(all_attribution, indent=2))
    print(f'{Colors.GREEN}OK{Colors.END}')

    # Summary
    local_count = len(all_manifest)
    print(f'\n{Colors.BLUE}Summary:{Colors.END}')
    print(f'{Colors.GREEN}  Downloaded/Available: {local_count} images{Colors.END}')

    if all_failures:
        print(f'{Colors.YELLOW}  Missing: {len(all_failures)} images{Colors.END}')
    else:
        print(f'{Colors.GREEN}  All images available!{Colors.END}')

    print(f'\n{Colors.BLUE}Files created/updated:{Colors.END}')
    print(f'  {Colors.GREEN}✓{Colors.END} {MANIFEST_PATH}')
    print(f'  {Colors.GREEN}✓{Colors.END} {ATTRIBUTION_PATH}')
    print(f'\n{Colors.GREEN}Done!{Colors.END}\n')

if __name__ == '__main__':
    main()
