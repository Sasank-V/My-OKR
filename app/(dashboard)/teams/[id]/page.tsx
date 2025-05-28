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
  Users,
  Edit,
  Building2,
  Target,
  TrendingUp,
  Calendar,
  User,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function TeamDetailsPage() {
  const params = useParams();
  const teamId = params.id;

  const [teamData, setTeamData] = useState<any>(null);
  useEffect(() => {
    async function fetchTeam() {
      try {
        const res = await fetch(`/api/teams/${teamId}`);
        if (!res.ok) throw new Error("Failed to fetch team");

        const data = await res.json();
        setTeamData({
          id: data._id,
          name: data.name,
          description: data.description,
          department: data.departmentId?.name || "N/A",
          organization: data.organizationId?.name || "N/A",
          status: data.status,
          memberCount: data.memberIds?.length || 0,
          goals: data.goals,
          lead: {
            name: data.leadId?.name,
            email: data.leadId?.email,
            avatar: data.leadId?.avatar || "/placeholder.svg",
          },
          members: data.memberIds?.map((m: any) => ({
            id: m._id,
            name: m.name,
            email: m.email,
            avatar: m.avatar || "/placeholder.svg",
            status: data.status,
          })),
          // Add mock values for metrics if not available from API
          metrics: {
            completedProjects: 0,
            averageOKRProgress: 0,
            teamSatisfaction: 0,
            deliveryOnTime: 0,
          },
          // Placeholder - you can implement OKRs and activity tracking later
          okrs: [],
          recentActivity: [],
        });
      } catch (error) {
        console.error("Error fetching team data:", error);
      }
    }

    if (teamId) {
      fetchTeam();
    }
  }, [teamId]);

  if (!teamData) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{teamData.name}</h1>
              <p className="text-xl text-muted-foreground">
                {teamData.description}
              </p>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline">{teamData.department}</Badge>
                <Badge
                  variant={
                    teamData.status === "Active" ? "default" : "secondary"
                  }
                >
                  {teamData.status}
                </Badge>
                <Badge variant="secondary">
                  {teamData.memberCount} members
                </Badge>
              </div>
            </div>
          </div>
          <Button asChild>
            <Link href={`/teams/${teamId}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Team
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {teamData.metrics.completedProjects}
            </div>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              OKR Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {teamData.metrics.averageOKRProgress}%
            </div>
            <p className="text-sm text-muted-foreground">Average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              Satisfaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {teamData.metrics.teamSatisfaction}/5
            </div>
            <p className="text-sm text-muted-foreground">Team rating</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              On-time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {teamData.metrics.deliveryOnTime}%
            </div>
            <p className="text-sm text-muted-foreground">Delivery rate</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="okrs">OKRs</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Department: {teamData.department}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Established:{" "}
                      {new Date(teamData.establishedDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Location: {teamData.location}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Lead</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage
                      src={teamData.lead.avatar || "/placeholder.svg"}
                      alt={teamData.lead.name}
                    />
                    <AvatarFallback>
                      {teamData.lead.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{teamData.lead.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {teamData.lead.role}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Team Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{teamData.goals}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamData.members.map((member: any) => (
              <Card key={member.id}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage
                        src={member.avatar || "/placeholder.svg"}
                        alt={member.name}
                      />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {member.role}
                      </div>
                      <Badge variant="outline" className="mt-1">
                        {member.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="okrs">
          <div className="space-y-4">
            {teamData.okrs.map((okr: any) => (
              <Card key={okr.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        {okr.title}
                      </CardTitle>
                      <CardDescription>
                        Due: {new Date(okr.endDate).toLocaleDateString()}
                      </CardDescription>
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
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{okr.progress}%</span>
                    </div>
                    <Progress value={okr.progress} className="w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <div className="space-y-4">
            {teamData.recentActivity.map((activity: any) => (
              <Card key={activity.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {activity.title}
                      </CardTitle>
                      <CardDescription>{activity.description}</CardDescription>
                      <div className="flex items-center gap-2 mt-2">
                        <User className="h-3 w-3" />
                        <span className="text-xs text-muted-foreground">
                          {activity.member}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(activity.date).toLocaleDateString()}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
