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
    <Card className="shadow-lg w-full">
      <CardHeader>
        <CardTitle className="text-center text-xl font-bold">
          Game Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full flex justify-center">
        {loadingChart ? (
          <p>Loading game statistics...</p>
        ) : (
          <BarChart
            width={window.innerWidth < 768 ? 350 : 1200}
            height={300}
            data={chartData}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="played" fill="#2563eb" />
            <Bar dataKey="won" fill="#16a34a" />
          </BarChart>
        )}
      </CardContent>
    </Card>
  );
}
