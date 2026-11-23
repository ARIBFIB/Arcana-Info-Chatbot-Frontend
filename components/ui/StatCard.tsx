import { Card } from "antd";

import { ui } from "@/design-system/components";

type StatCardProps = {
  value: string;
  unit: string;
  label: string;
};

export function StatCard({ value, unit, label }: StatCardProps) {
  return (
    <Card className={ui.statCard} classNames={{ body: ui.statCardBody }}>
      <div className="flex items-end gap-0.5">
        <span className={ui.statValue}>{value}</span>
        <span className={`${ui.statUnit} mb-1.5`}>{unit}</span>
      </div>
      <p className="font-body text-base leading-none font-bold text-smoke">{label}</p>
    </Card>
  );
}
