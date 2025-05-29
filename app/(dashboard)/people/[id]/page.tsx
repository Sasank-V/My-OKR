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
  User,
  Edit,
  Mail,
  Phone,
  Building2,
  Users,
  Calendar,
  Target,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PersonDetailsPage() {
  const params = useParams();
  const personId = params.id;

  const [personData, setPersonData] = useState<any>(null);

  useEffect(() => {
    const mockPerson = {
      id: personId,
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
      role: "Product Manager",
      department: "Engineering",
      team: "Frontend Team",
      status: "Active",
      avatar: "/placeholder.svg?height=100&width=100",
      startDate: "2022-03-15",
      manager: "Sarah Johnson",
      location: "San Francisco, CA",
      bio: "Experienced product manager with a passion for building user-centric solutions. Leading cross-functional teams to deliver innovative products.",
      skills: [
        "Product Management",
        "Agile",
        "User Research",
        "Data Analysis",
        "Leadership",
      ],
      okrs: [
        {
          id: 1,
          title: "Enhance Technical Leadership Skills",
          progress: 85,
          status: "On Track",
          endDate: "2024-06-30",
        },
        {
          id: 2,
          title: "Improve Code Quality and Architecture",
          progress: 70,
          status: "On Track",
          endDate: "2024-12-31",
        },
      ],
      recentActivity: [
        {
          id: 1,
          type: "okr_update",
          title: "Updated OKR progress",
          description: "Enhanced Technical Leadership Skills - 85% complete",
          date: "2024-01-15",
        },
        {
          id: 2,
          type: "team_meeting",
          title: "Team standup meeting",
          description: "Participated in daily standup with Frontend Team",
          date: "2024-01-14",
        },
      ],
      performance: {
        okrsCompleted: 12,
        averageProgress: 78,
        onTimeCompletion: 92,
        teamCollaboration: 95,
      },
    };
    setPersonData(mockPerson);
  }, [personId]);

  if (!personData) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage
                src={personData.avatar || "/placeholder.svg"}
                alt={personData.firstName}
              />
              <AvatarFallback className="text-lg">
                {personData.firstName[0]}
                {personData.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">
                {personData.firstName} {personData.lastName}
              </h1>
              <p className="text-xl text-muted-foreground">{personData.role}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline">{personData.department}</Badge>
                <Badge variant="outline">{personData.team}</Badge>
                <Badge
                  variant={
                    personData.status === "Active" ? "default" : "secondary"
                  }
                >
                  {personData.status}
                </Badge>
              </div>
            </div>
          </div>
          <Button asChild>
            <Link href={`/people/${personId}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{personData.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{personData.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span>{personData.location}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Work Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span>Department: {personData.department}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>Team: {personData.team}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Manager: {personData.manager}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                Start Date:{" "}
                {new Date(personData.startDate).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Performance Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>OKRs Completed</span>
              <span className="font-medium">
                {personData.performance.okrsCompleted}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Avg Progress</span>
              <span className="font-medium">
                {personData.performance.averageProgress}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>On-time Completion</span>
              <span className="font-medium">
                {personData.performance.onTimeCompletion}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Team Collaboration</span>
              <span className="font-medium">
                {personData.performance.teamCollaboration}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="okrs">OKRs</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{personData.bio}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="okrs">
          <div className="space-y-4">
            {personData.okrs.map((okr: any) => (
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
            {personData.recentActivity.map((activity: any) => (
              <Card key={activity.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <div>
                      <CardTitle className="text-lg">
                        {activity.title}
                      </CardTitle>
                      <CardDescription>{activity.description}</CardDescription>
                    </div>
                    <div className="ml-auto text-sm text-muted-foreground">
                      {new Date(activity.date).toLocaleDateString()}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <CardTitle>Skills & Expertise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {personData.skills.map((skill: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
