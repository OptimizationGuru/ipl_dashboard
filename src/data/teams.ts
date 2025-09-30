export interface Player {
  name: string;
  role: 'Batsman' | 'Bowler' | 'All-rounder' | 'Wicket-keeper';
  skill: string;
  isCaptain: boolean;
  isWicketKeeper: boolean;
  battingOrder?: number;
  bowlingOrder?: number;
}

export interface Team {
  name: string;
  shortName: string;
  captain: string;
  wicketKeeper: string;
  players: Player[];
}

export const IPL_TEAMS: Record<string, Team> = {
  'Mumbai Indians': {
    name: 'Mumbai Indians',
    shortName: 'MI',
    captain: 'Hardik Pandya',
    wicketKeeper: 'Ishan Kishan',
    players: [
      { name: 'Rohit Sharma', role: 'Batsman' as const, skill: 'Right-handed opener, excellent pull shot', isCaptain: false, isWicketKeeper: false, battingOrder: 1 },
      { name: 'Ishan Kishan', role: 'Wicket-keeper' as const, skill: 'Left-handed aggressive batsman, good keeper', isCaptain: false, isWicketKeeper: true, battingOrder: 2 },
      { name: 'Suryakumar Yadav', role: 'Batsman' as const, skill: 'Right-handed middle order, 360° player', isCaptain: false, isWicketKeeper: false, battingOrder: 3 },
      { name: 'Tilak Varma', role: 'Batsman' as const, skill: 'Left-handed young talent, good finisher', isCaptain: false, isWicketKeeper: false, battingOrder: 4 },
      { name: 'Hardik Pandya', role: 'All-rounder' as const, skill: 'Right-handed power hitter, medium pace bowler', isCaptain: true, isWicketKeeper: false, battingOrder: 5, bowlingOrder: 1 },
      { name: 'Tim David', role: 'Batsman' as const, skill: 'Right-handed finisher, explosive hitter', isCaptain: false, isWicketKeeper: false, battingOrder: 6 },
      { name: 'Romario Shepherd', role: 'All-rounder' as const, skill: 'Right-handed lower order, medium pace', isCaptain: false, isWicketKeeper: false, battingOrder: 7, bowlingOrder: 2 },
      { name: 'Piyush Chawla', role: 'Bowler' as const, skill: 'Right-arm leg spinner, experienced', isCaptain: false, isWicketKeeper: false, bowlingOrder: 3 },
      { name: 'Jasprit Bumrah', role: 'Bowler' as const, skill: 'Right-arm fast, death over specialist', isCaptain: false, isWicketKeeper: false, bowlingOrder: 4 },
      { name: 'Gerald Coetzee', role: 'Bowler' as const, skill: 'Right-arm fast, aggressive pace', isCaptain: false, isWicketKeeper: false, bowlingOrder: 5 },
      { name: 'Akash Madhwal', role: 'Bowler' as const, skill: 'Right-arm medium, good variations', isCaptain: false, isWicketKeeper: false, bowlingOrder: 6 }
    ]
  },
  'Chennai Super Kings': {
    name: 'Chennai Super Kings',
    shortName: 'CSK',
    captain: 'Ruturaj Gaikwad',
    wicketKeeper: 'MS Dhoni',
    players: [
      { name: 'Ruturaj Gaikwad', role: 'Batsman' as const, skill: 'Right-handed opener, elegant stroke player', isCaptain: true, isWicketKeeper: false, battingOrder: 1 },
      { name: 'Rachin Ravindra', role: 'All-rounder' as const, skill: 'Left-handed opener, left-arm spin', isCaptain: false, isWicketKeeper: false, battingOrder: 2, bowlingOrder: 1 },
      { name: 'Ajinkya Rahane', role: 'Batsman' as const, skill: 'Right-handed middle order, classical batsman', isCaptain: false, isWicketKeeper: false, battingOrder: 3 },
      { name: 'Daryl Mitchell', role: 'Batsman' as const, skill: 'Right-handed middle order, experienced', isCaptain: false, isWicketKeeper: false, battingOrder: 4 },
      { name: 'Shivam Dube', role: 'All-rounder' as const, skill: 'Left-handed power hitter, medium pace', isCaptain: false, isWicketKeeper: false, battingOrder: 5, bowlingOrder: 2 },
      { name: 'Ravindra Jadeja', role: 'All-rounder' as const, skill: 'Left-handed finisher, left-arm spin', isCaptain: false, isWicketKeeper: false, battingOrder: 6, bowlingOrder: 3 },
      { name: 'MS Dhoni', role: 'Wicket-keeper' as const, skill: 'Right-handed finisher, legendary keeper', isCaptain: false, isWicketKeeper: true, battingOrder: 7 },
      { name: 'Shardul Thakur', role: 'Bowler' as const, skill: 'Right-handed lower order, medium pace', isCaptain: false, isWicketKeeper: false, battingOrder: 8, bowlingOrder: 4 },
      { name: 'Deepak Chahar', role: 'Bowler' as const, skill: 'Right-arm medium, swing bowler', isCaptain: false, isWicketKeeper: false, bowlingOrder: 5 },
      { name: 'Tushar Deshpande', role: 'Bowler' as const, skill: 'Right-arm medium, death over specialist', isCaptain: false, isWicketKeeper: false, bowlingOrder: 6 },
      { name: 'Maheesh Theekshana', role: 'Bowler' as const, skill: 'Right-arm off spin, mystery spinner', isCaptain: false, isWicketKeeper: false, bowlingOrder: 7 }
    ]
  },
  'Royal Challengers Bengaluru': {
    name: 'Royal Challengers Bengaluru',
    shortName: 'RCB',
    captain: 'Faf du Plessis',
    wicketKeeper: 'Dinesh Karthik',
    players: [
      { name: 'Faf du Plessis', role: 'Batsman' as const, skill: 'Right-handed opener, experienced leader', isCaptain: true, isWicketKeeper: false, battingOrder: 1 },
      { name: 'Virat Kohli', role: 'Batsman' as const, skill: 'Right-handed top order, run machine', isCaptain: false, isWicketKeeper: false, battingOrder: 2 },
      { name: 'Rajat Patidar', role: 'Batsman' as const, skill: 'Right-handed middle order, solid technique', isCaptain: false, isWicketKeeper: false, battingOrder: 3 },
      { name: 'Glenn Maxwell', role: 'All-rounder' as const, skill: 'Right-handed power hitter, off-spinner', isCaptain: false, isWicketKeeper: false, battingOrder: 4, bowlingOrder: 1 },
      { name: 'Cameron Green', role: 'All-rounder' as const, skill: 'Right-handed finisher, fast bowler', isCaptain: false, isWicketKeeper: false, battingOrder: 5, bowlingOrder: 2 },
      { name: 'Dinesh Karthik', role: 'Wicket-keeper' as const, skill: 'Right-handed finisher, experienced keeper', isCaptain: false, isWicketKeeper: true, battingOrder: 6 },
      { name: 'Mahipal Lomror', role: 'All-rounder' as const, skill: 'Left-handed lower order, part-time spinner', isCaptain: false, isWicketKeeper: false, battingOrder: 7, bowlingOrder: 3 },
      { name: 'Mohammed Siraj', role: 'Bowler' as const, skill: 'Right-arm fast, swing specialist', isCaptain: false, isWicketKeeper: false, bowlingOrder: 4 },
      { name: 'Yash Dayal', role: 'Bowler' as const, skill: 'Left-arm medium, death over specialist', isCaptain: false, isWicketKeeper: false, bowlingOrder: 5 },
      { name: 'Karn Sharma', role: 'Bowler' as const, skill: 'Left-arm leg spinner, experienced', isCaptain: false, isWicketKeeper: false, bowlingOrder: 6 },
      { name: 'Lockie Ferguson', role: 'Bowler' as const, skill: 'Right-arm fast, express pace', isCaptain: false, isWicketKeeper: false, bowlingOrder: 7 }
    ]
  },
  'Kolkata Knight Riders': {
    name: 'Kolkata Knight Riders',
    shortName: 'KKR',
    captain: 'Shreyas Iyer',
    wicketKeeper: 'Phil Salt',
    players: [
      { name: 'Phil Salt', role: 'Wicket-keeper' as const, skill: 'Right-handed opener, aggressive batsman', isCaptain: false, isWicketKeeper: true, battingOrder: 1 },
      { name: 'Sunil Narine', role: 'All-rounder' as const, skill: 'Left-handed opener, mystery spinner', isCaptain: false, isWicketKeeper: false, battingOrder: 2, bowlingOrder: 1 },
      { name: 'Shreyas Iyer', role: 'Batsman' as const, skill: 'Right-handed middle order, elegant stroke player', isCaptain: true, isWicketKeeper: false, battingOrder: 3 },
      { name: 'Venkatesh Iyer', role: 'All-rounder' as const, skill: 'Left-handed middle order, medium pace', isCaptain: false, isWicketKeeper: false, battingOrder: 4, bowlingOrder: 2 },
      { name: 'Rinku Singh', role: 'Batsman' as const, skill: 'Left-handed finisher, power hitter', isCaptain: false, isWicketKeeper: false, battingOrder: 5 },
      { name: 'Andre Russell', role: 'All-rounder' as const, skill: 'Right-handed finisher, fast bowler', isCaptain: false, isWicketKeeper: false, battingOrder: 6, bowlingOrder: 3 },
      { name: 'Ramandeep Singh', role: 'All-rounder' as const, skill: 'Right-handed lower order, medium pace', isCaptain: false, isWicketKeeper: false, battingOrder: 7, bowlingOrder: 4 },
      { name: 'Mitchell Starc', role: 'Bowler' as const, skill: 'Left-arm fast, swing specialist', isCaptain: false, isWicketKeeper: false, bowlingOrder: 5 },
      { name: 'Varun Chakaravarthy', role: 'Bowler' as const, skill: 'Right-arm leg spinner, mystery bowler', isCaptain: false, isWicketKeeper: false, bowlingOrder: 6 },
      { name: 'Harshit Rana', role: 'Bowler' as const, skill: 'Right-arm medium fast, death over specialist', isCaptain: false, isWicketKeeper: false, bowlingOrder: 7 },
      { name: 'Vaibhav Arora', role: 'Bowler' as const, skill: 'Right-arm medium, swing bowler', isCaptain: false, isWicketKeeper: false, bowlingOrder: 8 }
    ]
  },
  'Delhi Capitals': {
    name: 'Delhi Capitals',
    shortName: 'DC',
    captain: 'Rishabh Pant',
    wicketKeeper: 'Rishabh Pant',
    players: [
      { name: 'Prithvi Shaw', role: 'Batsman' as const, skill: 'Right-handed opener, aggressive batsman', isCaptain: false, isWicketKeeper: false, battingOrder: 1 },
      { name: 'David Warner', role: 'Batsman' as const, skill: 'Left-handed opener, experienced campaigner', isCaptain: false, isWicketKeeper: false, battingOrder: 2 },
      { name: 'Mitchell Marsh', role: 'All-rounder' as const, skill: 'Right-handed middle order, fast bowler', isCaptain: false, isWicketKeeper: false, battingOrder: 3, bowlingOrder: 1 },
      { name: 'Rishabh Pant', role: 'Wicket-keeper' as const, skill: 'Left-handed middle order, explosive batsman', isCaptain: true, isWicketKeeper: true, battingOrder: 4 },
      { name: 'Tristan Stubbs', role: 'Batsman' as const, skill: 'Right-handed finisher, power hitter', isCaptain: false, isWicketKeeper: false, battingOrder: 5 },
      { name: 'Axar Patel', role: 'All-rounder' as const, skill: 'Left-handed lower order, left-arm spinner', isCaptain: false, isWicketKeeper: false, battingOrder: 6, bowlingOrder: 2 },
      { name: 'Abishek Porel', role: 'Batsman' as const, skill: 'Left-handed lower order, solid technique', isCaptain: false, isWicketKeeper: false, battingOrder: 7 },
      { name: 'Kuldeep Yadav', role: 'Bowler' as const, skill: 'Left-arm chinaman, wicket-taking bowler', isCaptain: false, isWicketKeeper: false, bowlingOrder: 3 },
      { name: 'Khaleel Ahmed', role: 'Bowler' as const, skill: 'Left-arm medium fast, swing bowler', isCaptain: false, isWicketKeeper: false, bowlingOrder: 4 },
      { name: 'Mukesh Kumar', role: 'Bowler' as const, skill: 'Right-arm medium, death over specialist', isCaptain: false, isWicketKeeper: false, bowlingOrder: 5 },
      { name: 'Ishant Sharma', role: 'Bowler' as const, skill: 'Right-arm fast, experienced campaigner', isCaptain: false, isWicketKeeper: false, bowlingOrder: 6 }
    ]
  },
  'Punjab Kings': {
    name: 'Punjab Kings',
    shortName: 'PBKS',
    captain: 'Shikhar Dhawan',
    wicketKeeper: 'Jitesh Sharma',
    players: [
      { name: 'Shikhar Dhawan', role: 'Batsman' as const, skill: 'Left-handed opener, experienced campaigner', isCaptain: true, isWicketKeeper: false, battingOrder: 1 },
      { name: 'Jonny Bairstow', role: 'Batsman' as const, skill: 'Right-handed opener, aggressive batsman', isCaptain: false, isWicketKeeper: false, battingOrder: 2 },
      { name: 'Prabhsimran Singh', role: 'Batsman' as const, skill: 'Right-handed middle order, young talent', isCaptain: false, isWicketKeeper: false, battingOrder: 3 },
      { name: 'Liam Livingstone', role: 'All-rounder' as const, skill: 'Right-handed power hitter, leg spinner', isCaptain: false, isWicketKeeper: false, battingOrder: 4, bowlingOrder: 1 },
      { name: 'Sam Curran', role: 'All-rounder' as const, skill: 'Left-handed finisher, left-arm medium', isCaptain: false, isWicketKeeper: false, battingOrder: 5, bowlingOrder: 2 },
      { name: 'Jitesh Sharma', role: 'Wicket-keeper' as const, skill: 'Right-handed finisher, good keeper', isCaptain: false, isWicketKeeper: true, battingOrder: 6 },
      { name: 'Shahrukh Khan', role: 'Batsman' as const, skill: 'Right-handed finisher, power hitter', isCaptain: false, isWicketKeeper: false, battingOrder: 7 },
      { name: 'Harpreet Brar', role: 'Bowler' as const, skill: 'Left-arm spinner, economical bowler', isCaptain: false, isWicketKeeper: false, bowlingOrder: 3 },
      { name: 'Kagiso Rabada', role: 'Bowler' as const, skill: 'Right-arm fast, pace spearhead', isCaptain: false, isWicketKeeper: false, bowlingOrder: 4 },
      { name: 'Arshdeep Singh', role: 'Bowler' as const, skill: 'Left-arm medium, death over specialist', isCaptain: false, isWicketKeeper: false, bowlingOrder: 5 },
      { name: 'Rahul Chahar', role: 'Bowler' as const, skill: 'Right-arm leg spinner, wicket-taker', isCaptain: false, isWicketKeeper: false, bowlingOrder: 6 }
    ]
  },
  'Rajasthan Royals': {
    name: 'Rajasthan Royals',
    shortName: 'RR',
    captain: 'Sanju Samson',
    wicketKeeper: 'Sanju Samson',
    players: [
      { name: 'Yashasvi Jaiswal', role: 'Batsman' as const, skill: 'Left-handed opener, young talent', isCaptain: false, isWicketKeeper: false, battingOrder: 1 },
      { name: 'Jos Buttler', role: 'Batsman' as const, skill: 'Right-handed opener, explosive batsman', isCaptain: false, isWicketKeeper: false, battingOrder: 2 },
      { name: 'Sanju Samson', role: 'Wicket-keeper' as const, skill: 'Right-handed middle order, elegant batsman', isCaptain: true, isWicketKeeper: true, battingOrder: 3 },
      { name: 'Riyan Parag', role: 'All-rounder' as const, skill: 'Right-handed middle order, leg spinner', isCaptain: false, isWicketKeeper: false, battingOrder: 4, bowlingOrder: 1 },
      { name: 'Shimron Hetmyer', role: 'Batsman' as const, skill: 'Left-handed finisher, power hitter', isCaptain: false, isWicketKeeper: false, battingOrder: 5 },
      { name: 'Rovman Powell', role: 'Batsman' as const, skill: 'Right-handed finisher, explosive hitter', isCaptain: false, isWicketKeeper: false, battingOrder: 6 },
      { name: 'Ravichandran Ashwin', role: 'All-rounder' as const, skill: 'Right-handed lower order, off spinner', isCaptain: false, isWicketKeeper: false, battingOrder: 7, bowlingOrder: 2 },
      { name: 'Trent Boult', role: 'Bowler' as const, skill: 'Left-arm fast, swing specialist', isCaptain: false, isWicketKeeper: false, bowlingOrder: 3 },
      { name: 'Yuzvendra Chahal', role: 'Bowler' as const, skill: 'Right-arm leg spinner, wicket-taker', isCaptain: false, isWicketKeeper: false, bowlingOrder: 4 },
      { name: 'Prasidh Krishna', role: 'Bowler' as const, skill: 'Right-arm fast, tall bowler', isCaptain: false, isWicketKeeper: false, bowlingOrder: 5 },
      { name: 'Avesh Khan', role: 'Bowler' as const, skill: 'Right-arm medium fast, death over specialist', isCaptain: false, isWicketKeeper: false, bowlingOrder: 6 }
    ]
  },
  'Sunrisers Hyderabad': {
    name: 'Sunrisers Hyderabad',
    shortName: 'SRH',
    captain: 'Pat Cummins',
    wicketKeeper: 'Heinrich Klaasen',
    players: [
      { name: 'Travis Head', role: 'Batsman' as const, skill: 'Left-handed opener, aggressive batsman', isCaptain: false, isWicketKeeper: false, battingOrder: 1 },
      { name: 'Abhishek Sharma', role: 'All-rounder' as const, skill: 'Left-handed opener, left-arm spinner', isCaptain: false, isWicketKeeper: false, battingOrder: 2, bowlingOrder: 1 },
      { name: 'Aiden Markram', role: 'Batsman' as const, skill: 'Right-handed middle order, elegant batsman', isCaptain: false, isWicketKeeper: false, battingOrder: 3 },
      { name: 'Heinrich Klaasen', role: 'Wicket-keeper' as const, skill: 'Right-handed middle order, explosive batsman', isCaptain: false, isWicketKeeper: true, battingOrder: 4 },
      { name: 'Abdul Samad', role: 'Batsman' as const, skill: 'Right-handed finisher, power hitter', isCaptain: false, isWicketKeeper: false, battingOrder: 5 },
      { name: 'Shahbaz Ahmed', role: 'All-rounder' as const, skill: 'Left-handed lower order, left-arm spinner', isCaptain: false, isWicketKeeper: false, battingOrder: 6, bowlingOrder: 2 },
      { name: 'Marco Jansen', role: 'All-rounder' as const, skill: 'Left-handed lower order, left-arm fast', isCaptain: false, isWicketKeeper: false, battingOrder: 7, bowlingOrder: 3 },
      { name: 'Pat Cummins', role: 'Bowler' as const, skill: 'Right-arm fast, experienced leader', isCaptain: true, isWicketKeeper: false, bowlingOrder: 4 },
      { name: 'Bhuvneshwar Kumar', role: 'Bowler' as const, skill: 'Right-arm medium, swing specialist', isCaptain: false, isWicketKeeper: false, bowlingOrder: 5 },
      { name: 'T Natarajan', role: 'Bowler' as const, skill: 'Left-arm medium, yorker specialist', isCaptain: false, isWicketKeeper: false, bowlingOrder: 6 },
      { name: 'Jaydev Unadkat', role: 'Bowler' as const, skill: 'Left-arm medium, experienced campaigner', isCaptain: false, isWicketKeeper: false, bowlingOrder: 7 }
    ]
  },
  'Gujarat Titans': {
    name: 'Gujarat Titans',
    shortName: 'GT',
    captain: 'Shubman Gill',
    wicketKeeper: 'Wriddhiman Saha',
    players: [
      { name: 'Shubman Gill', role: 'Batsman' as const, skill: 'Right-handed opener, elegant batsman', isCaptain: true, isWicketKeeper: false, battingOrder: 1 },
      { name: 'Wriddhiman Saha', role: 'Wicket-keeper' as const, skill: 'Right-handed opener, experienced keeper', isCaptain: false, isWicketKeeper: true, battingOrder: 2 },
      { name: 'Sai Sudharsan', role: 'Batsman' as const, skill: 'Left-handed middle order, solid technique', isCaptain: false, isWicketKeeper: false, battingOrder: 3 },
      { name: 'David Miller', role: 'Batsman' as const, skill: 'Left-handed middle order, power hitter', isCaptain: false, isWicketKeeper: false, battingOrder: 4 },
      { name: 'Rahul Tewatia', role: 'All-rounder' as const, skill: 'Left-handed finisher, leg spinner', isCaptain: false, isWicketKeeper: false, battingOrder: 5, bowlingOrder: 1 },
      { name: 'Rashid Khan', role: 'All-rounder' as const, skill: 'Right-handed lower order, leg spinner', isCaptain: false, isWicketKeeper: false, battingOrder: 6, bowlingOrder: 2 },
      { name: 'Vijay Shankar', role: 'All-rounder' as const, skill: 'Right-handed lower order, medium pace', isCaptain: false, isWicketKeeper: false, battingOrder: 7, bowlingOrder: 3 },
      { name: 'Mohit Sharma', role: 'Bowler' as const, skill: 'Right-arm medium, death over specialist', isCaptain: false, isWicketKeeper: false, bowlingOrder: 4 },
      { name: 'Noor Ahmad', role: 'Bowler' as const, skill: 'Left-arm chinaman, young spinner', isCaptain: false, isWicketKeeper: false, bowlingOrder: 5 },
      { name: 'Spencer Johnson', role: 'Bowler' as const, skill: 'Left-arm fast, tall bowler', isCaptain: false, isWicketKeeper: false, bowlingOrder: 6 },
      { name: 'Umesh Yadav', role: 'Bowler' as const, skill: 'Right-arm fast, experienced campaigner', isCaptain: false, isWicketKeeper: false, bowlingOrder: 7 }
    ]
  },
  'Lucknow Super Giants': {
    name: 'Lucknow Super Giants',
    shortName: 'LSG',
    captain: 'KL Rahul',
    wicketKeeper: 'KL Rahul',
    players: [
      { name: 'KL Rahul', role: 'Wicket-keeper' as const, skill: 'Right-handed opener, elegant batsman', isCaptain: true, isWicketKeeper: true, battingOrder: 1 },
      { name: 'Quinton de Kock', role: 'Batsman' as const, skill: 'Left-handed opener, aggressive batsman', isCaptain: false, isWicketKeeper: false, battingOrder: 2 },
      { name: 'Devdutt Padikkal', role: 'Batsman' as const, skill: 'Left-handed middle order, elegant stroke player', isCaptain: false, isWicketKeeper: false, battingOrder: 3 },
      { name: 'Marcus Stoinis', role: 'All-rounder' as const, skill: 'Right-handed middle order, fast bowler', isCaptain: false, isWicketKeeper: false, battingOrder: 4, bowlingOrder: 1 },
      { name: 'Nicholas Pooran', role: 'Batsman' as const, skill: 'Left-handed finisher, explosive batsman', isCaptain: false, isWicketKeeper: false, battingOrder: 5 },
      { name: 'Ayush Badoni', role: 'Batsman' as const, skill: 'Right-handed finisher, young talent', isCaptain: false, isWicketKeeper: false, battingOrder: 6 },
      { name: 'Krunal Pandya', role: 'All-rounder' as const, skill: 'Left-handed lower order, left-arm spinner', isCaptain: false, isWicketKeeper: false, battingOrder: 7, bowlingOrder: 2 },
      { name: 'Ravi Bishnoi', role: 'Bowler' as const, skill: 'Right-arm leg spinner, young talent', isCaptain: false, isWicketKeeper: false, bowlingOrder: 3 },
      { name: 'Mohsin Khan', role: 'Bowler' as const, skill: 'Left-arm medium fast, swing bowler', isCaptain: false, isWicketKeeper: false, bowlingOrder: 4 },
      { name: 'Yash Thakur', role: 'Bowler' as const, skill: 'Right-arm medium, death over specialist', isCaptain: false, isWicketKeeper: false, bowlingOrder: 5 },
      { name: 'Naveen-ul-Haq', role: 'Bowler' as const, skill: 'Right-arm medium fast, experienced campaigner', isCaptain: false, isWicketKeeper: false, bowlingOrder: 6 }
    ]
  }
};

export const IPL_VENUES = [
  'Wankhede Stadium, Mumbai',
  'M. A. Chidambaram Stadium, Chennai',
  'M. Chinnaswamy Stadium, Bangalore',
  'Eden Gardens, Kolkata',
  'Arun Jaitley Stadium, Delhi',
  'Narendra Modi Stadium, Ahmedabad',
  'Rajiv Gandhi International Stadium, Hyderabad',
  'Punjab Cricket Association Stadium, Mohali',
  'Sawai Mansingh Stadium, Jaipur',
  'Brabourne Stadium, Mumbai'
];

// Utility functions for team data
export const getAvailableTeams = (): string[] => {
  return Object.keys(IPL_TEAMS);
};

export const getTeamData = (teamName: string): Team | null => {
  return IPL_TEAMS[teamName] || null;
};

export const selectRandomTeams = (): { team1: string; team2: string } => {
  const teams = getAvailableTeams();
  const shuffled = teams.sort(() => 0.5 - Math.random());
  return {
    team1: shuffled[0],
    team2: shuffled[1]
  };
};
