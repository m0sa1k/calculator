'use client';

import { Pie, PieChart, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { formatCurrency } from '@/utils/format-currency';

// 1. Настраиваем цвета для Shadcn Chart
const chartConfig = {
  amount: {
    label: 'Основной долг',
    color: 'var(--chart-4)',
  },
  overpayment: {
    label: 'Переплата',
    color: 'var(--destructive)',
  },
} satisfies ChartConfig;

interface MortgageChartProps {
  loanAmount: number;       // Сумма кредита (totalAmount - downPayment)
  totalOverpayment: number; // Переплата
}

export default function MortgageChart({ loanAmount, totalOverpayment }: MortgageChartProps) {
  // 2. Форматируем данные для Recharts
  const data = [
    { name: 'amount', value: loanAmount, fill: 'var(--color-amount)' },
    { name: 'overpayment', value: totalOverpayment, fill: 'var(--color-overpayment)' },
  ];

  return (
    <Card className="flex flex-col border-none bg-transparent shadow-none">
      <CardHeader className="items-center pb-0">
        <CardTitle>Структура выплат</CardTitle>
        <CardDescription>Соотношение долга и процентов</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {/* 3. Оборачиваем в контейнер Shadcn */}
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              {/* Кастомная всплывающая подсказка при наведении */}

              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />

              <Pie
                data={data}
                innerRadius={50}
                stroke='white'
              />

              <text
                x="50%"
                y="50%"
                dy={-12}
                textAnchor='middle'
                style={{fill: '#333'}}
              >
                {formatCurrency(loanAmount + totalOverpayment)}
              </text>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
