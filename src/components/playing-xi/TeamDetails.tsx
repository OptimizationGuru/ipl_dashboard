'use client';

import { memo } from 'react';
import { Team } from '@/types/playingXI';
import TeamHeader from './TeamHeader';
import PlayerCard from './PlayerCard';

interface TeamDetailsProps {
  team: Team;
}

const TeamDetails = memo(function TeamDetails({ team }: TeamDetailsProps) {
  return (
    <div className="space-y-4">
      <TeamHeader team={team} />
      
      {/* Players Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {team.players.map((player, index) => (
          <PlayerCard key={player.name} player={player} index={index} />
        ))}
      </div>
    </div>
  );
});

export default TeamDetails;
