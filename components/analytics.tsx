"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  LineChart,
  Filter,
  Users,
  TrendingUp,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const analyticsData = [
  {
    id: "1",
    metric: "User Growth",
    value: 1280,
    percentageChange: 12,
    trend: "up",
    timeframe: "This Month",
    team: "Marketing",
    progress: 75,
  },
  {
    id: "2",
    metric: "Active Users",
    value: 932,
    percentageChange: -5,
    trend: "down",
    timeframe: "This Week",
    team: "Product",
    progress: 60,
  },
  {
    id: "3",
    metric: "Conversion Rate",
    value: "8.6%",
    percentageChange: 3.2,
    trend: "up",
    timeframe: "Today",
    team: "Growth",
    progress: 86,
  },
  {
    id: "4",
    metric: "Bug Reports",
    value: 23,
    percentageChange: -20,
    trend: "down",
    timeframe: "This Week",
    team: "Engineering",
    progress: 20,
  },
];

export function AnalyticsPage() {
  const [search, setSearch] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");

  const filteredData = analyticsData.filter((item) => {
    const matchSearch = item.metric
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchTime =
      timeFilter === "all" || item.timeframe.toLowerCase() === timeFilter;
    return matchSearch && matchTime;
  });

  const getTrendBadge = (trend: string, change: number) => {
    const icon =
      trend === "up" ? (
        <TrendingUp className="h-4 w-4 mr-1" />
      ) : (
        <AlertTriangle className="h-4 w-4 mr-1" />
      );
    const color = trend === "up" ? "secondary" : "destructive";
    return (
      <Badge variant={color} className="flex items-center gap-1">
        {icon}
        {change}%
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics</h2>
          <p className="text-muted-foreground">
            Track your performance and key metrics
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search metrics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Timeframes</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="this week">This Week</SelectItem>
            <SelectItem value="this month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Analytics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredData.map((metric) => (
          <Card key={metric.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  {metric.metric}
                </span>
                {getTrendBadge(metric.trend, metric.percentageChange)}
              </CardTitle>
              <CardDescription className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" /> {metric.team}
                <Calendar className="h-4 w-4 ml-4" /> {metric.timeframe}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-3xl font-bold">{metric.value}</div>
              <Progress value={metric.progress} />
              <p className="text-xs text-muted-foreground">
                Progress toward goal
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-12">
          <LineChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No data found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
}
