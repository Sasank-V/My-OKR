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
import { Plus, Target, Edit, Trash2, Building2 } from "lucide-react";
import Link from "next/link";

export default function DepartmentOKRsPage() {
  const departmentOKRs = [
    {
      id: 1,
      title: "Improve Engineering Efficiency",
      description: "Streamline development processes and reduce technical debt",
      department: "Engineering",
      progress: 85,
      status: "On Track",
      owner: "John Smith",
      keyResults: [
        { title: "Reduce deployment time by 50%", progress: 90 },
        { title: "Achieve 95% test coverage", progress: 80 },
        { title: "Decrease bug reports by 30%", progress: 85 },
      ],
    },
    {
      id: 2,
      title: "Enhance Marketing ROI",
      description: "Optimize marketing campaigns and improve lead quality",
      department: "Marketing",
      progress: 70,
      status: "On Track",
      owner: "Sarah Johnson",
      keyResults: [
        { title: "Increase qualified leads by 40%", progress: 75 },
        { title: "Improve conversion rate to 8%", progress: 65 },
        { title: "Reduce customer acquisition cost by 20%", progress: 70 },
      ],
    },
    {
      id: 3,
      title: "Accelerate Sales Growth",
      description: "Expand sales team capabilities and improve closing rates",
      department: "Sales",
      progress: 60,
      status: "At Risk",
      owner: "Mike Wilson",
      keyResults: [
        { title: "Hire 5 new sales representatives", progress: 40 },
        { title: "Increase deal closure rate to 25%", progress: 70 },
        { title: "Expand into 2 new territories", progress: 70 },
      ],
    },
  ];

  const departments = [
    "All Departments",
    "Engineering",
    "Marketing",
    "Sales",
    "HR",
    "Finance",
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Building2 className="h-8 w-8 text-purple-600" />
            Department OKRs
          </h1>
          <p className="text-muted-foreground">
            Department-level objectives and key results
          </p>
        </div>
        <Button asChild>
          <Link href="/okrs/new?type=department">
            <Plus className="h-4 w-4 mr-2" />
            New Department OKR
          </Link>
        </Button>
      </div>

      <div className="mb-6">
        <div className="flex gap-4 items-center">
          <Select defaultValue="All Departments">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-6">
        {departmentOKRs.map((okr) => (
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
                    <Badge variant="outline">{okr.department}</Badge>
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
                      className="bg-purple-600 h-2 rounded-full"
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
                            className="bg-green-600 h-1.5 rounded-full"
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
