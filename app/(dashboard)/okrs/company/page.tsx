import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Target, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

export default function CompanyOKRsPage() {
  const companyOKRs = [
    {
      id: 1,
      title: "Increase Annual Revenue",
      description: "Drive company growth through strategic initiatives",
      progress: 75,
      status: "On Track",
      owner: "CEO",
      keyResults: [
        { title: "Achieve $10M ARR", progress: 80 },
        { title: "Expand to 3 new markets", progress: 67 },
        { title: "Increase customer retention to 95%", progress: 78 },
      ],
    },
    {
      id: 2,
      title: "Improve Product Quality",
      description: "Enhance user experience and reduce bugs",
      progress: 60,
      status: "At Risk",
      owner: "CTO",
      keyResults: [
        { title: "Reduce bug reports by 40%", progress: 45 },
        { title: "Achieve 4.8+ app store rating", progress: 70 },
        { title: "Implement automated testing", progress: 65 },
      ],
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Company OKRs</h1>
          <p className="text-muted-foreground">
            Organization-wide objectives and key results
          </p>
        </div>
        <Button asChild>
          <Link href="/okrs/new?type=company">
            <Plus className="h-4 w-4 mr-2" />
            New Company OKR
          </Link>
        </Button>
      </div>

      <div className="space-y-6">
        {companyOKRs.map((okr) => (
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
                      className="bg-blue-600 h-2 rounded-full"
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
