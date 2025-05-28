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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateOKRDialog } from "@/components/create-okr-dialog";
import {
  Search,
  Filter,
  Calendar,
  User,
  Target,
  TrendingUp,
  AlertCircle,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function OKRList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const router = useRouter();

  // Mock OKR data
  const okrs = [
    {
      id: "1",
      title: "Increase Customer Satisfaction Score",
      description:
        "Improve overall customer satisfaction to drive retention and growth",
      owner: "John Doe",
      team: "Customer Success",
      progress: 75,
      status: "on-track",
      dueDate: "2024-03-31",
      keyResults: [
        {
          id: "1",
          title: "Achieve NPS score of 50+",
          progress: 80,
          target: 50,
          current: 45,
        },
        {
          id: "2",
          title: "Reduce support ticket resolution time to <2 hours",
          progress: 70,
          target: 2,
          current: 2.5,
        },
        {
          id: "3",
          title: "Increase customer retention rate to 95%",
          progress: 75,
          target: 95,
          current: 92,
        },
      ],
    },
    {
      id: "2",
      title: "Launch New Product Feature",
      description: "Successfully launch the AI-powered analytics dashboard",
      owner: "Jane Smith",
      team: "Product",
      progress: 45,
      status: "at-risk",
      dueDate: "2024-02-28",
      keyResults: [
        {
          id: "4",
          title: "Complete feature development",
          progress: 60,
          target: 100,
          current: 60,
        },
        {
          id: "5",
          title: "Conduct user testing with 50+ users",
          progress: 30,
          target: 50,
          current: 15,
        },
        {
          id: "6",
          title: "Achieve 90% user satisfaction in beta",
          progress: 45,
          target: 90,
          current: 78,
        },
      ],
    },
    {
      id: "3",
      title: "Improve Team Productivity",
      description: "Enhance team efficiency and reduce time-to-delivery",
      owner: "Mike Johnson",
      team: "Engineering",
      progress: 90,
      status: "completed",
      dueDate: "2024-01-31",
      keyResults: [
        {
          id: "7",
          title: "Reduce average PR review time to <4 hours",
          progress: 100,
          target: 4,
          current: 3.2,
        },
        {
          id: "8",
          title: "Increase deployment frequency to 2x per week",
          progress: 85,
          target: 2,
          current: 1.8,
        },
        {
          id: "9",
          title: "Achieve 95% test coverage",
          progress: 85,
          target: 95,
          current: 94,
        },
      ],
    },
  ];

  const filteredOKRs = okrs.filter((okr) => {
    const matchesSearch =
      okr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      okr.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || okr.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "on-track":
        return "secondary";
      case "at-risk":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <TrendingUp className="h-4 w-4" />;
      case "on-track":
        return <Target className="h-4 w-4" />;
      case "at-risk":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">OKRs</h2>
          <p className="text-muted-foreground">
            Manage your objectives and key results
          </p>
        </div>
        <Button onClick={() => router.push("/okr/create")}>Create OKR</Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search OKRs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="on-track">On Track</SelectItem>
            <SelectItem value="at-risk">At Risk</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* OKR Cards */}
      <div className="space-y-4">
        {filteredOKRs.map((okr) => (
          <Card key={okr.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {okr.title}
                    <Badge
                      variant={getStatusColor(okr.status)}
                      className="ml-2"
                    >
                      {getStatusIcon(okr.status)}
                      {okr.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {okr.description}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{okr.progress}%</div>
                  <Progress value={okr.progress} className="w-20 mt-1" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Meta info */}
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {okr.owner}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {okr.team}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Due: {okr.dueDate}
                  </div>
                </div>

                {/* Key Results */}
                <div>
                  <h4 className="font-medium mb-3">
                    Key Results ({okr.keyResults.length})
                  </h4>
                  <div className="space-y-3">
                    {okr.keyResults.map((kr) => (
                      <div
                        key={kr.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm">{kr.title}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <Progress
                              value={kr.progress}
                              className="flex-1 max-w-xs"
                            />
                            <span className="text-sm text-muted-foreground">
                              {kr.current} / {kr.target}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium">
                            {kr.progress}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    Update Progress
                  </Button>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOKRs.length === 0 && (
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No OKRs found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search or filters"
              : "Get started by creating your first OKR"}
          </p>
          {!searchTerm && statusFilter === "all" && <CreateOKRDialog />}
        </div>
      )}
    </div>
  );
}
