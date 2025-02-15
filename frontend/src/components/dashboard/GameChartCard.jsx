import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

export default function GameChartCard({ chartData, loadingChart }) {
  return (
    <Card className="shadow-sm w-full h-full">
      <CardHeader>
        <CardTitle className="text-center text-xl font-bold">
          Game Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full flex justify-center">
        {loadingChart ? (
          <p>Loading game statistics...</p>
        ) : chartData.length === 0 ? (
          <div className="text-center text-muted-foreground">
            <p>No game data available.</p>
            <p>Start playing to see your monthly statistics!</p>
          </div>
        ) : (
          <BarChart
            width={window.innerWidth < 768 ? 350 : 1200}
            height={270}
            data={chartData}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend
              wrapperStyle={{
                width: 'fit-content',
              }}
            />
            <Bar dataKey="played" fill="#2563eb" />
            <Bar dataKey="won" fill="#16a34a" />
          </BarChart>
        )}
      </CardContent>
    </Card>
  );
}
