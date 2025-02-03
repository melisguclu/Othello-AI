import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import AIOpponentStatistics from '@/components/dashboard/AIStatsRadialChart';

export default function StatisticsCard({ personalStats, loadingStats }) {
  return (
    <Card className="shadow-lg  ">
      <CardHeader>
        <CardTitle className="text-center text-xl font-bold">
          Statistics Overview
        </CardTitle>
      </CardHeader>
      <CardContent className=" md:flex-row justify-between items-center ">
        {/* Personal Statistics Section */}
        <div className="flex flex-row gap-4 text-center border-b md:border-b-0 justify-between  ">
          {loadingStats ? (
            <p>Loading statistics...</p>
          ) : (
            <>
              <div className="flex flex-col justify-center">
                <CardTitle>Total Games: {personalStats.totalGames}</CardTitle>
                <p>Wins: {personalStats.wins}</p>
                <p>Losses: {personalStats.losses}</p>
                <p>Win Rate: {personalStats.winRate}%</p>
              </div>
              <div>
                <AIOpponentStatistics personalStats={personalStats} />
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
