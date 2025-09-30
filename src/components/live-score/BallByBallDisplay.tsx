'use client';

import { BallDetails } from '@/types';

interface BallByBallDisplayProps {
  balls: BallDetails[];
  title: string;
  subtitle?: string;
}

export default function BallByBallDisplay({ balls, title, subtitle }: BallByBallDisplayProps) {
  if (!balls || balls.length === 0) {
    return null;
  }

  // Calculate total runs for this over
  const totalRuns = balls.reduce((sum, ball) => sum + (ball.runs || 0), 0);
  
  // Calculate legal balls (excluding wides and no-balls)
  const legalBalls = balls.filter(ball => 
    ball.type === 'ball' || ball.type === 'bye' || ball.type === 'legbye'
  ).length;

  return (
    <div className="mt-4">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-semibold text-gray-700">{title}</div>
          <div className="flex items-center space-x-2">
            <div className="text-xs text-gray-500">
              {subtitle || `${legalBalls} balls`}
            </div>
            {title === 'Current Over' && (
              <div className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-medium">
                Total: {totalRuns}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {balls.map((ball, index) => (
            <div 
              key={index} 
              className={`px-3 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all hover:scale-105 ${
                ball.type === 'wicket' ? 'bg-red-100 text-red-800 border border-red-200' :
                ball.type === 'wide' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                ball.type === 'noball' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                ball.type === 'bye' ? 'bg-cyan-100 text-cyan-800 border border-cyan-200' :
                ball.type === 'legbye' ? 'bg-teal-100 text-teal-800 border border-teal-200' :
                ball.runs === 4 ? 'bg-green-100 text-green-800 border border-green-200' :
                ball.runs === 6 ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                ball.runs === 0 ? 'bg-gray-100 text-gray-800 border border-gray-200' :
                'bg-blue-100 text-blue-800 border border-blue-200'
              }`}
            >
              {ball.type === 'wide' && 'wd'}
              {ball.type === 'noball' && 'nb'}
              {ball.type === 'wicket' && 'W'}
              {ball.type === 'bye' && 'b'}
              {ball.type === 'legbye' && 'lb'}
              {ball.type === 'ball' && ball.runs}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
