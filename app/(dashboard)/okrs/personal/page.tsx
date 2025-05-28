import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Plus,
  Target,
  Edit,
  Trash2,
  User,
  Calendar,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export default function MyOKRsPage() {
  const myOKRs = [
    {
      id: 1,
      title: "Enhance Technical Leadership Skills",
      description: "Develop leadership capabilities and mentor team members",
      progress: 85,
      status: "On Track",
      startDate: "2024-01-01",
      endDate: "2024-06-30",
      keyResults: [
        { title: "Complete leadership training program", progress: 100 },
        { title: "Mentor 3 junior developers", progress: 75 },
        { title: "Lead 2 major project initiatives", progress: 80 },
      ],
    },
    {
      id: 2,
      title: "Improve Code Quality and Architecture",
      description: "Focus on writing better code and improving system design",
      progress: 70,
      status: "On Track",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      keyResults: [
        { title: "Achieve 95% code coverage in projects", progress: 80 },
        { title: "Complete system architecture certification", progress: 60 },
        { title: "Reduce code review feedback by 40%", progress: 70 },
      ],
    },
    {
      id: 3,
      title: "Professional Development",
      description: "Expand knowledge and skills in emerging technologies",
      progress: 45,
      status: "Behind",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      keyResults: [
        { title: "Learn and implement AI/ML in projects", progress: 30 },
        { title: "Attend 4 tech conferences", progress: 50 },
        { title: "Contribute to 2 open source projects", progress: 55 },
      ],
    },
  ];

  const calculateDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <User className="h-8 w-8 text-orange-600" />
            My OKRs
          </h1>
          <p className="text-muted-foreground">
            Your personal objectives and key results
          </p>
        </div>
        <Button asChild>
          <Link href="/okrs/new?type=personal">
            <Plus className="h-4 w-4 mr-2" />
            New Personal OKR
          </Link>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Total OKRs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{myOKRs.length}</div>
            <p className="text-sm text-muted-foreground">Active objectives</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Average Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Math.round(
                myOKRs.reduce((acc, okr) => acc + okr.progress, 0) /
                  myOKRs.length
              )}
              %
            </div>
            <p className="text-sm text-muted-foreground">Across all OKRs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              On Track
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {myOKRs.filter((okr) => okr.status === "On Track").length}
            </div>
            <p className="text-sm text-muted-foreground">OKRs on schedule</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {myOKRs.map((okr) => (
          <Card key={okr.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    {okr.title}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {okr.description}
                  </CardDescription>
                  <div className="flex items-center gap-4 mt-3">
                    <Badge
                      variant={
                        okr.status === "On Track"
                          ? "default"
                          : okr.status === "Behind"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {okr.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {calculateDaysRemaining(okr.endDate)} days remaining
                    </span>
                    <span className="text-sm font-medium">
                      {okr.progress}% Complete
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/okrs/${okr.id}`}>View</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/okrs/${okr.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Progress</span>
                    <span>{okr.progress}%</span>
                  </div>
                  <Progress value={okr.progress} className="w-full" />
                </div>

                <div>
                  <h4 className="font-medium mb-3">Key Results</h4>
                  <div className="space-y-3">
                    {okr.keyResults.map((kr, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{kr.title}</span>
                          <span>{kr.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-orange-600 h-1.5 rounded-full"
                            style={{ width: `${kr.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    {new Date(okr.startDate).toLocaleDateString()} -{" "}
                    {new Date(okr.endDate).toLocaleDateString()}
                  </span>
                  <span>
                    Duration:{" "}
                    {Math.ceil(
                      (new Date(okr.endDate).getTime() -
                        new Date(okr.startDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    days
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
