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
  Building2,
  Edit,
  Users,
  Target,
  Calendar,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function DepartmentDetailsPage() {
  const params = useParams();
  const departmentId = params.id;

  const [departmentData, setDepartmentData] = useState<any>(null);

  useEffect(() => {
    async function fetchDepartmentData() {
      try {
        const res = await fetch(`/api/departments/${departmentId}`);
        const data = await res.json();
        setDepartmentData(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching department data:", error);
      }
    }

    if (departmentId) {
      fetchDepartmentData();
    }
  }, [departmentId]);

  if (!departmentData) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="bg-purple-100 p-3 rounded-lg">
            <Building2 className="h-8 w-8 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{departmentData.name}</h1>
            <p className="text-xl text-muted-foreground">
              {departmentData.description}
            </p>
            <Badge
              variant={
                departmentData.status === "Active" ? "default" : "secondary"
              }
              className="mt-2"
            >
              {departmentData.status}
            </Badge>
          </div>
        </div>
        <Button asChild>
          <Link href={`/departments/${departmentId}/edit`}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Department
          </Link>
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="okrs">OKRs</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Department Info */}
            <Card>
              <CardHeader>
                <CardTitle>Department Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Established:{" "}
                    {departmentData.establishedDate
                      ? new Date(
                          departmentData.establishedDate
                        ).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Location: {departmentData.location || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Annual Budget: {departmentData.budget || "N/A"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Department Head */}
            <Card>
              <CardHeader>
                <CardTitle>Department Head</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage
                      src={departmentData.head?.avatar || "/placeholder.svg"}
                      alt={departmentData.head?.name || "Head Avatar"}
                    />
                    <AvatarFallback>
                      {departmentData.head?.name
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("") || "NA"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {departmentData.head?.name || "N/A"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {departmentData.head?.role || "N/A"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {departmentData.head?.email || ""}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Mission Statement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {departmentData.mission || "N/A"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vision Statement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {departmentData.vision || "N/A"}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Teams */}
        <TabsContent value="teams">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {departmentData.teams?.length ? (
              departmentData.teams.map((team: any) => (
                <Card key={team._id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{team.name}</CardTitle>
                        <CardDescription>
                          Lead: {team.leadId?.name || "N/A"}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">{team.status || "N/A"}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {/* You don't fetch memberCount from API, so omit or add if available */}
                          Members: N/A
                        </span>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/teams/${team._id}`}>View Team</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p>No teams found.</p>
            )}
          </div>
        </TabsContent>

        {/* OKRs */}
        <TabsContent value="okrs">
          <div className="space-y-4">
            {departmentData.okrs?.length ? (
              departmentData.okrs.map((okr: any) => (
                <Card key={okr._id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Target className="h-5 w-5" />
                          {okr.title}
                        </CardTitle>
                        <p className="text-sm">
                          Due: {new Date(okr.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        variant={
                          okr.status === "On Track" ? "default" : "destructive"
                        }
                      >
                        {okr.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Progress
                      value={okr.progress}
                      max={100}
                      className="h-4 rounded-full"
                      aria-label="OKR Progress"
                    />
                  </CardContent>
                </Card>
              ))
            ) : (
              <p>No OKRs found.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
