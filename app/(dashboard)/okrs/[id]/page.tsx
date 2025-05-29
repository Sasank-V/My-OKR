"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Target,
  Edit,
  Calendar,
  Building2,
  Users,
  TrendingUp,
  Clock,
  User,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function OKRDetailsPage() {
  const params = useParams();
  const okrId = params.id;

  const [okrData, setOkrData] = useState<any>(null);
  const [updateLogs, setUpdateLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logsError, setLogsError] = useState<string | null>(null);

  useEffect(() => {
    if (!okrId) return;

    setLoading(true);
    setError(null);

    fetch(`/api/okrs/${okrId}`)
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch OKR");
        }
        return res.json();
      })
      .then((data) => {
        // You might need to transform the API data to match your UI structure here
        // Example: map ownerId to owner with avatar and role, etc.
        const transformedData = {
          id: data._id,
          title: data.title,
          description: data.description,
          type: data.type,
          owner: {
            name: data.ownerId?.name || "Unknown",
            role: data.ownerId?.role || "Owner",
            avatar: data.ownerId?.avatar || "/placeholder.svg",
          },
          department: data.departmentId?.name || "N/A",
          team: data.teamId?.name || "N/A",
          startDate: data.startDate,
          endDate: data.endDate,
          status: data.status || "Unknown",
          progress: data.progress || 0,
          keyResults: data.keyResults || [],
          updates: data.updates || [],
          contributors:
            data.contributors?.map((c: any) => ({
              name: c.name,
              role: c.role,
              avatar: c.avatar || "/placeholder.svg",
            })) || [],
        };

        setOkrData(transformedData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [okrId]);

  useEffect(() => {
    if (!okrId) return;

    setLogsLoading(true);
    setLogsError(null);

    fetch(`/api/okrs/${okrId}/updates`)
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch update logs");
        }
        return res.json();
      })
      .then((logs) => {
        setUpdateLogs(logs);
        setLogsLoading(false);
      })
      .catch((err) => {
        setLogsError(err.message);
        setLogsLoading(false);
      });
  }, [okrId]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!okrData) return <div className="p-6">No data found.</div>;

  const formatValue = (value: number, unit: string) => {
    if (unit === "$") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value);
    }
    return `${value}${unit}`;
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "create":
        return <Target className="h-4 w-4 text-green-600" />;
      case "update":
        return <Edit className="h-4 w-4 text-blue-600" />;
      case "delete":
        return <Target className="h-4 w-4 text-red-600" />;
      case "progress_update":
        return <TrendingUp className="h-4 w-4 text-orange-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActionText = (
    action: string,
    fieldChanged?: string,
    oldValue?: any,
    newValue?: any
  ) => {
    switch (action) {
      case "create":
        return "Created OKR";
      case "update":
        if (fieldChanged && oldValue !== undefined && newValue !== undefined) {
          return `Updated ${fieldChanged} from "${oldValue}" to "${newValue}"`;
        }
        return "Updated OKR";
      case "delete":
        return "Deleted OKR";
      case "progress_update":
        if (oldValue !== undefined && newValue !== undefined) {
          return `Updated progress from ${oldValue}% to ${newValue}%`;
        }
        return "Updated progress";
      default:
        return "Unknown action";
    }
  };

  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case "create":
        return "default";
      case "update":
        return "secondary";
      case "delete":
        return "destructive";
      case "progress_update":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Target className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{okrData.title}</h1>
              <p className="text-muted-foreground">{okrData.description}</p>
            </div>
          </div>
          <Button asChild>
            <Link href={`/okrs/${okrId}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit OKR
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge
                variant={
                  okrData.status === "On Track" ? "default" : "destructive"
                }
              >
                {okrData.status}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Type</span>
              <span className="text-sm font-medium">{okrData.type}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Progress</span>
              <span className="text-sm font-medium">{okrData.progress}%</span>
            </div>
            <Progress value={okrData.progress} className="w-full" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Owner & Team</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage
                  src={okrData.owner.avatar || "/placeholder.svg"}
                  alt={okrData.owner.name}
                />
                <AvatarFallback>
                  {okrData.owner.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{okrData.owner.name}</div>
                <div className="text-sm text-muted-foreground">
                  {okrData.owner.role}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span>{okrData.department}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{okrData.team}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                Start: {new Date(okrData.startDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>End: {new Date(okrData.endDate).toLocaleDateString()}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {Math.ceil(
                (new Date(okrData.endDate).getTime() - new Date().getTime()) /
                  (1000 * 60 * 60 * 24)
              )}{" "}
              days remaining
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="key-results" className="space-y-6">
        <TabsList>
          <TabsTrigger value="key-results">Key Results</TabsTrigger>
          {/* <TabsTrigger value="updates">Updates</TabsTrigger> */}
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
          {/* <TabsTrigger value="contributors">Contributors</TabsTrigger> */}
        </TabsList>

        <TabsContent value="key-results">
          <div className="space-y-4">
            {okrData.keyResults.map((kr: any) => (
              <Card key={kr.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{kr.title}</CardTitle>
                      <CardDescription>
                        Target: {formatValue(kr.target, kr.unit)} | Current:{" "}
                        {formatValue(kr.current, kr.unit)} | Last updated:{" "}
                        {new Date(kr.lastUpdated).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        kr.progress >= 80
                          ? "default"
                          : kr.progress >= 60
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {kr.progress}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress value={kr.progress} />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* <TabsContent value="updates">
          <div className="space-y-4">
            {okrData.updates.map((update: any) => (
              <Card key={update.id}>
                <CardHeader>
                  <CardTitle>{update.title}</CardTitle>
                  <CardDescription>
                    {new Date(update.date).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>{update.content}</CardContent>
              </Card>
            ))}
          </div>
        </TabsContent> */}

        <TabsContent value="activity">
          <div className="space-y-4">
            {logsLoading ? (
              <div className="text-center py-8">
                <div className="text-muted-foreground">
                  Loading activity logs...
                </div>
              </div>
            ) : logsError ? (
              <div className="text-center py-8">
                <div className="text-red-600">
                  Error loading activity logs: {logsError}
                </div>
              </div>
            ) : updateLogs.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-muted-foreground">
                  No activity logs found.
                </div>
              </div>
            ) : (
              updateLogs.map((log: any) => (
                <Card key={log._id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {getActionIcon(log.action)}
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">
                              {log.userId?.name || "Unknown User"}
                            </span>
                            <Badge variant={getActionBadgeVariant(log.action)}>
                              {log.action.replace("_", " ")}
                            </Badge>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-4 w-4 mr-1" />
                            {new Date(log.timestamp).toLocaleString()}
                          </div>
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          {getActionText(
                            log.action,
                            log.fieldChanged,
                            log.oldValue,
                            log.newValue
                          )}
                        </div>
                        {log.userId?.email && (
                          <div className="mt-1 text-xs text-muted-foreground">
                            {log.userId.email}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* <TabsContent value="contributors">
          <div className="flex space-x-6">
            {okrData.contributors.map((contributor: any) => (
              <div key={contributor.name} className="text-center">
                <Avatar className="mx-auto mb-2">
                  <AvatarImage
                    src={contributor.avatar || "/placeholder.svg"}
                    alt={contributor.name}
                  />
                  <AvatarFallback>
                    {contributor.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="font-medium">{contributor.name}</div>
                <div className="text-sm text-muted-foreground">
                  {contributor.role}
                </div>
              </div>
            ))}
          </div>
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
