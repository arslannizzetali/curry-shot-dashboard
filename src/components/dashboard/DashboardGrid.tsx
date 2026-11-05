import type { ReactNode } from "react";

type DashboardGridProps = {
  controls: ReactNode;
  filters: ReactNode;
  chart: ReactNode;
  metrics: ReactNode;
  coach: ReactNode;
};

export function DashboardGrid({ controls, filters, chart, metrics, coach }: DashboardGridProps) {
  return (
    <section className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)_360px]">
      <aside className="grid gap-4 xl:content-start">
        {controls}
        {filters}
      </aside>

      <section className="min-w-0">{chart}</section>

      <aside className="grid gap-4 xl:content-start">
        {coach}
        {metrics}
      </aside>
    </section>
  );
}
