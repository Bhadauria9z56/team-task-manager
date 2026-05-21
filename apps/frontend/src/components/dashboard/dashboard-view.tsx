"use client";

import { AlertTriangle, CheckCircle2, Clock3, ListTodo } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { MetricCard } from "@/components/dashboard/metric-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getDashboard } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

export function DashboardView() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard
  });

  if (isLoading || !data) {
    return <Skeleton className="h-96 w-full" />;
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="rounded-xl border border-border/40 bg-gradient-to-br from-card to-card/50 p-8 shadow-sm backdrop-blur-sm">
        <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-base text-muted-foreground">A quick view of workload, progress, and deadlines.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total tasks" value={data.totalTasks} icon={ListTodo} />
        <MetricCard label="In progress" value={data.tasksByStatus.IN_PROGRESS} icon={Clock3} />
        <MetricCard label="Done" value={data.tasksByStatus.DONE} icon={CheckCircle2} />
        <MetricCard label="Overdue" value={data.overdueTasks.length} icon={AlertTriangle} />
      </div>

      {/* Two Column Section */}
      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-border/60">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Tasks per user</CardTitle>
            <CardDescription>Assigned workload across your accessible projects.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.tasksPerUser.length ? (
              data.tasksPerUser.map((item) => (
                <div
                  key={item.user?.id ?? "unknown"}
                  className="flex items-center justify-between gap-4 rounded-lg border border-border/40 bg-gradient-to-r from-card to-background/50 p-4 transition-all hover:border-border/60 hover:shadow-sm"
                >
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{item.user?.name ?? "Unassigned"}</p>
                    <p className="text-xs text-muted-foreground truncate">{item.user?.email}</p>
                  </div>
                  <Badge variant="info" className="flex-shrink-0">{item.total} tasks</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">No assigned work yet.</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Overdue tasks</CardTitle>
            <CardDescription>Tasks past due and not marked done.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.overdueTasks.length ? (
              data.overdueTasks.map((task) => (
                <div key={task.id} className="rounded-lg border border-destructive/20 bg-gradient-to-r from-destructive/5 to-background p-4 hover:border-destructive/30 transition-all">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold line-clamp-1">{task.title}</p>
                    <Badge variant="danger" className="flex-shrink-0">{formatDate(task.dueDate)}</Badge>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{task.assignedTo?.name ?? "Unassigned"}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">No overdue tasks. Nice and tidy.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-border/60">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Recent activity</CardTitle>
          <CardDescription>Latest project and task changes.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.recentActivity.length ? (
            data.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between gap-4 rounded-lg border border-border/40 bg-gradient-to-r from-card to-background/30 p-4 transition-all hover:border-border/60 hover:shadow-sm">
                <div className="min-w-0">
                  <p className="font-medium truncate">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">by {activity.user.name}</p>
                </div>
                <span className="text-xs text-muted-foreground flex-shrink-0">{formatDate(activity.createdAt)}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground py-4 text-center">Activity will appear here as your team works.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
