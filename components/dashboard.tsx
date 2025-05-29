"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/context/auth-provider";
import { Sidebar } from "@/components/nav/sidebar";
import { OKRList } from "@/components/okr-list";
import { CreateOKRDialog } from "@/components/create-okr-dialog";
import { TeamManagement } from "@/components/team-management";
import { Target, TrendingUp, Calendar, BarChart3 } from "lucide-react";
// import { AnalyticsPage } from "./analytics";
import { Header } from "./nav/header";

export function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const stats = {
    totalOKRs: 12,
    completedOKRs: 8,
    inProgressOKRs: 4,
    averageProgress: 67,
  };

  const recentOKRs = [
    {
      id: "1",
      title: "Increase Customer Satisfaction",
      progress: 75,
      keyResults: 3,
      dueDate: "2024-03-31",
      status: "on-track",
    },
    {
      id: "2",
      title: "Launch New Product Feature",
      progress: 45,
      keyResults: 4,
      dueDate: "2024-02-28",
      status: "at-risk",
    },
    {
      id: "3",
      title: "Improve Team Productivity",
      progress: 90,
      keyResults: 2,
      dueDate: "2024-01-31",
      status: "completed",
    },
  ];

  return (
    <div className="flex h-full bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total OKRs
                    </CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalOKRs}</div>
                    <p className="text-xs text-muted-foreground">
                      +2 from last quarter
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Completed
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.completedOKRs}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {Math.round(
                        (stats.completedOKRs / stats.totalOKRs) * 100
                      )}
                      % completion rate
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      In Progress
                    </CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.inProgressOKRs}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Active objectives
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Avg Progress
                    </CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.averageProgress}%
                    </div>
                    <Progress value={stats.averageProgress} className="mt-2" />
                  </CardContent>
                </Card>
              </div>

              {/* Recent OKRs */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent OKRs</CardTitle>
                  <CardDescription>
                    Your most recently updated objectives
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOKRs.map((okr) => (
                      <div
                        key={okr.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex-1">
                          <h3 className="font-medium">{okr.title}</h3>
                          <div className="flex items-center gap-4 mt-2">
                            <Progress value={okr.progress} className="w-32" />
                            <span className="text-sm text-muted-foreground">
                              {okr.progress}%
                            </span>
                            <Badge
                              variant={
                                okr.status === "completed"
                                  ? "default"
                                  : okr.status === "on-track"
                                  ? "secondary"
                                  : "destructive"
                              }
                            >
                              {okr.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            {okr.keyResults} Key Results
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Due: {okr.dueDate}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="okrs">
              <OKRList />
            </TabsContent>

            {/* <TabsContent value="analytics">
              <AnalyticsPage />
            </TabsContent> */}

            <TabsContent value="teams">
              <TeamManagement />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
