"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Building2, Users, Target } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Department {
  _id: string;
  name: string;
  description?: string;
  head: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  teamCount: number;
  memberCount: number;
  okrCount: number;
  status: "Active" | "Inactive" | "Planning" | "Restructuring";
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [status]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch("/api/departments");
        if (!res.ok) throw new Error("Failed to fetch departments");
        const data = await res.json();
        setDepartments(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchDepartments();
    }
  }, [status]);

  if (loading) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Loading departments...
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Departments</h1>
          <p className="text-muted-foreground">
            Manage organizational departments
          </p>
        </div>
        <Button asChild>
          <Link href="/departments/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Department
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <Card key={dept._id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Building2 className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{dept.name}</CardTitle>
                    <CardDescription>
                      Head: {dept.head?.name || "N/A"}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="default">{dept.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {dept.description}
                </p>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-1">
                    <div className="flex items-center justify-center">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold">
                      {dept.memberCount || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Members</div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center">
                      <Users className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold">
                      {dept.teamCount || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Teams</div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center">
                      <Target className="h-4 w-4 text-orange-600" />
                    </div>
                    <div className="text-2xl font-bold">
                      {dept.okrCount || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">OKRs</div>
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/departments/${dept._id}`}>View Details</Link>
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/departments/${dept._id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
