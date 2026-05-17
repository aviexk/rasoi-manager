import AppShell from "@/components/layout/AppShell";
import StatsCards from "@/components/dashboard/StatsCards";
import ConsumptionChart from "@/components/dashboard/ConsumptionChart";
import LowStockAlerts from "@/components/dashboard/LowStockAlerts";
import RecentOrders from "@/components/dashboard/RecentOrders";
import { mockDashboardStats } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <AppShell
      title="Dashboard"
      subtitle="Live overview · Synced with PetPooja"
    >
      <div className="space-y-6 max-w-7xl">
        <StatsCards stats={mockDashboardStats} />

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ConsumptionChart />
          </div>
          <div>
            <LowStockAlerts />
          </div>
        </div>

        <RecentOrders />
      </div>
    </AppShell>
  );
}
