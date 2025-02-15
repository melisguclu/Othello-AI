import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function RecentGamesCard({ recentGames, loadingGames }) {
  return (
    <Card className="col-span-3 shadow-sm md:col-span-3 lg:col-span-2 sm:col-span-3 ">
      <CardHeader>
        <CardTitle className="text-center text-xl font-bold">
          Recent Games
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loadingGames ? (
          <p>Loading recent games...</p>
        ) : recentGames.length > 0 ? (
          <div className="divide-y divide-gray-300">
            {recentGames.map((game) => (
              <div
                key={game._id}
                className="grid grid-cols-4 items-center py-2 text-center"
              >
                <span className="font-medium text-start">{game.mode}</span>
                <span className="font-medium">{game.aiType}</span>
                <span
                  className={`font-semibold ${
                    game.result === 'win' ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {game.result}
                </span>
                <span className="text-gray-500 text-sm text-end">
                  {new Date(game.date).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600">No recent games found.</p>
        )}
      </CardContent>
    </Card>
  );
}
