import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { MonthlyCashflowItem, Language, formatINR } from '../data/financeData';

interface IncomeExpenseChartProps {
  lang: Language;
  data: MonthlyCashflowItem[];
  currentMonthIncome: number;
  currentMonthExpenses: number;
}

// Custom 3D Claymorphic Bar Shape with soft rounded top/bottom & inner highlight
const ClayBarShape = (props: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
  variant?: 'income' | 'expenses';
}) => {
  const { x = 0, y = 0, width = 0, height = 0, variant = 'income' } = props;
  if (
    !Number.isFinite(x) ||
    !Number.isFinite(y) ||
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    height <= 0 ||
    width <= 0
  ) {
    return null;
  }

  const radius = Math.min(8, width / 2, height / 2);
  const gradId =
    variant === 'income' ? 'clayIncomeBarGrad' : 'clayExpenseBarGrad';
  const shadowColor =
    variant === 'income'
      ? 'rgba(54, 158, 98, 0.28)'
      : 'rgba(223, 92, 92, 0.28)';

  return (
    <g>
      {/* Soft ambient clay shadow */}
      <rect
        x={x + 1}
        y={y + 3}
        width={width}
        height={height}
        rx={radius}
        ry={radius}
        fill={shadowColor}
      />
      {/* Main 3D Clay Bar body */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={radius}
        ry={radius}
        fill={`url(#${gradId})`}
      />
      {/* Specular left/top 3D clay rim highlight */}
      {width > 6 && height > 10 && (
        <rect
          x={x + 2}
          y={y + 2}
          width={Math.max(2, width * 0.28)}
          height={Math.max(4, height - 4)}
          rx={Math.max(1, radius - 2)}
          fill="rgba(255, 255, 255, 0.32)"
        />
      )}
    </g>
  );
};

interface CustomTooltipProps {
  active?: boolean;
  lang: Language;
  payload?: Array<{
    value: number;
    dataKey: string;
    payload: MonthlyCashflowItem;
  }>;
}

const ClayChartTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  lang,
}) => {
  if (!active || !payload || payload.length === 0) return null;
  const item = payload[0].payload;
  const isRTL = lang === 'ar';
  const netSavings = item.income - item.expenses;
  const savingsRate = Math.round((netSavings / Math.max(1, item.income)) * 100);

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="clay-card rounded-[18px] px-4 py-3 border border-white/80 min-w-[195px]"
    >
      <p className="text-[12.5px] font-extrabold text-[#1E1B26] pb-1.5 mb-1.5 border-b border-[#E6DFD9]">
        {isRTL ? item.fullMonthAr : item.fullMonth}
      </p>
      <div className="space-y-1.5 text-[12px]">
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 font-semibold text-[#3B3532]">
            <span
              className="w-2.5 h-2.5 rounded-full clay-dot inline-block"
              style={{
                background: 'linear-gradient(145deg, #62D292 0%, #349E62 100%)',
              }}
            />
            {isRTL ? 'الدخل' : 'Income'}
          </span>
          <span dir="ltr" className="font-extrabold tabular-nums text-[#1F8E5A]">
            {formatINR(item.income)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 font-semibold text-[#3B3532]">
            <span
              className="w-2.5 h-2.5 rounded-full clay-dot inline-block"
              style={{
                background: 'linear-gradient(145deg, #FF9999 0%, #DF5C5C 100%)',
              }}
            />
            {isRTL ? 'المصروفات' : 'Expenses'}
          </span>
          <span dir="ltr" className="font-extrabold tabular-nums text-[#D84E4E]">
            {formatINR(item.expenses)}
          </span>
        </div>

        <div className="pt-1.5 mt-1 border-t border-[#E6DFD9] flex items-center justify-between gap-4">
          <span className="font-bold text-[#1E1B26]">
            {isRTL ? 'صافي الادخار' : 'Net Saved'}
          </span>
          <span dir="ltr" className="font-extrabold tabular-nums text-[#6D50EB]">
            {formatINR(netSavings)} ({savingsRate}%)
          </span>
        </div>
      </div>
    </div>
  );
};

export const IncomeExpenseChart: React.FC<IncomeExpenseChartProps> = ({
  lang,
  data,
  currentMonthIncome,
  currentMonthExpenses,
}) => {
  const [rangeFilter, setRangeFilter] = useState<'6M' | '3M'>('6M');
  const isRTL = lang === 'ar';

  // Sync the latest month (Nov) with live session income & expenses
  const chartData = useMemo(() => {
    const synced = data.map((row, idx) =>
      idx === data.length - 1
        ? {
            ...row,
            income: currentMonthIncome,
            expenses: currentMonthExpenses,
            savings: Math.max(0, currentMonthIncome - currentMonthExpenses),
          }
        : row
    );
    return rangeFilter === '3M' ? synced.slice(-3) : synced;
  }, [data, currentMonthIncome, currentMonthExpenses, rangeFilter]);

  const sixMonthTotals = useMemo(() => {
    const totalInc = chartData.reduce((s, r) => s + r.income, 0);
    const totalExp = chartData.reduce((s, r) => s + r.expenses, 0);
    const avgSavings = Math.round(
      (totalInc - totalExp) / Math.max(1, chartData.length)
    );
    return { totalInc, totalExp, avgSavings };
  }, [chartData]);

  return (
    <div className="clay-card rounded-[24px] p-5 flex flex-col justify-between">
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div>
          <h2 className="text-[16.5px] font-extrabold text-[#1E1B26]">
            {isRTL
              ? 'الدخل مقابل المصروفات (آخر 6 أشهر)'
              : 'Income vs. Expenses (Last 6 Months)'}
          </h2>
          <p className="text-[12px] font-medium text-[#5A534E] mt-0.5 tabular-nums">
            {isRTL ? 'متوسط الادخار الشهري: ' : 'Avg. Monthly Savings: '}
            <strong dir="ltr" className="font-extrabold text-[#1F8E5A] inline-block">
              {formatINR(sixMonthTotals.avgSavings)}
            </strong>{' '}
            · {isRTL ? 'إجمالي الدخل: ' : 'Total Inflow: '}
            <strong dir="ltr" className="font-bold text-[#1E1B26] inline-block">
              {formatINR(sixMonthTotals.totalInc)}
            </strong>
          </p>
        </div>

        {/* Legend + Interactive Range Filter */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3.5 text-[12px] font-bold text-[#2C2733]">
            <span className="flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-full clay-dot inline-block"
                style={{
                  background: 'linear-gradient(145deg, #62D292 0%, #349E62 100%)',
                }}
              />
              {isRTL ? 'الدخل' : 'Income'}
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-full clay-dot inline-block"
                style={{
                  background: 'linear-gradient(145deg, #FF9999 0%, #DF5C5C 100%)',
                }}
              />
              {isRTL ? 'المصروفات' : 'Expenses'}
            </span>
          </div>

          <div className="clay-inner-card p-1 rounded-[12px] flex items-center gap-1">
            {(['6M', '3M'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setRangeFilter(mode)}
                className={`px-2.5 py-1 rounded-[9px] text-[11.5px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                  rangeFilter === mode
                    ? 'clay-purple-active text-white'
                    : 'text-[#5A534E] hover:text-[#1E1B26]'
                }`}
              >
                {mode === '6M'
                  ? isRTL
                    ? 'آخر 6 أشهر'
                    : 'Last 6 Months'
                  : isRTL
                  ? 'آخر 3 أشهر'
                  : 'Last 3 Months'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Claymorphic Recessed Chart Well */}
      <div
        dir="ltr"
        className="clay-inner-card rounded-[18px] pt-4 pb-2 px-2 sm:px-4 h-[236px] w-full min-w-0"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 16, left: 10, bottom: 4 }}
            barGap={8}
            barCategoryGap="24%"
          >
            <defs>
              <linearGradient id="clayIncomeBarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#63D494" />
                <stop offset="55%" stopColor="#42B273" />
                <stop offset="100%" stopColor="#2F945B" />
              </linearGradient>
              <linearGradient id="clayExpenseBarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF9898" />
                <stop offset="55%" stopColor="#F07171" />
                <stop offset="100%" stopColor="#D95353" />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="#DFD7D0"
            />

            <XAxis
              dataKey={isRTL ? 'monthAr' : 'month'}
              reversed={isRTL}
              axisLine={false}
              tickLine={false}
              tick={{
                fill: '#4A433E',
                fontSize: 12,
                fontWeight: 700,
              }}
              dy={6}
            />

            <YAxis
              orientation={isRTL ? 'right' : 'left'}
              axisLine={false}
              tickLine={false}
              width={60}
              tickFormatter={(val: number) =>
                val === 0 ? '₹0' : `₹${Math.round(val / 1000)}k`
              }
              tick={{
                fill: '#6E655F',
                fontSize: 11.5,
                fontWeight: 600,
              }}
            />

            <Tooltip
              content={<ClayChartTooltip lang={lang} />}
              cursor={{ fill: 'rgba(115, 87, 246, 0.06)', radius: 12 }}
            />

            <Bar
              dataKey="income"
              name={isRTL ? 'الدخل' : 'Income'}
              maxBarSize={28}
              shape={<ClayBarShape variant="income" />}
            />

            <Bar
              dataKey="expenses"
              name={isRTL ? 'المصروفات' : 'Expenses'}
              maxBarSize={28}
              shape={<ClayBarShape variant="expenses" />}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
