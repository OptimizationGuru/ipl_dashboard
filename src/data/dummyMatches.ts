import { MatchData } from '@/types';

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
