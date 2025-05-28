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
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function OKRDetailsPage() {
  const params = useParams();
  const okrId = params.id;

  const [okrData, setOkrData] = useState<any>(null);

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockOKR = {
      id: okrId,
      title: "Increase Annual Revenue",
      description:
        "Drive company growth through strategic initiatives and market expansion",
      type: "Company",
      owner: {
        name: "John Smith",
        role: "CEO",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      department: "Executive",
      team: "Leadership",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      status: "On Track",
      progress: 75,
      keyResults: [
        {
          id: 1,
          title: "Achieve $10M ARR",
          target: 10000000,
          unit: "$",
          current: 8000000,
          progress: 80,
          lastUpdated: "2024-01-15",
        },
        {
          id: 2,
          title: "Expand to 3 new markets",
          target: 3,
          unit: "markets",
          current: 2,
          progress: 67,
          lastUpdated: "2024-01-10",
        },
        {
          id: 3,
          title: "Increase customer retention to 95%",
          target: 95,
          unit: "%",
          current: 78,
          progress: 78,
          lastUpdated: "2024-01-12",
        },
      ],
      updates: [
        {
          id: 1,
          author: "John Smith",
          date: "2024-01-15",
          content:
            "Q1 revenue targets exceeded expectations. On track for annual goal.",
          type: "progress",
        },
        {
          id: 2,
          author: "Sarah Johnson",
          date: "2024-01-10",
          content:
            "Successfully launched in European market. Asia expansion planned for Q2.",
          type: "milestone",
        },
      ],
      contributors: [
        {
          name: "John Smith",
          role: "CEO",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        {
          name: "Sarah Johnson",
          role: "VP Sales",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        {
          name: "Mike Wilson",
          role: "Marketing Director",
          avatar: "/placeholder.svg?height=32&width=32",
        },
      ],
    };
    setOkrData(mockOKR);
  }, [okrId]);

  if (!okrData) {
    return <div className="p-6">Loading...</div>;
  }

  const formatValue = (value: number, unit: string) => {
    if (unit === "$") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value);
    }
    return `${value}${unit}`;
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
          <TabsTrigger value="updates">Updates</TabsTrigger>
          <TabsTrigger value="contributors">Contributors</TabsTrigger>
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
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{kr.progress}%</span>
                    </div>
                    <Progress value={kr.progress} className="w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="updates">
          <div className="space-y-4">
            {okrData.updates.map((update: any) => (
              <Card key={update.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>
                          {update.author
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{update.author}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(update.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {update.type === "progress" ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <Target className="h-3 w-3 mr-1" />
                      )}
                      {update.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{update.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contributors">
          <Card>
            <CardHeader>
              <CardTitle>Team Contributors</CardTitle>
              <CardDescription>People working on this OKR</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {okrData.contributors.map((contributor: any, index: number) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Avatar>
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
                    <div>
                      <div className="font-medium">{contributor.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {contributor.role}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
