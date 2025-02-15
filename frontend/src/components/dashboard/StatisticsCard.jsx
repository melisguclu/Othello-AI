import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import AIOpponentStatistics from '@/components/dashboard/AIStatsRadialChart';

export default function StatisticsCard({ personalStats, loadingStats }) {
  return (
    <Card className="shadow-sm w-full h-full">
      <CardHeader>
        <CardTitle className="text-center text-xl font-bold">
          Statistics Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loadingStats ? (
          <p>Loading statistics...</p>
        ) : personalStats.totalGames === 0 ? (
          <div className="text-center text-muted-foreground">
            <p>You haven't played any games yet.</p>
            <p>Start playing to see your statistics here!</p>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row lg:flex-row gap-6 items-center sm:flex-col">
            {/*boxes */}
            <div className="w-full lg:w-1/2">
              <div className="grid grid-cols-1 gap-4">
                {/* Total Games */}
                <div className="p-4 bg-blue-50 rounded-lg text-center flex flex-row items-center justify-between h-12">
                  <p className="text-sm font-medium text-gray-500">Total</p>
                  <p className="text-lg sm:text-xl font-bold">
                    {personalStats.totalGames}
                  </p>
                </div>

                {/* Wins */}
                <div className="p-4 bg-green-50 rounded-lg text-center flex flex-row items-center justify-between h-12">
                  <p className="text-sm font-medium text-gray-500">Wins</p>
                  <p className="text-lg sm:text-xl font-bold">
                    {personalStats.wins}
                  </p>
                </div>

                {/* Losses */}
                <div className="p-4 bg-red-50 rounded-lg text-center flex flex-row items-center justify-between h-12">
                  <p className="text-sm font-medium text-gray-500">Losses</p>
                  <p className="text-lg sm:text-xl font-bold">
                    {personalStats.losses}
                  </p>
                </div>

                {/* Win Rate */}
                <div className="p-4 bg-purple-50 rounded-lg text-center flex flex-row items-center justify-between h-12">
                  <p className="text-sm font-medium text-gray-500">Win Rate</p>
                  <p className="text-lg sm:text-xl font-bold">
                    {personalStats.winRate}%
                  </p>
                </div>
              </div>
            </div>

            {/* AI Opponent Statistics */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
              <AIOpponentStatistics personalStats={personalStats} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
