'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { YearlyData } from '@/utils/calculate';

const chartConfig = {
  principalPaid: {
    label: 'Основной долг',
    color: 'var(--primary)',
  },
  interestPaid: {
    label: 'Проценты',
    color: 'var(--destructive)',
  },
} satisfies ChartConfig;

interface Props {
  data: YearlyData[];
  isAnimationActive: boolean;
}

export default function MortgageBarChart({ data, isAnimationActive }: Props) {
  return (
    <Card className="border-none bg-transparent shadow-none w-full">
      <CardHeader className="items-center pb-2">
        <CardTitle className="text-base">График выплат по годам</CardTitle>
        <CardDescription>Основной долг vs Проценты</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="year" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}к`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              {/* stackId="a" заставляет столбцы встать друг на друга */}
              <Bar isAnimationActive={isAnimationActive} dataKey="principalPaid" stackId="a" fill="var(--color-principalPaid)" radius={[0, 0, 4, 4]} />
              <Bar isAnimationActive={isAnimationActive} dataKey="interestPaid" stackId="a" fill="var(--color-interestPaid)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
