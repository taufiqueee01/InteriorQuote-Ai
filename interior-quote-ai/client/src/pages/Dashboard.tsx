import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { FileText, Users, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { data: stats, isLoading } = trpc.dashboard.getStats.useQuery();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-slate-600 mt-2">Welcome back! Here's your overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Proposals</CardTitle>
              <FileText className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.proposalsCount || 0}</div>
                  <p className="text-xs text-slate-600 mt-1">Professional proposals created</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Quotations</CardTitle>
              <FileText className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.quotationsCount || 0}</div>
                  <p className="text-xs text-slate-600 mt-1">Quotations generated</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            size="lg"
            className="w-full"
            onClick={() => setLocation("/proposals/new")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Proposal
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full"
            onClick={() => setLocation("/quotations/new")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Quotation
          </Button>
        </div>

        {/* Recent Clients */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Recent Clients
            </CardTitle>
            <CardDescription>Your most recent clients</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : stats?.recentClients && stats.recentClients.length > 0 ? (
              <div className="space-y-4">
                {stats.recentClients.map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => setLocation(`/clients/${client.id}`)}
                  >
                    <div>
                      <p className="font-medium text-slate-900">{client.name}</p>
                      <p className="text-sm text-slate-600">{client.email || client.phone || "No contact info"}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLocation(`/clients/${client.id}`);
                      }}
                    >
                      View
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-600">No clients yet. Start by creating a new client.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setLocation("/clients/new")}
                >
                  Add Client
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
