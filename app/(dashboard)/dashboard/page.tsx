"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/auth-provider";
import { Target, TrendingUp, Calendar, BarChart3 } from "lucide-react";
import Link from "next/link";

interface RawOKR {
  _id: string;
  title: string;
  progress: number;
  keyResults: {
    _id: string;
    title: string;
    target: number;
    unit: string;
    createdAt: string;
    updatedAt: string;
  }[];
  dueDate: string;
  status: string;
}

interface OKR {
  id: string;
  title: string;
  progress: number;
  keyResults: number;
  dueDate: string;
  status: "completed" | "on-track" | "at-risk" | "active";
}

export default function Dashboard() {
  const { user } = useAuth();
  const [okrs, setOkrs] = useState<OKR[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOKRs() {
      try {
        const res = await fetch("/api/okrs");
        if (!res.ok) throw new Error("Failed to fetch OKRs");
        const json = await res.json();
        console.log(json);
        const transformed: OKR[] = json.data.map((okr: RawOKR) => ({
          id: okr._id,
          title: okr.title,
          progress: okr.progress,
          keyResults: okr.keyResults.length,
          dueDate: new Date(okr.dueDate).toLocaleDateString(),
          status:
            okr.status === "completed"
              ? "completed"
              : okr.status === "on-track" || okr.status === "at-risk"
              ? okr.status
              : "active",
        }));

        setOkrs(transformed);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Unknown error");
        setLoading(false);
      }
    }

    fetchOKRs();
  }, []);

  const stats = {
    totalOKRs: okrs.length,
    completedOKRs: okrs.filter((okr) => okr.status === "completed").length,
    inProgressOKRs: okrs.filter(
      (okr) => okr.status === "on-track" || okr.status === "at-risk"
    ).length,
    averageProgress:
      okrs.length > 0
        ? Math.round(
            okrs.reduce((acc, okr) => acc + okr.progress, 0) / okrs.length
          )
        : 0,
  };

  if (loading) return <p>Loading OKRs...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  const recentOKRs = [...okrs]
    .sort(
      (a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
    )
    .slice(0, 3);

  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total OKRs</CardTitle>
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
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedOKRs}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalOKRs > 0
                ? Math.round((stats.completedOKRs / stats.totalOKRs) * 100)
                : 0}
              % completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgressOKRs}</div>
            <p className="text-xs text-muted-foreground">Active objectives</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageProgress}%</div>
            <Progress value={stats.averageProgress} className="mt-2" />
          </CardContent>
        </Card>
      </div>

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
              <Link
                href={`/okrs/${okr.id}`}
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
                          : okr.status === "at-risk"
                          ? "destructive"
                          : "outline"
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
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
