"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { tokens } from "@/design-system";

const DATA = [
  { date: "22APR", value: 48 },
  { date: "23APR", value: 52 },
  { date: "24APR", value: 74 },
  { date: "25APR", value: 58 },
  { date: "26APR", value: 50 },
  { date: "27APR", value: 44 },
  { date: "28APR", value: 46 },
  { date: "29APR", value: 40 },
  { date: "30APR", value: 48 },
];

const PEAK = DATA.reduce((a, b) => (b.value > a.value ? b : a));

type CustomDotProps = {
  cx?: number;
  cy?: number;
  payload?: { date: string; value: number };
};

function CustomDot({ cx, cy, payload }: CustomDotProps) {
  if (!payload || payload.date !== PEAK.date) return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r={6} fill="#3B6FFF" stroke="#fff" strokeWidth={2} />
      <text
        x={cx}
        y={(cy ?? 0) - 14}
        textAnchor="middle"
        fill="var(--color-white)"
        fontSize={13}
        fontWeight={700}
        fontFamily={tokens.typography.fontFamily}
      >
        {payload.value}%
      </text>
    </g>
  );
}

export function QueryResolutionChart() {
  return (
    <div className="w-full rounded-[10px] bg-charcoal px-5 pt-5 pb-4">
      <p className="font-body mb-4 block text-base leading-none font-bold text-smoke">
        Query Resolution Rate
      </p>
      <div className="h-[220px] sm:h-[260px] lg:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={DATA} margin={{ top: 24, right: 20, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B6FFF" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#3B6FFF" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              horizontal
              vertical={false}
              stroke="rgba(255,255,255,0.06)"
            />
            <XAxis
              dataKey="date"
              tick={{
                fill: "var(--color-smoke)",
                fontSize: 13,
                fontWeight: 700,
                fontFamily: tokens.typography.fontFamily,
              }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tickFormatter={(v) => `${v}%`}
              tick={{
                fill: "var(--color-smoke)",
                fontSize: 13,
                fontWeight: 700,
                fontFamily: tokens.typography.fontFamily,
              }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "#1a1d24",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8,
                fontFamily: tokens.typography.fontFamily,
                color: "#fff",
                fontSize: 13,
              }}
              formatter={(value) => [`${value ?? 0}%`, "Resolution Rate"]}
              cursor={{ stroke: "rgba(255,255,255,0.08)" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3B6FFF"
              strokeWidth={2.5}
              fill="url(#chartGradient)"
              dot={<CustomDot />}
              activeDot={{ r: 5, fill: "#3B6FFF", stroke: "#fff", strokeWidth: 2 }}
            />
            <ReferenceLine
              x={PEAK.date}
              stroke="rgba(59,111,255,0.3)"
              strokeDasharray="4 4"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
