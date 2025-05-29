"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
import Link from "next/link";

export default function OKRList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get("type") || "individual";

  const [okrs, setOkrs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    async function fetchOKRs() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/okrs?type=${type}`);
        if (!res.ok) throw new Error("Failed to fetch OKRs");
        const data = await res.json();
        if (data.success) {
          setOkrs(data.data);
        } else {
          setError(data.message || "Failed to fetch OKRs");
          setOkrs([]);
        }
      } catch (err: any) {
        setError(err.message);
        setOkrs([]);
      } finally {
        setLoading(false);
      }
    }

    fetchOKRs();
  }, [type]);

  const filteredOKRs = okrs.filter((okr: any) => {
    const matchesSearch =
      okr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (okr.description?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || okr.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "active":
      case "on-track":
        return "secondary";
      case "at-risk":
      case "cancelled":
        return "destructive";
      case "draft":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <TrendingUp className="h-4 w-4" />;
      case "active":
      case "on-track":
        return <Target className="h-4 w-4" />;
      case "at-risk":
      case "cancelled":
        return <AlertCircle className="h-4 w-4" />;
      case "draft":
        return <Filter className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  // Capitalize first letter for title
  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            OKRs - {capitalize(type)} Objectives
          </h2>
          <p className="text-muted-foreground">
            Manage your {type} objectives and key results
          </p>
        </div>
        <Button onClick={() => router.push("/okrs/new")}>Create OKR</Button>
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
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="on-track">On Track</SelectItem>
            <SelectItem value="at-risk">At Risk</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <p>Loading OKRs...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-12 text-red-600">
          <p>Error: {error}</p>
        </div>
      )}

      {/* OKR Cards */}
      {!loading && !error && (
        <div className="space-y-4">
          {filteredOKRs.length > 0 ? (
            filteredOKRs.map((okr: any) => (
              <Link href={`/okrs/${okr._id}`} key={okr}>
                <Card
                  key={okr._id || okr.id}
                  className="hover:shadow-md transition-shadow"
                >
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
                        <div className="text-2xl font-bold">
                          {okr.progress}%
                        </div>
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
                          {/* If you want to show owner name, you might need to fetch user data */}
                          {okr.ownerName || "Owner"}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {okr.teamName || "Team"}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Due: {new Date(okr.dueDate).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Key Results */}
                      <div>
                        <h4 className="font-medium mb-3">
                          Key Results ({okr.keyResults.length})
                        </h4>
                        <div className="space-y-3">
                          {okr.keyResults.map((kr: any) => (
                            <div
                              key={kr._id || kr.id}
                              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                            >
                              <div className="flex-1">
                                <p className="font-medium text-sm">
                                  {kr.title}
                                </p>
                                <div className="flex items-center gap-4 mt-2">
                                  <Progress
                                    value={kr.progress}
                                    className="flex-1 max-w-xs"
                                  />
                                  <span className="text-sm text-muted-foreground">
                                    {kr.current} / {kr.target} {kr.unit || ""}
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
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(`/okrs/${okr._id || okr.id}/edit`)
                          }
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            alert("Delete feature to be implemented")
                          }
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <p className="text-center text-muted-foreground">
              No OKRs found for type "{type}".
            </p>
          )}
        </div>
      )}
    </div>
  );
}
