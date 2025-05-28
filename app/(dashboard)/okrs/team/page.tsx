import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Target, Edit, Trash2, Users } from "lucide-react";
import Link from "next/link";

export default function TeamOKRsPage() {
  const teamOKRs = [
    {
      id: 1,
      title: "Improve Frontend Performance",
      description: "Optimize user interface and enhance user experience",
      team: "Frontend Team",
      department: "Engineering",
      progress: 78,
      status: "On Track",
      owner: "Alice Johnson",
      keyResults: [
        { title: "Reduce page load time to under 2s", progress: 85 },
        { title: "Achieve 95+ Lighthouse score", progress: 70 },
        { title: "Implement lazy loading for all images", progress: 80 },
      ],
    },
    {
      id: 2,
      title: "Scale Backend Infrastructure",
      description: "Improve system reliability and handle increased traffic",
      team: "Backend Team",
      department: "Engineering",
      progress: 65,
      status: "On Track",
      owner: "Bob Smith",
      keyResults: [
        { title: "Achieve 99.9% uptime", progress: 70 },
        { title: "Handle 10x current traffic load", progress: 60 },
        { title: "Reduce API response time by 30%", progress: 65 },
      ],
    },
    {
      id: 3,
      title: "Increase Brand Awareness",
      description: "Expand brand reach and improve market presence",
      team: "Growth Team",
      department: "Marketing",
      progress: 82,
      status: "On Track",
      owner: "Carol Davis",
      keyResults: [
        { title: "Reach 1M social media followers", progress: 85 },
        { title: "Increase brand mention by 50%", progress: 80 },
        { title: "Launch 3 viral marketing campaigns", progress: 80 },
      ],
    },
  ];

  const teams = [
    "All Teams",
    "Frontend Team",
    "Backend Team",
    "Growth Team",
    "Design Team",
    "QA Team",
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="h-8 w-8 text-green-600" />
            Team OKRs
          </h1>
          <p className="text-muted-foreground">
            Team-level objectives and key results
          </p>
        </div>
        <Button asChild>
          <Link href="/okrs/new?type=team">
            <Plus className="h-4 w-4 mr-2" />
            New Team OKR
          </Link>
        </Button>
      </div>

      <div className="mb-6">
        <div className="flex gap-4 items-center">
          <Select defaultValue="All Teams">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by team" />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => (
                <SelectItem key={team} value={team}>
                  {team}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-6">
        {teamOKRs.map((okr) => (
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
                        okr.status === "On Track" ? "default" : "destructive"
                      }
                    >
                      {okr.status}
                    </Badge>
                    <Badge variant="outline">{okr.team}</Badge>
                    <Badge variant="secondary">{okr.department}</Badge>
                    <span className="text-sm text-muted-foreground">
                      Owner: {okr.owner}
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
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${okr.progress}%` }}
                    ></div>
                  </div>
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
                            className="bg-blue-600 h-1.5 rounded-full"
                            style={{ width: `${kr.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
