import { MatchData, PointsTableData, ScheduleData } from '@/types';

export const dummyMatches: MatchData[] = [
  {
    id: 'live-1',
    team1: 'Mumbai Indians',
    team2: 'Chennai Super Kings',
    venue: 'Wankhede Stadium, Mumbai',
    date: 'Mar 15',
    time: '7:30 PM',
    status: 'live',
    liveScore: {
      team1: { runs: 156, wickets: 4, overs: 18.2 },
      team2: { runs: 0, wickets: 0, overs: 0 },
      currentBatsman: 'Suryakumar Yadav',
      currentBowler: 'Deepak Chahar',
      requiredRunRate: 8.5
    }
  },
  {
    id: 'upcoming-1',
    team1: 'Royal Challengers Bangalore',
    team2: 'Kolkata Knight Riders',
    venue: 'M. Chinnaswamy Stadium, Bangalore',
    date: 'Mar 16',
    time: '7:30 PM',
    status: 'upcoming'
  },
  {
    id: 'upcoming-2',
    team1: 'Delhi Capitals',
    team2: 'Punjab Kings',
    venue: 'Arun Jaitley Stadium, Delhi',
    date: 'Mar 17',
    time: '3:30 PM',
    status: 'upcoming'
  },
  {
    id: 'upcoming-3',
    team1: 'Rajasthan Royals',
    team2: 'Sunrisers Hyderabad',
    venue: 'Sawai Mansingh Stadium, Jaipur',
    date: 'Mar 18',
    time: '7:30 PM',
    status: 'upcoming'
  }
];

export const dummyPointsTable: PointsTableData[] = [
  {
    team: 'Mumbai Indians',
    matches: 5,
    won: 4,
    lost: 1,
    tied: 0,
    noResult: 0,
    points: 8,
    netRunRate: 1.25,
    position: 1
  },
  {
    team: 'Chennai Super Kings',
    matches: 5,
    won: 3,
    lost: 2,
    tied: 0,
    noResult: 0,
    points: 6,
    netRunRate: 0.85,
    position: 2
  },
  {
    team: 'Royal Challengers Bangalore',
    matches: 4,
    won: 3,
    lost: 1,
    tied: 0,
    noResult: 0,
    points: 6,
    netRunRate: 0.65,
    position: 3
  },
  {
    team: 'Kolkata Knight Riders',
    matches: 4,
    won: 2,
    lost: 2,
    tied: 0,
    noResult: 0,
    points: 4,
    netRunRate: 0.15,
    position: 4
  },
  {
    team: 'Delhi Capitals',
    matches: 4,
    won: 2,
    lost: 2,
    tied: 0,
    noResult: 0,
    points: 4,
    netRunRate: -0.25,
    position: 5
  },
  {
    team: 'Punjab Kings',
    matches: 4,
    won: 2,
    lost: 2,
    tied: 0,
    noResult: 0,
    points: 4,
    netRunRate: -0.45,
    position: 6
  },
  {
    team: 'Rajasthan Royals',
    matches: 3,
    won: 1,
    lost: 2,
    tied: 0,
    noResult: 0,
    points: 2,
    netRunRate: -0.35,
    position: 7
  },
  {
    team: 'Sunrisers Hyderabad',
    matches: 3,
    won: 1,
    lost: 2,
    tied: 0,
    noResult: 0,
    points: 2,
    netRunRate: -0.65,
    position: 8
  },
  {
    team: 'Gujarat Titans',
    matches: 3,
    won: 1,
    lost: 2,
    tied: 0,
    noResult: 0,
    points: 2,
    netRunRate: -0.85,
    position: 9
  },
  {
    team: 'Lucknow Super Giants',
    matches: 3,
    won: 0,
    lost: 3,
    tied: 0,
    noResult: 0,
    points: 0,
    netRunRate: -1.25,
    position: 10
  }
];

export const dummySchedule: ScheduleData[] = [
  {
    id: 'match-1',
    team1: 'Mumbai Indians',
    team2: 'Chennai Super Kings',
    venue: 'Wankhede Stadium, Mumbai',
    date: 'Mar 15',
    time: '7:30 PM',
    matchNumber: 1,
    season: '2024'
  },
  {
    id: 'match-2',
    team1: 'Royal Challengers Bangalore',
    team2: 'Kolkata Knight Riders',
    venue: 'M. Chinnaswamy Stadium, Bangalore',
    date: 'Mar 16',
    time: '7:30 PM',
    matchNumber: 2,
    season: '2024'
  },
  {
    id: 'match-3',
    team1: 'Delhi Capitals',
    team2: 'Punjab Kings',
    venue: 'Arun Jaitley Stadium, Delhi',
    date: 'Mar 17',
    time: '3:30 PM',
    matchNumber: 3,
    season: '2024'
  },
  {
    id: 'match-4',
    team1: 'Rajasthan Royals',
    team2: 'Sunrisers Hyderabad',
    venue: 'Sawai Mansingh Stadium, Jaipur',
    date: 'Mar 18',
    time: '7:30 PM',
    matchNumber: 4,
    season: '2024'
  },
  {
    id: 'match-5',
    team1: 'Gujarat Titans',
    team2: 'Lucknow Super Giants',
    venue: 'Narendra Modi Stadium, Ahmedabad',
    date: 'Mar 19',
    time: '7:30 PM',
    matchNumber: 5,
    season: '2024'
  },
  {
    id: 'match-6',
    team1: 'Chennai Super Kings',
    team2: 'Royal Challengers Bangalore',
    venue: 'M. A. Chidambaram Stadium, Chennai',
    date: 'Mar 20',
    time: '7:30 PM',
    matchNumber: 6,
    season: '2024'
  },
  {
    id: 'match-7',
    team1: 'Kolkata Knight Riders',
    team2: 'Delhi Capitals',
    venue: 'Eden Gardens, Kolkata',
    date: 'Mar 21',
    time: '7:30 PM',
    matchNumber: 7,
    season: '2024'
  },
  {
    id: 'match-8',
    team1: 'Punjab Kings',
    team2: 'Rajasthan Royals',
    venue: 'Punjab Cricket Association Stadium, Mohali',
    date: 'Mar 22',
    time: '7:30 PM',
    matchNumber: 8,
    season: '2024'
  },
  {
    id: 'match-9',
    team1: 'Sunrisers Hyderabad',
    team2: 'Mumbai Indians',
    venue: 'Rajiv Gandhi International Stadium, Hyderabad',
    date: 'Mar 23',
    time: '7:30 PM',
    matchNumber: 9,
    season: '2024'
  },
  {
    id: 'match-10',
    team1: 'Lucknow Super Giants',
    team2: 'Gujarat Titans',
    venue: 'Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium, Lucknow',
    date: 'Mar 24',
    time: '7:30 PM',
    matchNumber: 10,
    season: '2024'
  }
];
