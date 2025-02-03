import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartConfig = {
  minimax: {
    label: 'Minimax',
    color: 'hsl(var(--chart-1))',
  },
  mcts: {
    label: 'MCTS',
    color: 'hsl(var(--chart-2))',
  },
  random: {
    label: 'Random',
    color: 'hsl(var(--chart-3))',
  },
};

export default function AIOpponentStatistics({ personalStats }) {
  const aiGameData = [
    { name: 'Minimax', value: personalStats.aiStats?.minimax || 0 },
    { name: 'Random', value: personalStats.aiStats?.random || 0 },
    { name: 'MCTS', value: personalStats.aiStats?.mcts || 0 },
  ];

  const totalGames = aiGameData.reduce((sum, ai) => sum + ai.value, 0);
  console.log(totalGames);

  const chartData = [
    {
      minimax: personalStats.aiStats?.minimax,
      mcts: personalStats.aiStats?.mcts,
      random: personalStats.aiStats?.random,
    },
  ];

  return (
    <div className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Games Played Against AI</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-2">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px] "
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={80}
            outerRadius={130}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {totalGames.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          Games
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="minimax"
              stackId="a"
              cornerRadius={5}
              fill="var(--color-minimax)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="mcts"
              fill="var(--color-mcts)"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="random"
              fill="var(--color-random)"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
        <div className="leading-none text-muted-foreground mt-[-80px]">
          minimax: {personalStats.aiStats?.minimax} games, mcts:{' '}
          {personalStats.aiStats?.mcts} games, random:{' '}
          {personalStats.aiStats?.random} games
        </div>
      </CardContent>
    </div>
  );
}
