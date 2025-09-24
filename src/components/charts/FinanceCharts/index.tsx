'use client';

import type React from 'react';
import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface ChartData {
  day: string;
  lightBlue: number;
  darkBlue: number;
}

interface FinanceChartsProps {
  incomeData: ChartData[];
  expensesData: ChartData[];
  profitData: ChartData[];
}

const incomeChartConfig = {
  incomeLight: {
    label: 'Основные доходы',
    color: '#3B82F6', // Светло-синий
  },
  incomeDark: {
    label: 'Дополнительные доходы',
    color: '#1E40AF', // Темно-синий
  },
} satisfies ChartConfig;

const expensesChartConfig = {
  expensesLight: {
    label: 'Операционные затраты',
    color: '#60A5FA', // Светло-синий
  },
  expensesDark: {
    label: 'Накладные расходы',
    color: '#2563EB', // Средне-синий
  },
} satisfies ChartConfig;

const profitChartConfig = {
  profitLight: {
    label: 'Операционная прибыль',
    color: '#93C5FD', // Очень светло-синий
  },
  profitDark: {
    label: 'Чистая прибыль',
    color: '#1D4ED8', // Темно-синий
  },
} satisfies ChartConfig;

export const FinanceCharts: React.FC<FinanceChartsProps> = ({
  incomeData,
  expensesData,
  profitData,
}) => {
  const chartData = incomeData.map((item, index) => ({
    day: item.day,
    income: item.lightBlue + item.darkBlue,
    incomeLight: item.lightBlue,
    incomeDark: item.darkBlue,
    expenses: expensesData[index].lightBlue + expensesData[index].darkBlue,
    expensesLight: expensesData[index].lightBlue,
    expensesDark: expensesData[index].darkBlue,
    profit: profitData[index].lightBlue + profitData[index].darkBlue,
    profitLight: profitData[index].lightBlue,
    profitDark: profitData[index].darkBlue,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Income Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Доходы</CardTitle>
          <CardDescription>Анализ доходов по дням недели</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={incomeChartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="incomeLight"
                stackId="income"
                fill="var(--color-incomeLight)"
                radius={[0, 0, 4, 4]}
              />
              <Bar
                dataKey="incomeDark"
                stackId="income"
                fill="var(--color-incomeDark)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 leading-none font-medium">
            Рост на 12% в этом месяце <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">
            Показаны доходы за последние 6 дней
          </div>
        </CardFooter>
      </Card>

      {/* Expenses Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Затраты</CardTitle>
          <CardDescription>Анализ затрат по дням недели</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={expensesChartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="expensesLight"
                stackId="expenses"
                fill="var(--color-expensesLight)"
                radius={[0, 0, 4, 4]}
              />
              <Bar
                dataKey="expensesDark"
                stackId="expenses"
                fill="var(--color-expensesDark)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 leading-none font-medium">
            Рост на 8% в этом месяце <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">
            Показаны затраты за последние 6 дней
          </div>
        </CardFooter>
      </Card>

      {/* Profit Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Прибыль</CardTitle>
          <CardDescription>Анализ прибыли по дням недели</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={profitChartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="profitLight"
                stackId="profit"
                fill="var(--color-profitLight)"
                radius={[0, 0, 4, 4]}
              />
              <Bar
                dataKey="profitDark"
                stackId="profit"
                fill="var(--color-profitDark)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 leading-none font-medium">
            Рост на 18% в этом месяце <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">
            Показана прибыль за последние 6 дней
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
